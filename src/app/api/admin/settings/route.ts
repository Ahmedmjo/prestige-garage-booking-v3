import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";

async function checkAuth(req: NextRequest) {
  const settings = await getSettings();
  const pin = req.headers.get("x-admin-pin");
  return pin === settings.adminPin;
}

// GET all settings
export async function GET(req: NextRequest) {
  const settings = await getSettings();
  // Don't expose secrets in the public read; admin already has them
  const isAuthed = await checkAuth(req);
  const safe = { ...settings } as Partial<typeof settings>;
  if (!isAuthed) {
    delete safe.adminPin;
    delete safe.smtpPass;
    delete safe.whatsappApiKey;
  }
  return NextResponse.json({ settings: safe });
}

// مفاتيح سرية: القيمة الفارغة لا تمسح المخزّن (تحمي من المسح غير المقصود بعد إعادة تحميل الصفحة)
const SECRET_KEYS = new Set(["adminPin", "smtpPass", "whatsappApiKey"]);

// PUT update settings (admin)
export async function PUT(req: NextRequest) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as Record<string, string>;
  for (const [key, value] of Object.entries(body)) {
    if (typeof value !== "string") continue;
    if (SECRET_KEYS.has(key) && value.trim() === "") continue;
    await db.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  const settings = await getSettings();
  return NextResponse.json({ settings });
}
