import { NextRequest, NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";
import { sendTestEmail, isSmtpConfigured } from "@/lib/mailer";

/**
 * POST /api/admin/test-email
 * يرسل بريداً تجريبياً للبريد المضبوط في الإعدادات للتأكد من عمل SMTP.
 */
export async function POST(req: NextRequest) {
  try {
    const settings = await getSettings();
    const pin = req.headers.get("x-admin-pin");
    if (pin !== settings.adminPin) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const to = (settings.bookingNotificationEmail || "").trim();
    if (!to || !to.includes("@")) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "اكتب بريداً إلكترونياً صحيحاً في حقل (البريد المستقبل للحجوزات) واحفظ الإعدادات أولاً",
        },
        { status: 400 }
      );
    }

    if (!isSmtpConfigured()) {
      return NextResponse.json(
        {
          ok: false,
          error: "smtp_not_configured",
          message:
            "لم يتم ضبط البريد المرسل بعد: أضف SMTP_USER و SMTP_PASS في متغيرات البيئة على Vercel ثم أعد النشر — راجع ملف README (قسم إشعارات البريد)",
        },
        { status: 400 }
      );
    }

    const result = await sendTestEmail(to, settings.brandNameAr || "بريستيج جاراج");
    if (!result.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: `فشل الإرسال: ${result.error || "خطأ غير معروف"} — تأكد من صحة كلمة مرور التطبيق (SMTP_PASS)`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, message: "تم الإرسال — تحقق من صندوق الوارد" });
  } catch (e) {
    console.error("POST /api/admin/test-email error", e);
    return NextResponse.json(
      { ok: false, message: "حدث خطأ غير متوقع" },
      { status: 500 }
    );
  }
}
