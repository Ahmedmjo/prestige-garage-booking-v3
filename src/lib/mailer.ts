/**
 * Mailer — إشعارات البريد الإلكتروني عند وصول حجز جديد
 * ------------------------------------------------------
 * يستخدم SMTP عبر متغيرات البيئة (افتراضياً Gmail):
 *   SMTP_USER   -> بريد Gmail المرسل (مثال: Prestigegarage.eg@gmail.com)
 *   SMTP_PASS   -> كلمة مرور التطبيق (App Password) من حساب Google
 *   SMTP_HOST   -> افتراضي smtp.gmail.com
 *   SMTP_PORT   -> افتراضي 465
 *   SMTP_SECURE -> افتراضي true (TLS مباشر على 465)
 *
 * الإرسال لا يفشل الحجز أبداً: أي خطأ يُسجَّل فقط في اللوجات.
 */
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
const SMTP_SECURE = process.env.SMTP_SECURE !== "false";
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";

export function isSmtpConfigured(): boolean {
  return Boolean(SMTP_USER && SMTP_PASS);
}

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return cachedTransporter;
}

/* ================= البيانات المطلوبة لبريد الحجز ================= */

export interface BookingEmailData {
  refCode: string;
  customerName: string;
  phone: string;
  carType: string | null;
  carBrand: string | null;
  carModel: string;
  carPlate: string | null;
  variantName: string | null;
  serviceNameAr: string;
  branchNameAr: string | null;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes: string | null;
  address: string | null;
  totalPrice: number;
  currencyAr: string;
  brandNameAr: string;
  createdAt: Date;
}

/* ================= أدوات تنسيق عربية ================= */

const WEEKDAYS_AR = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

function weekdayAr(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  if (isNaN(d.getTime())) return "";
  return WEEKDAYS_AR[d.getDay()] ?? "";
}

/** "13:30" -> "1:30 م" */
function timeAr(timeStr: string): string {
  const [hRaw, mRaw] = timeStr.split(":");
  const h = Number(hRaw);
  if (isNaN(h)) return timeStr;
  const suffix = h < 12 ? "ص" : "م";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${(mRaw || "00").padStart(2, "0")} ${suffix}`;
}

function priceAr(value: number, currencyAr: string): string {
  const rounded = Math.round(value);
  const n = Number.isFinite(rounded)
    ? rounded.toLocaleString("en-US")
    : String(value);
  return `${n} ${currencyAr}`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** wa.me link بجزء رقم مصري (نفس منطق src/lib/phone.ts — نسخة خادم) */
function waLink(phone: string, text: string): string {
  let p = phone.replace(/[^0-9]/g, "");
  if (p.startsWith("0")) p = "20" + p.slice(1);
  return `https://wa.me/${p}?text=${encodeURIComponent(text)}`;
}

/* ================= بناء البريد ================= */

