export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'job-seeker' | 'mentor' | 'trainer' | 'admin';
          avatar: string | null;
          headline: string | null;
          phone: string | null;
          location: string | null;
          bio: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      mentor_profiles: {
        Row: {
          id: string;
          expertise: string[];
          hourly_rate: number;
          rating: number;
          total_sessions: number;
          approval_status: 'pending' | 'approved' | 'rejected';
        };
        Insert: Partial<Database['public']['Tables']['mentor_profiles']['Row']> & { id: string };
        Update: Partial<Database['public']['Tables']['mentor_profiles']['Row']>;
      };
      trainer_profiles: {
        Row: {
          id: string;
          specialization: string[];
          approval_status: 'pending' | 'approved' | 'rejected';
        };
        Insert: Partial<Database['public']['Tables']['trainer_profiles']['Row']> & { id: string };
        Update: Partial<Database['public']['Tables']['trainer_profiles']['Row']>;
      };
      job_seeker_profiles: {
        Row: {
          id: string;
          skills: string[];
          employability_score: number;
          cv_template: string;
          languages: Json;
        };
        Insert: Partial<Database['public']['Tables']['job_seeker_profiles']['Row']> & { id: string };
        Update: Partial<Database['public']['Tables']['job_seeker_profiles']['Row']>;
      };
      work_experiences: {
        Row: {
          id: string;
          profile_id: string;
          company: string;
          position: string;
          start_date: string | null;
          end_date: string | null;
          is_current: boolean;
          description: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['work_experiences']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['work_experiences']['Insert']>;
      };
      education: {
        Row: {
          id: string;
          profile_id: string;
          institution: string;
          degree: string;
          field: string | null;
          start_date: string | null;
          end_date: string | null;
          is_current: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['education']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['education']['Insert']>;
      };
      courses: {
        Row: {
          id: string;
          trainer_id: string;
          title: string;
          title_fa: string | null;
          description: string | null;
          description_fa: string | null;
          category: string | null;
          level: 'beginner' | 'intermediate' | 'advanced';
          price: number;
          status: 'draft' | 'published' | 'archived';
          approval_status: 'pending' | 'approved' | 'rejected';
          thumbnail: string | null;
          duration: string | null;
          enrollments: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['courses']['Row'], 'id' | 'created_at' | 'enrollments'>;
        Update: Partial<Database['public']['Tables']['courses']['Insert']>;
      };
      course_enrollments: {
        Row: {
          id: string;
          course_id: string;
          job_seeker_id: string;
          progress: number;
          enrolled_at: string;
        };
        Insert: Omit<Database['public']['Tables']['course_enrollments']['Row'], 'id' | 'enrolled_at'>;
        Update: Partial<Database['public']['Tables']['course_enrollments']['Insert']>;
      };
      consultation_requests: {
        Row: {
          id: string;
          job_seeker_id: string;
          mentor_id: string;
          subject: string;
          message: string | null;
          status: 'pending' | 'accepted' | 'rejected' | 'completed';
          notes: string | null;
          session_date: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['consultation_requests']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['consultation_requests']['Insert']>;
      };
      roadmap_items: {
        Row: {
          id: string;
          profile_id: string;
          title: string;
          title_fa: string | null;
          description: string | null;
          description_fa: string | null;
          category: 'skill' | 'course' | 'experience' | 'certification';
          priority: 'high' | 'medium' | 'low';
          completed: boolean;
          estimated_time: string | null;
          resources: string[];
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['roadmap_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['roadmap_items']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string | null;
          read: boolean;
          href: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
      assessment_results: {
        Row: {
          id: string;
          profile_id: string;
          score: number;
          answers: Json;
          completed_at: string;
        };
        Insert: Omit<Database['public']['Tables']['assessment_results']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['assessment_results']['Insert']>;
      };
    };
    Views: {
      admin_users_view: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: string;
          avatar: string | null;
          is_active: boolean;
          created_at: string;
          mentor_status: string | null;
          trainer_status: string | null;
        };
      };
      admin_stats_view: {
        Row: {
          total_users: number;
          job_seekers: number;
          mentors: number;
          trainers: number;
          pending_mentors: number;
          pending_trainers: number;
          pending_courses: number;
          total_courses: number;
          total_requests: number;
          pending_requests: number;
        };
      };
    };
    Functions: {};
  };
}
