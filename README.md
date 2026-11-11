# 🚗 Prestige Garage — نظام حجز المواعيد

تطبيق حجز مواعيد احترافي لورش تعديلات السيارات — Next.js 15 · Prisma · PostgreSQL (Neon) · Vercel

---

## 📁 هيكل المشروع

```
src/
 ├── app/                  # Next.js App Router (pages + API routes)
 │   └── api/
 │       ├── admin/        # Admin endpoints (bookings, services, offers, branches, settings)
 │       └── bookings/     # Customer booking endpoints
 ├── components/
 │   ├── admin/            # لوحة تحكم الأدمن
 │   ├── booking/          # شاشات الحجز + حجوزاتي
 │   ├── home/             # الشاشة الرئيسية + عروض
 │   ├── services/         # عرض الخدمات
 │   └── brand/            # Logo + ServiceIcon
 ├── lib/
 │   ├── types.ts           # TypeScript types
 │   ├── api.ts             # Client-side API helpers
 │   ├── store.ts           # Zustand store
 │   └── db.ts              # Prisma client
 └── prisma/
     └── schema.prisma      # Database schema
```

---

## 🚀 الرفع على GitHub + Vercel + Neon (خطوة بخطوة)

### 1. إنشاء قاعدة بيانات Neon

1. اذهب لـ [neon.tech](https://neon.tech) وأنشئ حساب مجاني
2. أنشئ **Project جديد** ← اختر منطقة قريبة منك (Frankfurt أو US East)
3. من صفحة المشروع → **Connection Details** → انسخ **Connection string** (Pooled)
4. احتفظ بهذا الرابط — ستحتاجه في Vercel

---

### 2. رفع المشروع على GitHub

```bash
# داخل مجلد المشروع
git init
git add .
git commit -m "feat: initial prestige garage booking app"

# أنشئ repo جديد في github.com ثم:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

### 3. الربط مع Vercel

1. اذهب لـ [vercel.com](https://vercel.com) → **New Project**
2. استورد الـ repo من GitHub
3. في **Environment Variables** أضف:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | رابط Neon الذي نسخته (Pooled connection string) |
   | `ADMIN_PIN` | الرقم السري للأدمن (مثال: `1234`) |
   | `SMTP_USER` | بريد Gmail المُرسِل للإشعارات (مثال: `Prestigegarage.eg@gmail.com`) |
   | `SMTP_PASS` | كلمة مرور التطبيق من Gmail (App Password — الخطوات في القسم 5) |

   > آخر متغيرين اختياريان لكنهما مطلوبان لتفعيل بريد تفاصيل الحجوزات الجديدة.

4. اضغط **Deploy**
5. Vercel سيشغّل تلقائياً: `npm install` → `prisma generate` → `prisma db push` → `next build`

> ⚠️ إذا لم يشتغل `prisma db push` تلقائياً، أضف في **Build Command** في Vercel:
> ```
> npx prisma generate && npx prisma db push && next build
> ```

---

### 4. أول تشغيل

بعد انتهاء الـ Deploy:
- افتح التطبيق → الزر السفلي الأيسر (الترس) → أدخل الـ PIN → ستجد لوحة الأدمن جاهزة

---

### 5. إشعارات البريد الإلكتروني عند الحجز ✉️

عند إنشاء أي حجز جديد يُرسل النظام تلقائياً بريداً بتفاصيل الحجز كاملة (رقم الحجز، العميل، الهاتف، الخدمة، السيارة، الموعد، السعر، الملاحظات) إلى البريد المحدد في: **لوحة الأدمن → الإعدادات → إشعارات البريد الإلكتروني** (الافتراضي: `Prestigegarage.eg@gmail.com`).

#### خطوات التفعيل (مرة واحدة فقط)

1. **فعّل التحقق بخطوتين** على حساب Google (إن لم يكن مفعّلاً):
   [myaccount.google.com/security](https://myaccount.google.com/security)

2. **أنشئ كلمة مرور تطبيق** (App Password):
   [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - اكتب اسماً مثل `Prestige Garage` ثم **Create**
   - انسخ كلمة المرور المكوّنة من 16 حرفاً (مثل: `abcd efgh ijkl mnop`)

3. **أضف المتغيرين في Vercel**:
   - من مشروعك في Vercel → **Settings** → **Environment Variables** → أضف:

   | Key | Value |
   |-----|-------|
   | `SMTP_USER` | `Prestigegarage.eg@gmail.com` |
   | `SMTP_PASS` | كلمة مرور التطبيق المنسوخة |

4. **أعد النشر** (Redeploy) من Vercel — أو ادفع أي commit جديد.

5. **اختبر**: من لوحة الأدمن → الإعدادات → إشعارات البريد الإلكتروني → **إرسال بريد تجريبي**.

#### ملاحظات

- كلمة مرور التطبيق تُستخدم بدلاً من كلمة مرور Gmail العادية (Google أوقفت تسجيل الدخول بكلمة المرور العادية للتطبيقات).
- إرسال البريد **لا يعطّل الحجز أبداً** — لو فشل الإرسال لأي سبب يُسجَّل الخطأ في اللوجات ويكتمل الحجز بشكل طبيعي.
- يمكنك تغيير البريد المستقبل أو إيقاف الإشعارات مؤقتاً من لوحة الأدمن بدون لمس الكود.
- مزودو SMTP آخرون: اضبط `SMTP_HOST` (افتراضي `smtp.gmail.com`) و `SMTP_PORT` (افتراضي `465`) و `SMTP_SECURE` (افتراضي `true`).

---

## 💻 التطوير المحلي

```bash
# 1. نسخ ملف البيئة
cp .env.example .env.local
# 2. عدّل DATABASE_URL في .env.local بنسخ Neon connection string
# 3. تثبيت الحزم
npm install
# 4. إعداد قاعدة البيانات
npx prisma generate
npx prisma db push
# 5. تشغيل الخادم
npm run dev
```

---

## ✨ المميزات

| الميزة | الوصف |
|--------|-------|
| 🎬 فيديو إعلاني | العروض تدعم فيديو يعمل بدون صوت، يشتغل بالصوت عند الضغط |
| 📸 رفع ميديا | رفع صور وفيديو من الجهاز أو رابط Drive أو URL |
| ✉️ بريد الحجوزات | يصل بريد بتفاصيل كل حجز جديد فوراً + زر واتساب للتواصل مع العميل |
| 🔔 تنبيه العميل | الأدمن يكتب رسالة تظهر في ملف حجز العميل (مثل: موعد تجديد البروتيكشن) |
| 📅 تاريخ انتهاء | الأدمن يحدد تاريخ انتهاء الخدمة ويظهر للعميل كـ reminder |
| 🎨 ألوان متنوعة | كل فئة خدمة بلون مختلف مع carbon fiber خفيف |
| 🏆 بطاقة حجز فاخرة | تصميم receipt احترافي مع عرض الوقت والتاريخ بشكل مميز |
| 🔗 ربط أدمن-عميل | لوحة الأدمن مربوطة بملف الحجز في جانب العميل |
| 🌍 ثنائية اللغة | عربي / إنجليزي بشكل كامل |

---

## 🔐 الأمان

- الـ Admin PIN محمي في `ADMIN_PIN` environment variable
- لا يوجد credentials مكشوفة في الكود
- كل API routes تتحقق من الـ PIN قبل أي عملية

---

## 📦 التقنيات

- **Next.js 15** (App Router)
- **Prisma ORM** + **Neon PostgreSQL**
- **Tailwind CSS** + **Framer Motion**
- **Zustand** (State Management)
- **TypeScript**
