'use client';

import React from 'react';
import { FileText, CheckCircle, XCircle, AlertTriangle, Scale, RefreshCw } from 'lucide-react';
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

  const sections: Section[] = fa
    ? [
        {
          icon: <CheckCircle size={20} />, color: 'text-green-600 bg-green-50',
          title: 'پذیرش شرایط',
          body: [
            'با ثبت‌نام و استفاده از موویان، این شرایط خدمات را می‌پذیرید.',
            'اگر با هر یک از این شرایط موافق نیستید، لطفاً از استفاده از پلتفرم خودداری کنید.',
            'این شرایط ممکن است به‌روزرسانی شوند؛ ادامه استفاده به منزله پذیرش تغییرات است.',
          ],
        },
        {
          icon: <FileText size={20} />, color: 'text-blue-600 bg-blue-50',
          title: 'حساب کاربری',
          body: [
            'مسئولیت حفظ امنیت رمز عبور حساب کاربری خود با شماست.',
            'اطلاعات ثبت‌نام باید دقیق و به‌روز باشد.',
            'هر حساب مختص یک نفر است و قابل اشتراک‌گذاری نیست.',
            'در صورت مشاهده هر گونه دسترسی غیرمجاز، فوراً با ما تماس بگیرید.',
          ],
        },
        {
          icon: <CheckCircle size={20} />, color: 'text-primary-600 bg-primary-50',
          title: 'استفاده مجاز',
          body: [
            'پلتفرم را برای اهداف قانونی و حرفه‌ای استفاده کنید.',
            'محتوای صادقانه و دقیق در پروفایل و تعاملات خود ارائه دهید.',
            'با سایر اعضا با احترام و حرفه‌ای رفتار کنید.',
            'قوانین مربوط به مالکیت معنوی را رعایت کنید.',
          ],
        },
        {
          icon: <XCircle size={20} />, color: 'text-red-600 bg-red-50',
          title: 'فعالیت‌های ممنوع',
          body: [
            'ارسال هرزنامه، تبلیغات غیرمجاز یا محتوای گمراه‌کننده.',
            'جعل هویت یا ارائه اطلاعات نادرست درباره خود.',
            'تلاش برای نفوذ به سیستم یا دسترسی غیرمجاز به داده‌های دیگران.',
            'سوء استفاده از ابزارهای پلتفرم برای اهداف غیراخلاقی.',
          ],
        },
        {
          icon: <Scale size={20} />, color: 'text-amber-600 bg-amber-50',
          title: 'محدودیت مسئولیت',
          body: [
            'موویان یک پلتفرم واسط است و مسئولیت مستقیم نتایج مشاوره‌ها را نمی‌پذیرد.',
            'ما تلاش می‌کنیم خدمات بدون وقفه ارائه دهیم اما قطعی‌های موقت ممکن است رخ دهند.',
            'محتوای منتورها و مدرسان بیانگر نظرات شخصی آن‌هاست نه موضع رسمی موویان.',
          ],
        },
        {
          icon: <RefreshCw size={20} />, color: 'text-teal-600 bg-teal-50',
          title: 'تغییرات در خدمات',
          body: [
            'موویان حق تغییر، تعلیق یا توقف هر بخشی از خدمات را دارد.',
            'در صورت تغییرات عمده، کاربران از طریق ایمیل مطلع خواهند شد.',
            'می‌توانید در هر زمان حساب خود را حذف کنید.',
          ],
        },
      ]
    : nl
    ? [
        {
          icon: <CheckCircle size={20} />, color: 'text-green-600 bg-green-50',
          title: 'Acceptatie van voorwaarden',
          body: [
            'Door u te registreren en Movian te gebruiken, gaat u akkoord met deze servicevoorwaarden.',
            'Als u het niet eens bent met een van deze voorwaarden, gebruik het platform dan niet.',
            'Deze voorwaarden kunnen worden bijgewerkt; voortgezet gebruik impliceert acceptatie van wijzigingen.',
          ],
        },
        {
          icon: <FileText size={20} />, color: 'text-blue-600 bg-blue-50',
          title: 'Gebruikersaccount',
          body: [
            'U bent verantwoordelijk voor het bewaken van de beveiliging van uw wachtwoord.',
            'Registratiegegevens moeten accuraat en up-to-date zijn.',
            'Elk account is persoonlijk en mag niet worden gedeeld.',
            'Neem bij ongeautoriseerde toegang onmiddellijk contact met ons op.',
          ],
        },
        {
          icon: <CheckCircle size={20} />, color: 'text-primary-600 bg-primary-50',
          title: 'Toegestaan gebruik',
          body: [
            'Gebruik het platform voor legale en professionele doeleinden.',
            'Bied eerlijke en nauwkeurige informatie aan in uw profiel en interacties.',
            'Behandel andere leden met respect en professionaliteit.',
            'Respecteer de regels met betrekking tot intellectueel eigendom.',
          ],
        },
        {
          icon: <XCircle size={20} />, color: 'text-red-600 bg-red-50',
          title: 'Verboden activiteiten',
          body: [
            'Versturen van spam, ongeautoriseerde reclame of misleidende inhoud.',
            'Identiteitsfraude of het verstrekken van onjuiste informatie over uzelf.',
            'Pogingen om in te breken in het systeem of ongeautoriseerde toegang tot andermans gegevens.',
            'Misbruik van platformtools voor onethische doeleinden.',
          ],
        },
        {
          icon: <Scale size={20} />, color: 'text-amber-600 bg-amber-50',
          title: 'Beperking van aansprakelijkheid',
          body: [
            'Movian is een bemiddelingsplatform en aanvaardt geen directe verantwoordelijkheid voor advieskansen.',
            'We streven naar ononderbroken dienstverlening maar tijdelijke onderbrekingen zijn mogelijk.',
            'De inhoud van mentors en trainers vertegenwoordigt hun persoonlijke mening, niet het officiële standpunt van Movian.',
          ],
        },
        {
          icon: <RefreshCw size={20} />, color: 'text-teal-600 bg-teal-50',
          title: 'Wijzigingen in diensten',
          body: [
            'Movian heeft het recht om elk deel van de diensten te wijzigen, op te schorten of te beëindigen.',
            'Bij grote wijzigingen worden gebruikers per e-mail geïnformeerd.',
            'U kunt uw account op elk moment verwijderen.',
          ],
        },
      ]
    : [
        {
          icon: <CheckCircle size={20} />, color: 'text-green-600 bg-green-50',
          title: 'Acceptance of Terms',
          body: [
            'By registering and using Movian, you accept these Terms of Service.',
            'If you disagree with any of these terms, please refrain from using the platform.',
            'These terms may be updated; continued use implies acceptance of changes.',
          ],
        },
        {
          icon: <FileText size={20} />, color: 'text-blue-600 bg-blue-50',
          title: 'User Account',
          body: [
            'You are responsible for maintaining the security of your account password.',
            'Registration information must be accurate and up-to-date.',
            'Each account is personal and cannot be shared.',
            'Report any unauthorized access to us immediately.',
          ],
        },
        {
          icon: <CheckCircle size={20} />, color: 'text-primary-600 bg-primary-50',
          title: 'Permitted Use',
          body: [
            'Use the platform for lawful and professional purposes.',
            'Provide honest and accurate information in your profile and interactions.',
            'Treat other members with respect and professionalism.',
            'Respect intellectual property rules.',
          ],
        },
        {
          icon: <XCircle size={20} />, color: 'text-red-600 bg-red-50',
          title: 'Prohibited Activities',
          body: [
            'Sending spam, unauthorized advertisements, or misleading content.',
            'Identity fraud or providing false information about yourself.',
            'Attempting to breach the system or gain unauthorized access to others\' data.',
            'Misusing platform tools for unethical purposes.',
          ],
        },
        {
          icon: <Scale size={20} />, color: 'text-amber-600 bg-amber-50',
          title: 'Limitation of Liability',
          body: [
            'Movian is an intermediary platform and does not accept direct responsibility for consultation outcomes.',
            'We strive to provide uninterrupted services but temporary outages may occur.',
            'Content from mentors and trainers represents their personal opinions, not Movian\'s official position.',
          ],
        },
        {
          icon: <RefreshCw size={20} />, color: 'text-teal-600 bg-teal-50',
          title: 'Changes to Services',
          body: [
            'Movian reserves the right to change, suspend, or discontinue any part of its services.',
            'Users will be notified by email of any major changes.',
            'You can delete your account at any time.',
          ],
        },
      ];

  return {
    title: fa ? 'شرایط خدمات' : nl ? 'Servicevoorwaarden' : 'Terms of Service',
    intro: fa
      ? 'لطفاً این شرایط را پیش از استفاده از موویان به دقت مطالعه کنید.'
      : nl
      ? 'Lees deze voorwaarden zorgvuldig voordat u Movian gebruikt.'
      : 'Please read these terms carefully before using Movian.',
    lastUpdated: fa ? 'آخرین به‌روزرسانی: ۱ خرداد ۱۴۰۵' : nl ? 'Laatste update: 1 juni 2026' : 'Last updated: June 1, 2026',
    sections,
  };
}

export default function TermsPage() {
  const { isRTL } = useLang();
  const { title, intro, lastUpdated, sections } = useContent();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-700 text-white py-16">
          <div className="max-w-3xl mx-auto text-center px-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Scale size={26} className="text-slate-300" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">{title}</h1>
            <p className="text-slate-300 mb-3">{intro}</p>
            <p className="text-xs text-slate-500">{lastUpdated}</p>
          </div>
        </section>

        {/* Notice banner */}
        <div className="bg-amber-50 border-b border-amber-100">
          <div className={cn('max-w-3xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-amber-700', isRTL ? 'flex-row-reverse' : '')}>
            <AlertTriangle size={16} className="flex-shrink-0" />
            <span>
              {isRTL
                ? 'استفاده از پلتفرم به معنای پذیرش کامل این شرایط است.'
                : isRTL === false && 'Using the platform means full acceptance of these terms.'}
            </span>
          </div>
        </div>

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
