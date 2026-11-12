/**
 * WhatsApp — إشعار برقم الشركة عند وصول حجز جديد
 * ------------------------------------------------
 * مزودات مدعومة (تُضبط من لوحة الأدمن ← الإعدادات ← إشعارات واتساب):
 *   ultramsg  (موصى به — تجربة مجانية وسهلة) -> api.ultramsg.com (POST JSON)
 *   meta      (واتساب Cloud API الرسمي)        -> graph.facebook.com (POST JSON)
 *   callmebot (مجاني — كثيراً ما يمتلئ بوتاته) -> api.callmebot.com/whatsapp.php
 *   textmebot (بديل مدفوع رمزياً)              -> api.textmebot.com/send.php
 *   custom    (رابط API مخصص)                  -> قالب URL يحتوي {phone} و {text} و {apikey}
 *
 * الإرسال لا يفشل الحجز أبداً: أي خطأ يُسجَّل فقط في اللوجات.
 */
import { weekdayAr, timeAr, priceAr } from "./mailer";

export interface SendResult {
  ok: boolean;
  error?: string;
}

/* ================= الإعدادات ================= */

export interface WhatsAppConfig {
  provider: string; // "ultramsg" | "meta" | "callmebot" | "textmebot" | "custom"
  toPhone: string; // رقم الشركة المستقبل (مصري: 01xxxxxxxxx)
  apiKey: string; // callmebot / textmebot / custom
  urlTemplate: string; // للمزود المخصص فقط
  instanceId: string; // ultramsg: معرّف النسخة (مثال: instance12345)
  token: string; // ultramsg: توكن النسخة
  metaToken: string; // meta: توكن دائم (Permanent Token)
  metaPhoneId: string; // meta: معرّف رقم الهاتف (Phone Number ID)
}

export function resolveWhatsAppConfig(settings: {
  whatsappProvider?: string;
  whatsappToPhone?: string;
  whatsappApiKey?: string;
  whatsappUrlTemplate?: string;
  whatsappInstanceId?: string;
  whatsappToken?: string;
  whatsappMetaToken?: string;
  whatsappMetaPhoneId?: string;
}): WhatsAppConfig {
  return {
    provider: (settings.whatsappProvider || "ultramsg").trim().toLowerCase(),
    toPhone: (settings.whatsappToPhone || "").trim(),
    apiKey: (settings.whatsappApiKey || "").trim(),
    urlTemplate: (settings.whatsappUrlTemplate || "").trim(),
    instanceId: (settings.whatsappInstanceId || "").trim(),
    token: (settings.whatsappToken || "").trim(),
    metaToken: (settings.whatsappMetaToken || "").trim(),
    metaPhoneId: (settings.whatsappMetaPhoneId || "").trim(),
  };
}

/** أسماء الحقول الناقصة حسب المزوّد المختار (لعرضها للمستخدم) */
export function missingWhatsAppFields(c: WhatsAppConfig): string[] {
  const missing: string[] = [];
  if (!c.toPhone) missing.push("رقم الواتساب المستقبل");
  if (c.provider === "ultramsg") {
    if (!c.instanceId) missing.push("معرّف النسخة (Instance ID)");
    if (!c.token) missing.push("توكن UltraMsg");
  } else if (c.provider === "meta") {
    if (!c.metaToken) missing.push("توكن Meta الدائم");
    if (!c.metaPhoneId) missing.push("معرّف رقم الهاتف (Phone Number ID)");
  } else if (c.provider === "custom") {
    if (!c.urlTemplate) missing.push("قالب الرابط");
    if (!c.apiKey) missing.push("مفتاح API");
  } else {
    if (!c.apiKey) missing.push("مفتاح API");
  }
  return missing;
}

export function isWhatsAppConfigured(c: WhatsAppConfig): boolean {
  return missingWhatsAppFields(c).length === 0;
}

/* ================= تنسيق الأرقام ================= */

/** 01505777755 -> +201505777755 (يدعم الإدخال المصري والدولي) */
export function toInternationalPhone(phone: string): string {
  let p = phone.replace(/[^\d]/g, "");
  if (p.startsWith("00")) p = p.slice(2);
  if (p.startsWith("0")) p = "20" + p.slice(1); // مصر: 01x -> 201x
  return "+" + p;
}

/* ================= بناء رسالة الحجز ================= */

export interface BookingWhatsAppData {
  refCode: string;
  customerName: string;
  phone: string;
  carType: string | null;
  carBrand: string | null;
  carModel: string;
  variantName: string | null;
  serviceNameAr: string;
  branchNameAr: string | null;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes: string | null;
  totalPrice: number;
  currencyAr: string;
  brandNameAr: string;
}

