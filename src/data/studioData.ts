export type LanguageCode = 'en' | 'ur' | 'ar' | 'es';
export type CurrencyCode = 'PKR' | 'USD' | 'GBP' | 'EUR';
export type PackageId = 'express' | 'correction' | 'ceramic';
export type VehicleSize = 'sedan' | 'suv' | 'exotic';

export const STUDIO_IMAGES = {
  heroBay: '/src/assets/images/hero_detailing_bay_1795083039066.jpg',
  beforeSwirls: '/src/assets/images/paint_before_swirls_1795083037822.jpg',
  afterCeramic: '/src/assets/images/paint_after_ceramic_1795083036803.jpg',
  ceramicCraft: '/src/assets/images/studio_ceramic_craft_1795083037059.jpg',
  interiorDetail: '/src/assets/images/luxury_interior_detail_1795083037292.jpg',
  hydrophobicBeads: '/src/assets/images/hydrophobic_beading_finish_1795083037757.jpg',
} as const;

export const STUDIO_DEFAULTS = {
  name: 'Detailing Crew Islamabad',
  shortName: 'Detailing Crew',
  address: '52 Main Nazim-ud-din Road, F-8/4, Islamabad, Pakistan',
  city: 'Islamabad',
  country: 'Pakistan',
  phoneDisplay: '+92 345 9430222',
  phoneHref: '+923459430222',
  whatsappDigits: '923459430222',
  mapsShortUrl: 'https://maps.app.goo.gl/5vMB9f8SHSBNWV7t6',
  coordinates: {
    lat: 33.6822173,
    lng: 72.9993209,
  },
  socials: {
    instagram: 'https://www.instagram.com/explore/tags/detailingcrewislamabad/',
    facebook: 'https://www.facebook.com/search/top/?q=Detailing%20Crew%20Islamabad',
    tiktok: 'https://www.tiktok.com/search?q=Detailing%20Crew%20Islamabad',
    youtube: 'https://www.youtube.com/results?search_query=Detailing+Crew+Islamabad',
  },
} as const;

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rateFromPkr: number;
  decimals: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  PKR: {code: 'PKR', symbol: '₨', label: 'PKR ₨', rateFromPkr: 1, decimals: 0},
  USD: {code: 'USD', symbol: '$', label: 'USD $', rateFromPkr: 1 / 278, decimals: 0},
  GBP: {code: 'GBP', symbol: '£', label: 'GBP £', rateFromPkr: 1 / 355, decimals: 0},
  EUR: {code: 'EUR', symbol: '€', label: 'EUR €', rateFromPkr: 1 / 302, decimals: 0},
};

export const VEHICLE_MULTIPLIERS: Record<VehicleSize, {factor: number; label: Record<LanguageCode, string>}> = {
  sedan: {
    factor: 1,
    label: {
      en: 'Sedan / Coupe',
      ur: 'سیڈان / کوپ',
      ar: 'سيدان / كوبيه',
      es: 'Sedán / Coupé',
    },
  },
  suv: {
    factor: 1.25,
    label: {
      en: 'SUV / 4x4',
      ur: 'ایس یو وی / 4x4',
      ar: 'دفع رباعي / SUV',
      es: 'SUV / 4x4',
    },
  },
  exotic: {
    factor: 1.45,
    label: {
      en: 'Exotic / Full-Size',
      ur: 'لگژری / فل سائز',
      ar: 'فاخرة / حجم كامل',
      es: 'Exótico / Gran Tamaño',
    },
  },
};

export function formatConvertedPrice(basePkr: number, currency: CurrencyCode, vehicleSize: VehicleSize = 'sedan'): string {
  const cfg = CURRENCIES[currency];
  const raw = basePkr * VEHICLE_MULTIPLIERS[vehicleSize].factor * cfg.rateFromPkr;
  const rounded = currency === 'PKR' ? Math.round(raw / 500) * 500 : Math.round(raw);
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: cfg.decimals,
  }).format(rounded);
  return `${cfg.symbol}${formatted}`;
}

