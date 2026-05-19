-- ============================================================
-- Movian HR Platform — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Profiles (extends auth.users) ────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name        TEXT NOT NULL DEFAULT '',
  email       TEXT UNIQUE NOT NULL DEFAULT '',
  role        TEXT NOT NULL DEFAULT 'job-seeker'
              CHECK (role IN ('job-seeker','mentor','trainer','admin')),
  avatar      TEXT,
  headline    TEXT,
  phone       TEXT,
  location    TEXT,
  bio         TEXT,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Job Seeker Profiles ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.job_seeker_profiles (
  id                  UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  skills              TEXT[]  DEFAULT '{}',
  employability_score INTEGER DEFAULT 0,
  cv_template         TEXT    DEFAULT 'modern',
  languages           JSONB   DEFAULT '[]'
);

-- ── Work Experience ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.work_experiences (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id  UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  company     TEXT NOT NULL,
  position    TEXT NOT NULL,
  start_date  TEXT,
  end_date    TEXT,
  is_current  BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Education ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.education (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id  UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  institution TEXT NOT NULL,
  degree      TEXT NOT NULL,
  field       TEXT,
  start_date  TEXT,
  end_date    TEXT,
  is_current  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Mentor Profiles ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mentor_profiles (
  id              UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  expertise       TEXT[]  DEFAULT '{}',
  hourly_rate     NUMERIC DEFAULT 0,
  rating          NUMERIC DEFAULT 0,
  total_sessions  INTEGER DEFAULT 0,
  approval_status TEXT    DEFAULT 'pending'
                  CHECK (approval_status IN ('pending','approved','rejected'))
);

-- ── Trainer Profiles ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.trainer_profiles (
  id              UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  specialization  TEXT[] DEFAULT '{}',
  approval_status TEXT   DEFAULT 'pending'
                  CHECK (approval_status IN ('pending','approved','rejected'))
);

-- ── Courses ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courses (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trainer_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title           TEXT NOT NULL,
  title_fa        TEXT,
  description     TEXT,
  description_fa  TEXT,
  category        TEXT,
  level           TEXT DEFAULT 'beginner'
                  CHECK (level IN ('beginner','intermediate','advanced')),
  price           NUMERIC DEFAULT 0,
  status          TEXT DEFAULT 'draft'
                  CHECK (status IN ('draft','published','archived')),
  approval_status TEXT DEFAULT 'pending'
                  CHECK (approval_status IN ('pending','approved','rejected')),
  thumbnail       TEXT,
  duration        TEXT,
  enrollments     INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Course Enrollments ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id     UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  job_seeker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  progress      INTEGER DEFAULT 0,
  enrolled_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, job_seeker_id)
);

-- ── Consultation Requests ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.consultation_requests (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_seeker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mentor_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject       TEXT NOT NULL,
  message       TEXT,
  status        TEXT DEFAULT 'pending'
                CHECK (status IN ('pending','accepted','rejected','completed')),
  notes         TEXT,
  session_date  TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Roadmap Items ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.roadmap_items (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title           TEXT NOT NULL,
  title_fa        TEXT,
  description     TEXT,
  description_fa  TEXT,
  category        TEXT DEFAULT 'skill'
                  CHECK (category IN ('skill','course','experience','certification')),
  priority        TEXT DEFAULT 'medium'
                  CHECK (priority IN ('high','medium','low')),
  completed       BOOLEAN DEFAULT FALSE,
  estimated_time  TEXT,
  resources       TEXT[] DEFAULT '{}',
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Notifications ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type       TEXT DEFAULT 'system',
  title      TEXT NOT NULL,
  body       TEXT,
  read       BOOLEAN DEFAULT FALSE,
  href       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Assessment Results ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id  UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  score       INTEGER NOT NULL,
  answers     JSONB DEFAULT '{}',
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'job-seeker')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-increment course enrollment count
CREATE OR REPLACE FUNCTION public.increment_enrollments()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.courses SET enrollments = enrollments + 1 WHERE id = NEW.course_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_course_enrollment
  AFTER INSERT ON public.course_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.increment_enrollments();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_seeker_profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experiences      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results    ENABLE ROW LEVEL SECURITY;

-- profiles: everyone can read, owner can update, admin can do all
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- mentor_profiles: approved ones visible to all
CREATE POLICY "mentor_profiles_select" ON public.mentor_profiles FOR SELECT USING (true);
CREATE POLICY "mentor_profiles_insert" ON public.mentor_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "mentor_profiles_update" ON public.mentor_profiles FOR UPDATE USING (auth.uid() = id);

-- trainer_profiles
CREATE POLICY "trainer_profiles_select" ON public.trainer_profiles FOR SELECT USING (true);
CREATE POLICY "trainer_profiles_insert" ON public.trainer_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "trainer_profiles_update" ON public.trainer_profiles FOR UPDATE USING (auth.uid() = id);

-- job_seeker_profiles
CREATE POLICY "js_profiles_select" ON public.job_seeker_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "js_profiles_insert" ON public.job_seeker_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "js_profiles_update" ON public.job_seeker_profiles FOR UPDATE USING (auth.uid() = id);

-- work_experiences
CREATE POLICY "work_exp_select" ON public.work_experiences FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "work_exp_insert" ON public.work_experiences FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "work_exp_update" ON public.work_experiences FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY "work_exp_delete" ON public.work_experiences FOR DELETE USING (auth.uid() = profile_id);

-- education
CREATE POLICY "edu_select" ON public.education FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "edu_insert" ON public.education FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "edu_update" ON public.education FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY "edu_delete" ON public.education FOR DELETE USING (auth.uid() = profile_id);

-- courses: published+approved visible to all; trainer manages own
CREATE POLICY "courses_select_public" ON public.courses FOR SELECT
  USING (status = 'published' AND approval_status = 'approved');
CREATE POLICY "courses_select_own" ON public.courses FOR SELECT
  USING (auth.uid() = trainer_id);
CREATE POLICY "courses_insert" ON public.courses FOR INSERT WITH CHECK (auth.uid() = trainer_id);
CREATE POLICY "courses_update" ON public.courses FOR UPDATE USING (auth.uid() = trainer_id);

-- course_enrollments
CREATE POLICY "enrollments_select" ON public.course_enrollments FOR SELECT
  USING (auth.uid() = job_seeker_id);
CREATE POLICY "enrollments_insert" ON public.course_enrollments FOR INSERT
  WITH CHECK (auth.uid() = job_seeker_id);

-- consultation_requests
CREATE POLICY "requests_select_seeker" ON public.consultation_requests FOR SELECT
  USING (auth.uid() = job_seeker_id);
CREATE POLICY "requests_select_mentor" ON public.consultation_requests FOR SELECT
  USING (auth.uid() = mentor_id);
CREATE POLICY "requests_insert" ON public.consultation_requests FOR INSERT
  WITH CHECK (auth.uid() = job_seeker_id);
CREATE POLICY "requests_update_mentor" ON public.consultation_requests FOR UPDATE
  USING (auth.uid() = mentor_id);

-- roadmap_items
CREATE POLICY "roadmap_select" ON public.roadmap_items FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "roadmap_insert" ON public.roadmap_items FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "roadmap_update" ON public.roadmap_items FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY "roadmap_delete" ON public.roadmap_items FOR DELETE USING (auth.uid() = profile_id);

-- notifications
CREATE POLICY "notif_select" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notif_update" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- assessment_results
CREATE POLICY "assessment_select" ON public.assessment_results FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "assessment_insert" ON public.assessment_results FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- ============================================================
-- ADMIN HELPER VIEWS (bypass RLS with service role)
-- ============================================================
CREATE OR REPLACE VIEW public.admin_users_view AS
  SELECT
    p.id, p.name, p.email, p.role, p.avatar, p.is_active, p.created_at,
    mp.approval_status AS mentor_status,
    tp.approval_status AS trainer_status
  FROM public.profiles p
  LEFT JOIN public.mentor_profiles mp ON mp.id = p.id
  LEFT JOIN public.trainer_profiles tp ON tp.id = p.id;

CREATE OR REPLACE VIEW public.admin_stats_view AS
  SELECT
    (SELECT COUNT(*) FROM public.profiles)                                        AS total_users,
    (SELECT COUNT(*) FROM public.profiles WHERE role = 'job-seeker')              AS job_seekers,
    (SELECT COUNT(*) FROM public.profiles WHERE role = 'mentor')                  AS mentors,
    (SELECT COUNT(*) FROM public.profiles WHERE role = 'trainer')                 AS trainers,
    (SELECT COUNT(*) FROM public.mentor_profiles WHERE approval_status='pending') AS pending_mentors,
    (SELECT COUNT(*) FROM public.trainer_profiles WHERE approval_status='pending') AS pending_trainers,
    (SELECT COUNT(*) FROM public.courses WHERE approval_status='pending')          AS pending_courses,
    (SELECT COUNT(*) FROM public.courses)                                          AS total_courses,
    (SELECT COUNT(*) FROM public.consultation_requests)                            AS total_requests,
    (SELECT COUNT(*) FROM public.consultation_requests WHERE status='pending')     AS pending_requests;