export function renderBookingWhatsAppMessage(d: BookingWhatsAppData): string {
  const serviceLabel = d.variantName
    ? `${d.serviceNameAr} — ${d.variantName}`
    : d.serviceNameAr;

  const weekday = weekdayAr(d.date);
  const dateLabel = weekday ? `${weekday} ${d.date}` : d.date;
  const carLabel =
    [d.carBrand, d.carModel, d.carType].filter(Boolean).join(" — ") || "غير محدد";

  const lines: string[] = [
    `🚗 *حجز جديد — ${d.brandNameAr}*`,
    ``,
    `*رقم الحجز:* ${d.refCode}`,
    `*العميل:* ${d.customerName}`,
    `*الهاتف:* ${d.phone}`,
    `*الخدمة:* ${serviceLabel}`,
    `*الموعد:* ${dateLabel} — ${timeAr(d.time)}`,
    `*السيارة:* ${carLabel}`,
    `*السعر:* ${priceAr(d.totalPrice, d.currencyAr)}`,
  ];
  if (d.branchNameAr) lines.push(`*الفرع:* ${d.branchNameAr}`);
  if (d.notes) lines.push(`*ملاحظات:* ${d.notes}`);
  lines.push("", `📲 للتواصل مع العميل: https://wa.me/${toInternationalPhone(d.phone).slice(1)}`);

  return lines.join("\n");
}

/* ================= الإرسال ================= */

/** مزودات الروابط (callmebot / textmebot / custom) — GET بسيط */
function buildRequestUrl(c: WhatsAppConfig, text: string): string {
  const phone = encodeURIComponent(toInternationalPhone(c.toPhone));
  const msg = encodeURIComponent(text);
  const key = encodeURIComponent(c.apiKey);

  if (c.provider === "textmebot") {
    return `https://api.textmebot.com/send.php?recipient=${phone}&apikey=${key}&text=${msg}`;
  }
  if (c.provider === "custom" && c.urlTemplate) {
    return c.urlTemplate
      .replaceAll("{phone}", phone)
      .replaceAll("{text}", msg)
      .replaceAll("{apikey}", key);
  }
  // الافتراضي: CallMeBot
  return `https://api.callmebot.com/whatsapp.php?phone=${phone}&apikey=${key}&text=${msg}`;
}

async function sendViaGet(url: string): Promise<SendResult> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(10000),
    headers: { "User-Agent": "PrestigeGarageBooking/1.0" },
  });
  const body = await res.text().catch(() => "");
  if (!res.ok) {
    return { ok: false, error: `HTTP ${res.status}: ${body.slice(0, 140)}` };
  }
  // بعض المزودات ترجع 200 مع نص خطأ داخل الجسم
  if (/(invalid|error|unauthor)/i.test(body)) {
    return { ok: false, error: body.slice(0, 160) || "provider_error" };
  }
  return { ok: true };
}

/** UltraMsg — POST JSON إلى api.ultramsg.com */
async function sendViaUltraMsg(c: WhatsAppConfig, text: string): Promise<SendResult> {
  const res = await fetch(`https://api.ultramsg.com/${c.instanceId}/messages/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(10000),
    body: JSON.stringify({
      token: c.token,
      to: toInternationalPhone(c.toPhone),
      body: text,
    }),
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  const sent = String(data.sent ?? "");
  if (!res.ok || data.error || sent === "false") {
    const err =
      typeof data.error === "string" && data.error
        ? data.error
        : JSON.stringify(data).slice(0, 160) || `HTTP ${res.status}`;
    return { ok: false, error: err };
  }
  return { ok: true };
}

/** Meta WhatsApp Cloud API — POST JSON إلى graph.facebook.com */
async function sendViaMeta(c: WhatsAppConfig, text: string): Promise<SendResult> {
  const to = toInternationalPhone(c.toPhone).replace(/^\+/, ""); // Meta: أرقام فقط بلا +
  const res = await fetch(`https://graph.facebook.com/v22.0/${c.metaPhoneId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${c.metaToken}`,
    },
    signal: AbortSignal.timeout(10000),
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { preview_url: false, body: text },
    }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    error?: { message?: string };
  };
  if (!res.ok || data.error) {
    const err =
      data.error?.message && data.error.message !== "undefined"
        ? data.error.message
        : `HTTP ${res.status}`;
    return { ok: false, error: err.slice(0, 200) };
  }
  return { ok: true };
}

/** يرسل رسالة واتساب نصية — لا يرمي استثناءات أبداً */
export async function sendWhatsAppText(
  c: WhatsAppConfig,
  text: string
): Promise<SendResult> {
  try {
    if (!isWhatsAppConfigured(c)) {
      console.warn(
        "[whatsapp] not configured — notification skipped:",
        missingWhatsAppFields(c).join(", ")
      );
      return { ok: false, error: "whatsapp_not_configured" };
    }

    if (c.provider === "ultramsg") return await sendViaUltraMsg(c, text);
    if (c.provider === "meta") return await sendViaMeta(c, text);
    return await sendViaGet(buildRequestUrl(c, text));
  } catch (e) {
    console.error("[whatsapp] send failed:", e);
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  }
}

/** إشعار واتساب بتفاصيل الحجز الجديد */
export async function sendBookingWhatsAppNotification(
  c: WhatsAppConfig,
  data: BookingWhatsAppData
): Promise<SendResult> {
  return sendWhatsAppText(c, renderBookingWhatsAppMessage(data));
}

/** رسالة تجريبية للتأكد من صحة الإعدادات */
export async function sendTestWhatsApp(
  c: WhatsAppConfig,
  brandNameAr: string
): Promise<SendResult> {
  const text = [
    `✅ *رسالة تجريبية — ${brandNameAr}*`,
    ``,
    `الإعدادات تعمل بنجاح.`,
    `من الآن سيصلك واتساب بتفاصيل كل حجز جديد على هذا الرقم.`,
  ].join("\n");
  return sendWhatsAppText(c, text);
}