export function renderBookingEmail(
  d: BookingEmailData
): { subject: string; html: string; text: string } {
  const weekday = weekdayAr(d.date);
  const dateLabel = weekday ? `${weekday} ${d.date}` : d.date;
  const timeLabel = timeAr(d.time);
  const price = priceAr(d.totalPrice, d.currencyAr);
  const serviceLabel = d.variantName
    ? `${d.serviceNameAr} — ${d.variantName}`
    : d.serviceNameAr;

  const subject = `حجز جديد ${d.refCode} | ${serviceLabel} | ${dateLabel} ${timeLabel}`;

  const confirmMsg = `مرحباً ${d.customerName}، تم استلام حجزك رقم ${d.refCode} في ${d.brandNameAr} وجاري تأكيده.`;
  const waHref = esc(waLink(d.phone, confirmMsg));

  const rows: { label: string; value: string }[] = [
    { label: "رقم الحجز", value: d.refCode },
    { label: "اسم العميل", value: d.customerName },
    { label: "رقم الهاتف", value: d.phone },
    { label: "الخدمة", value: serviceLabel },
    { label: "التاريخ", value: dateLabel },
    { label: "الوقت", value: timeLabel },
    {
      label: "السيارة",
      value:
        [d.carBrand, d.carModel, d.carType].filter(Boolean).join(" — ") ||
        "غير محدد",
    },
    { label: "رقم اللوحة", value: d.carPlate || "غير محدد" },
    { label: "الفرع", value: d.branchNameAr || "غير محدد" },
    { label: "السعر الإجمالي", value: price },
    { label: "مكان الخدمة", value: d.address || "داخل المركز" },
    { label: "ملاحظات العميل", value: d.notes || "لا توجد" },
  ];

  const htmlRows = rows
    .map(
      (r, i) => `
        <tr style="background:${i % 2 === 0 ? "#ffffff" : "#faf9fc"};">
          <td style="padding:10px 14px;color:#6b7280;font-size:13px;width:34%;border-bottom:1px solid #f0eef4;">${esc(r.label)}</td>
          <td style="padding:10px 14px;color:#111827;font-size:13px;font-weight:700;border-bottom:1px solid #f0eef4;">${esc(r.value)}</td>
        </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#eef0f4;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eef0f4;">
<tr>
<td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

  <!-- الترويسة -->
  <tr>
    <td style="background:#0c0c14;padding:26px 20px;text-align:center;">
      <div style="color:#ffffff;font-size:24px;font-weight:800;">${esc(d.brandNameAr)}</div>
      <div style="color:#8b8b9e;font-size:11px;letter-spacing:3px;margin-top:4px;">PRESTIGE GARAGE</div>
      <div style="margin-top:14px;">
        <span style="display:inline-block;background:#dc143c;color:#ffffff;font-size:13px;font-weight:700;padding:7px 22px;border-radius:20px;">حجز جديد بانتظار التأكيد</span>
      </div>
    </td>
  </tr>

  <!-- رقم الحجز -->
  <tr>
    <td style="background:#171722;padding:12px 20px;text-align:center;color:#cfcfdd;font-size:14px;">
      رقم الحجز: <span style="color:#ffd166;font-weight:800;font-size:16px;">${esc(d.refCode)}</span>
    </td>
  </tr>

  <!-- التفاصيل -->
  <tr>
    <td style="padding:22px 20px 8px;">
      <p style="margin:0 0 14px;color:#111827;font-size:15px;font-weight:800;">تفاصيل الحجز</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        ${htmlRows}
      </table>
    </td>
  </tr>

  <!-- زر واتساب للتواصل مع العميل -->
  <tr>
    <td style="padding:20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:6px 0 2px;">
            <a href="${waHref}" style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 34px;border-radius:10px;">تواصل مع العميل عبر واتساب</a>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:10px 0 0;">
            <span style="color:#9ca3af;font-size:12px;">أو اتصل مباشرة: <a href="tel:${esc(d.phone.replace(/\\s/g, ""))}" style="color:#dc143c;font-weight:700;text-decoration:none;">${esc(d.phone)}</a></span>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- التذييل -->
  <tr>
    <td style="background:#faf9fc;border-top:1px solid #f0eef4;padding:16px 20px;text-align:center;">
      <p style="margin:0;color:#9ca3af;font-size:12px;">هذه رسالة تلقائية من نظام حجوزات ${esc(d.brandNameAr)} — وصل الحجز الآن عبر الموقع.</p>
      <p style="margin:6px 0 0;color:#c7c7d1;font-size:11px;">تاريخ الإرسال: ${esc(
        new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(d.createdAt)
      )}</p>
    </td>
  </tr>

</table>
</td>
</tr>
</table>
</body>
</html>`;

  const text = [
    `حجز جديد — ${d.brandNameAr}`,
    ``,
    `رقم الحجز: ${d.refCode}`,
    `الاسم: ${d.customerName}`,
    `الهاتف: ${d.phone}`,
    `الخدمة: ${serviceLabel}`,
    `التاريخ: ${dateLabel}`,
    `الوقت: ${timeLabel}`,
    `السيارة: ${[d.carBrand, d.carModel, d.carType].filter(Boolean).join(" — ") || "غير محدد"}`,
    `رقم اللوحة: ${d.carPlate || "غير محدد"}`,
    `الفرع: ${d.branchNameAr || "غير محدد"}`,
    `السعر: ${price}`,
    `مكان الخدمة: ${d.address || "داخل المركز"}`,
    `ملاحظات: ${d.notes || "لا توجد"}`,
    ``,
    `للتواصل مع العميل: ${waLink(d.phone, confirmMsg)}`,
  ].join("\n");

  return { subject, html, text };
}

/* ================= الإرسال ================= */

export interface SendResult {
  ok: boolean;
  error?: string;
}

/** يرسل بريد تفاصيل الحجز الجديد — لا يرمي استثناءات أبداً */
export async function sendBookingNotificationEmail(
  to: string,
  data: BookingEmailData
): Promise<SendResult> {
  try {
    if (!isSmtpConfigured()) {
      console.warn(
        "[mailer] SMTP not configured (SMTP_USER / SMTP_PASS missing) — booking email skipped"
      );
      return { ok: false, error: "smtp_not_configured" };
    }
    if (!to || !to.includes("@")) {
      console.warn("[mailer] invalid recipient — booking email skipped:", to);
      return { ok: false, error: "invalid_recipient" };
    }

    const { subject, html, text } = renderBookingEmail(data);
    const info = await getTransporter().sendMail({
      from: `"${data.brandNameAr}" <${SMTP_USER}>`,
      to,
      subject,
      html,
      text,
    });

    console.log(`[mailer] booking notification sent to ${to} (${info.messageId})`);
    return { ok: true };
  } catch (e) {
    console.error("[mailer] booking notification failed:", e);
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  }
}

/** بريد تجريبي للتأكد من صحة إعدادات SMTP */
export async function sendTestEmail(
  to: string,
  brandNameAr: string
): Promise<SendResult> {
  try {
    if (!isSmtpConfigured()) {
      return { ok: false, error: "smtp_not_configured" };
    }
    const info = await getTransporter().sendMail({
      from: `"${brandNameAr}" <${SMTP_USER}>`,
      to,
      subject: `بريد تجريبي — نظام حجوزات ${brandNameAr}`,
      html: `<!DOCTYPE html>
<html dir="rtl" lang="ar"><head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#eef0f4;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:14px;overflow:hidden;">
<tr><td style="background:#0c0c14;padding:24px;text-align:center;">
<div style="color:#fff;font-size:22px;font-weight:800;">${esc(brandNameAr)}</div>
<div style="margin-top:10px;"><span style="display:inline-block;background:#16a34a;color:#fff;font-size:14px;font-weight:700;padding:8px 24px;border-radius:20px;">الإعدادات تعمل بنجاح</span></div>
</td></tr>
<tr><td style="padding:24px;color:#374151;font-size:14px;line-height:1.9;text-align:center;">
تهانينا — وصلتك هذه الرسالة لأن إعدادات البريد الإلكتروني مضبوطة بشكل صحيح.<br/>
من الآن سيصلك بريد بتفاصيل <b>كل حجز جديد</b> على هذا البريد.
</td></tr>
<tr><td style="background:#faf9fc;border-top:1px solid #f0eef4;padding:14px;text-align:center;color:#9ca3af;font-size:12px;">رسالة تجريبية من نظام حجوزات ${esc(brandNameAr)}</td></tr>
</table>
</td></tr></table>
</body></html>`,
      text: `بريد تجريبي — نظام حجوزات ${brandNameAr}\n\nالإعدادات تعمل بنجاح. سيصلك بريد بتفاصيل كل حجز جديد على هذا البريد.`,
    });

    console.log(`[mailer] test email sent to ${to} (${info.messageId})`);
    return { ok: true };
  } catch (e) {
    console.error("[mailer] test email failed:", e);
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  }
}
