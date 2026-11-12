"use client";

import { useApp } from "./store";
import { useEffect } from "react";
import type { SiteSettings } from "./types";

// نسخة احتياطية للعرض قبل تحميل الإعدادات من الخادم.
// الأسرار (adminPin / smtpUser / smtpPass / whatsappApiKey / whatsappToken / whatsappMetaToken)
// غير مضمّنة عمداً حتى لا تُمسح قيمها المخزّنة لو حُفِظت الإعدادات قبل اكتمال التحميل.
const FALLBACK = {
  brandName: "Prestige Garage",
  brandNameAr: "بريستيج جاراج",
  tagline: "Premium Car Care",
  taglineAr: "العناية الفاخرة بالسيارات",
  bornLine: "Born in Germany. Mastered in Egypt.",
  poweredBy: "AUTHORIZED SONAX DEALER",
  phone: "+201000000000",
  whatsapp: "+201000000000",
  address: "Cairo, Egypt",
  addressAr: "القاهرة، مصر",
  workingHours: "Sat - Thu: 10:00 AM - 10:00 PM",
  workingHoursAr: "السبت - الخميس: ١٠:٠٠ ص - ١٠:٠٠ م",
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  tiktok: "https://tiktok.com",
  twitter: "https://twitter.com",
  snapchat: "https://snapchat.com",
  email: "prestigegarage.eg@gmail.com",
  branchSelectionEnabled: "true",
  currency: "EGP",
  currencyAr: "ج.م",
  leadTimeHours: "2",
  slotDurationMin: "60",
  emailNotificationsEnabled: "true",
  bookingNotificationEmail: "Prestigegarage.eg@gmail.com",
  smtpHost: "smtp.gmail.com",
  smtpPort: "465",
  smtpSecure: "true",
  whatsappNotificationsEnabled: "true",
  whatsappProvider: "greenapi",
  whatsappToPhone: "01505777755",
  aboutAr: "وجهة مصر الرائدة للعناية الفاخرة بالسيارات. نجمع بين التكنولوجيا الألمانية والحرفية المتخصصة لتحقيق نتائج لا مثيل لها لسيارتك.",
  aboutEn: "Egypt's premier destination for luxury car care. We combine German technology with expert craftsmanship to deliver unmatched results for your vehicle.",
};

export function useSettings(): SiteSettings {
  const settings = useApp((s) => s.settings);
  const loadSettings = useApp((s) => s.loadSettings);
  useEffect(() => {
    if (!settings) loadSettings();
  }, [settings, loadSettings]);
  // تحويل مقصود عبر unknown: النسخة الاحتياطية جزئية عمداً (بلا أسرار)
  return settings ?? (FALLBACK as unknown as SiteSettings);
}
