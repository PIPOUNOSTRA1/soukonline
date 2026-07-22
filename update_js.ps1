# PowerShell script to update main.js content safely without BOM and escaping issues

$jsPath = ".\assets\js\main.js"
$content = Get-Content -Raw -Path $jsPath -Encoding utf8

# 1. Replace translations
$translationsPattern = '(?s)const translations = \{.*?\n\};'
$newTranslations = @"
const translations = {
  ar: {
    nav_collection: "المجموعة",
    nav_caftan: "العناية بالبشرة",
    nav_karakou: "المكياج",
    nav_wedding: "العطور",
    nav_reviews: "آراء العميلات",
    eyebrow_sub: "دار مستحضرات التجميل والعناية الفاخرة — جمال طبيعي بلمسة جزائرية",
    hero_title: "جمالكِ <em>يستحق</em><br>العناية الفاخرة",
    hero_sub: "سيروم الذهب · كريمات النضارة · عطور فاخرة — قِطع جمالية مصنوعة بحب ومواد طبيعية",
    hero_cta: "اكتشفي المجموعة ↙",
    scroll_hint: "مرّري للأسفل",
    runway_eyebrow: "سحر التجربة",
    runway_title: "نعتني بجمالكِ <em>بأرقى مستحضرات العناية الطبيعية</em>",
    runway_label_1: "مستخلصات طبيعية 100% لبشرة نضرة",
    runway_label_2: "عناية متكاملة لجميع أنواع البشرة",
    runway_label_3: "زيوت نقية ومستخلصات عشبية",
    runway_label_4: "تأثير لترطيب ونعومة فورية",
    runway_label_5: "إطلالة مشرقة تبرز جمالكِ اليومي",
    chapter_1_num: "١",
    chapter_1_title: "مستحضرات <em>طبيعية</em> بلمسة احترافية",
    chapter_1_desc: "كل مستحضر في لمسة بيوتي يُصنع بتركيبات طبيعية آمنة وفعالة، بأيدي خبراء في العناية بالبشرة ومستحضرات التجميل، ليكون الخيار الأمثل لجمالكِ اليومي بلمسة جزائرية فاخرة.",
    stat_experience: "سنوات خبرة",
    stat_clients: "عميلة سعيدة",
    stat_handmade: "منتجات طبيعية",
    chapter_2_title: "مجموعة <em>العناية</em> الجديدة",
    chapter_2_desc: "أحدث تركيبات العناية بالبشرة والمكياج المستخلصة من مكونات طبيعية 100%.",
    chapter_3_title: "روتين <em>العناية بالبشرة</em>",
    chapter_3_desc: "كريمات ليلية وسيروم نضارة لتغذية البشرة وتجديد خلاياها بعمق.",
    chapter_4_title: "مستحضرات <em>المكياج والتجميل</em>",
    chapter_4_desc: "أحمر شفاه مخملي، ظلال عيون، وعلب مكياج متكاملة لإطلالة ساحرة.",
    chapter_5_title: "العطور <em>الفاخرة</em>",
    chapter_5_desc: "عطور راقية تدوم طويلاً بتركيبة مركزة ونغمات ساحرة تليق بحضورك.",
    chapter_6_title: "الأكثر <em>طلباً</em>",
    chapter_6_desc: "مستحضرات التجميل والعناية الأكثر شعبية بين عميلاتنا هذا الموسم.",
    chapter_7_title: "رحلة <em>الصنع والجودة</em>",
    chapter_7_step1_title: "01 — اختيار المكونات",
    chapter_7_step1_desc: "نختار أجود الزيوت الأساسية والمستخلصات الطبيعية العضوية من مصادر موثوقة لضمان أمان وفعالية المنتج.",
    chapter_7_step2_title: "02 — التركيبة والاختبار",
    chapter_7_step2_desc: "يتم تركيب المستحضرات واختبارها مخبرياً لضمان ملاءمتها لمختلف أنواع البشرة وخلوها من المواد الضارة.",
    chapter_7_step3_title: "03 — الصنع والتعبئة",
    chapter_7_step3_desc: "يتم تحضير المنتجات في ظروف معقمة تماماً وتعبئتها في عبوات تحافظ على جودة وفعالية التركيبة.",
    chapter_7_step4_title: "04 — التصميم والتغليف",
    chapter_7_step4_desc: "نصمم عبوات أنيقة وتغليفاً فاخراً يحمي المنتج ويعكس رقي العلامة كهدية مميزة لكِ.",
    chapter_7_step5_title: "05 — الشحن والتوصيل",
    chapter_7_step5_desc: "يتم شحن طلبيتكِ مغلفة بعناية تامة لتصلكِ في أفضل حالة أينما كنتِ في الجزائر.",
    chapter_8_title: "قالت <em>عميلاتنا</em>",
    final_cta_eyebrow: "جمالكِ يستحق رعاية استثنائية",
    final_cta_title: "تسوّقي مجموعتكِ <em>الفاخرة</em> اليوم",
    final_cta_desc: "توصيل لجميع الولايات · الدفع عند الاستلام · إرجاع سهل وسريع",
    final_cta_btn: "تسوّقي الآن",
    footer_desc: "دار مستحضرات التجميل والعناية الفاخرة بالبشرة، نقدم منتجات طبيعية 100% بتركيبات آمنة وفعالة صنعت بحب.",
    footer_store: "المتجر",
    footer_care: "خدمة العملاء",
    footer_guide: "طريقة الاستخدام",
    footer_shipping: "الشحن والتوصيل",
    footer_returns: "سياسة الإرجاع والاستبدال",
    footer_contact: "تواصلي معنا",
    footer_follow: "تابعينا",
    footer_rights: "© 2026 LAMSA BEAUTY — جميع الحقوق محفوظة",
    quick_view: "عرض سريع",
    add_to_cart: "أضيفي للسلة",
    cart_title: "سلة المشتريات",
    cart_empty: "سلتكِ فارغة حالياً. تصفحي المنتجات وأضيفي ما يعجبكِ.",
    checkout_title: "إتمام الطلب (الدفع عند الاستلام)",
    client_name: "الاسم الكامل *",
    client_phone: "رقم الهاتف *",
    client_wilaya: "الولاية *",
    client_commune: "البلدية *",
    client_address: "العنوان الكامل *",
    desk_delivery: "توصيل للمكتب (Stop Desk) - تكلفة شحن أقل",
    subtotal: "المجموع الفرعي:",
    shipping: "تكلفة الشحن:",
    total: "المجموع الإجمالي:",
    confirm_order: "تأكيد طلبكِ الآن ↙",
    wishlist_title: "المفضلة",
    wishlist_empty: "قائمة المفضلة فارغة حالياً.",
    size_label: "النوع:",
    custom_size_btn: "طلب عبوة مخصصة 📏",
    custom_fitting_title: "الرغبات الخاصة أو نوع البشرة (اختياري):",
    lbl_chest: "نوع البشرة",
    lbl_waist: "المشاكل المستهدفة",
    lbl_hips: "العمر التقديري",
    lbl_shoulders: "ملاحظات إضافية",
    lbl_height: "حجم العبوة المطلوبة",
    custom_fitting_note: "* سيتم تركيب المستحضر وتخصيصه ليتناسب مع احتياجاتكِ وبشرتكِ بشكل فريد.",
    txt_custom_fitting_note: "* سيتم تركيب المستحضر وتخصيصه ليتناسب مع احتياجاتكِ وبشرتكِ بشكل فريد.",
    search_placeholder: "ابحثي عن كريم، سيروم، عطر...",
    toast_added_cart: "تم إضافة المنتج إلى السلة بنجاح.",
    toast_added_wishlist: "تم إضافة المنتج إلى المفضلة.",
    toast_removed_wishlist: "تم إزالة المنتج من المفضلة.",
    toast_view_cart: "عرض السلة",
    toast_order_success: "تم تسجيل طلبكِ بنجاح! سنتصل بكِ لتأكيد الشحن قريباً.",
    success_title: "شكراً لطلبكِ الأنيق!",
    success_desc: "تم استلام طلبكِ بنجاح تحت الرقم: ",
    success_note: "سيتصل بكِ فريق مبيعات لمسة بيوتي خلال 24 ساعة لتأكيد معلومات الشحن وبدء التحضير.",
    success_close: "متابعة التسوق",
    invoice_title: "فاتورة الطلب التقديرية",
    invoice_client: "العميلة:",
    invoice_phone: "الهاتف:",
    invoice_wilaya: "الولاية:",
    invoice_address: "العنوان:",
    invoice_delivery: "طريقة التوصيل:",
    invoice_home: "توصيل للمنزل",
    invoice_desk: "توصيل للمكتب (Stop Desk)",
    validation_wilaya: "يرجى اختيار الولاية أولاً لتحديد تكلفة التوصيل.",
    validation_measurements: "يرجى كتابة رغباتك وتفاصيل بشرتك لتفصيل التركيبة المخصصة.",
    validation_phone: "يرجى إدخال رقم هاتف صحيح في الجزائر (مثل: 05/06/07).",
    custom_size_badge: "تركيبة خاصة",
    add_cart_wishlist: "أضيفي للسلة",
    quick_view_wishlist: "عرض سريع"
  },
  fr: {
    nav_collection: "Collection",
    nav_caftan: "Soin Peau",
    nav_karakou: "Maquillage",
    nav_wedding: "Parfums",
    nav_reviews: "Avis",
    eyebrow_sub: "Maison de soins et cosmétiques de luxe — Beauté naturelle, touche algérienne",
    hero_title: "Votre beauté <em>mérite</em><br>les soins les plus fins",
    hero_sub: "Sérum d’or · Crèmes éclat · Parfums exclusifs — Soins préparés avec amour et ingrédients naturels",
    hero_cta: "Découvrir la Collection ↙",
    scroll_hint: "Défiler vers le bas",
    runway_eyebrow: "Le secret de l’éclat",
    runway_title: "Sublimer votre beauté <em>avec nos soins 100% naturels</em>",
    runway_label_1: "Extraits botaniques purs pour une peau rayonnante",
    runway_label_2: "Routine complète pour un éclat éternel",
    runway_label_3: "Huiles bio pures sans additifs chimiques",
    runway_label_4: "Effet lissant immédiat et toucher velouté",
    runway_label_5: "Beauté naturelle révélant votre présence unique",
    chapter_1_num: "I",
    chapter_1_title: "Cosmétiques <em>naturels</em> et professionnels",
    chapter_1_desc: "Chaque formule chez Lamsa Beauty est élaborée avec des ingrédients botaniques sains et efficaces, par des experts de la peau, pour être l’alliée idéale de votre beauté au quotidien avec une signature de luxe algérienne.",
    stat_experience: "ans d’expertise",
    stat_clients: "clientes heureuses",
    stat_handmade: "produits naturels",
    chapter_2_title: "Nouvelle Collection <em>Éclat</em>",
    chapter_2_desc: "Les dernières innovations de soins et maquillage conçues avec des extraits 100% bio.",
    chapter_3_title: "Routine <em>Soin & Peau</em>",
    chapter_3_desc: "Crèmes de nuit régénérantes et sérums revitalisants pour une hydratation intense.",
    chapter_4_title: "Gamme <em>Maquillage & Beauté</em>",
    chapter_4_desc: "Rouges à lèvres veloutés, palettes et coffrets complets pour un look radieux.",
    chapter_5_title: "Les Parfums <em>Exclusifs</em>",
    chapter_5_desc: "Des fragrances de prestige concentrées avec des notes ensorcelantes longue durée.",
    chapter_6_title: "Les Plus <em>Demandés</em>",
    chapter_6_desc: "Nos produits de soins et maquillage phares plébiscités par nos clientes ce mois-ci.",
    chapter_7_title: "Voyage de <em>Confection</em>",
    chapter_7_step1_title: "01 — Ingrédients Bio",
    chapter_7_step1_desc: "Sélection d’huiles essentielles et extraits botaniques organiques certifiés pour votre sécurité.",
    chapter_7_step2_title: "02 — Formulation & Tests",
    chapter_7_step2_desc: "Développement en laboratoire et tests d’efficacité pour convenir à tous les types de peaux.",
    chapter_7_step3_title: "03 — Fabrication Stérile",
    chapter_7_step3_desc: "Préparation et mise en flacon dans des conditions d’hygiène rigoureuses pour préserver les actifs.",
    chapter_7_step4_title: "04 — Packaging de Luxe",
    chapter_7_step4_desc: "Flacons raffinés et coffrets soignés pour un rangement élégant ou un cadeau parfait.",
    chapter_7_step5_title: "05 — Expédition Rapide",
    chapter_7_step5_desc: "Livraison de votre commande emballée avec précaution partout en Algérie.",
    chapter_8_title: "Ce qu’elles <em>en pensent</em>",
    final_cta_eyebrow: "Votre beauté mérite l’excellence absolue",
    final_cta_title: "Achetez votre coffret <em>de luxe</em> aujourd’hui",
    final_cta_desc: "Livraison 58 wilayas · Paiement cash à la livraison · Retours faciles",
    final_cta_btn: "Commander maintenant",
    footer_desc: "Maison de cosmétiques et soins de luxe, offrant des produits naturels aux formules sûres et performantes.",
    footer_store: "Boutique",
    footer_care: "Service Client",
    footer_guide: "Conseils d’utilisation",
    footer_shipping: "Livraison",
    footer_returns: "Retours & Échanges",
    footer_contact: "Contactez-nous",
    footer_follow: "Suivez-nous",
    footer_rights: "© 2026 LAMSA BEAUTY — Tous droits réservés",
    quick_view: "Aperçu rapide",
    add_to_cart: "Ajouter au Panier",
    cart_title: "Votre Panier",
    cart_empty: "Votre panier est vide. Découvrez nos produits et ajoutez vos coups de cœur.",
    checkout_title: "Finaliser la commande (COD)",
    client_name: "Nom complet *",
    client_phone: "Téléphone *",
    client_wilaya: "Wilaya *",
    client_commune: "Commune *",
    client_address: "Adresse complète *",
    desk_delivery: "Livraison au bureau (Stop Desk) - Tarif réduit",
    subtotal: "Sous-total :",
    shipping: "Frais d’envoi :",
    total: "Total :",
    confirm_order: "Confirmer ma commande ↙",
    wishlist_title: "Favoris",
    wishlist_empty: "Votre liste de favoris est vide.",
    size_label: "Taille :",
    custom_size_btn: "Sur Mesure 📏",
    custom_fitting_title: "Spécifications de peau (Optionnel) :",
    lbl_chest: "Type de peau",
    lbl_waist: "Problèmes ciblés",
    lbl_hips: "Âge approximatif",
    lbl_shoulders: "Notes spéciales",
    lbl_height: "Taille du flacon",
    custom_fitting_note: "* La formule sera enrichie et adaptée spécialement aux besoins de votre épiderme.",
    txt_custom_fitting_note: "* La formule sera enrichie et adaptée spécialement aux besoins de votre épiderme.",
    search_placeholder: "Rechercher crème, sérum, parfum...",
    toast_added_cart: "Produit ajouté au panier.",
    toast_added_wishlist: "Produit ajouté aux favoris.",
    toast_removed_wishlist: "Produit retiré des favoris.",
    toast_view_cart: "Voir Panier",
    toast_order_success: "Votre commande a été enregistrée ! Nous vous appellerons bientôt.",
    success_title: "Merci pour votre commande !",
    success_desc: "Commande reçue sous le numéro : ",
    success_note: "Notre équipe vous appellera sous 24h pour confirmer l’expédition et l’adresse.",
    success_close: "Continuer mes achats",
    invoice_title: "Facture Proforma",
    invoice_client: "Cliente :",
    invoice_phone: "Téléphone :",
    invoice_wilaya: "Wilaya :",
    invoice_address: "Adresse :",
    invoice_delivery: "Livraison :",
    invoice_home: "Livraison à domicile",
    invoice_desk: "Point Relais (Stop Desk)",
    validation_wilaya: "Veuillez choisir une wilaya pour le calcul des frais d’envoi.",
    validation_measurements: "Veuillez spécifier vos besoins pour la formule sur-mesure.",
    validation_phone: "Veuillez entrer un numéro de téléphone valide en Algérie.",
    custom_size_badge: "Formule personnalisée",
    add_cart_wishlist: "Ajouter au panier",
    quick_view_wishlist: "Détails"
  }
};
"@

