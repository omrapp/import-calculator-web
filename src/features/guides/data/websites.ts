// Ported verbatim from the React Native app's guide data.
import type { LocalizedString } from './types';

export interface TradingWebsite {
  id: string;
  title: LocalizedString; // Often just the URL or a specific name
  description: LocalizedString;
  url: string;
}

export const tradingWebsites: TradingWebsite[] = [
  {
    id: '1',
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
];
