'use client';

import React, { useState } from 'react';
import {
  Search, ChevronDown, ChevronUp, User, FileText, Map, MessageSquare,
  BookOpen, CreditCard, Shield, Zap,
} from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

interface FAQ {
  q: string;
  a: string;
}

interface Category {
  icon: React.ReactNode;
  color: string;
  title: string;
  faqs: FAQ[];
}

function useContent() {
  const { lang } = useLang();
  const fa = lang === 'fa';
  const nl = lang === 'nl';

  const title = fa ? 'مرکز راهنمایی' : nl ? 'Helpcentrum' : 'Help Center';
  const subtitle = fa
    ? 'پاسخ سوالات رایج و راهنمای استفاده از موویان'
    : nl
    ? 'Antwoorden op veelgestelde vragen en gidsen voor het gebruik van Movian'
    : 'Answers to common questions and guides for using Movian';
  const searchPlaceholder = fa ? 'جستجو در سوالات…' : nl ? 'Zoek in vragen…' : 'Search questions…';

  const categories: Category[] = [
    {
      icon: <User size={20} />,
      color: 'text-blue-600 bg-blue-50',
      title: fa ? 'حساب کاربری' : nl ? 'Account' : 'Account',
      faqs: fa
        ? [
            { q: 'چطور ثبت‌نام کنم؟', a: 'روی دکمه «شروع کنید» در صفحه اصلی کلیک کنید، ایمیل و رمز عبور وارد کنید و نقش خود را انتخاب کنید.' },
            { q: 'رمز عبورم را فراموش کرده‌ام.', a: 'در صفحه ورود روی «فراموشی رمز عبور» کلیک کنید. لینک بازیابی به ایمیل شما ارسال می‌شود.' },
            { q: 'چطور اطلاعات پروفایلم را ویرایش کنم؟', a: 'از منوی کناری وارد بخش «پروفایل» شوید و تغییرات را اعمال کنید.' },
          ]
        : nl
        ? [
            { q: 'Hoe registreer ik me?', a: 'Klik op "Aan de slag" op de startpagina, vul uw e-mail en wachtwoord in en kies uw rol.' },
            { q: 'Ik ben mijn wachtwoord vergeten.', a: 'Klik op de inlogpagina op "Wachtwoord vergeten". Een herstelkoppeling wordt naar uw e-mail gestuurd.' },
            { q: 'Hoe bewerk ik mijn profiel?', a: 'Ga via het zijmenu naar "Profiel" en sla uw wijzigingen op.' },
          ]
        : [
            { q: 'How do I sign up?', a: 'Click "Get Started" on the homepage, enter your email and password, then choose your role.' },
            { q: 'I forgot my password.', a: 'Click "Forgot password" on the login page. A recovery link will be sent to your email.' },
            { q: 'How do I edit my profile?', a: 'Open "Profile" from the sidebar menu and save your changes.' },
          ],
    },
    {
      icon: <FileText size={20} />,
      color: 'text-purple-600 bg-purple-50',
      title: fa ? 'ساخت رزومه' : nl ? 'CV Bouwer' : 'CV Builder',
      faqs: fa
        ? [
            { q: 'آیا می‌توانم رزومه را دانلود کنم؟', a: 'بله، پس از ساخت رزومه می‌توانید آن را به فرمت PDF دانلود کنید.' },
            { q: 'چند قالب رزومه وجود دارد؟', a: 'در حال حاضر ۶ قالب حرفه‌ای ارائه می‌دهیم که به‌روزرسانی می‌شوند.' },
          ]
        : nl
        ? [
            { q: 'Kan ik mijn cv downloaden?', a: 'Ja, na het opstellen kunt u uw cv als PDF downloaden.' },
            { q: 'Hoeveel cv-sjablonen zijn er?', a: 'Momenteel bieden we 6 professionele sjablonen die regelmatig worden bijgewerkt.' },
          ]
        : [
            { q: 'Can I download my CV?', a: 'Yes, after building your CV you can download it as a PDF.' },
            { q: 'How many CV templates are available?', a: 'We currently offer 6 professional templates that are regularly updated.' },
          ],
    },
    {
      icon: <MessageSquare size={20} />,
      color: 'text-orange-600 bg-orange-50',
      title: fa ? 'مشاوره با منتور' : nl ? 'Mentorschap' : 'Mentorship',
      faqs: fa
        ? [
            { q: 'چطور منتور پیدا کنم؟', a: 'از منوی کناری وارد «یافتن منتور» شوید، فیلتر کنید و درخواست مشاوره ارسال کنید.' },
            { q: 'هزینه جلسه مشاوره چقدر است؟', a: 'هر منتور نرخ ساعتی خود را تعیین می‌کند که در پروفایلش قابل مشاهده است.' },
            { q: 'اگر منتور درخواستم را رد کند چه اتفاقی می‌افتد؟', a: 'می‌توانید با منتور دیگری تماس بگیرید. پول شما پس از تایید جلسه کسر می‌شود.' },
          ]
        : nl
        ? [
            { q: 'Hoe vind ik een mentor?', a: 'Ga via het zijmenu naar "Mentors zoeken", filter op expertise en stuur een consultatieverzoek.' },
            { q: 'Wat kost een mentorsessie?', a: 'Elke mentor bepaalt zijn eigen uurtarief dat zichtbaar is op zijn profiel.' },
            { q: 'Wat als een mentor mijn verzoek afwijst?', a: 'U kunt contact opnemen met een andere mentor. Betaling vindt pas plaats na bevestiging.' },
          ]
        : [
            { q: 'How do I find a mentor?', a: 'Go to "Find Mentors" in the sidebar, filter by expertise, and send a consultation request.' },
            { q: 'How much does a mentoring session cost?', a: 'Each mentor sets their own hourly rate, visible on their profile.' },
            { q: 'What if a mentor rejects my request?', a: 'You can reach out to another mentor. Payment is only deducted after a session is confirmed.' },
          ],
    },
    {
      icon: <Map size={20} />,
      color: 'text-teal-600 bg-teal-50',
      title: fa ? 'نقشه راه شغلی' : nl ? 'Carrière Routekaart' : 'Career Roadmap',
      faqs: fa
        ? [
            { q: 'نقشه راه چطور تولید می‌شود؟', a: 'بر اساس نتایج ارزیابی شغلی شما، یک نقشه راه شخصی‌سازی‌شده ایجاد می‌شود.' },
            { q: 'آیا می‌توانم نقشه راه را ویرایش کنم؟', a: 'بله، مراحل می‌توانند به عنوان تکمیل‌شده علامت‌گذاری شوند و اولویت‌ها تغییر کنند.' },
          ]
        : nl
        ? [
            { q: 'Hoe wordt de routekaart gegenereerd?', a: 'Op basis van uw carrièrebeoordelingsresultaten wordt een gepersonaliseerde routekaart aangemaakt.' },
            { q: 'Kan ik de routekaart bewerken?', a: 'Ja, stappen kunnen als voltooid worden gemarkeerd en prioriteiten kunnen worden gewijzigd.' },
          ]
        : [
            { q: 'How is my roadmap generated?', a: 'Based on your career assessment results, a personalized roadmap is created for you.' },
            { q: 'Can I edit my roadmap?', a: 'Yes, steps can be marked as complete and priorities can be adjusted.' },
          ],
    },
    {
      icon: <BookOpen size={20} />,
      color: 'text-green-600 bg-green-50',
      title: fa ? 'دوره‌ها' : nl ? 'Cursussen' : 'Courses',
      faqs: fa
        ? [
            { q: 'آیا دوره‌ها دارای گواهینامه هستند؟', a: 'بله، پس از اتمام موفقیت‌آمیز دوره، گواهینامه دیجیتال صادر می‌شود.' },
            { q: 'آیا می‌توانم به صورت آفلاین از محتوا استفاده کنم؟', a: 'محتوای دوره‌ها از طریق پلتفرم آنلاین در دسترس است؛ قابلیت دانلود در نسخه‌های بعدی اضافه می‌شود.' },
          ]
        : nl
        ? [
            { q: 'Hebben cursussen een certificaat?', a: 'Ja, na het succesvol afronden van een cursus wordt een digitaal certificaat uitgegeven.' },
            { q: 'Kan ik inhoud offline bekijken?', a: 'Cursusinhoud is beschikbaar via het online platform; downloadmogelijkheden worden in toekomstige versies toegevoegd.' },
          ]
        : [
            { q: 'Do courses have certificates?', a: 'Yes, upon successfully completing a course, a digital certificate is issued.' },
            { q: 'Can I access content offline?', a: 'Course content is available via the online platform; download capability will be added in future versions.' },
          ],
    },
    {
      icon: <CreditCard size={20} />,
      color: 'text-red-600 bg-red-50',
      title: fa ? 'پرداخت و اشتراک' : nl ? 'Betaling & Abonnement' : 'Billing & Subscription',
      faqs: fa
        ? [
            { q: 'چه روش‌های پرداختی پشتیبانی می‌شوند؟', a: 'درگاه‌های پرداخت ایرانی (زرین‌پال، ملت) و کارت‌های بین‌المللی پشتیبانی می‌شوند.' },
            { q: 'آیا امکان کنسل کردن اشتراک وجود دارد؟', a: 'بله، از تنظیمات حساب می‌توانید در هر زمان اشتراک خود را لغو کنید.' },
          ]
        : nl
        ? [
            { q: 'Welke betaalmethoden worden ondersteund?', a: 'iDEAL, creditcards en PayPal worden ondersteund.' },
            { q: 'Kan ik mijn abonnement opzeggen?', a: 'Ja, u kunt uw abonnement op elk moment opzeggen via uw accountinstellingen.' },
          ]
        : [
            { q: 'What payment methods are supported?', a: 'We support major credit cards, PayPal, and local payment gateways.' },
            { q: 'Can I cancel my subscription?', a: 'Yes, you can cancel your subscription at any time from your account settings.' },
          ],
    },
  ];

  return { title, subtitle, searchPlaceholder, categories };
}