$content = [regex]::Replace($content, $translationsPattern, $newTranslations)


# 2. Replace productsData
$productsPattern = '(?s)let productsData = \[.*?\];'
$newProducts = @"
let productsData = [
  {
    id: 'cream-premium',
    name: 'كريم النضارة الليلي الفاخر',
    name_fr: 'Crème de Nuit Éclat Premium',
    price: 4200,
    oldPrice: 5500,
    tag: 'جديد',
    tag_fr: 'Nouveau',
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=600&auto=format&fit=crop'
    ],
    grids: ['grid-new', 'grid-caftan', 'grid-best'],
    desc: 'كريم ليلي غني ومغذي بمستخلصات زهرة الأوركيد البرية وزبدة الشيا العضوية، يعمل على ترطيب البشرة بعمق وتجديد خلاياها طوال الليل لتستيقظي ببشرة مشرقة، مشدودة وناعمة كالحرير.',
    desc_fr: 'Soin de nuit régénérant enrichi en extraits d’orchidée sauvage et beurre de karité bio. Hydrate intensément, lisse les ridules et unifie le teint durant votre sommeil.'
  },
  {
    id: 'serum-gold',
    name: 'سيروم الذهب للعناية المركزة',
    name_fr: 'Sérum d’Or Anti-Âge',
    price: 5800,
    oldPrice: 7200,
    tag: 'الأكثر رواجاً',
    tag_fr: 'Populaire',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600&auto=format&fit=crop'
    ],
    grids: ['grid-new', 'grid-caftan', 'grid-best'],
    desc: 'سيروم مضاد للأكسدة بتركيبة غنية بجزيئات الذهب عيار 24 وحمض الهيالورونيك، يساعد في تحفيز الكولاجين الطبيعي للبشرة وشد الجلد والتقليل من علامات الشيخوخة والترهل بشكل فوري.',
    desc_fr: 'Élixir anti-âge concentré aux micro-particules d’or 24 carats et acide hyaluronique. Booste la production de collagène, raffermit l’épiderme et redonne un éclat instantané.'
  },
  {
    id: 'lipstick-matte',
    name: 'أحمر شفاه "لمسة مخملية"',
    name_fr: 'Rouge à Lèvres Velouté',
    price: 2400,
    oldPrice: null,
    tag: 'جديد',
    tag_fr: 'Nouveau',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop'
    ],
    grids: ['grid-new', 'grid-karakou', 'grid-best'],
    desc: 'أحمر شفاه كريمي مطفأ (Matte) يمنح شفتيكِ تغطية كاملة ولوناً غنياً ثابتاً يدوم لـ 12 ساعة، مع تركيبة غنية بفيتامين E لمنع جفاف أو تشقق الشفاه.',
    desc_fr: 'Rouge à lèvres liquide fini mat velours longue tenue 12h. Formule hautement pigmentée et enrichie en vitamine E pour des lèvres hydratées et sublimées.'
  },
  {
    id: 'perfume-asala',
    name: 'عطر الأصالة الملكي',
    name_fr: 'Parfum L’Original Royal',
    price: 7500,
    oldPrice: null,
    tag: 'حصري',
    tag_fr: 'Exclusif',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop'
    ],
    grids: ['grid-new', 'grid-wedding', 'grid-best'],
    desc: 'تركيبة عطرية ساحرة تمزج بين نفحات العود الفاخر، خشب الصندل الدافئ والياسمين البري. عطر شرقي غني ومميز يعكس حضورك القوي والراقي في كل مكان.',
    desc_fr: 'Fragrance mystique mêlant des notes de oud précieux, de bois de santal chaleureux et de jasmin sauvage. Un sillage puissant et raffiné pour vos grandes occasions.'
  },
  {
    id: 'oil-argan',
    name: 'زيت الأرغان الطبيعي النقي',
    name_fr: 'Huile d’Argan Pure Bio',
    price: 3200,
    oldPrice: 4000,
    tag: 'طبيعي',
    tag_fr: 'Bio',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&auto=format&fit=crop'
    ],
    grids: ['grid-caftan'],
    desc: 'زيت أرغان نوي 100% معصور على البارد، مغذٍّ غني بالأحماض الدهنية وفيتامين E، رائع لترطيب البشرة وتنعيم الشعر الجاف والتالف وإعطائه لمعاناً طبيعياً.',
    desc_fr: 'Huile d’argan pure 100% extraite à froid. Riche en acides gras essentiels et vitamine E, elle nourrit intensément les cheveux et hydrate le corps.'
  },
  {
    id: 'makeup-set',
    name: 'مجموعة المكياج "بيوتي بوكس"',
    name_fr: 'Beauty Box Coffret',
    price: 9500,
    oldPrice: 12000,
    tag: 'عرض خاص',
    tag_fr: 'Offre',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=600&auto=format&fit=crop'
    ],
    grids: ['grid-karakou'],
    desc: 'حقيبة متكاملة تضم مستحضرات التجميل الأساسية: كريم أساس مرطب، ظلال عيون بألوان ترابية ناعمة، مسكرة تطويل الرموش، وأحمر شفاه مخملي مميز.',
    desc_fr: 'Coffret complet réunissant nos essentiels maquillage : fond de teint éclat, palette nude, mascara volume intense et rouge à lèvres mat.'
  },
  {
    id: 'rose-water',
    name: 'ماء الورد المقطر العضوي',
    name_fr: 'Eau de Rose Distillée',
    price: 1800,
    oldPrice: null,
    tag: 'طبيعي',
    tag_fr: 'Naturel',
    image: 'https://images.unsplash.com/photo-1614859324967-bdf461fcf7f4?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1614859324967-bdf461fcf7f4?q=80&w=600&auto=format&fit=crop'
    ],
    grids: ['grid-caftan'],
    desc: 'تونر طبيعي مهدئ للبشرة مقطر من أوراق الورد الجوري الطازجة، يساعد في قبض المسام وتلطيف التهيج وتنشيط الدورة الدموية للوجه بضغطة واحدة.',
    desc_fr: 'Tonique apaisant naturel distillé à partir de pétales de roses fraîches. Resserre les pores, rafraîchit le teint et calme les irritations.'
  },
  {
    id: 'scrub-coffee',
    name: 'مقشر القهوة الطبيعي المنعم',
    name_fr: 'Gommage au Café Doux',
    price: 2200,
    oldPrice: 2800,
    tag: null,
    tag_fr: null,
    image: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=600&auto=format&fit=crop'
    ],
    grids: ['grid-caftan'],
    desc: 'مقشر للوجه والجسم مصنوع من حبيبات القهوة العضوية المطحونة وزيت جوز الهند، يزيل الخلايا الميتة بلطف وينشط الدورة الدموية ليترك بشرتك ناعمة ورطبة.',
    desc_fr: 'Gommage exfoliant corporel et visage aux grains de café robusta et huile de coco. Élimine les cellules mortes et atténue la cellulite.'
  }
];
"@

