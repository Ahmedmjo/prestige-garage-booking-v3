import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";

// Public settings read (no admin pin exposed)
export async function GET() {
  const settings = await getSettings();
  const safe = { ...settings } as Partial<typeof settings>;
  delete safe.adminPin;
  // كلمة مرور البريد لا تُعاد أبداً في القراءة العامة
  delete safe.smtpPass;
  return NextResponse.json({ settings: safe });
}
