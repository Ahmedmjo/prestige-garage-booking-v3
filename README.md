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

#### خطوات التفعيل (مرة واحدة فقط — كل شيء من لوحة الأدمن داخل الموقع)

1. **فعّل التحقق بخطوتين** على حساب Google (إن لم يكن مفعّلاً):
   [myaccount.google.com/security](https://myaccount.google.com/security)

2. **أنشئ كلمة مرور تطبيق** (App Password):
   [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - اكتب اسماً مثل `Prestige Garage` ثم **Create**
   - انسخ كلمة المرور المكوّنة من 16 حرفاً (مثل: `abcd efgh ijkl mnop`)

3. **افتح لوحة الأدمن في الموقع** → الإعدادات → إشعارات البريد الإلكتروني:
   - **بريد Gmail المُرسِل**: اكتب `Prestigegarage.eg@gmail.com`
   - **كلمة مرور التطبيق**: الصق كلمة المرور المنسوخة
   - اضغط **إرسال بريد تجريبي** — سيصل بريد تأكيد فوراً إلى البريد المستقبل

4. من الآن سيصلك بريد بتفاصيل **كل حجز جديد** تلقائياً.

#### طريقة بديلة (متغيرات بيئة على Vercel — اختيارية)

يمكن بدلاً من الخطوة 3 أعلاه إضافة `SMTP_USER` و `SMTP_PASS` في Vercel → Settings → Environment Variables ثم Redeploy — القيم في لوحة الأدمن لها الأولوية إن وُجدت.

#### ملاحظات

- كلمة مرور التطبيق تُستخدم بدلاً من كلمة مرور Gmail العادية (Google أوقفت تسجيل الدخول بكلمة المرور العادية للتطبيقات).
- كلمة المرور تُخزّن في قاعدة البيانات ولا تُعاد أبداً في أي قراءة عامة للإعدادات — تظهر فقط داخل لوحة الأدمن بعد إدخال الـ PIN.
- إرسال البريد **لا يعطّل الحجز أبداً** — لو فشل الإرسال لأي سبب يُسجَّل الخطأ في اللوجات ويكتمل الحجز بشكل طبيعي.
- يمكنك تغيير البريد المستقبل أو إيقاف الإشعارات مؤقتاً من لوحة الأدمن بدون لمس الكود.
- مزودو SMTP آخرون: اضبط `smtpHost` و `smtpPort` و `smtpSecure` من نفس البطاقة في لوحة الأدمن (الافتراضي Gmail: `smtp.gmail.com` / `465` / `true`).

---

### 6. إشعارات واتساب عند الحجز 📲

مع كل حجز جديد تصلك رسالة واتساب على رقم الشركة بتفاصيل الحجز (رقم الحجز، العميل، الهاتف، الخدمة، الموعد، السيارة، السعر) مع رابط مباشر للتواصل مع العميل.

الإعداد كله من **لوحة الأدمن → الإعدادات → إشعارات واتساب**:

1. اكتب **رقم الواتساب المستقبل** (رقم الشركة).
2. اختر **مزود الإرسال**:
   - **UltraMsg (موصى به — الافتراضي)**:
     - سجّل حساباً مجاناً في [ultramsg.com/free](https://ultramsg.com/free/) (بريد + كلمة مرور)
     - من لوحة UltraMsg اضغط (Scan QR) وامسح الكود بتطبيق واتساب أي رقم عندك (هذا الرقم سيكون المُرسِل)
     - انسخ (Instance ID) و (Token) من لوحة UltraMsg والصقهما في الحقلين المخصصين
     - الباقة المجانية للتجربة كافية للبداية، والخطط المدفوعة تبدأ من دولارات قليلة شهرياً
   - **واتساب Cloud API الرسمي (Meta)**:
     - من [developers.facebook.com](https://developers.facebook.com) أنشئ تطبيقاً من نوع WhatsApp واربطه برقم واتساب Business
     - انسخ (Phone Number ID) وأنشئ (Permanent Token) من إعدادات النظام (System User) بصلاحية `whatsapp_business_messaging`
     - ملاحظة: الرسائل التي تبدأها أنت (خارج نافذة الرد ٢٤ ساعة) تتطلب قالباً معتمداً من Meta
   - **CallMeBot (مجاني)**:
     - من واتساب رقم الشركة أرسل رسالة نصها `I allow callmebot to send me messages`
       إلى رقم البوت الظاهر في [callmebot.com](https://www.callmebot.com/blog/free-api-whatsapp-messages) (قسم Free WhatsApp API ← Setup)
     - سيصلك المفتاح فوراً في رسالة رد — انسخه والصقه في حقل **مفتاح API**
     - تنبيه: بوتات CallMeBot كثيراً ما تمتلئ وتبقى معطلة لأيام — في هذه الحالة استخدم UltraMsg
   - **TextMeBot (مدفوع رمزياً)**: سجّل في [textmebot.com](https://textmebot.com) واحصل على مفتاح API
   - **رابط API مخصص**: لأي مزود آخر — اكتب قالب الرابط مع `{phone}` و `{text}` و `{apikey}`
3. اضغط **إرسال رسالة تجريبية** للتأكد، ثم حفظ الإعدادات.

#### ملاحظات

- التوكنات (مفتاح CallMeBot / توكن UltraMsg / توكن Meta) تُخزّن في قاعدة البيانات ولا تُعاد في أي قراءة عامة للإعدادات (مثل كلمة مرور البريد تماماً).
- الإرسال **لا يعطّل الحجز أبداً** — الفشل يُسجَّل في اللوجات فقط.
- UltraMsg و TextMeBot و CallMeBot خدمات غير رسمية: استخدم رقماً ثانوياً للإرسال لو كنت قلقاً على رقمك الأساسي، أو اعتمد مزود Meta الرسمي.

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