$content = [regex]::Replace($content, $productsPattern, $newProducts)


# 3. Replace reviews
$reviewsPattern = '(?s)const reviews = \{.*?\n\};'
$newReviews = @"
const reviews = {
  ar: [
    ['سيروم الذهب غير بشرتي تماماً! أصبحت نضرة ومشدودة والخطوط خفت بشكل ملحوظ.', 'سارة، الجزائر العاصمة'],
    ['كريم الليل الفاخر مرطب رهيب وريحته تاخذ العقل، التعبئة فخمة جداً.', 'ليلى، وهران'],
    ['أحمر الشفاه ثابت طول اليوم وما يجفف الشفايف أبداً، أنصح به بشدة.', 'آمال، قسنطينة'],
    ['العطور عندهم ثباتها رائع وتوصيل سريع في يومين فقط.', 'نور الهدى، عنابة'],
  ],
  fr: [
    ['Le sérum d’or a transformé ma peau ! Elle est plus ferme et lumineuse.', 'Sarah, Alger'],
    ['La crème de nuit est incroyablement hydratante, parfum très subtil.', 'Lila, Oran'],
    ['Le rouge à lèvres mat tient toute la journée sans dessécher, j’adore.', 'Amel, Constantine'],
    ['Leurs parfums ont une tenue exceptionnelle, livraison rapide.', 'Nour El Houda, Annaba'],
  ]
};
"@

