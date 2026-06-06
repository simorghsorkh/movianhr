'use client';

import React, { useState } from 'react';
import {
  Mail, Phone, MapPin, Send, MessageCircle, Clock, CheckCircle,
} from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

function useContent() {
  const { lang } = useLang();
  const fa = lang === 'fa';
  const nl = lang === 'nl';

  return {
    title:   fa ? 'تماس با ما'         : nl ? 'Neem contact op'   : 'Contact Us',
    subtitle: fa
      ? 'سوال یا پیشنهادی دارید؟ خوشحال می‌شویم بشنویم.'
      : nl
      ? 'Heeft u een vraag of suggestie? We horen graag van u.'
      : 'Have a question or suggestion? We\'d love to hear from you.',

    // Info cards
    emailLabel:   fa ? 'ایمیل'         : nl ? 'E-mail'            : 'Email',
    emailValue:   'support@movian.io',
    phoneLabel:   fa ? 'تلفن'          : nl ? 'Telefoon'          : 'Phone',
    phoneValue:   fa ? '۰۲۱-۴۲۸۵۷۰۰۰' : '+31 20 123 4567',
    addressLabel: fa ? 'آدرس'          : nl ? 'Adres'             : 'Address',
    addressValue: fa
      ? 'تهران، خیابان ولیعصر، برج تکنولوژی موویان'
      : nl
      ? 'Amsterdam, Herengracht 182'
      : 'Amsterdam, Herengracht 182',
    hoursLabel:   fa ? 'ساعات پاسخگویی' : nl ? 'Openingstijden'  : 'Support Hours',
    hoursValue:   fa ? 'شنبه تا پنج‌شنبه — ۹ صبح تا ۶ عصر' : nl ? 'Ma–vr — 9:00–18:00' : 'Mon–Fri — 9 AM – 6 PM',

    // Form
    formTitle:  fa ? 'ارسال پیام'      : nl ? 'Stuur een bericht' : 'Send a Message',
    namePlaceholder:    fa ? 'نام کامل شما'    : nl ? 'Uw volledige naam'  : 'Your full name',
    emailPlaceholder:   fa ? 'آدرس ایمیل شما' : nl ? 'Uw e-mailadres'     : 'Your email address',
    subjectPlaceholder: fa ? 'موضوع پیام'      : nl ? 'Onderwerp'          : 'Subject',
    messagePlaceholder: fa
      ? 'پیام خود را اینجا بنویسید…'
      : nl
      ? 'Schrijf hier uw bericht…'
      : 'Write your message here…',
    submitBtn: fa ? 'ارسال پیام'       : nl ? 'Bericht versturen' : 'Send Message',
    successMsg: fa
      ? 'پیام شما با موفقیت ارسال شد! تیم ما به زودی پاسخ خواهد داد.'
      : nl
      ? 'Uw bericht is succesvol verzonden! Ons team reageert zo snel mogelijk.'
      : 'Your message was sent successfully! Our team will respond shortly.',
    nameLabel:    fa ? 'نام'    : nl ? 'Naam'    : 'Name',
    emailLabel2:  fa ? 'ایمیل' : nl ? 'E-mail'  : 'Email',
    subjectLabel: fa ? 'موضوع' : nl ? 'Onderwerp' : 'Subject',
    messageLabel: fa ? 'پیام'  : nl ? 'Bericht' : 'Message',
  };
}

export default function ContactPage() {
  const { isRTL } = useLang();
  const c = useContent();

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1400);
  };

  const infoCards = [
    { icon: <Mail size={20} />, color: 'text-primary-600 bg-primary-50', label: c.emailLabel, value: c.emailValue },
    { icon: <Phone size={20} />, color: 'text-green-600 bg-green-50', label: c.phoneLabel, value: c.phoneValue },
    { icon: <MapPin size={20} />, color: 'text-orange-600 bg-orange-50', label: c.addressLabel, value: c.addressValue },
    { icon: <Clock size={20} />, color: 'text-purple-600 bg-purple-50', label: c.hoursLabel, value: c.hoursValue },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-900 to-primary-700 text-white py-16">
          <div className="max-w-3xl mx-auto text-center px-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <MessageCircle size={26} className="text-primary-200" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">{c.title}</h1>
            <p className="text-primary-200">{c.subtitle}</p>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <div className={cn('grid grid-cols-1 lg:grid-cols-2 gap-10', isRTL ? 'lg:grid-flow-col-dense' : '')}>

              {/* Left — contact info */}
              <div className="space-y-4">
                {infoCards.map((card) => (
                  <div
                    key={card.label}
                    className={cn('flex items-start gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5', isRTL ? 'flex-row-reverse text-right' : '')}
                  >
                    <span className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5', card.color)}>
                      {card.icon}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{card.label}</p>
                      <p className="text-sm font-medium text-gray-800">{card.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right — form */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className={cn('text-lg font-semibold text-gray-900 mb-5', isRTL ? 'text-right' : '')}>{c.formTitle}</h2>

                {sent ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                    <CheckCircle size={48} className="text-green-500" />
                    <p className="text-sm text-gray-600 max-w-xs">{c.successMsg}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className={cn('block text-xs font-semibold text-gray-600 mb-1.5', isRTL ? 'text-right' : '')}>{c.nameLabel}</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder={c.namePlaceholder}
                        dir={isRTL ? 'rtl' : 'ltr'}
                        className={cn('w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all', isRTL ? 'text-right' : '')}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className={cn('block text-xs font-semibold text-gray-600 mb-1.5', isRTL ? 'text-right' : '')}>{c.emailLabel2}</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        placeholder={c.emailPlaceholder}
                        dir="ltr"
                        className={cn('w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all', isRTL ? 'text-right' : '')}
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className={cn('block text-xs font-semibold text-gray-600 mb-1.5', isRTL ? 'text-right' : '')}>{c.subjectLabel}</label>
                      <input
                        type="text"
                        required
                        value={form.subject}
                        onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                        placeholder={c.subjectPlaceholder}
                        dir={isRTL ? 'rtl' : 'ltr'}
                        className={cn('w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all', isRTL ? 'text-right' : '')}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className={cn('block text-xs font-semibold text-gray-600 mb-1.5', isRTL ? 'text-right' : '')}>{c.messageLabel}</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                        placeholder={c.messagePlaceholder}
                        dir={isRTL ? 'rtl' : 'ltr'}
                        className={cn('w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all resize-none', isRTL ? 'text-right' : '')}
                      />
                    </div>

                    <Button type="submit" fullWidth disabled={loading} className="flex items-center justify-center gap-2 mt-1">
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send size={16} />
                      )}
                      {c.submitBtn}
                    </Button>
                  </form>
                )}
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
