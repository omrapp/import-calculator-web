// Ported verbatim from the React Native app's guide data.
import type { LocalizedString } from './types';

export interface TradeTerm {
  id: string;
  term: string;
  name: LocalizedString;
  description: LocalizedString;
}

export const tradeTerms: TradeTerm[] = [
  {
    id: 'fob',
    term: 'FOB',
    name: {
      en: 'Free on Board',
      he: 'משלוח על הספינה',
      ar: 'التسليم على ظهر السفينة',
    },
    description: {
      en: 'The seller is responsible for all costs and risks until the goods are loaded onto the ship at the port of origin. From that point, the buyer assumes responsibility.',
      he: 'המוכר אחראי על כל ההוצאות והסיכונים עד שהסחורה מועמסת על כלי השיט בנמל המוצא. משם והלאה, הקונה אחראי.',
      ar: 'يكون البائع مسؤولاً عن جميع التكاليف والمخاطر حتى يتم تحميل البضاعة على السفينة في ميناء المنشأ. من هناك فصاعداً، يكون المشتري مسؤولاً.',
    },
  },
  {
    id: 'cif',
    term: 'CIF',
    name: {
      en: 'Cost, Insurance, and Freight',
      he: 'עלות, ביטוח והובלה',
      ar: 'التكلفة والتأمين والشحن',
    },
    description: {
      en: "The seller is responsible for costs, insurance, and freight until the goods arrive at the destination port. Risk transfers to buyer when goods cross the ship's rail.",
      he: 'המוכר אחראי על העלויות, הביטוח והמשלוח עד שהסחורה מגיעה לנמל היעד. הסיכון עובר לקונה כשהסחורה עוברת את סיפון הספינה.',
      ar: 'يكون البائع مسؤولاً عن التكاليف والتأمين والشحن حتى تصل البضاعة إلى ميناء الوصول. تنتقل المخاطر إلى المشتري عندما تعبر البضاعة سطح السفينة.',
    },
  },
  {
    id: 'exw',
    term: 'EXW',
    name: {
      en: 'Ex Works',
      he: 'מהמפעל',
      ar: 'تسليم المصنع',
    },
    description: {
      en: 'The seller provides goods at their premises. The buyer is responsible for all transport costs and risks from that point onwards.',
      he: 'הספק מספק את הסחורה בנקודה המוסכמת, בדרך כלל במפעל או במחסן שלו. הקונה אחראי על כל הוצאות המשלוח והסיכונים.',
      ar: 'يقوم البائع بتوفير البضاعة في مقره. يكون المشتري مسؤولاً عن جميع تكاليف النقل والمخاطر من هذه النقطة فصاعداً.',
    },
  },
  {
    id: 'ddp',
    term: 'DDP',
    name: {
      en: 'Delivered Duty Paid',
      he: 'מסירה עם מכס משולם',
      ar: 'التسليم مع دفع الرسوم',
    },
    description: {
      en: 'The seller is responsible for all costs and risks including customs duties and taxes until the goods reach the destination.',
      he: 'המוכר אחראי על כל העלויות והסיכונים כולל מכסים ומיסים עד שהסחורה מגיעה ליעד.',
      ar: 'يكون البائع مسؤولاً عن جميع التكاليف والمخاطر بما في ذلك الرسوم الجمركية والضرائب حتى تصل البضاعة إلى الوجهة.',
    },
  },
  {
    id: 'dap',
    term: 'DAP',
    name: {
      en: 'Delivered at Place',
      he: 'מסירה במקום',
      ar: 'التسليم في المكان',
    },
    description: {
      en: 'The seller delivers goods to the destination, but the buyer is responsible for customs duties and taxes.',
      he: 'המוכר מספק את הסחורה בנקודת היעד, אך הקונה אחראי לתשלום המכסים והמסים.',
      ar: 'يقوم البائع بتسليم البضاعة إلى الوجهة، لكن المشتري مسؤول عن الرسوم الجمركية والضرائب.',
    },
  },
  {
    id: 'fca',
    term: 'FCA',
    name: {
      en: 'Free Carrier',
      he: 'מסירה למוביל',
      ar: 'التسليم للناقل',
    },
    description: {
      en: 'The seller delivers goods to a specified carrier or location. The buyer takes responsibility for transport from that point.',
      he: 'המוכר מספק את הסחורה לנקודת הובלה שצוינה, והקונה לוקח על עצמו את ההובלה משם.',
      ar: 'يقوم البائع بتسليم البضاعة إلى ناقل أو موقع محدد. يتحمل المشتري المسؤولية عن النقل من هذه النقطة.',
    },
  },
  {
    id: 'bill-of-lading',
    term: 'B/L',
    name: {
      en: 'Bill of Lading',
      he: 'שטר מטען',
      ar: 'بوليصة الشحن',
    },
    description: {
      en: 'A document issued by the carrier acknowledging receipt of goods for shipment and specifying transport terms.',
      he: 'מסמך שמונפק על ידי מוביל הסחורות, המעיד על קבלת הסחורה למשלוח ומפרט את תנאי ההובלה.',
      ar: 'وثيقة تصدرها شركة الشحن تثبت استلام البضاعة للشحن وتوضح شروط النقل.',
    },
  },
  {
    id: 'certificate-of-origin',
    term: 'CO',
    name: {
      en: 'Certificate of Origin',
      he: 'תעודת מקור',
      ar: 'شهادة المنشأ',
    },
    description: {
      en: 'A document certifying the country where the goods were manufactured, recognized by customs authorities.',
      he: 'מסמך המאשר את מקור הסחורה ומוכר על ידי רשויות המכס.',
      ar: 'وثيقة تثبت الدولة التي تم فيها تصنيع البضاعة وتعترف بها السلطات الجمركية.',
    },
  },
  {
    id: 'proforma-invoice',
    term: 'PI',
    name: {
      en: 'Pro Forma Invoice',
      he: 'חשבונית פרופורמה',
      ar: 'فاتورة أولية',
    },
    description: {
      en: 'A preliminary document providing details about the transaction including product description, price, and shipping terms.',
      he: 'מסמך ראשוני המספק פרטים על העסקה, לרבות תיאור הסחורה, המחיר ותנאי המשלוח.',
      ar: 'وثيقة أولية توفر تفاصيل عن الصفقة بما في ذلك وصف المنتج والسعر وشروط الشحن.',
    },
  },
  {
    id: 'letter-of-credit',
    term: 'L/C',
    name: {
      en: 'Letter of Credit',
      he: 'אשראי דוקומנטרי',
      ar: 'خطاب الاعتماد',
    },
    description: {
      en: 'A bank payment instrument guaranteeing payment to the seller after presenting documents proving shipment of goods.',
      he: 'כלי תשלום בנקאי שבו בנק הקונה מבטיח תשלום למוכר לאחר הצגת מסמכים המעידים על שליחת הסחורה.',
      ar: 'أداة دفع مصرفية تضمن الدفع للبائع بعد تقديم مستندات تثبت شحن البضاعة.',
    },
  },
  {
    id: 'incoterms',
    term: 'Incoterms',
    name: {
      en: 'International Commercial Terms',
      he: 'מונחי מסחר בינלאומיים',
      ar: 'مصطلحات التجارة الدولية',
    },
    description: {
      en: 'A set of terms created by the ICC that regulate the distribution of risks, costs, and responsibilities between seller and buyer.',
      he: 'קבוצה של מונחים שנוצרו על ידי לשכת המסחר הבינלאומית שמסדירים את חלוקת הסיכונים, העלויות והחובות.',
      ar: 'مجموعة من المصطلحات التي أنشأتها غرفة التجارة الدولية تنظم توزيع المخاطر والتكاليف والمسؤوليات.',
    },
  },
  {
    id: 'customs-clearance',
    term: 'CC',
    name: {
      en: 'Customs Clearance',
      he: 'שחרור ממכס',
      ar: 'التخليص الجمركي',
    },
    description: {
      en: 'The process where goods entering a country are inspected by customs authorities and released for commercial use.',
      he: 'תהליך שבו סחורה נכנסת למדינה נבדקת על ידי רשויות המכס ומשוחררת לשימוש מסחרי.',
      ar: 'عملية تفحص فيها السلطات الجمركية البضاعة التي تدخل البلاد ويتم الإفراج عنها للاستخدام التجاري.',
    },
  },
  {
    id: 'tariff',
    term: 'Tariff',
    name: {
      en: 'Customs Tariff',
      he: 'מכס',
      ar: 'التعريفة الجمركية',
    },
    description: {
      en: 'A tax imposed on imported or exported goods.',
      he: 'מס שמוטל על סחורות מיובאות או מיוצאות.',
      ar: 'ضريبة تفرض على السلع المستوردة أو المصدرة.',
    },
  },
  {
    id: 'quota',
    term: 'Quota',
    name: {
      en: 'Import/Export Quota',
      he: 'מכסה',
      ar: 'حصص الاستيراد/التصدير',
    },
    description: {
      en: 'A limit on the quantity of goods that can be imported or exported to a specific country.',
      he: 'מגבלה על כמות הסחורה שניתן לייבא או לייצא למדינה מסוימת.',
      ar: 'حد أقصى لكمية البضاعة التي يمكن استيرادها أو تصديرها إلى بلد معين.',
    },
  },
  {
    id: 'embargo',
    term: 'Embargo',
    name: {
      en: 'Trade Embargo',
      he: 'אמברגו',
      ar: 'الحظر التجاري',
    },
    description: {
      en: 'A complete or partial restriction on trade with a country or group of countries, usually for political reasons.',
      he: 'הגבלה מוחלטת או חלקית על סחר עם מדינה או קבוצה של מדינות, בדרך כלל מסיבות פוליטיות.',
      ar: 'قيود كاملة أو جزئية على التجارة مع دولة أو مجموعة من الدول، عادة لأسباب سياسية.',
    },
  },
  {
    id: 'consignment',
    term: 'Consignment',
    name: {
      en: 'Consignment Shipping',
      he: 'משלוח בקונסיגנציה',
      ar: 'شحنة بالأمانة',
    },
    description: {
      en: 'A method where the seller ships goods to the buyer, but ownership remains with the seller until the goods are sold.',
      he: 'שיטה שבה המוכר שולח סחורה לקונה, אך הבעלות נשארת אצל המוכר עד שהסחורה נמכרת.',
      ar: 'طريقة يقوم فيها البائع بشحن البضاعة إلى المشتري، لكن تظل الملكية لدى البائع حتى يتم بيع البضاعة.',
    },
  },
  {
    id: 'hs-code',
    term: 'HS Code',
    name: {
      en: 'Harmonized System Code',
      he: 'קוד מכס',
      ar: 'رمز النظام المنسق',
    },
    description: {
      en: 'An international product classification system that helps determine customs duties and import/export conditions.',
      he: 'מערכת סיווג בינלאומית למוצרים המסייעת בקביעת המכס ותנאי ייבוא/ייצוא.',
      ar: 'نظام تصنيف دولي للمنتجات يساعد في تحديد الرسوم الجمركية وشروط الاستيراد/التصدير.',
    },
  },
  {
    id: 'trade-agreement',
    term: 'FTA',
    name: {
      en: 'Free Trade Agreement',
      he: 'הסכם סחר חופשי',
      ar: 'اتفاقية التجارة الحرة',
    },
    description: {
      en: 'An agreement between countries to promote and facilitate trade by reducing tariffs and other restrictions.',
      he: 'הסכם בין מדינות שנועד לקדם ולהקל על סחר באמצעות הפחתת מכסים ומגבלות.',
      ar: 'اتفاق بين دول يهدف إلى تعزيز وتسهيل التجارة من خلال تخفيض الرسوم الجمركية والقيود.',
    },
  },
  {
    id: 'freight-forwarder',
    term: 'FF',
    name: {
      en: 'Freight Forwarder',
      he: 'משלח בינלאומי',
      ar: 'وكيل الشحن',
    },
    description: {
      en: 'A company specializing in planning and executing international shipment logistics, including transport, customs handling, and cargo insurance.',
      he: 'חברה המתמחה בתכנון וביצוע לוגיסטי של משלוח בינלאומי, כולל ארגון הובלה, טיפול במכס, וביטוח סחורה.',
      ar: 'شركة متخصصة في التخطيط والتنفيذ اللوجستي للشحن الدولي، بما في ذلك تنظيم النقل والتعامل مع الجمارك وتأمين البضاعة.',
    },
  },
  {
    id: 'vat',
    term: 'VAT',
    name: {
      en: 'Value Added Tax',
      he: 'מס ערך מוסף',
      ar: 'ضريبة القيمة المضافة',
    },
    description: {
      en: 'A tax imposed on products at the time of sale, including in international sales.',
      he: 'מס שמוטל על המוצר בזמן המכירה, גם במכירה בינלאומית.',
      ar: 'ضريبة تُفرض على المنتجات عند البيع، بما في ذلك في المبيعات الدولية.',
    },
  },
];