function FAQItem({ q, a, isRTL }: { q: string; a: string; isRTL: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className={cn('w-full flex items-center justify-between gap-3 py-4 text-sm font-medium text-gray-800 hover:text-primary-600 transition-colors text-left', isRTL ? 'flex-row-reverse text-right' : '')}
      >
        <span>{q}</span>
        {open ? <ChevronUp size={16} className="flex-shrink-0 text-primary-500" /> : <ChevronDown size={16} className="flex-shrink-0 text-gray-400" />}
      </button>
      {open && (
        <p className={cn('pb-4 text-sm text-gray-600 leading-relaxed', isRTL ? 'text-right' : '')}>
          {a}
        </p>
      )}
    </div>
  );
}

export default function HelpPage() {
  const { isRTL } = useLang();
  const { title, subtitle, searchPlaceholder, categories } = useContent();
  const [query, setQuery] = useState('');

  const filtered = categories.map((cat) => ({
    ...cat,
    faqs: cat.faqs.filter(
      (f) => !query || f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((cat) => cat.faqs.length > 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-900 to-primary-700 text-white py-16">
          <div className="max-w-3xl mx-auto text-center px-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Zap size={26} className="text-primary-200" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">{title}</h1>
            <p className="text-primary-200 mb-8">{subtitle}</p>
            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search size={16} className={cn('absolute top-1/2 -translate-y-1/2 text-gray-400', isRTL ? 'right-4' : 'left-4')} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className={cn('w-full bg-white rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-300', isRTL ? 'pr-11 text-right' : 'pl-11')}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 space-y-8">
            {filtered.map((cat) => (
              <div key={cat.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className={cn('flex items-center gap-3 px-6 py-4 border-b border-gray-100', isRTL ? 'flex-row-reverse' : '')}>
                  <span className={cn('w-9 h-9 rounded-xl flex items-center justify-center', cat.color)}>
                    {cat.icon}
                  </span>
                  <h2 className="text-base font-semibold text-gray-900">{cat.title}</h2>
                </div>
                <div className="px-6">
                  {cat.faqs.map((faq, i) => (
                    <FAQItem key={i} q={faq.q} a={faq.a} isRTL={isRTL} />
                  ))}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className={cn('text-center text-gray-400 py-12', isRTL ? 'text-right' : '')}>
                {isRTL ? 'نتیجه‌ای یافت نشد.' : 'No results found.'}
              </p>
            )}
          </div>
        </section>

        {/* Still need help? */}
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="max-w-xl mx-auto text-center px-4">
            <Shield size={28} className="text-primary-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isRTL ? 'هنوز به کمک نیاز دارید؟' : 'Still need help?'}
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              {isRTL
                ? 'تیم پشتیبانی ما آماده پاسخگویی است.'
                : 'Our support team is ready to help you.'}
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              {isRTL ? 'تماس با ما' : 'Contact Us'}
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
