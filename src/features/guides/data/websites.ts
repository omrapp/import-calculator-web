// Entries 1–15 ported from the React Native app's guide data; categories and
// entries 16+ added on the web (URLs checked 2026-10-14).
import type { LocalizedString } from './types';

export const WEBSITE_CATEGORIES = [
  'government',
  'sourcing',
  'trade_fairs',
  'shipping',
  'research',
  'payments',
  'tools',
] as const;

export type WebsiteCategory = (typeof WEBSITE_CATEGORIES)[number];

export interface TradingWebsite {
  id: string;
  category: WebsiteCategory;
  title: LocalizedString; // Often just the URL or a specific name
  description: LocalizedString;
  url: string;
}

export const tradingWebsites: TradingWebsite[] = [
  {
    id: '1',
    category: 'trade_fairs',
    title: {
      en: 'ExpoExpo',
      he: 'ExpoExpo',
      ar: 'ExpoExpo',
    },
    description: {
      en: 'Global exhibitions and conferences search system.',
      he: 'מערכת לחיפוש תערוכות וכנסים בעולם בתחומים שונים.',
      ar: 'نظام للبحث عن المعارض والمؤتمرات العالمية في مختلف المجالات.',
    },
    url: 'https://www.expoexpo.com/',
  },
  {
    id: '2',
    category: 'tools',
    title: {
      en: 'WeChat',
      he: 'WeChat',
      ar: 'WeChat',
    },
    description: {
      en: 'Messaging and calling app, essential for trade with China.',
      he: 'אפליקציה מיועדת לניהול תקשורת ותרגום בסין (מומלץ לסחר עם סין).',
      ar: 'تطبيق مصمم للإدارة والاتصالات والترجمة في الصين (يوصى به للتجارة مع الصين).',
    },
    url: 'https://www.wechat.com/',
  },
  {
    id: '3',
    category: 'research',
    title: {
      en: 'Tel Aviv Chamber of Commerce',
      he: 'לשכת המסחר תל-אביב והמרכז',
      ar: 'الغرفة التجارية في تل ابيب والمركز',
    },
    description: {
      en: 'Articles and explanations on international trade.',
      he: 'אתר שמכיל כתבות והסבר על כל מה שקשור לעולם הסחר הבינלאומי.',
      ar: 'موقع يحتوي على مقالات وشرح لكل ما يتعلق بعالم التجارة الدولية.',
    },
    url: 'https://www.chamber.org.il/foreigntrade/1124/',
  },
  {
    id: '4',
    category: 'government',
    title: {
      en: 'Bilateral Agreements Search',
      he: 'חיפוש הסכמים בילטרליים',
      ar: 'البحث عن الاتفاقيات الثنائية',
    },
    description: {
      en: 'Government site showing international trade contracts.',
      he: 'אתר ממשלתי המציג חוזים בסחר בינלאומי בין המדינות למדינת ישראל.',
      ar: 'موقع حكومي يعرض عقود التجارة الدولية بين الدول ودولة إسرائيل.',
    },
    url: 'https://www.gov.il/he/departments/dynamiccollectors/bilateral-agreements-search?skip=0',
  },
  {
    id: '5',
    category: 'government',
    title: {
      en: 'Import Guide for Beginners',
      he: 'מדריך יבוא למתחילים',
      ar: 'دليل الاستيراد للمبتدئين',
    },
    description: {
      en: 'Detailed explanations for first-time importers.',
      he: 'מדריך זה נועד להקל על אזרחים שניגשים לראשונה לסוגיית היבוא, אישי או מסחרי.',
      ar: 'يهدف هذا الدليل إلى تسهيل الأمر على المواطنين الذين يتناولون موضوع الواردات لأول مرة.',
    },
    url: 'https://www.gov.il/he/pages/import_guide_beginners',
  },
  {
    id: '6',
    category: 'government',
    title: {
      en: 'Personal Import Guide',
      he: 'מדריך יבוא אישי',
      ar: 'دليل الاستيراد الشخصي',
    },
    description: {
      en: 'Government guide on personal imports.',
      he: 'אתר ממשלתי - מדריך על יבוא אישי.',
      ar: 'موقع الحكومة - دليل الاستيراد الشخصي.',
    },
    url: 'https://www.gov.il/he/pages/personal_import',
  },
  {
    id: '7',
    category: 'government',
    title: {
      en: 'Personal Import Status',
      he: 'סטטוס יבוא אישי',
      ar: 'حالة الاستيراد الشخصي',
    },
    description: {
      en: 'Check import requirements for specific products.',
      he: 'מערכת לחיפוש מידע על דרישות ליבוא אישי של מוצרים לארץ.',
      ar: 'نظام للبحث عن معلومات حول متطلبات الاستيراد الشخصي للمنتجات.',
    },
    url: 'https://apps.economy.gov.il/Apps/PersonalImport/',
  },
  {
    id: '8',
    category: 'government',
    title: {
      en: 'Israel Tax Authority',
      he: 'רשות המסים בישראל',
      ar: 'مصلحة الضرائب الإسرائيلية',
    },
    description: {
      en: 'Services and information from the Tax Authority.',
      he: 'שירותים ומידע רשות המסים בישראל.',
      ar: 'خدمات ومعلومات مصلحة الضرائب الإسرائيلية.',
    },
    url: 'https://www.gov.il/he/services/department/c0d8ba69-e309-4fe5-801f-855971774a90',
  },
  {
    id: '9',
    category: 'government',
    title: {
      en: 'Path System',
      he: 'מערכת מסלול',
      ar: 'نظام المسار',
    },
    description: {
      en: 'To submit requests, approvals and licenses. for personal and commercial imports.',
      he: 'להגשת בקשות, אישורים ורישיונות. ליובאי אישי ומסחרי.',
      ar: 'لتقديم الطلبات، الموافقات والترخيص. للإيابات الشخصية والتجارية.',
    },
    url: 'https://www.gov.il/he/service/maslul-plus',
  },
  {
    id: '10',
    category: 'shipping',
    title: {
      en: 'Yam Yabasha',
      he: 'ים יבשה',
      ar: 'يم يباشا',
    },
    description: {
      en: 'International shipping (Sea & Air).',
      he: 'הובלה בינלאומית, שילוח ימי ואווירי.',
      ar: 'الشحن الدولي للنقل البحري والجوي.',
    },
    url: 'http://yamyabasha.co.il',
  },
  {
    id: '11',
    category: 'shipping',
    title: {
      en: 'Tevel Logistics',
      he: 'תבל לוגיסטיקה',
      ar: 'تيفيل لوجستيكس',
    },
    description: {
      en: 'International logistics and shipping.',
      he: 'שילוח בינלאומי הובלה ימית ואווירית.',
      ar: 'الشحن الدولي النقل البحري والجوي.',
    },
    url: 'https://www.tevel-logistics.com',
  },
  {
    id: '12',
    category: 'trade_fairs',
    title: {
      en: 'Canton Fair',
      he: 'יריד קנטון',
      ar: 'معرض كانتون',
    },
    description: {
      en: "China's largest trade fair, held biannually in Guangzhou.",
      he: 'יריד הסחר הגדול ביותר בסין, מתקיים פעמיים בשנה בגואנגז׳ו.',
      ar: 'أكبر معرض تجاري في الصين، يُعقد مرتين سنوياً في قوانغتشو.',
    },
    url: 'https://www.cantonfair.org.cn/en-US',
  },
  {
    id: '13',
    category: 'research',
    title: {
      en: 'Google Trends',
      he: 'Google Trends',
      ar: 'Google Trends',
    },
    description: {
      en: 'Analyze search trends to discover product demand and market interests.',
      he: 'ניתוח מגמות חיפוש לגילוי ביקוש למוצרים ותחומי עניין בשוק.',
      ar: 'تحليل اتجاهات البحث لاكتشاف الطلب على المنتجات واهتمامات السوق.',
    },
    url: 'https://www.google.com/trends',
  },
  {
    id: '14',
    category: 'research',
    title: {
      en: 'ZIK Analytics',
      he: 'ZIK Analytics',
      ar: 'ZIK Analytics',
    },
    description: {
      en: 'Product research tool for eBay, Shopify & AliExpress dropshippers.',
      he: 'כלי מחקר מוצרים לדרופשיפרים באיביי, שופיפיי ואלי אקספרס.',
      ar: 'أداة بحث المنتجات لبائعي دروبشيبينغ على إيباي وشوبيفاي وعلي إكسبريس.',
    },
    url: 'https://www.zikanalytics.com/',
  },
  {
    id: '15',
    category: 'sourcing',
    title: {
      en: 'Wholesale2B',
      he: 'Wholesale2B',
      ar: 'Wholesale2B',
    },
    description: {
      en: 'Dropshipping platform with 2M+ products from US-based suppliers.',
      he: 'פלטפורמת דרופשיפינג עם יותר מ-2 מיליון מוצרים מספקים אמריקאיים.',
      ar: 'منصة دروبشيبينغ مع أكثر من 2 مليون منتج من موردين أمريكيين.',
    },
    url: 'https://www.wholesale2b.com/',
  },
  {
    id: '16',
    category: 'government',
    title: {
      en: 'Israel Customs Tariff (Shaar Olami)',
      he: 'התעריף המכסי – שער עולמי',
      ar: 'التعريفة الجمركية الإسرائيلية (شعار عولمي)',
    },
    description: {
      en: 'Look up Israeli customs duty and purchase tax by HS code before you import.',
      he: 'חיפוש מכס ומס קנייה לפי קוד HS לפני היבוא.',
      ar: 'ابحث عن الرسوم الجمركية وضريبة الشراء حسب رمز HS قبل الاستيراد.',
    },
    url: 'https://shaarolami-query.customs.mof.gov.il/CustomspilotWeb/en/CustomsBook/Import/Doubt',
  },
  {
    id: '17',
    category: 'government',
    title: {
      en: 'Standards Institution of Israel (SII)',
      he: 'מכון התקנים הישראלי',
      ar: 'معهد المواصفات الإسرائيلي',
    },
    description: {
      en: 'Check mandatory Israeli standards and certification marks imported products must meet.',
      he: 'בדיקת תקנים מחייבים ותווי תקן שמוצרים מיובאים נדרשים לעמוד בהם.',
      ar: 'تحقق من المواصفات الإلزامية وعلامات المطابقة التي يجب أن تستوفيها المنتجات المستوردة.',
    },
    url: 'https://www.sii.org.il',
  },
  {
    id: '18',
    category: 'shipping',
    title: {
      en: 'Maman (Ben Gurion air cargo)',
      he: 'ממן – מטענים בנתב"ג',
      ar: 'مامان – الشحن الجوي في مطار بن غوريون',
    },
    description: {
      en: 'Air cargo terminal at Ben Gurion: track air waybills and check import flight schedules.',
      he: 'מסוף המטען האווירי בנתב"ג: בדיקת סטטוס שטר מטען ולוח טיסות יבוא.',
      ar: 'محطة الشحن الجوي في مطار بن غوريون: تتبع بوليصة الشحن وجدول رحلات الاستيراد.',
    },
    url: 'https://mamanonline.maman.co.il/',
  },
  {
    id: '19',
    category: 'sourcing',
    title: { en: 'Alibaba.com', he: 'Alibaba.com', ar: 'Alibaba.com' },
    description: {
      en: 'Find Chinese manufacturers and wholesale suppliers, request quotes, compare MOQs and prices.',
      he: 'מציאת יצרנים וספקים סיניים, בקשת הצעות מחיר והשוואת מינימום הזמנה ומחירים.',
      ar: 'ابحث عن مصنعين وموردين صينيين، واطلب عروض أسعار، وقارن الحد الأدنى للطلب والأسعار.',
    },
    url: 'https://www.alibaba.com',
  },
  {
    id: '20',
    category: 'sourcing',
    title: {
      en: 'Made-in-China.com',
      he: 'Made-in-China.com',
      ar: 'Made-in-China.com',
    },
    description: {
      en: 'Source verified Chinese manufacturers with factory audits and bulk pricing.',
      he: 'איתור יצרנים סיניים מאומתים עם ביקורת מפעל ותמחור לכמויות גדולות.',
      ar: 'ابحث عن مصنعين صينيين موثّقين مع تدقيق المصانع وأسعار الجملة.',
    },
    url: 'https://www.made-in-china.com',
  },
  {
    id: '21',
    category: 'sourcing',
    title: { en: 'IndiaMART', he: 'IndiaMART', ar: 'IndiaMART' },
    description: {
      en: 'Indian B2B marketplace for textiles, machinery, chemicals and building materials.',
      he: 'שוק B2B הודי לרכש טקסטיל, מכונות, כימיקלים וחומרי בניין.',
      ar: 'سوق B2B هندي لشراء المنسوجات والآلات والكيماويات ومواد البناء.',
    },
    url: 'https://www.indiamart.com',
  },
  {
    id: '22',
    category: 'sourcing',
    title: { en: 'Europages', he: 'Europages', ar: 'Europages' },
    description: {
      en: 'European B2B directory to find verified European suppliers and request quotes.',
      he: 'מדריך עסקים אירופי לאיתור ספקים אירופיים מאומתים ובקשת הצעות מחיר.',
      ar: 'دليل أعمال أوروبي للعثور على موردين أوروبيين موثوقين وطلب عروض الأسعار.',
    },
    url: 'https://www.europages.com/languages',
  },
  {
    id: '23',
    category: 'trade_fairs',
    title: {
      en: 'Messe Frankfurt',
      he: 'Messe Frankfurt',
      ar: 'Messe Frankfurt',
    },
    description: {
      en: 'Major German trade fair organizer; browse exhibitor lists for European sourcing ideas.',
      he: 'מארגן ירידי סחר גרמני גדול; עיון ברשימות מציגים לרעיונות רכש באירופה.',
      ar: 'منظم معارض تجارية ألماني كبير؛ تصفح قوائم العارضين لأفكار التوريد من أوروبا.',
    },
    url: 'https://www.messefrankfurt.com/frankfurt/en.html',
  },
  {
    id: '24',
    category: 'trade_fairs',
    title: { en: 'TradeFairDates', he: 'TradeFairDates', ar: 'TradeFairDates' },
    description: {
      en: 'Searchable calendar of trade fairs worldwide, filterable by industry and country.',
      he: 'לוח ירידי סחר ותערוכות בעולם, עם סינון לפי ענף ומדינה.',
      ar: 'تقويم قابل للبحث للمعارض التجارية حول العالم، مع فلترة حسب القطاع والدولة.',
    },
    url: 'https://www.tradefairdates.com',
  },
  {
    id: '25',
    category: 'shipping',
    title: { en: 'Freightos', he: 'Freightos', ar: 'Freightos' },
    description: {
      en: 'Compare live ocean and air freight rates and book shipments from China, Turkey and Europe.',
      he: 'השוואת תעריפי הובלה ימית ואווירית בזמן אמת והזמנת משלוחים מסין, טורקיה ואירופה.',
      ar: 'قارن أسعار الشحن البحري والجوي الفورية واحجز الشحنات من الصين وتركيا وأوروبا.',
    },
    url: 'https://www.freightos.com',
  },
  {
    id: '26',
    category: 'shipping',
    title: {
      en: 'Drewry World Container Index',
      he: 'מדד המכולות העולמי של Drewry',
      ar: 'مؤشر Drewry العالمي للحاويات',
    },
    description: {
      en: 'Weekly benchmark of 40ft container rates on major routes, to judge freight costs.',
      he: 'מדד שבועי של תעריפי מכולות 40 רגל במסלולים מרכזיים, לבחינת עלות ההובלה.',
      ar: 'مؤشر أسبوعي لأسعار حاويات 40 قدماً على المسارات الرئيسية لتقدير تكلفة الشحن.',
    },
    url: 'https://www.drewry.co.uk/supply-chain-advisors/supply-chain-expertise/world-container-index-assessed-by-drewry',
  },
  {
    id: '27',
    category: 'shipping',
    title: {
      en: 'ICC Incoterms 2020 Rules',
      he: 'כללי Incoterms 2020 של ICC',
      ar: 'قواعد Incoterms 2020 لغرفة التجارة الدولية',
    },
    description: {
      en: 'Official ICC reference for the 11 Incoterms rules that split cost and risk.',
      he: 'המקור הרשמי של ICC ל-11 כללי Incoterms שמגדירים חלוקת עלות וסיכון.',
      ar: 'المرجع الرسمي لغرفة التجارة الدولية لقواعد Incoterms الإحدى عشرة لتوزيع التكلفة والمخاطر.',
    },
    url: 'https://iccwbo.org/business-solutions/incoterms-rules/',
  },
  {
    id: '28',
    category: 'shipping',
    title: { en: 'VesselFinder', he: 'VesselFinder', ar: 'VesselFinder' },
    description: {
      en: 'Track vessels and port calls to estimate when your container ship arrives.',
      he: 'מעקב אחר אוניות ועגינות בנמלים, להערכת מועד הגעת המכולה.',
      ar: 'تتبع السفن وزيارات الموانئ لتقدير موعد وصول سفينة الحاويات.',
    },
    url: 'https://www.vesselfinder.com',
  },
  {
    id: '29',
    category: 'research',
    title: {
      en: 'WCO Harmonized System (HS)',
      he: 'שיטת ההרמוניזציה (HS) של ארגון המכס העולמי',
      ar: 'النظام المنسّق (HS) لمنظمة الجمارك العالمية',
    },
    description: {
      en: 'Official HS nomenclature to find the right classification code for your product.',
      he: 'מסווג ה-HS הרשמי לאיתור קוד הסיווג הנכון למוצר.',
      ar: 'تصنيف HS الرسمي لإيجاد رمز التصنيف الصحيح لمنتجك.',
    },
    url: 'https://www.wcoomd.org/en/topics/nomenclature.aspx',
  },
  {
    id: '30',
    category: 'research',
    title: {
      en: 'EU Access2Markets',
      he: 'Access2Markets של האיחוד האירופי',
      ar: 'Access2Markets للاتحاد الأوروبي',
    },
    description: {
      en: 'EU portal for tariffs, rules of origin and requirements on EU-origin goods.',
      he: 'פורטל האיחוד האירופי לתעריפים, כללי מקור ודרישות לסחורות ממקור אירופי.',
      ar: 'بوابة الاتحاد الأوروبي للتعريفات وقواعد المنشأ ومتطلبات البضائع الأوروبية المنشأ.',
    },
    url: 'https://trade.ec.europa.eu/access-to-markets/en/home',
  },
  {
    id: '31',
    category: 'research',
    title: {
      en: 'Turkish Exporters Assembly (TIM)',
      he: 'איגוד היצואנים הטורקי (TIM)',
      ar: 'جمعية المصدّرين الأتراك (TIM)',
    },
    description: {
      en: 'Turkish export statistics and sector reports for researching Turkish suppliers.',
      he: 'נתוני יצוא ודוחות ענפיים לחקר ספקים מטורקיה.',
      ar: 'إحصاءات الصادرات التركية وتقارير القطاعات لدراسة الموردين في تركيا.',
    },
    url: 'https://www.tim.org.tr',
  },
  {
    id: '32',
    category: 'payments',
    title: { en: 'Wise', he: 'Wise', ar: 'Wise' },
    description: {
      en: 'Low-fee international transfers and multi-currency account for paying foreign suppliers.',
      he: 'העברות בינלאומיות בעמלה נמוכה וחשבון רב-מטבעי לתשלום לספקים בחו"ל.',
      ar: 'تحويلات دولية منخفضة الرسوم وحساب متعدد العملات لدفع الموردين الأجانب.',
    },
    url: 'https://wise.com',
  },
  {
    id: '33',
    category: 'payments',
    title: { en: 'Payoneer', he: 'Payoneer', ar: 'Payoneer' },
    description: {
      en: 'Send and receive B2B payments worldwide with local-currency accounts.',
      he: 'שליחה וקבלה של תשלומי B2B בעולם עם חשבונות במטבע מקומי.',
      ar: 'أرسل واستلم مدفوعات B2B حول العالم عبر حسابات بعملات محلية.',
    },
    url: 'https://www.payoneer.com',
  },
  {
    id: '34',
    category: 'tools',
    title: {
      en: 'XE Currency Converter',
      he: 'XE ממיר מטבעות',
      ar: 'XE محوّل العملات',
    },
    description: {
      en: 'Live and historical exchange rates for converting supplier invoices to shekels.',
      he: 'שערי חליפין עדכניים והיסטוריים להמרת חשבוניות ספקים לשקלים.',
      ar: 'أسعار صرف فورية وتاريخية لتحويل فواتير الموردين إلى الشيكل.',
    },
    url: 'https://www.xe.com',
  },
  {
    id: '35',
    category: 'tools',
    title: {
      en: 'UnitConverters.net',
      he: 'UnitConverters.net',
      ar: 'UnitConverters.net',
    },
    description: {
      en: 'Convert weight, length and volume units for product specs and shipping documents.',
      he: 'המרת יחידות משקל, אורך ונפח לנתוני מוצר ומסמכי משלוח.',
      ar: 'حوّل وحدات الوزن والطول والحجم لمواصفات المنتج ووثائق الشحن.',
    },
    url: 'https://www.unitconverters.net',
  },
  {
    id: '36',
    category: 'tools',
    title: { en: 'DeepL Translator', he: 'DeepL מתרגם', ar: 'DeepL المترجم' },
    description: {
      en: 'Translate supplier emails, contracts and specs from Chinese, Turkish or German.',
      he: 'תרגום מיילים, חוזים ומפרטים של ספקים מסינית, טורקית או גרמנית.',
      ar: 'ترجم رسائل الموردين والعقود والمواصفات من الصينية أو التركية أو الألمانية.',
    },
    url: 'https://www.deepl.com',
  },
  {
    id: '37',
    category: 'tools',
    title: { en: 'CBM Calculator', he: 'מחשבון CBM', ar: 'حاسبة CBM' },
    description: {
      en: 'Calculate cubic meters, volumetric weight and 20ft/40ft container fit.',
      he: 'חישוב נפח בקוב, משקל נפחי והתאמה למכולת 20/40 רגל.',
      ar: 'احسب الحجم بالمتر المكعب والوزن الحجمي وملاءمة حاوية 20/40 قدماً.',
    },
    url: 'https://www.cbm-calculator.com',
  },
];
