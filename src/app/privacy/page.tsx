'use client';

import React from 'react';
import { Shield, Eye, Database, Lock, UserCheck, Bell } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

interface Section {
  icon: React.ReactNode;
  color: string;
  title: string;
  body: string[];
}

function useContent() {
  const { lang } = useLang();
  const fa = lang === 'fa';
  const nl = lang === 'nl';

  const lastUpdated = fa ? '۱ خرداد ۱۴۰۵' : nl ? '1 juni 2026' : 'June 1, 2026';

  const sections: Section[] = fa
    ? [
        {
          icon: <Database size={20} />, color: 'text-blue-600 bg-blue-50',
          title: 'اطلاعاتی که جمع‌آوری می‌کنیم',
          body: [
            'اطلاعات شناسایی شخصی مانند نام، ایمیل و شماره تلفن که هنگام ثبت‌نام وارد می‌کنید.',
            'اطلاعات حرفه‌ای از جمله تجربه کاری، تحصیلات، مهارت‌ها و رزومه‌ای که بارگذاری می‌کنید.',
            'داده‌های استفاده از پلتفرم مانند صفحاتی که بازدید می‌کنید و ابزارهایی که استفاده می‌نمایید.',
            'اطلاعات دستگاه و مرورگر برای بهبود تجربه کاربری.',
          ],
        },
        {
          icon: <Eye size={20} />, color: 'text-purple-600 bg-purple-50',
          title: 'چگونه از اطلاعات شما استفاده می‌کنیم',
          body: [
            'ارائه، شخصی‌سازی و بهبود خدمات موویان برای شما.',
            'ایجاد و مدیریت حساب کاربری و ارتباط با منتورها و مدرسان.',
            'ارسال اعلان‌ها و به‌روزرسانی‌های مرتبط با حساب شما.',
            'تحلیل داده‌ها برای بهبود پلتفرم و ارائه توصیه‌های شغلی بهتر.',
          ],
        },
        {
          icon: <UserCheck size={20} />, color: 'text-green-600 bg-green-50',
          title: 'اشتراک‌گذاری اطلاعات',
          body: [
            'اطلاعات شما را به هیچ شخص ثالثی برای اهداف تبلیغاتی نمی‌فروشیم.',
            'اطلاعات حرفه‌ای پروفایل شما فقط برای منتورها و مدرسانی که با آن‌ها تعامل می‌کنید قابل مشاهده است.',
            'در صورت الزام قانونی، اطلاعات ممکن است با مراجع ذی‌صلاح به اشتراک گذاشته شود.',
          ],
        },
        {
          icon: <Lock size={20} />, color: 'text-red-600 bg-red-50',
          title: 'امنیت داده‌ها',
          body: [
            'از رمزنگاری SSL/TLS برای انتقال امن داده‌ها استفاده می‌کنیم.',
            'رمزهای عبور به صورت هش‌شده ذخیره می‌شوند و هرگز به صورت متن ساده نگهداری نمی‌شوند.',
            'دسترسی به داده‌ها محدود به کارمندان مجاز است و به صورت منظم بازبینی می‌شود.',
          ],
        },
        {
          icon: <Bell size={20} />, color: 'text-amber-600 bg-amber-50',
          title: 'حقوق شما',
          body: [
            'می‌توانید در هر زمان اطلاعات حساب خود را مشاهده و ویرایش کنید.',
            'حق درخواست حذف کامل اطلاعات خود از سیستم را دارید.',
            'می‌توانید از دریافت ایمیل‌های بازاریابی انصراف دهید.',
            'برای هر سوالی درباره داده‌هایتان با ما تماس بگیرید.',
          ],
        },
      ]
    : nl
    ? [
        {
          icon: <Database size={20} />, color: 'text-blue-600 bg-blue-50',
          title: 'Gegevens die we verzamelen',
          body: [
            'Persoonlijk identificeerbare informatie zoals naam, e-mail en telefoonnummer die u bij registratie invult.',
            'Professionele informatie inclusief werkervaring, opleiding, vaardigheden en uw geüploade cv.',
            'Gebruiksgegevens van het platform zoals bezochte pagina\'s en gebruikte tools.',
            'Apparaat- en browserinformatie voor het verbeteren van de gebruikerservaring.',
          ],
        },
        {
          icon: <Eye size={20} />, color: 'text-purple-600 bg-purple-50',
          title: 'Hoe we uw gegevens gebruiken',
          body: [
            'Het leveren, personaliseren en verbeteren van Movian\'s diensten voor u.',
            'Het aanmaken en beheren van uw account en communicatie met mentors en trainers.',
            'Het verzenden van meldingen en updates gerelateerd aan uw account.',
            'Gegevensanalyse om het platform te verbeteren en betere loopbaanaanbevelingen te doen.',
          ],
        },
        {
          icon: <UserCheck size={20} />, color: 'text-green-600 bg-green-50',
          title: 'Delen van gegevens',
          body: [
            'Wij verkopen uw gegevens nooit aan derden voor reclamedoeleinden.',
            'Uw professionele profielinformatie is alleen zichtbaar voor mentors en trainers waarmee u interactie heeft.',
            'Bij wettelijke verplichting kunnen gegevens worden gedeeld met bevoegde autoriteiten.',
          ],
        },
        {
          icon: <Lock size={20} />, color: 'text-red-600 bg-red-50',
          title: 'Gegevensbeveiliging',
          body: [
            'Wij gebruiken SSL/TLS-encryptie voor veilige gegevensoverdracht.',
            'Wachtwoorden worden gehasht opgeslagen en nooit als gewone tekst bewaard.',
            'Toegang tot gegevens is beperkt tot geautoriseerde medewerkers en wordt regelmatig gecontroleerd.',
          ],
        },
        {
          icon: <Bell size={20} />, color: 'text-amber-600 bg-amber-50',
          title: 'Uw rechten',
          body: [
            'U kunt uw accountgegevens op elk moment bekijken en bewerken.',
            'U heeft het recht om volledige verwijdering van uw gegevens aan te vragen.',
            'U kunt zich uitschrijven voor marketinge-mails.',
            'Neem voor vragen over uw gegevens contact met ons op.',
          ],
        },
      ]
    : [
        {
          icon: <Database size={20} />, color: 'text-blue-600 bg-blue-50',
          title: 'Information We Collect',
          body: [
            'Personally identifiable information such as name, email, and phone number you provide at registration.',
            'Professional information including work experience, education, skills, and any CV you upload.',
            'Platform usage data such as pages visited and tools used.',
            'Device and browser information to improve user experience.',
          ],
        },
        {
          icon: <Eye size={20} />, color: 'text-purple-600 bg-purple-50',
          title: 'How We Use Your Information',
          body: [
            'Providing, personalizing, and improving Movian\'s services for you.',
            'Creating and managing your account and facilitating communication with mentors and trainers.',
            'Sending notifications and updates related to your account.',
            'Data analysis to improve the platform and provide better career recommendations.',
          ],
        },
        {
          icon: <UserCheck size={20} />, color: 'text-green-600 bg-green-50',
          title: 'Sharing Your Information',
          body: [
            'We never sell your data to third parties for advertising purposes.',
            'Your professional profile information is visible only to mentors and trainers you interact with.',
            'If legally required, data may be shared with competent authorities.',
          ],
        },
        {
          icon: <Lock size={20} />, color: 'text-red-600 bg-red-50',
          title: 'Data Security',
          body: [
            'We use SSL/TLS encryption for secure data transmission.',
            'Passwords are stored as hashes and never kept in plain text.',
            'Data access is limited to authorized employees and regularly audited.',
          ],
        },
        {
          icon: <Bell size={20} />, color: 'text-amber-600 bg-amber-50',
          title: 'Your Rights',
          body: [
            'You can view and edit your account information at any time.',
            'You have the right to request complete deletion of your data.',
            'You can opt out of marketing emails.',
            'For any questions about your data, contact us.',
          ],
        },
      ];

  return {
    title: fa ? 'سیاست حریم خصوصی' : nl ? 'Privacybeleid' : 'Privacy Policy',
    intro: fa
      ? 'موویان به حریم خصوصی شما احترام می‌گذارد. این سیاست توضیح می‌دهد که چه اطلاعاتی جمع‌آوری می‌کنیم و چگونه از آن‌ها استفاده می‌نماییم.'
      : nl
      ? 'Movian respecteert uw privacy. Dit beleid legt uit welke informatie we verzamelen en hoe we deze gebruiken.'
      : 'Movian respects your privacy. This policy explains what information we collect and how we use it.',
    lastUpdated: fa ? `آخرین به‌روزرسانی: ${lastUpdated}` : nl ? `Laatste update: ${lastUpdated}` : `Last updated: ${lastUpdated}`,
    sections,
  };
}

export default function PrivacyPage() {
  const { isRTL } = useLang();
  const { title, intro, lastUpdated, sections } = useContent();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-700 text-white py-16">
          <div className="max-w-3xl mx-auto text-center px-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Shield size={26} className="text-gray-300" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">{title}</h1>
            <p className="text-gray-300 mb-3">{intro}</p>
            <p className="text-xs text-gray-500">{lastUpdated}</p>
          </div>
        </section>

        {/* Sections */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            {sections.map((sec, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className={cn('flex items-center gap-3 px-6 py-4 border-b border-gray-100', isRTL ? 'flex-row-reverse' : '')}>
                  <span className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', sec.color)}>
                    {sec.icon}
                  </span>
                  <h2 className="text-base font-semibold text-gray-900">{sec.title}</h2>
                </div>
                <ul className="px-6 py-4 space-y-3">
                  {sec.body.map((line, j) => (
                    <li key={j} className={cn('flex gap-3 text-sm text-gray-600 leading-relaxed', isRTL ? 'flex-row-reverse text-right' : '')}>
                      <span className="text-primary-500 mt-1 flex-shrink-0">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