$content = [regex]::Replace($content, $reviewsPattern, $newReviews)


# 4. Replace productReviews
$prodRevPattern = '(?s)const productReviews = \{.*?\n\};'
$newProdRevs = @"
const productReviews = {
  'cream-premium': [
    { text: 'كريم الليل هذا رائع جداً، يرطب البشرة بعمق ويتركها ناعمة كالحرير في الصباح.', who: 'سارة م.', wilaya: 'الجزائر العاصمة', rating: 5 },
    { text: 'أفضل كريم ليلي جربته على الإطلاق. ريحته خفيفة ويهدئ البشرة المتهيجة.', who: 'نور هـ.', wilaya: 'وهران', rating: 5 }
  ],
  'serum-gold': [
    { text: 'سيروم الذهب ممتاز لشد التجاعيد وإعطاء نضارة فورية للبشرة قبل المكياج.', who: 'ليلى س.', wilaya: 'عنابة', rating: 5 },
    { text: 'بشرتي أصبحت مشدودة وأكثر إشراقاً بعد أسبوعين فقط من الاستخدام اليومي.', who: 'منال ك.', wilaya: 'سطيف', rating: 5 }
  ],
  'lipstick-matte': [
    { text: 'اللون ثابت جداً ومطفأ بشكل أنيق دون أن يتشقق على الشفاه.', who: 'رانيا ف.', wilaya: 'الجزائر العاصمة', rating: 5 },
    { text: 'أحمر شفاه رائع ومريح للارتداء اليومي، أنصح بكل الألوان.', who: 'سلمى ي.', wilaya: 'تلمسان', rating: 5 }
  ],
  'perfume-asala': [
    { text: 'رائحة العود الفاخر والياسمين مميزة وتدوم طويلاً، عطر يستحق الاقتناء.', who: 'فاطمة ز.', wilaya: 'تلمسان', rating: 5 },
    { text: 'عطر ملكي بكل المقاييس، الثبات والفوحان رائعين جداً.', who: 'حنان م.', wilaya: 'وهران', rating: 5 }
  ]
};
"@

