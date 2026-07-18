# 👑 لمسة بيوتي | LAMSA BEAUTY

> **دار مستحضرات التجميل والعناية الفاخرة بالبشرة**
> Premium, high-performance cosmetics e-commerce store with Cash on Delivery (COD) in Algeria.

---

[اللغة العربية](#العربية) | [English](#english-documentation)

---

## العربية

متجر إلكتروني فاخر وسريع للغاية، مخصص لبيع مستحضرات التجميل ومنتجات العناية بالبشرة للعلامة التجارية **لمسة بيوتي (Lamsa Beauty)**. المتجر مصمم ليكون صفحة هبوط ذات تحويل عالٍ (High Conversion Landing Page) ويدعم الشحن لجميع الولايات الجزائرية مع الدفع عند الاستلام.

### 🌟 المميزات التقنية والفنية
- **تجربة العرض الحي التفاعلية (Runway Video Scrubbing):** تجربة تصفح غامرة بالفيديو تتفاعل مع تمرير الصفحة (باستخدام GSAP & ScrollTrigger) لاستعراض فخامة وجودة المنتجات.
- **إتمام طلب ذكي (COD Checkout Form):** فورم طلب مدمج لطلب سريع ومنعش يدعم التحقق التلقائي من أرقام الهواتف الجزائرية وتحديد أسعار الشحن حسب كل ولاية (58 ولاية).
- **نظام المفضلة وسلة المشتريات (Wishlist & Cart Drawers):** لوحات جانبية انسيابية لإضافة وإدارة المشتريات دون مغادرة الصفحة.
- **تعدد اللغات (Bilingual AR/FR):** تبديل سلس ولحظي بين اللغتين العربية والفرنسية لكافة نصوص المتجر والمنتجات والأسعار.
- **مهيأ للتسويق والتحليلات (Marketing & Tracking Pixels):**
  - متكامل ديناميكياً مع **Meta Pixel** و **TikTok Pixel** و **Snapchat Pixel** و **Google Analytics (GA4)** لتتبع الأحداث مثل مشاهدة الصفحة (`PageView`)، الإضافة للسلة (`AddToCart`)، وبدء إتمام الطلب (`InitiateCheckout`).
  - وسوم **Open Graph** و **Twitter Cards** محسنة لمشاركة احترافية على منصات التواصل الاجتماعي.

---

### ⚙️ إعدادات التخصيص للمطورين

1. **التحكم بالمنتجات والأسعار:**
   افتح الملف [assets/js/main.js](file:///c:/Users/CorteC/Downloads/سوقك%20اونلاين/assets/js/main.js) للتحكم في مصفوفة المنتجات `productsData`:
   - يمكنك تعديل المعرف `id` والاسم باللغتين وصور المنتجات والأسعار والتصنيفات (`grids`).

2. **معرفات البكسل والتتبع:**
   عند تشغيل الموقع، يقوم بالاتصال بسيرفر الباكيند لجلب إعدادات البكسل ديناميكياً، وفي حال تعذر ذلك، يتم تتبع الأحداث محلياً عبر المتصفح.

---

### 🚀 كيفية النشر على GitHub Pages
1. ارفع ملفات هذا المجلد إلى مستودع جديد على حسابك في GitHub.
2. اذهب إلى إعدادات المستودع (**Settings**).
3. اختر **Pages** من القائمة الجانبية.
4. تحت قسم **Build and deployment**، اختر الفرع الرئيسي `main` واضغط **Save**.
5. سيصبح المتجر متاحاً خلال ثوانٍ معدودة على رابط GitHub Pages الخاص بك.

---
---

## English Documentation

A premium, fast-loading single-page e-commerce store customized for **Lamsa Beauty (لمسة بيوتي)**—a luxury skincare and cosmetics brand in Algeria.

### 🌟 Key Features
- **Cinematic Video Scrubbing (Runway Section):** Implements smooth, scroll-scrubbed background video using GSAP & ScrollTrigger for premium branding.
- **Optimized COD Checkout Form:** Features instant commune loading, smart Algerian phone format validation, and custom shipping rate calculation across 58 wilayas.
- **Bilingual Interface (AR/FR):** Seamlessly switch between Arabic and French for all content, including dynamic catalog details, prices, and error toasts.
- **Social Drawer System:** Slide-out panels for the Wishlist and Shopping Cart, with full persistence in LocalStorage.
- **Pre-integrated Pixel Tracking:** Fires PageView, AddToCart, InitiateCheckout, and Purchase events to Meta, TikTok, Snapchat, and Google Analytics.

### ⚙️ Development & Catalog Configuration
- Modify the database directly in [assets/js/main.js](file:///c:/Users/CorteC/Downloads/سوقك%20اونلاين/assets/js/main.js) inside the `productsData` array.
- Update social links, store phone number, and metadata in `index.html`.