export interface ServicePackage {
  id: PackageId;
  index: string;
  basePricePkr: number;
  duration: Record<LanguageCode, string>;
  featured?: boolean;
  name: Record<LanguageCode, string>;
  subtitle: Record<LanguageCode, string>;
  features: Record<LanguageCode, string[]>;
}

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'express',
    index: '01',
    basePricePkr: 6500,
    duration: {
      en: '90 – 120 mins',
      ur: '90 – 120 منٹ',
      ar: '90 – 120 دقيقة',
      es: '90 – 120 min',
    },
    name: {
      en: 'Express Exterior Wash & Interior Vacuum',
      ur: 'ایکسپریس ایکسٹیریئر واش اور انٹیریئر ویکیوم',
      ar: 'غسيل خارجي سريع وتنظيف داخلي بالشفط',
      es: 'Lavado Exterior Express y Aspirado Interior',
    },
    subtitle: {
      en: 'Safe pH-neutral maintenance wash engineered to preserve swirl-free paintwork and ceramic coatings.',
      ur: 'محفوظ پی ایچ نیوٹرل واش جو گاڑی کے پینٹ اور سیرامک کوٹنگ کی چمک برقرار رکھے۔',
      ar: 'غسيل صيانة متعادل الحموضة مصمم لحماية الطلاء الخالي من الخدوش وطبقات السيراميك.',
      es: 'Lavado de mantenimiento con pH neutro diseñado para conservar la pintura sin marcas y recubrimientos cerámicos.',
    },
    features: {
      en: [
        'pH-neutral snow foam pre-soak & touchless grime lift',
        'Two-bucket grit-guard hand wash with merino wool mitts',
        'Deep alloy wheel face, barrel & brake caliper decontamination',
        'Filtered warm air blow-dry & plush edgeless microfiber finish',
        'Complete cabin vacuuming, crevice dusting & carpet refresh',
        'Non-greasy UV satin dressing for dashboard, trim & tires',
        'Streak-free interior & exterior optical glass polish',
      ],
      ur: [
        'پی ایچ نیوٹرل سنو فوم پری واش اور محفوظ صفائی',
        'ٹو-بکٹ گرٹ گارڈ ہینڈ واش نرم مائیکرو فائبر مٹ کے ساتھ',
        'الائے رمز، وہیل بیرل اور بریک کیلیپرز کی گہری صفائی',
        'فلٹرڈ ایئر ڈرائی اور نرم مائیکرو فائبر فنشنگ',
        'مکمل کیبن ویکیوم، ڈسٹنگ اور کارپٹ کلیننگ',
        'ڈیش بورڈ اور ٹرم کے لیے نان گریسی یو وی سیٹن کنڈیشننگ',
        'شیشوں کی اندرونی اور بیرونی کرسٹل کلیئر صفائی',
      ],
      ar: [
        'غسيل أولي برغوة ثلجية متعادلة الحموضة لإزالة الأوساخ بأمان',
        'غسيل يدوي بنظام الدلوين وقفازات الصوف الناعمة',
        'تنظيف عميق للجنوط ومكابح العجلات وإزالة الرواسب',
        'تجفيف بالهواء المفلتر ومناشف مايكروفايبر فائقة النعومة',
        'تنظيف شامل للمقصورة بالشفط وإزالة الغبار من الزوايا',
        'حماية غير دهنية للتابلوه والديكورات من الأشعة فوق البنفسجية',
        'تلميع زجاج داخلي وخارجي خالٍ من الخطوط',
      ],
      es: [
        'Pre-lavado con espuma activa pH neutro sin contacto agresivo',
        'Lavado manual método dos cubos con guantes de lana merino',
        'Descontaminación profunda de llantas, gargantas y pinzas',
        'Secado con aire filtrado y toallas de microfibra sin bordes',
        'Aspirado integral de cabina, rendijas y alfombrillas',
        'Acondicionado satinado sin grasa con protección UV',
        'Limpieza óptica sin rastros de cristales interiores y exteriores',
      ],
    },
  },
  {
    id: 'correction',
    index: '02',
    basePricePkr: 28000,
    duration: {
      en: '1 – 2 Days',
      ur: '1 – 2 دن',
      ar: '1 – 2 يوم',
      es: '1 – 2 Días',
    },
    name: {
      en: 'Multi-Stage Paint Correction & Gloss Enhancement',
      ur: 'ملٹی اسٹیج پینٹ کریکشن اور گلاس انہانسمنٹ',
      ar: 'تصحيح الطلاء متعدد المراحل وتعزيز اللمعان',
      es: 'Corrección de Pintura Multietapa y Realce de Brillo',
    },
    subtitle: {
      en: 'Machine-calibrated clear coat leveling that eliminates wash swirls, oxidation, and holograms for wet-mirror depth.',
      ur: 'مشین کے ذریعے کلیئر کوٹ کی بحالی جو سوئرل مارکس، آکسیڈیشن اور ہولوگرامز کو ختم کر کے شیشے جیسی چمک دے۔',
      ar: 'تصحيح دقيق لطبقة الطلاء الشفافة لإزالة الدوائر والأكسدة واستعادة عمق اللون كالمرآة.',
      es: 'Nivelado mecánico del barniz para eliminar swirls, oxidación y hologramas logrando profundidad de espejo.',
    },
    features: {
      en: [
        'Full chemical iron fallout removal & fine-grade clay bar treatment',
        'Ultrasonic digital paint depth mapping across every body panel',
        '2-stage rotary & dual-action swirl, scratch & oxidation leveling',
        'High-clarity jeweling refinement polish under Scangrip inspection LEDs',
        'Isopropyl alcohol (IPA) surgical panel wipe for true defect verification',
        '12-month SiO2 hydrophobic paint sealant application',
        'Trim restoration, exhaust tip metal polish & interior express refresh',
      ],
      ur: [
        'مکمل آئرن فال آؤٹ ریموول اور فائن کلے بار ٹریٹمنٹ',
        'الٹراسونک پینٹ ڈیپتھ گیج سے ہر پینل کی پیمائش',
        'دو مرحلوں میں مشین پالش سے سوئرل مارکس اور خراشوں کا خاتمہ',
        'اسکین گرپ انسپکشن لائٹس کے نیچے ہائی گلاس ریفائنمنٹ',
        'آئی پی اے پینل وائپ کے ذریعے حقیقی فنش کی تصدیق',
        '12 ماہ کی ہائیڈروفوبک SiO2 پینٹ سیلنٹ پروٹیکشن',
        'ٹرم بحالی، ایگزاسٹ پالش اور انٹیریئر ریفریش',
      ],
      ar: [
        'إزالة كاملة لترسبات الحديد ومعالجة بالطين الناعم',
        'قياس سماكة الطلاء الرقمي بالموجات فوق الصوتية لكل لوح',
        'تصحيح على مرحلتين لإزالة الخدوش السطحية والأكسدة والدوائر',
        'تلميع نهائي فائق الوضوح تحت إضاءة الفحص المتخصصة',
        'تنظيف الألواح بالكحول الطبي للتحقق الفعلي من خلو العيوب',
        'تطبيق طبقة حماية SiO2 طاردة للماء لمدة 12 شهراً',
        'تجديد الديكورات الخارجية وتلميع العوادم وتنظيف داخلي سريع',
      ],
      es: [
        'Descontaminación férrica química y barra de arcilla fina',
        'Medición digital ultrasónica de espesor de pintura por panel',
        'Pulido en 2 etapas para eliminar swirls, arañazos y oxidación',
        'Refinado espejo inspeccionado bajo focos LED de corrección',
        'Desengrasado IPA quirúrgico para verificación real sin rellenos',
        'Sellador hidrofóbico SiO2 con 12 meses de durabilidad',
        'Restauración de plásticos, colas de escape y repaso interior',
      ],
    },
  },
  {
    id: 'ceramic',
    index: '03',
    basePricePkr: 75000,
    featured: true,
    duration: {
      en: '3 – 4 Days',
      ur: '3 – 4 دن',
      ar: '3 – 4 أيام',
      es: '3 – 4 Días',
    },
    name: {
      en: 'Ultimate 9H Ceramic Coating & Full Interior Deep Restoration',
      ur: 'الٹیمیٹ 9H سیرامک کوٹنگ اور مکمل انٹیریئر ڈیپ ریسٹوریشن',
      ar: 'طلاء سيراميك 9H الفائق وترميم داخلي عميق وشامل',
      es: 'Recubrimiento Cerámico 9H Definitivo y Restauración Interior Total',
    },
    subtitle: {
      en: 'Our flagship studio commission combining multi-stage optical paint correction, dual-layer 9H ceramic armor, and cabin rejuvenation.',
      ur: 'ہمارا فلیگ شپ پیکج جس میں 3-اسٹیج پینٹ کریکشن، ڈوئل لیئر 9H سیرامک کوٹنگ اور مکمل کیبن ریسٹوریشن شامل ہے۔',
      ar: 'باقتنا الرائدة التي تجمع بين التصحيح البصري متعدد المراحل ودرع السيراميك 9H ثنائي الطبقة وتجديد المقصورة بالكامل.',
      es: 'Nuestro servicio insignia con corrección óptica en 3 etapas, blindaje cerámico 9H bicapa y rejuvenecimiento total del habitáculo.',
    },
    features: {
      en: [
        '3-stage optical paint correction targeting 90%+ defect elimination',
        'Dual-layer certified 9H SiO2 ceramic coating bonded in controlled bay',
        'Dedicated high-temperature ceramic coating for alloy wheels & calipers',
        'Hydrophobic rain-repellent glass shield on windshield & side windows',
        '150°C dry-vapor interior steam sanitization for seats, vents & carpets',
        'pH-balanced Nappa leather & Alcantara matte restoration + UV shield',
        'Infrared lamp curing protocol & complimentary 30-day studio inspection',
      ],
      ur: [
        '3-اسٹیج آپٹیکل پینٹ کریکشن (90 فیصد سے زائد نقائص کا خاتمہ)',
        'کنٹرولڈ اسٹوڈیو بے میں ڈوئل لیئر سرٹیفائیڈ 9H سیرامک کوٹنگ',
        'الائے رمز اور بریک کیلیپرز کے لیے ہائی ٹمپریچر سیرامک شیلڈ',
        'ونڈ اسکرین اور شیشوں کے لیے ہائیڈروفوبک گلاس کوٹنگ',
        'سیٹوں، اے سی وینٹس اور کارپٹ کی ڈرائی اسٹیم سینیٹائزیشن',
        'نپا لیدر اور الکانٹارا کی پی ایچ بیلنسڈ میٹ کنڈیشننگ',
        'انفراریڈ کیورنگ اور 30 دن بعد مفت اسٹوڈیو انسپکشن',
      ],
      ar: [
        'تصحيح طلاء بصري من 3 مراحل لإزالة أكثر من 90% من العيوب',
        'طبقتان من طلاء السيراميك المعتمد 9H داخل غرفة معزولة',
        'حماية سيراميك مقاومة للحرارة العالية للجنوط والمكابح',
        'طبقة طاردة للمطر للزجاج الأمامي والنوافذ الجانبية',
        'تعقيم داخلي عميق بالبخار الجاف للمقاعد وفتحات التكييف والسجاد',
        'ترميم وترطيب جلود النابا والألكانتارا بلمسة مطفية أصلية',
        'معالجة بالأشعة تحت الحمراء وفحص مجاني في الاستوديو بعد 30 يوماً',
      ],
      es: [
        'Corrección óptica en 3 etapas eliminando más del 90% de defectos',
        'Doble capa certificada de cerámica 9H SiO2 en cabina controlada',
        'Recubrimiento cerámico de alta temperatura para llantas y pinzas',
        'Tratamiento hidrofóbico antilluvia en parabrisas y ventanillas',
        'Desinfección interior con vapor seco en tapicería, conductos y moqueta',
        'Nutrición mate pH neutro para cuero Nappa y Alcantara con escudo UV',
        'Curado por lámparas infrarrojas e inspección gratuita a los 30 días',
      ],
    },
  },
];