$content = [regex]::Replace($content, $prodRevPattern, $newProdRevs)


# 5. Replace defaultReviews
$defRevPattern = '(?s)const defaultReviews = \[.*?\];'
$newDefRevs = @"
const defaultReviews = [
  { text: 'مستحضرات ذات جودة عالية وتركيبات طبيعية آمنة للبشرة. التوصيل سريع والتغليف فخم جداً.', who: 'فاطمة ر.', wilaya: 'الجزائر العاصمة', rating: 5 },
  { text: 'المنتجات أصلية والتوصيل سريع جداً. التغليف يفتح النفس كهدية.', who: 'نادية ل.', wilaya: 'قسنطينة', rating: 5 },
  { text: 'الدفع عند الاستلام مريح جداً والمنتج رائع كما في الوصف تماماً.', who: 'مريم ح.', wilaya: 'وهران', rating: 5 }
];
"@

$content = [regex]::Replace($content, $defRevPattern, $newDefRevs)


# 6. Replace categoryMap
$catMapPattern = '(?s)const categoryMap = \{.*?\n\};'
$newCatMap = @"
const categoryMap = {
  'cream-premium': 'العناية بالبشرة',
  'serum-gold': 'العناية بالبشرة',
  'oil-argan': 'العناية بالبشرة',
  'rose-water': 'العناية بالبشرة',
  'scrub-coffee': 'العناية بالبشرة',
  'lipstick-matte': 'المكياج ومستحضرات التجميل',
  'makeup-set': 'المكياج ومستحضرات التجميل',
  'perfume-asala': 'العطور الفاخرة'
};
"@

