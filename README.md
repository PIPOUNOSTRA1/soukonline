# 🛍️ سوقك أونلاين (Souqok Online)

> **تصميم وتطوير متاجر إلكترونية احترافية في الجزائر**
> Premium landing page for e-commerce design & development services in Algeria.

---

[اللغة العربية](#العربية) | [English](#english-documentation)

---

## العربية

صفحة هبوط احترافية ومحسنة للتسويق وجلب العملاء لأصحاب المحلات التجارية في الجزائر الذين يرغبون في تحويل محلاتهم التقليدية إلى متاجر إلكترونية تبيع على مدار الساعة بدون عمولات أو اشتراكات شهرية.

### 🌟 المميزات
- **تصميم عصري وجاذب (Premium UI):** استخدام تدرجات لونية متناسقة، تأثيرات زجاجية (Glassmorphism)، ومؤثرات بصرية متحركة عند التمرير.
- **تجاوب كامل (Responsive Design):** متوافق تماماً مع الهواتف الذكية، الأجهزة اللوحية، والشاشات المكتبية.
- **مهيأ لمحركات البحث (SEO Optimized):** إضافة وسوم Meta الوصفية، خريطة الموقع `sitemap.xml` وملف `robots.txt` وبيانات مهيكلة (Schema.org) لتسهيل الأرشفة في جوجل.
- **جاهز للتسويق الرقمي (Marketing Ready):**
  - متكامل ديناميكياً مع **Meta Pixel** لتتبع الزيارات والتحويلات.
  - وسوم **Open Graph** و **Twitter Cards** لتظهر الصفحة بشكل احترافي عند مشاركتها على واتساب، فيسبوك، أو منصة X.
  - توليد روابط واتساب تلقائية برسائل مخصصة مسبقاً وتتبع النقرات كأحداث إرسال عملاء (Leads/Contacts).

---

### ⚙️ كيفية التخصيص والإعداد قبل النشر

#### 1. تعديل بيانات الاتصال والتتبع (مهم جداً)
افتح الملف [assets/js/main.js](file:///c:/Users/CorteC/Downloads/سوقك%20اونلاين/assets/js/main.js) وقم بتعديل كائن الإعدادات في البداية:

```javascript
const CONFIG = {
  // رقم الواتساب الخاص بك (مفتاح الدولة الجزائر +213 متبوعاً بالرقم دون الصفر الأول)
  whatsappNumber: '213XXXXXXXXX', 
  
  // الرسالة التلقائية عند طلب الاستشارة المجانية
  consultationMessage: 'مرحباً سوقك أونلاين، أود الحصول على استشارة مجانية بخصوص تصميم متجر إلكتروني لمحلي.',
  
  // الرسالة التلقائية عند التواصل العام عبر واتساب
  generalContactMessage: 'مرحباً سوقك أونلاين، أود الاستفسار عن خدمات تصميم المتاجر الإلكترونية.',
  
  // معرف فيسبوك بيكسل (Meta Pixel ID) لربط الإعلانات وتتبع النتائج
  metaPixelId: 'ضع_هنا_معرف_البيكسل_الخاص_بك'
};
```

#### 2. تعديل وسوم SEO ومشاركة الروابط
افتح الملف [index.html](file:///c:/Users/CorteC/Downloads/سوقك%20اونلاين/index.html) وقم بتحديث الروابط التالية لتناسب رابط موقعك الجديد على GitHub Pages:
- استبدل `https://username.github.io/souqok-online/` برابط موقعك الفعلي في جميع وسوم `og:url` و `twitter:url` وخريطة الموقع `sitemap.xml`.

---

### 🚀 كيفية الرفع والنشر على GitHub Pages مجاناً

1. قم بإنشاء مستودع جديد (New Repository) على حسابك في GitHub.
2. ارفع ملفات هذا المجلد إلى المستودع.
3. اذهب إلى إعدادات المستودع (**Settings**).
4. من القائمة الجانبية اختر **Pages**.
5. تحت قسم **Build and deployment**، اختر الفرع الرئيسي `main` كـ Source، ثم اضغط **Save**.
6. سيقوم GitHub ببناء ونشر موقعك خلال دقيقة واحدة، وسيعطيك رابطاً مباشراً لموقعك (مثل: `https://username.github.io/souqok-online/`).

---
---

## English Documentation

A professional, high-converting landing page optimized for promoting e-commerce design and development services in Algeria.

### 🌟 Features
- **Premium UI & Modern Aesthetics:** Sleek color palette, Glassmorphism, scroll-triggered micro-animations, and reading progress indicators.
- **100% Responsive:** Fully tested on mobile, tablet, and desktop devices.
- **SEO & Search Engines Optimized:** Implements standard Meta tags, `sitemap.xml`, `robots.txt`, and Schema.org structured JSON-LD data for Google rich snippets.
- **Digital Marketing Ready:**
  - Dynamic **Meta Pixel (Facebook Pixel)** integration for tracking pageviews and conversions.
  - **Open Graph (OG) & Twitter Cards** metadata for neat link previews on social platforms (WhatsApp, Facebook, Messenger, X).
  - Clean event tracking on call-to-action buttons (sends click events to Pixel as `Contact` or `Lead`).

---

### ⚙️ Customization Guide

#### 1. Edit Contact & Tracking Data
Open the file [assets/js/main.js](file:///c:/Users/CorteC/Downloads/سوقك%20اونلاين/assets/js/main.js) and update the config block at the top:
- Change `whatsappNumber` to your Algerian phone number (format: country code `213` + phone number without leading zero, e.g. `213550000000`).
- Paste your Meta Pixel ID into `metaPixelId` to enable ad-tracking.

#### 2. Adjust Domain Links for SEO & Social Previews
In [index.html](file:///c:/Users/CorteC/Downloads/سوقك%20اونلاين/index.html), search and replace `https://username.github.io/souqok-online/` with your actual live URL in the OG metadata tags and Schema script. Do the same in [sitemap.xml](file:///c:/Users/CorteC/Downloads/سوقك%20اونلاين/sitemap.xml).

---

### 🚀 How to Deploy to GitHub Pages (Free Hosting)

1. Create a new repository on your GitHub account (e.g., named `souqok-online`).
2. Push or upload these files to the repository.
3. Navigate to **Settings** -> **Pages** in your repository dashboard.
4. Set the build source to deploy from the `main` branch (root folder) and click **Save**.
5. Wait about a minute, and your site will be live at `https://<your-username>.github.io/souqok-online/`.