export interface TranslationCopy {
  isRtl: boolean;
  langLabel: string;
  nav: {
    home: string;
    services: string;
    gallery: string;
    packages: string;
    reviews: string;
    contact: string;
    bookNow: string;
    whatsapp: string;
  };
  hero: {
    kicker: string;
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    statRatingLabel: string;
    statHardnessLabel: string;
    statCorrectionLabel: string;
    statChemistryLabel: string;
  };
  gallery: {
    kicker: string;
    title: string;
    subtitle: string;
    tabPaint: string;
    tabCeramic: string;
    tabInterior: string;
    beforeLabel: string;
    afterLabel: string;
    dragHint: string;
    btnBefore: string;
    btnSplit: string;
    btnAfter: string;
  };
  packages: {
    kicker: string;
    title: string;
    subtitle: string;
    vehicleClassLabel: string;
    currencyNote: string;
    estimatedTime: string;
    signatureLabel: string;
    selectBtn: string;
    selectedBtn: string;
  };
  credentials: {
    kicker: string;
    title: string;
    subtitle: string;
    statCars: string;
    statYears: string;
    statRating: string;
    statCoatings: string;
    pillars: {title: string; desc: string}[];
  };
  reviews: {
    kicker: string;
    title: string;
    subtitle: string;
    verifiedSource: string;
    viewOnMaps: string;
    loadingText: string;
    emptyNotice: string;
    basedOn: string;
  };
  booking: {
    kicker: string;
    title: string;
    subtitle: string;
    summaryTitle: string;
    estimatedTotal: string;
    studioDuration: string;
    conciergeLabel: string;
    fullName: string;
    phone: string;
    whatsapp: string;
    sameAsPhone: string;
    vehicleLabel: string;
    vehiclePlaceholder: string;
    packageLabel: string;
    dateLabel: string;
    timeLabel: string;
    notesLabel: string;
    notesPlaceholder: string;
    submitBtn: string;
    modalTitle: string;
    modalSubtitle: string;
    refCode: string;
    sendWhatsApp: string;
    doneBtn: string;
  };
  footer: {
    locationKicker: string;
    locationTitle: string;
    addressLabel: string;
    hoursLabel: string;
    phoneLabel: string;
    directionsBtn: string;
    openMapsBtn: string;
    whatsappSupport: string;
    followUs: string;
    hoursUnavailable: string;
    rights: string;
    credit: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, TranslationCopy> = {
  en: {
    isRtl: false,
    langLabel: 'EN',
    nav: {
      home: 'Home',
      services: 'Services',
      gallery: 'Gallery',
      packages: 'Packages',
      reviews: 'Reviews',
      contact: 'Contact',
      bookNow: 'Book Now',
      whatsapp: 'WhatsApp',
    },
    hero: {
      kicker: 'Islamabad · Sector F-8/4 · Ceramic & Paint Correction Studio',
      headline: 'Unleash Ultimate Gloss & 9H Ceramic Protection',
      subheadline:
        'Bespoke multi-stage paint correction, certified 9H SiO2 ceramic coatings, and surgical cabin restoration at Detailing Crew Islamabad — engineered for enthusiasts who demand mirror-grade perfection.',
      primaryCta: 'Book Detailing Slot',
      secondaryCta: 'Explore Packages',
      statRatingLabel: 'Google Verified Rating',
      statHardnessLabel: 'Certified Ceramic Shield',
      statCorrectionLabel: 'Optical Paint Leveling',
      statChemistryLabel: 'Safe Studio Chemistry',
    },
    gallery: {
      kicker: 'Visual Evidence',
      title: 'Live Before & After Transformation',
      subtitle:
        'Drag the inspection lens across real studio correction stages to compare heavy wash swirls and dull oxidation against mirror-leveled 9H ceramic gloss.',
      tabPaint: 'Paint Correction',
      tabCeramic: '9H Ceramic Craft',
      tabInterior: 'Interior Restoration',
      beforeLabel: 'Before · Wash Swirls & Haze',
      afterLabel: 'After · 9H Ceramic Mirror',
      dragHint: 'Drag slider or use arrow keys to inspect paint clarity',
      btnBefore: 'Before',
      btnSplit: '50 / 50 Split',
      btnAfter: 'After',
    },
    packages: {
      kicker: 'Studio Menu',
      title: 'Services & Transparent Pricing',
      subtitle:
        'Select your vehicle class and preferred currency for live, accurate package estimates. Click any package to pre-load your appointment slot.',
      vehicleClassLabel: 'Vehicle Class',
      currencyNote: 'Live rates converted from PKR studio tariff',
      estimatedTime: 'Estimated bay time',
      signatureLabel: 'Flagship Commission',
      selectBtn: 'Select Package',
      selectedBtn: 'Selected for Booking',
    },
    credentials: {
      kicker: 'Why Detailing Crew Islamabad',
      title: 'Precision Craftsmanship Inside a Controlled Studio Bay',
      subtitle:
        'Every vehicle enters a dust-managed LED inspection studio, measured panel-by-panel with ultrasonic paint depth gauges before a single polishing pad touches the clear coat.',
      statCars: 'Vehicles Detailed',
      statYears: 'Years Studio Mastery',
      statRating: 'Live Google Rating',
      statCoatings: 'SiO2 Hardness Rating',
      pillars: [
        {
          title: '01. Certified 9H Ceramic Systems',
          desc: 'Authentic pro-grade SiO2 matrices bonded under controlled temperature and humidity for enduring UV, acid-rain, and chemical resistance.',
        },
        {
          title: '02. Ultrasonic Clear-Coat Calibration',
          desc: 'Digital micron readings logged across hood, fenders, and pillars ensure aggressive defect removal while preserving factory clear coat integrity.',
        },
        {
          title: '03. 100% pH-Neutral Deionized Protocol',
          desc: 'Zero harsh degreasers or silicone fillers. Every wash uses filtered water, merino wool mitts, and European pH-neutral snow foams.',
        },
        {
          title: '04. Dedicated Scangrip Inspection Lighting',
          desc: 'High-CRI color-matched studio arrays expose microscopic haze and holograms before delivery so finishes stay flawless under Islamabad sun.',
        },
      ],
    },
    reviews: {
      kicker: 'Verified Client Voices',
      title: 'Authentic Google Maps Reviews',
      subtitle:
        'Pulled directly from the official Detailing Crew Islamabad Google Maps listing with verified reviewer attributions.',
      verifiedSource: 'Live Google Maps Listing',
      viewOnMaps: 'View All Reviews on Google Maps',
      loadingText: 'Fetching live verified reviews from Google Maps...',
      emptyNotice: 'Live Google reviews are available directly on our official Google Maps studio profile.',
      basedOn: 'verified Google reviews',
    },
    booking: {
      kicker: 'Private Studio Appointment',
      title: 'Reserve Your Detailing Bay',
      subtitle:
        'Lock in your preferred date and detailing tier. Receive an immediate confirmation code and optional one-tap WhatsApp dispatch.',
      summaryTitle: 'Selected Commission',
      estimatedTotal: 'Estimated Investment',
      studioDuration: 'Studio Turnaround',
      conciergeLabel: 'Direct WhatsApp Concierge',
      fullName: 'Full Name',
      phone: 'Phone Number',
      whatsapp: 'WhatsApp Number',
      sameAsPhone: 'Same as phone number',
      vehicleLabel: 'Vehicle Make, Model & Year',
      vehiclePlaceholder: 'e.g., Audi A6, 2025 or Porsche Macan, 2024',
      packageLabel: 'Service Package',
      dateLabel: 'Preferred Date',
      timeLabel: 'Preferred Drop-Off Time',
      notesLabel: 'Paint Color & Special Requests (Optional)',
      notesPlaceholder: 'Jet black paint, minor door scratches, light beige leather conditioning...',
      submitBtn: 'Confirm Studio Appointment',
      modalTitle: 'Detailing Slot Reserved',
      modalSubtitle: 'Your studio request at Detailing Crew Islamabad has been logged. Present or forward your reference code on arrival.',
      refCode: 'Booking Reference',
      sendWhatsApp: 'Send Confirmation on WhatsApp',
      doneBtn: 'Close Confirmation',
    },
    footer: {
      locationKicker: 'Visit Our Islamabad Studio',
      locationTitle: 'Location, Hours & Direct Concierge',
      addressLabel: 'Studio Address',
      hoursLabel: 'Opening & Closing Hours',
      phoneLabel: 'Phone & WhatsApp Support',
      directionsBtn: 'Get Directions',
      openMapsBtn: 'Open Google Maps',
      whatsappSupport: 'Chat on WhatsApp',
      followUs: 'Studio Channels',
      hoursUnavailable: 'Call or WhatsApp to confirm same-day bay availability.',
      rights: 'All rights reserved.',
      credit: 'Crafted for luxury automotive care in Islamabad.',
    },
  },
  ur: {
    isRtl: true,
    langLabel: 'اردو',
    nav: {
      home: 'ہوم',
      services: 'خدمات',
      gallery: 'گیلری',
      packages: 'پیکجز',
      reviews: 'ریویوز',
      contact: 'رابطہ',
      bookNow: 'بکنگ کریں',
      whatsapp: 'واٹس ایپ',
    },
    hero: {
      kicker: 'اسلام آباد · سیکٹر F-8/4 · سیرامک اور پینٹ کریکشن اسٹوڈیو',
      headline: 'بے مثال چمک اور 9H سیرامک تحفظ کا تجربہ کریں',
      subheadline:
        'ڈیٹیلنگ کریو اسلام آباد میں ملٹی اسٹیج پینٹ کریکشن، سرٹیفائیڈ 9H سیرامک کوٹنگ اور مکمل انٹیریئر ریسٹوریشن — ان شوقین افراد کے لیے جو شو روم جیسی چمک چاہتے ہیں۔',
      primaryCta: 'بکنگ سلاٹس حاصل کریں',
      secondaryCta: 'پیکجز دیکھیں',
      statRatingLabel: 'گوگل تصدیق شدہ ریٹنگ',
      statHardnessLabel: 'سرٹیفائیڈ سیرامک شیلڈ',
      statCorrectionLabel: 'آپٹیکل پینٹ کریکشن',
      statChemistryLabel: 'محفوظ اسٹوڈیو پروڈکٹس',
    },
    gallery: {
      kicker: 'عملی نتائج',
      title: 'پہلے اور بعد کی لائیو تبدیلی',
      subtitle:
        'سلائیڈر کو حرکت دے کر سوئرل مارکس اور مدھم پینٹ کا 9H سیرامک آئینہ دار فنش سے براہ راست موازنہ کریں۔',
      tabPaint: 'پینٹ کریکشن',
      tabCeramic: '9H سیرامک کاریگری',
      tabInterior: 'انٹیریئر بحالی',
      beforeLabel: 'پہلے · سوئرل مارکس اور دھندلا پن',
      afterLabel: 'بعد میں · 9H سیرامک شیشہ چمک',
      dragHint: 'پینٹ کی صفائی دیکھنے کے لیے سلائیڈر کو دائیں بائیں کھینچیں',
      btnBefore: 'پہلے',
      btnSplit: '50 / 50 موازنہ',
      btnAfter: 'بعد میں',
    },
    packages: {
      kicker: 'اسٹوڈیو مینو',
      title: 'خدمات اور شفاف قیمتیں',
      subtitle:
        'اپنی گاڑی کی کیٹیگری اور کرنسی منتخب کریں۔ بکنگ فارم خودکار بھرنے کے لیے کوئی بھی پیکج منتخب کریں۔',
      vehicleClassLabel: 'گاڑی کی قسم',
      currencyNote: 'لائیو کرنسی کنورژن PKR اسٹوڈیو ریٹس سے',
      estimatedTime: 'متوقع وقت',
      signatureLabel: 'سب سے مقبول پیکج',
      selectBtn: 'پیکج منتخب کریں',
      selectedBtn: 'بکنگ کے لیے منتخب',
    },
    credentials: {
      kicker: 'ڈیٹیلنگ کریو اسلام آباد کیوں؟',
      title: 'جدید ایل ای ڈی اسٹوڈیو میں ماہرانہ کاریگری',
      subtitle:
        'ہر گاڑی کو ڈسٹ کنٹرولڈ اسٹوڈیو میں الٹراسونک پینٹ ڈیپتھ گیج سے چیک کر کے محفوظ طریقے سے پالش اور کوٹ کیا جاتا ہے۔',
      statCars: 'گاڑیاں ڈیٹیل کی گئیں',
      statYears: 'سالوں کا تجربہ',
      statRating: 'لائیو گوگل ریٹنگ',
      statCoatings: 'SiO2 سختی کا معیار',
      pillars: [
        {
          title: '01. سرٹیفائیڈ 9H سیرامک سسٹم',
          desc: 'دھوپ، تیزابی بارش اور کیمیکلز سے طویل مدتی تحفظ کے لیے کنٹرولڈ ماحول میں مستند SiO2 کوٹنگ۔',
        },
        {
          title: '02. الٹراسونک کلیئر کوٹ پیمائش',
          desc: 'ہر پینل کی ڈیجیٹل پیمائش تاکہ فیکٹری کلیئر کوٹ محفوظ رہے اور خراشیں مکمل ختم ہوں۔',
        },
        {
          title: '03. 100% پی ایچ نیوٹرل واش پروٹوکول',
          desc: 'کوئی سخت کیمیکل نہیں — صرف فلٹرڈ پانی، نرم مائیکرو فائبر اور محفوظ یورپی سنو فوم۔',
        },
        {
          title: '04. خصوصی ایل ای ڈی انسپکشن لائٹنگ',
          desc: 'ہائی سی آر آئی اسٹوڈیو لائٹس میں باریک ترین خراش کی جانچ تاکہ دھوپ میں پینٹ بے داغ دکھے۔',
        },
      ],
    },
    reviews: {
      kicker: 'مصدقہ کسٹمر آراء',
      title: 'گوگل میپس کے حقیقی ریویوز',
      subtitle: 'براہ راست ڈیٹیلنگ کریو اسلام آباد کے آفیشل گوگل میپس پروفائل سے حاصل کردہ ریویوز۔',
      verifiedSource: 'لائیو گوگل میپس لسٹنگ',
      viewOnMaps: 'گوگل میپس پر تمام ریویوز دیکھیں',
      loadingText: 'گوگل میپس سے لائیو ریویوز لوڈ ہو رہے ہیں...',
      emptyNotice: 'تمام تصدیق شدہ ریویوز ہمارے آفیشل گوگل میپس صفحے پر دستیاب ہیں۔',
      basedOn: 'تصدیق شدہ گوگل ریویوز',
    },
    booking: {
      kicker: 'پرائیویٹ اسٹوڈیو اپائنٹمنٹ',
      title: 'اپنا ڈیٹیلنگ سلاٹس بُک کریں',
      subtitle: 'اپنی پسندیدہ تاریخ اور پیکج منتخب کریں اور فوری کنفرمیشن کوڈ حاصل کریں۔',
      summaryTitle: 'منتخب پیکج',
      estimatedTotal: 'متوقع لاگت',
      studioDuration: 'اسٹوڈیو دورانیہ',
      conciergeLabel: 'براہ راست واٹس ایپ سپورٹ',
      fullName: 'مکمل نام',
      phone: 'فون نمبر',
      whatsapp: 'واٹس ایپ نمبر',
      sameAsPhone: 'فون نمبر جیسا ہی',
      vehicleLabel: 'گاڑی کا میک، ماڈل اور سال',
      vehiclePlaceholder: 'مثلاً Audi A6, 2025 یا Toyota Fortuner, 2024',
      packageLabel: 'سروس پیکج منتخب کریں',
      dateLabel: 'پسندیدہ تاریخ',
      timeLabel: 'پسندیدہ وقت',
      notesLabel: 'پینٹ کا رنگ اور خصوصی ہدایات (اختیاری)',
      notesPlaceholder: 'سیاہ پینٹ، دروازے پر ہلکی خراشیں، لیدر سیٹ کنڈیشننگ...',
      submitBtn: 'اپائنٹمنٹ کنفرم کریں',
      modalTitle: 'بکنگ کنفرم ہو گئی',
      modalSubtitle: 'ڈیٹیلنگ کریو اسلام آباد میں آپ کی درخواست محفوظ کر لی گئی ہے۔',
      refCode: 'بکنگ ریفرنس نمبر',
      sendWhatsApp: 'واٹس ایپ پر کنفرمیشن بھیجیں',
      doneBtn: 'بند کریں',
    },
    footer: {
      locationKicker: 'اسلام آباد اسٹوڈیو تشریف لائیں',
      locationTitle: 'مقام، اوقات کار اور رابطہ',
      addressLabel: 'اسٹوڈیو کا پتہ',
      hoursLabel: 'کھلنے اور بند ہونے کے اوقات',
      phoneLabel: 'فون اور واٹس ایپ سپورٹ',
      directionsBtn: 'راستہ دیکھیں',
      openMapsBtn: 'گوگل میپس کھولیں',
      whatsappSupport: 'واٹس ایپ پر چیٹ کریں',
      followUs: 'سوشل میڈیا',
      hoursUnavailable: 'اوقات کار کی تصدیق کے لیے کال یا واٹس ایپ کریں۔',
      rights: 'جملہ حقوق محفوظ ہیں۔',
      credit: 'اسلام آباد میں لگژری آٹوموٹو کیئر کے لیے تیار کردہ۔',
    },
  },
  ar: {
    isRtl: true,
    langLabel: 'عربي',
    nav: {
      home: 'الرئيسية',
      services: 'الخدمات',
      gallery: 'المعرض',
      packages: 'الباقات',
      reviews: 'التقييمات',
      contact: 'اتصل بنا',
      bookNow: 'احجز الآن',
      whatsapp: 'واتساب',
    },
    hero: {
      kicker: 'إسلام آباد · القطاع F-8/4 · استوديو العناية والسيراميك',
      headline: 'أطلق العنان لأقصى لمعان وحماية سيراميك 9H',
      subheadline:
        'تصحيح طلاء متعدد المراحل، طلاء سيراميك 9H معتمد، وترميم داخلي فاخر في Detailing Crew Islamabad — لعشاق السيارات الباحثين عن الكمال المرآتي.',
      primaryCta: 'احجز موعد العناية',
      secondaryCta: 'استكشف الباقات',
      statRatingLabel: 'تقييم جوجل الموثق',
      statHardnessLabel: 'درع سيراميك معتمد',
      statCorrectionLabel: 'تصحيح طلاء بصري',
      statChemistryLabel: 'مواد متعادلة الحموضة',
    },
    gallery: {
      kicker: 'نتائج حقيقية',
      title: 'معرض التحول المباشر قبل وبعد',
      subtitle:
        'اسحب شريط المقارنة لمشاهدة الفرق بين دوائر الغسيل والأكسدة وبين اللمعان المرآتي بعد تصحيح الطلاء وطلاء السيراميك 9H.',
      tabPaint: 'تصحيح الطلاء',
      tabCeramic: 'حرفية سيراميك 9H',
      tabInterior: 'ترميم المقصورة',
      beforeLabel: 'قبل · خدوش دائرية وبهتان',
      afterLabel: 'بعد · لمعان سيراميك 9H',
      dragHint: 'اسحب الشريط أو استخدم الأسهم لفحص نقاء الطلاء',
      btnBefore: 'قبل',
      btnSplit: 'مقارنة 50 / 50',
      btnAfter: 'بعد',
    },
    packages: {
      kicker: 'قائمة الاستوديو',
      title: 'الباقات والأسعار الشفافة',
      subtitle:
        'اختر فئة سيارتك والعملة المفضلة للحصول على تسعير فوري. انقر على أي باقة لتعبئة نموذج الحجز تلقائياً.',
      vehicleClassLabel: 'فئة المركبة',
      currencyNote: 'تحويل فوري من تسعيرة الاستوديو بالروبية',
      estimatedTime: 'الوقت التقديري',
      signatureLabel: 'الباقة الرائدة',
      selectBtn: 'اختر الباقة',
      selectedBtn: 'تم الاختيار للحجز',
    },
    credentials: {
      kicker: 'لماذا Detailing Crew Islamabad',
      title: 'حرفية دقيقة داخل مقصورة عناية محكمة الإضاءة',
      subtitle:
        'تخضع كل سيارة لفحص سماكة الطلاء بالموجات فوق الصوتية تحت إضاءة LED متخصصة قبل بدء أي مرحلة تلميع.',
      statCars: 'سيارة تمت العناية بها',
      statYears: 'سنوات من الخبرة',
      statRating: 'تقييم جوجل المباشر',
      statCoatings: 'صلابة SiO2 المعتمدة',
      pillars: [
        {
          title: '01. أنظمة سيراميك 9H معتمدة',
          desc: 'مركبات SiO2 احترافية تُطبّق في بيئة محكمة الحرارة والرطوبة لمقاومة الأشعة فوق البنفسجية والمواد الكيميائية.',
        },
        {
          title: '02. قياس الطلاء بالموجات فوق الصوتية',
          desc: 'قراءات رقمية دقيقة لكل جزء من الهيكل لضمان إزالة العيوب مع الحفاظ التام على طبقة اللكر الأصلية.',
        },
        {
          title: '03. بروتوكول غسيل متعادل الحموضة',
          desc: 'خالي تماماً من المواد القاسية؛ مياه مفلترة وقفازات صوف ناعمة ورغوة أوروبية آمنة على السيراميك.',
        },
        {
          title: '04. إضاءة فحص احترافية عالية الدقة',
          desc: 'مصفوفات إضاءة تكشف أدق الهولوغرامات والعيوب المجهرية قبل تسليم السيارة لضمان صفاء تام تحت الشمس.',
        },
      ],
    },
    reviews: {
      kicker: 'آراء العملاء الموثقة',
      title: 'تقييمات خرائط جوجل الحقيقية',
      subtitle: 'تقييمات مباشرة من ملف Detailing Crew Islamabad الرسمي على خرائط جوجل.',
      verifiedSource: 'ملف خرائط جوجل المباشر',
      viewOnMaps: 'عرض جميع التقييمات على خرائط جوجل',
      loadingText: 'جاري تحميل التقييمات الموثقة من خرائط جوجل...',
      emptyNotice: 'التقييمات المباشرة متوفرة على ملفنا الرسمي في خرائط جوجل.',
      basedOn: 'تقييم موثق على جوجل',
    },
    booking: {
      kicker: 'حجز موعد خاص',
      title: 'احجز مكانك في الاستوديو',
      subtitle: 'اختر التاريخ والباقة المناسبة واحصل على رمز تأكيد فوري مع إمكانية الإرسال المباشر عبر واتساب.',
      summaryTitle: 'الباقة المختارة',
      estimatedTotal: 'التكلفة التقديرية',
      studioDuration: 'مدة العمل في الاستوديو',
      conciergeLabel: 'خدمة واتساب المباشرة',
      fullName: 'الاسم الكامل',
      phone: 'رقم الهاتف',
      whatsapp: 'رقم الواتساب',
      sameAsPhone: 'نفس رقم الهاتف',
      vehicleLabel: 'نوع السيارة والموديل والسنة',
      vehiclePlaceholder: 'مثال: Audi A6, 2025 أو Mercedes E300, 2024',
      packageLabel: 'باقة الخدمة',
      dateLabel: 'التاريخ المفضل',
      timeLabel: 'الوقت المفضل',
      notesLabel: 'لون الطلاء وملاحظات خاصة (اختياري)',
      notesPlaceholder: 'طلاء أسود، خدوش خفيفة على الباب، عناية بالمقاعد الجلدية...',
      submitBtn: 'تأكيد حجز الاستوديو',
      modalTitle: 'تم حجز موعدك بنجاح',
      modalSubtitle: 'تم تسجيل طلبك لدى Detailing Crew Islamabad. يمكنك مشاركة رمز الحجز معنا عبر واتساب.',
      refCode: 'رمز الحجز المرجعي',
      sendWhatsApp: 'إرسال التأكيد عبر واتساب',
      doneBtn: 'إغلاق',
    },
    footer: {
      locationKicker: 'زوروا الاستوديو في إسلام آباد',
      locationTitle: 'الموقع وساعات العمل والتواصل المباشر',
      addressLabel: 'عنوان الاستوديو',
      hoursLabel: 'ساعات العمل',
      phoneLabel: 'الهاتف ودعم واتساب',
      directionsBtn: 'احصل على الاتجاهات',
      openMapsBtn: 'افتح في خرائط جوجل',
      whatsappSupport: 'تحدث عبر واتساب',
      followUs: 'قنوات الاستوديو',
      hoursUnavailable: 'اتصل أو راسلنا عبر واتساب لتأكيد التوفر اليومي.',
      rights: 'جميع الحقوق محفوظة.',
      credit: 'مصمم لأرقى خدمات العناية بالسيارات في إسلام آباد.',
    },
  },
  es: {
    isRtl: false,
    langLabel: 'ES',
    nav: {
      home: 'Inicio',
      services: 'Servicios',
      gallery: 'Galería',
      packages: 'Paquetes',
      reviews: 'Reseñas',
      contact: 'Contacto',
      bookNow: 'Reservar',
      whatsapp: 'WhatsApp',
    },
    hero: {
      kicker: 'Islamabad · Sector F-8/4 · Estudio de Cerámica y Corrección',
      headline: 'Desata el Brillo Definitivo y Protección Cerámica 9H',
      subheadline:
        'Corrección de pintura multietapa, recubrimientos cerámicos 9H SiO2 certificados y restauración interior quirúrgica en Detailing Crew Islamabad.',
      primaryCta: 'Reservar Turno',
      secondaryCta: 'Ver Paquetes',
      statRatingLabel: 'Calificación Google',
      statHardnessLabel: 'Blindaje Cerámico Real',
      statCorrectionLabel: 'Nivelado Óptico',
      statChemistryLabel: 'Química pH Neutro',
    },
    gallery: {
      kicker: 'Evidencia Visual',
      title: 'Transformación en Vivo Antes y Después',
      subtitle:
        'Desliza el visor de inspección para comparar marcas de lavado y oxidación frente a un acabado cerámico 9H efecto espejo.',
      tabPaint: 'Corrección de Pintura',
      tabCeramic: 'Aplicación 9H',
      tabInterior: 'Restauración Interior',
      beforeLabel: 'Antes · Swirls y Opacidad',
      afterLabel: 'Después · Espejo Cerámico 9H',
      dragHint: 'Arrastra el deslizador o usa las flechas para inspeccionar',
      btnBefore: 'Antes',
      btnSplit: 'División 50 / 50',
      btnAfter: 'Después',
    },
    packages: {
      kicker: 'Menú de Estudio',
      title: 'Paquetes y Tarifas Transparentes',
      subtitle:
        'Elige la categoría de tu vehículo y tu divisa para ver el precio convertido en tiempo real. Pulsa cualquier paquete para rellenar la reserva.',
      vehicleClassLabel: 'Tipo de Vehículo',
      currencyNote: 'Conversión dinámica desde tarifa oficial en PKR',
      estimatedTime: 'Tiempo estimado en cabina',
      signatureLabel: 'Servicio Insignia',
      selectBtn: 'Seleccionar Paquete',
      selectedBtn: 'Seleccionado para Reserva',
    },
    credentials: {
      kicker: 'Por Qué Detailing Crew Islamabad',
      title: 'Precisión Artesanal en Cabina Controlada',
      subtitle:
        'Cada vehículo se mide panel por panel con medidores ultrasónicos de espesor antes de iniciar cualquier corrección de barniz.',
      statCars: 'Vehículos Detallados',
      statYears: 'Años de Maestría',
      statRating: 'Nota en Google Maps',
      statCoatings: 'Dureza Certificada SiO2',
      pillars: [
        {
          title: '01. Sistemas Cerámicos 9H Certificados',
          desc: 'Matrices SiO2 profesionales curadas bajo temperatura controlada para máxima resistencia UV y química.',
        },
        {
          title: '02. Calibración Ultrasónica de Barniz',
          desc: 'Lecturas digitales de micras por panel que eliminan defectos preservando el espesor original de fábrica.',
        },
        {
          title: '03. Protocolo 100% pH Neutro',
          desc: 'Cero desengrasantes agresivos ni siliconas. Agua filtrada, guantes de lana merino y espumas europeas seguras.',
        },
        {
          title: '04. Iluminación de Inspección Scangrip',
          desc: 'Matrices LED de alto CRI que revelan microhologramas antes de la entrega para un brillo impecable al sol.',
        },
      ],
    },
    reviews: {
      kicker: 'Clientes Verificados',
      title: 'Reseñas Reales de Google Maps',
      subtitle: 'Obtenidas en tiempo real desde la ficha oficial de Detailing Crew Islamabad en Google Maps.',
      verifiedSource: 'Ficha Oficial Google Maps',
      viewOnMaps: 'Ver Todas las Reseñas en Google Maps',
      loadingText: 'Cargando reseñas verificadas desde Google Maps...',
      emptyNotice: 'Consulta todas las reseñas verificadas directamente en nuestra ficha oficial de Google Maps.',
      basedOn: 'reseñas verificadas en Google',
    },
    booking: {
      kicker: 'Cita Privada en Estudio',
      title: 'Reserva tu Cabina de Detailing',
      subtitle: 'Asegura tu fecha y paquete preferido con confirmación instantánea y envío directo por WhatsApp.',
      summaryTitle: 'Servicio Seleccionado',
      estimatedTotal: 'Inversión Estimada',
      studioDuration: 'Estancia en Estudio',
      conciergeLabel: 'Atención Directa por WhatsApp',
      fullName: 'Nombre Completo',
      phone: 'Teléfono',
      whatsapp: 'Número de WhatsApp',
      sameAsPhone: 'Igual que el teléfono',
      vehicleLabel: 'Marca, Modelo y Año del Vehículo',
      vehiclePlaceholder: 'Ej., Audi A6, 2025 o Porsche Macan, 2024',
      packageLabel: 'Paquete de Servicio',
      dateLabel: 'Fecha Preferida',
      timeLabel: 'Hora de Recepción',
      notesLabel: 'Color de Pintura y Notas (Opcional)',
      notesPlaceholder: 'Negro metalizado, ligeros arañazos en puertas, hidratación de cuero...',
      submitBtn: 'Confirmar Cita en Estudio',
      modalTitle: 'Turno Reservado',
      modalSubtitle: 'Tu solicitud en Detailing Crew Islamabad ha sido registrada con éxito.',
      refCode: 'Código de Reserva',
      sendWhatsApp: 'Enviar Confirmación por WhatsApp',
      doneBtn: 'Cerrar',
    },
    footer: {
      locationKicker: 'Visita Nuestro Estudio en Islamabad',
      locationTitle: 'Ubicación, Horarios y Contacto Directo',
      addressLabel: 'Dirección del Estudio',
      hoursLabel: 'Horario de Apertura',
      phoneLabel: 'Teléfono y Soporte WhatsApp',
      directionsBtn: 'Cómo Llegar',
      openMapsBtn: 'Abrir en Google Maps',
      whatsappSupport: 'Chatear por WhatsApp',
      followUs: 'Canales Oficiales',
      hoursUnavailable: 'Llámanos o escríbenos por WhatsApp para confirmar disponibilidad diaria.',
      rights: 'Todos los derechos reservados.',
      credit: 'Diseñado para el cuidado automotriz de lujo en Islamabad.',
    },
  },
};