$content = [regex]::Replace($content, $catMapPattern, $newCatMap)


# 7. Replace categoryFeatures
$catFeatPattern = '(?s)const categoryFeatures = \{.*?\n\};'
$newCatFeats = @"
const categoryFeatures = {
  'العناية بالبشرة': ['تركيبات طبيعية وعضوية 100%','خالٍ من البارابين والمواد الكيميائية الضارة','مختبر سريرياً ومناسب للبشرة الحساسة','تأثير مغذٍّ ومرطب طويل الأمد'],
  'المكياج ومستحضرات التجميل': ['تغطية كاملة ومظهر مخملي مطفأ','مكونات مرطبة تمنع جفاف الشفاه والجلد','ثبات يدوم طويلاً لـ 12 ساعة متواصلة','ألوان غنية وراقية تناسب كل الإطلالات'],
  'العطور الفاخرة': ['مزيج ساحر من النغمات الشرقية والفرنسية','تركيز عالي وثبات يدوم لأكثر من 24 ساعة','زجاجة فاخرة وتصميم ملكي أنيق','مثالي للإهداء والمناسبات الخاصة']
};
"@

$content = [regex]::Replace($content, $catFeatPattern, $newCatFeats)


# 8. Replace stepLabels
$stepPattern = '(?s)const stepLabels = \[.*?\];'
$newStepLabels = @"
const stepLabels = [
    '✦ تركيبات مستوحاة من الطبيعة الجزائرية الخلابة',
    '✦ زيوت عضوية نقية معصورة على البارد',
    '✦ أقصى درجات الترطيب والعناية العميقة',
    '✦ تصنيع آمن ومختبر سريرياً لبشرتكِ',
    '✦ لمسة بيوتي تبرز إشراقة جمالكِ الطبيعي'
  ];
"@

$content = [regex]::Replace($content, $stepPattern, $newStepLabels)


# 9. Generic String Replacements
$content = $content.Replace("ZAPHERA COFTAN", "LAMSA BEAUTY")
$content = $content.Replace("zephira_caftan_05", "lamsa_beauty_dz")
$content = $content.Replace("ZF-", "LB-")

# Write out file in UTF-8 without BOM using .NET System.IO.File to prevent PowerShell encoding bugs
$utf8NoBOM = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($jsPath, $content, $utf8NoBOM)
Write-Output "JavaScript file main.js updated successfully with Lamsa Beauty data (UTF-8 without BOM)."
