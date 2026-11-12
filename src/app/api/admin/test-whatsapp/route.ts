import { NextRequest, NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";
import {
  sendTestWhatsApp,
  resolveWhatsAppConfig,
  isWhatsAppConfigured,
  missingWhatsAppFields,
} from "@/lib/whatsapp";

/**
 * POST /api/admin/test-whatsapp
 * يرسل رسالة واتساب تجريبية للرقم المضبوط في الإعدادات للتأكد من عمل المزود.
 */
export async function POST(req: NextRequest) {
  try {
    const settings = await getSettings();
    const pin = req.headers.get("x-admin-pin");
    if (pin !== settings.adminPin) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const config = resolveWhatsAppConfig(settings);
    if (!config.toPhone) {
      return NextResponse.json(
        {
          ok: false,
          message: "اكتب رقم الواتساب المستقبل في الحقل بالأعلى ثم اضغط الحفظ",
        },
        { status: 400 }
      );
    }

    if (!isWhatsAppConfigured(config)) {
      const missing = missingWhatsAppFields(config);
      return NextResponse.json(
        {
          ok: false,
          error: "whatsapp_not_configured",
          message: `أكمل الحقول التالية في بطاقة واتساب بالأعلى ثم احفظ: ${missing.join("، ")}`,
        },
        { status: 400 }
      );
    }

    const result = await sendTestWhatsApp(
      config,
      settings.brandNameAr || "بريستيج جاراج"
    );
    if (!result.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: `فشل الإرسال: ${result.error || "خطأ غير معروف"} — راجع بيانات المزوّد في الإعدادات${
            config.provider === "greenapi"
              ? " وتأكد من مسح كود QR من كونسول GREEN-API وأن الخطة Developer مفعّلة"
              : ""
          }${
            config.provider === "ultramsg"
              ? " وتأكد من مسح كود QR من لوحة UltraMsg"
              : ""
          }`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "تم الإرسال — تحقق من واتساب رقم الشركة",
    });
  } catch (e) {
    console.error("POST /api/admin/test-whatsapp error", e);
    return NextResponse.json(
      { ok: false, message: "حدث خطأ غير متوقع" },
      { status: 500 }
    );
  }
}
