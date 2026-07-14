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
