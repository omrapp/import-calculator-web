// Ported verbatim from the React Native app's guide data.
import type { LocalizedString } from './types';

export type LearningModule = {
  id: string;
  title: LocalizedString;
  content: LocalizedString;
  category: string;
};

export const learningModules: LearningModule[] = [
  {
    id: '1',
    category: 'regulations',
    title: {
      en: '1. Personal Import Rules',
      he: '1. יבוא אישי',
      ar: '1. قواعد الاستيراد الشخصي',
    },
    content: {
      en: `• **Up to $150:** Exempt from all taxes (Health tax applies to tobacco/alcohol).
• **$150 - $500:** Exempt from Customs Duty. Liable for VAT (17%) and Purchase Tax (if applicable).
• **$500 - $1000:** Liable for all taxes (Customs, VAT, Purchase Tax) calculated based on the collective declaration.
• **Over $1000:** Requires a formal import declaration (files by a customs broker) and liable for all import taxes.
• **Electrical Appliances:** Exempt from energy rating certification.`,
      he: `• **עד 150 דולר:** פטור מלא מכל המסים (למעט טבק ואלכוהול שחייבים במס בריאות).
• **150 עד 500 דולר:** פטור ממכס בלבד. חייב במע"מ (17%) ובמס קניה (אם קיים על המוצר).
• **500 עד 1000 דולר:** חייב בכל המסים (מכס, מע"מ, מס קניה) לפי חישוב הצהרה קולקטיבית.
• **מעל 1000 דולר:** דורש שחרור פרטני (רשימון יבוא על ידי עמיל מכס) וחייב בכל המסים כדין.
• **מוצרי חשמל:** פטורים מאישור דירוג אנרגטי.`,
      ar: `• **حتى 150 دولار:** معفى من جميع الضرائب (ضريبة الصحة تطبق على التبغ والكحول).
• **150 - 500 دولار:** معفى من الرسوم الجمركية. يخضع لضريبة القيمة المضافة (17٪) وضريبة الشراء (إن وجدت).
• **500 - 1000 دولار:** يخضع لجميع الضرائب (الجمارك، ضريبة القيمة المضافة، ضريبة الشراء) بناءً على التصريح الجماعي.
• **أكثر من 1000 دولار:** يتطلب تصريح استيراد رسمي (يتم تقديمه بواسطة مخلص جمركي) ويخضع لجميع ضرائب الاستيراد.
• **الأجهزة الكهربائية:** معفاة من شهادة تصنيف الطاقة.`,
    },
  },
  {
    id: '2',
    category: 'vehicles',
    title: {
      en: '2. Personal Vehicle Import',
      he: '2. יבוא אישי של רכב',
      ar: '2. استيراد المركبات الشخصية',
    },
    content: {
      en: `• **Prerequisites:** Valid driver's license, Private Vehicle (M1) or Wheelchair Accessible (M2).
• **Vehicle Age:** Up to 24 months from manufacture (48 months for returning residents). Collectible vehicles allowed if over 30 years old.
• **Prohibitions & Requirements:**
  - No Total Loss or Salvage titles.
  - ESP (Electronic Stability Program) is mandatory.
  - Approved Standards: Federal (USA) or Canadian, even if made outside NAFTA.
  - No structural modifications allowed (engine, chassis).
• **Restrictions:** Sale prohibited for 12 months after import.
• **Valuation & Taxes:**
  - Value based on "Declared Value" (Invoice + Freight + Insurance) if reasonable. Customs may override with a price list.
  - Appeal possible within 30 days.
  - **Tax Rates (Approx):** Gasoline ~114% (Trade agreement countries) to ~129% (Others); Electric ~29%.`,
      he: `• **תנאי סף:** רישיון נהיגה ישראלי בתוקף, רכב פרטי (M1) או רכב נכה (M2).
• **גיל הרכב:** עד 24 חודשים ממועד הייצור (48 חודשים לתושב חוזר). רכב אספנות מותר ליבוא אם חלפו 30 שנה מייצורו.
• **איסורים ודרישות טכניות:**
  - אסור לייבא רכב שהוכרז כ-Total Loss או Salvage.
  - חובה המצאות מערכת בקרת יציבות (ESP).
  - תקינה מותרת: פדראלית (ארה"ב) או קנדית, גם אם יוצר מחוץ לנפט"א.
  - איסור על שינוי מבנה ברכב (מידות, מנוע, שלדה).
• **הגבלת מכירה:** אסור להעביר בעלות על הרכב במשך 12 חודשים מיום היבוא.
• **הערכת שווי ומיסים:**
  - הערך נקבע לפי "ערך מוצהר" (חשבונית + הובלה + ביטוח) אם הוא סביר. המכס רשאי לפסול ערך זה ולקבוע לפי מחירון.
  - ניתן לערער על קביעת המכס תוך 30 יום.
  - **שיעורי מס (דוגמאות):** רכב רגיל (בנזין) – כ-114% ממדינות הסכם, כ-129% ממדינות אחרות. רכב חשמלי – כ-29%.`,
      ar: `• **المتطلبات الأساسية:** رخصة قيادة سارية، مركبة خاصة (M1) أو مركبة للمعاقين (M2).
• **عمر المركبة:** حتى 24 شهرًا من تاريخ التصنيع (48 شهرًا للمقيمين العائدين). يُسمح بالمركبات الأثرية إذا مر 30 عامًا على تصنيعها.
• **المحظورات والمتطلبات:**
  - يمنع استيراد المركبات ذات "خسارة كلية" (Total Loss) أو "إنقاذ" (Salvage).
  - نظام التحكم بالثبات (ESP) إلزامي.
  - المعايير المعتمدة: الفيدرالية (الولايات المتحدة) أو الكندية، حتى لو صنعت خارج النافتا.
  - يمنع إجراء تعديلات هيكلية (المحرك، الهيكل).
• **القيود:** يمنع بيع المركبة لمدة 12 شهرًا بعد الاستيراد.
• **التقييم والضرائب:**
  - تعتمد القيمة على "القيمة المصرح بها" (الفاتورة + الشحن + التأمين) إذا كانت معقولة. للجمارك الحق في تحديد القيمة حسب القوائم.
  - يمكن الاستئناف خلال 30 يومًا.
  - **معدلات الضريبة (تقريبي):** بنزين ~114٪ (دول الاتفاقيات التجارية) إلى ~129٪ (أخرى)؛ كهربائي ~29٪.`,
    },
  },
  {
    id: '3',
    category: 'systems',
    title: {
      en: '3. Global Gateway (Shaar Olami)',
      he: '3. מערכת "שער עולמי"',
      ar: '3. بوابة العالم (شاعر عولمي)',
    },
    content: {
      en: `Israel's new foreign trade system digitizing customs processes.

**5 Key Changes for Importers:**
1. **Smart Card:** Mandatory digital ID (Comsign/Personal ID) for electronic signing.
2. **Digital Power of Attorney:** Authorization for customs brokers done online via "Available Government" portal.
3. **Online Importer Declaration:** Supplier relationship declared online.
4. **Paperless Documents:** No physical papers (Invoice, Origin cert). Scanned, digitally signed files are accepted.
5. **Document Retention:** Responsibility shifts to the importer to keep records for 7 years.`,
      he: `מערכת סחר החוץ החדשה של ישראל, המשנה את תהליכי העבודה מול המכס לדיגיטליים לחלוטין.

**5 השינויים העיקריים ליבואנים:**
1. **כרטיס חכם:** חובה להנפיק כרטיס חכם (Comsign או Personal ID) לצורך הזדהות וחתימה אלקטרונית על טפסים.
2. **ייפוי כוח דיגיטלי:** כתב הרשאה לסוכן המכס מבוצע דיגיטלית באתר "ממשל זמין" ומחליף את הנייר הפיזי.
3. **הצהרת יבואן מקוונת:** תצהיר על הקשר עם הספקים מוגש באופן מקוון.
4. **מסמכים דיגיטליים (Paperless):** אין צורך בהגשת ניירת פיזית (חשבוניות, תעודות מקור). מסמך קביל הוא קובץ סרוק החתום דיגיטלית.
5. **אחריות שמירת מסמכים:** האחריות לשמירת מסמכי היבוא עוברת מהמכס ליבואן. חובה לשמור מסמכים למשך 7 שנים.`,
      ar: `نظام التجارة الخارجية الجديد في إسرائيل لرقمنة العمليات الجمركية.

**5 تغييرات رئيسية للمستوردين:**
1. **البطاقة الذكية:** هوية رقمية إزامية (Comsign/Personal ID) للتوقيع الإلكتروني.
2. **توكيل رقمي:** يتم تفويض وكلاء الجمارك عبر الإنترنت من خلال بوابة "الحكومة المتاحة".
3. **تصريح المستورد عبر الإنترنت:** يتم التصريح عن العلاقة مع الموردين عبر الإنترنت.
4. **مستندات بدون ورق:** لا حاجة للأوراق المادية (الفواتير، شهادات المنشأ). تُقبل الملفات الممسوحة ضوئيًا والموقعة رقميًا.
5. **حفظ المستندات:** تنتقل المسؤولية إلى المستورد للاحتفاظ بالسجلات لمدة 7 سنوات.`,
    },
  },
  {
    id: '4',
    category: 'systems',
    title: {
      en: '4. Maslul System',
      he: '4. מערכת "מסלול"',
      ar: '4. نظام مسلول',
    },
    content: {
      en: `• **Purpose:** Connects Customs, Importers, and Competent Authorities (Health, Transport, Standards Inst).
• **Function:** Allows online application for permits/licenses and real-time status tracking.
• **Access:** Requires Smart Card identification.`,
      he: `• **מטרה:** מערכת המקשרת בין המכס, היבואנים והרשויות המוסמכות (כגון משרד הבריאות, התחבורה, מכון התקנים).
• **פונקציונליות:** מאפשרת הגשת בקשות לאישורים ורישיונות באופן מקוון ומעקב אחר סטטוס הבקשה בזמן אמת עד לאישור המכס.
• **גישה:** מחייבת הזדהות באמצעות כרטיס חכם.`,
      ar: `• **الهدف:** يربط الجمارك، المستوردين، والسلطات المختصة (الصحة، النقل، معهد القاييس).
• **الوظيفة:** يسمح بتقديم طلبات التصاريح/التراخيص عبر الإنترنت وتتبع الحالة في الوقت الفعلي.
• **الوصول:** يتطلب التعريف بالبطاقة الذكية.`,
    },
  },
  {
    id: '5',
    category: 'documentation',
    title: {
      en: '5. Required Trade Documents',
      he: '5. מסמכי סחר נדרשים',
      ar: '5. مستندات التجارة المطلوبة',
    },
    content: {
      en: `• **Commercial Invoice:** Financial details.
• **Bill of Lading (B/L):** Contract of carriage and document of title.
• **Packing List:** Physical details (weights, dimensions, contents).
• **Certificate of Origin:** For customs duty exemptions (Trade Agreements).
• **Delivery Order:** Allows cargo release from port (after B/L redemption).
• **Import Declaration (Rashimon):** Importer's declaration for classification and tax calculation.`,
      he: `• **חשבונית (Invoice):** מייצגת את הנתונים הכספיים.
• **שטר מטען (Bill of Lading - B/L):** חוזה ההובלה ומסמך בעלות.
• **רשימת אריזה (Packing List):** מייצגת את הנתונים הפיזיים (משקל, מידות, תכולה).
• **תעודת מקור (Certificate of Origin):** לצורך קבלת פטור ממכס בהתאם להסכמי סחר.
• **פקודת מסירה (Delivery Order):** מסמך המאפשר את שחרור המטען מהנמל, מתקבל לאחר פדיית שטר המטען.
• **רשימון יבוא:** הצהרת היבואן למכס הכוללת סיווג וחישוב מיסים. לאחר אישורו ותשלום המיסים, הוא מהווה אישור התרה.`,
      ar: `• **الفاتورة التجارية:** التفاصيل المالية.
• **بوليصة الشحن (B/L):** عقد النقل ووثيقة الملكية.
• **قائمة التعبئة:** التفاصيل المادية (الأوزان، الأبعاد، المحتويات).
• **شهادة المنشأ:** للإعفاءات الجمركية (اتفاقيات التجارة).
• **إذن التسليم:** يسمح بالإفراج عن البضائع من الميناء (بعد استرداد بوليصة الشحن).
• **بيان الاستيراد (راشيمون):** تصريح المستورد للتصنيف وحساب الضرائب.`,
    },
  },
  {
    id: '6',
    category: 'regulations',
    title: {
      en: '6. Prohibited Imports & IP',
      he: '6. איסורי יבוא וקניין רוחני',
      ar: '6. الواردات المحظورة والملكية الفكرية',
    },
    content: {
      en: `• **Prohibited Items:** Obscene material, gambling equipment, offensive knives, laser jammers, pen-guns, used beekeeping gear, incitement materials.
• **Prohibited Countries:** Countries without diplomatic relations or banning Israeli imports (e.g., Iran, Syria, Lebanon). Specific licenses required for others (UAE, Saudi Arabia).
• **Intellectual Property:** Customs handles "infringing imports" (counterfeit) but does not intervene in "parallel imports" (genuine goods bypassing exclusive distributor).`,
      he: `• **מוצרים אסורים:** טובין פרוצים/מגונים, כרטיסי הימורים, סכינים (למעט אולר או למטרות עבודה), משבשי לייזר, כלי ירייה דמוי עט, ציוד משומש לגידול דבורים, חומרים מסיתים לטרור/גזענות.
• **מדינות אסורות:** יבוא מותר מרוב המדינות, למעט כאלו ללא יחסים דיפלומטיים או שאוסרות יבוא מישראל. מדינות מסוימות (כגון איראן, סוריה, לבנון) אסורות לחלוטין. מדינות אחרות (כגון איחוד האמירויות, בחריין, סעודיה) דורשות רישיון יבוא ספציפי לטובין מסוימים.
• **קניין רוחני:** הגדרות לסימן מסחר, זכות יוצרים, פטנטים ומדגמים. המכס מטפל ב"יבוא מפר" (מזויף), אך אינו מתערב ב"יבוא מקביל" (מקורי אך עוקף יבואן בלעדי).`,
      ar: `• **المواد المحظورة:** المواد الفاحشة، معدات المقامرة، السكاكين الهجومية، أجهزة التشويش بالليزر، الأقلام المسدسة، معدات تربية النحل المستعملة، مواد التحريض.
• **الدول المحظورة:** الدول التي ليس لها علاقات دبلوماسية أو تحظر الواردات الإسرائيلية (مثل إيران، سوريا، لبنان). تراخيص خاصة مطلوبة لدول أخرى (الإمارات، السعودية).
• **الملكية الفكرية:** تتعامل الجمارك مع "الواردات المنتهكة" (المقلدة) ولكنها لا تتدخل في "الواردات الموازية" (البضائع الأصلية التي تتجاوز الوكيل الحصري).`,
    },
  },
  {
    id: '7',
    category: 'shipping',
    title: {
      en: '7. Air Freight & Costs',
      he: '7. הובלה אווירית וחישובי עלויות',
      ar: '7. الشحن الجوي والتكاليف',
    },
    content: {
      en: `• **Volumetric Ratio:** 1:6 (1kg = 6000 cc). Chargeable Weight is the higher of actual vs. volumetric.
• **Formulas:**
  - Cm: L x W x H / 6000
  - Meters: L x W x H x 167
• **Consolidation:** Combining shipments for lower costs.
  - **MAWB:** Master Air Waybill (Forwarder - Airline).
  - **HAWB:** House Air Waybill (Exporter - Forwarder).`,
      he: `• **יחס המרה:** בהובלה אווירית היחס בין נפח למשקל הוא 1:6 (כל ק"ג שקול ל-6,000 סמ"ק). המשקל לחיוב (Chargeable Weight) הוא הגבוה מבין המשקל הפיזי למשקל הנפחי.
• **נוסחאות חישוב:**
  - בסנטימטרים: אורך×רוחב×גובה/6000.
  - במטרים: אורך×רוחב×גובה×167 (או חלוקה ב-0.006).
• **קונסולידציה (Consolidation):** איחוד משלוחים של מספר יצואנים למטען אחד כדי להוזיל עלויות.
  - **MAWB (שטר מטען ראשי):** בין המשלח לחברת התעופה.
  - **HAWB (שטר מטען פנימי):** בין היצואן למשלח.`,
      ar: `• **النسبة الحجمية:** 1:6 (1 كجم = 6000 سم مكعب). الوزن الخاضع للرسوم هو الأعلى بين الفعلي والحجمي.
• **الصيغ:**
  - سم: الطول × العرض × الارتفاع / 6000
  - متر: الطول × العرض × الارتفاع × 167
• **تجميع الشحنات:** دمج الشحنات لخفض التكاليف.
  - **MAWB:** بوليصة الشحن الجوي الرئيسية (وكيل الشحن - شركة الطيران).
  - **HAWB:** بوليصة الشحن الجوي الداخلية (المصدر - وكيل الشحن).`,
    },
  },
  {
    id: '8',
    category: 'regulations',
    title: {
      en: '8. Wood Packaging (ISPM 15)',
      he: '8. אריזות עץ (תקן ISPM 15)',
      ar: '8. التعبئة الخشبية (ISPM 15)',
    },
    content: {
      en: `• **Requirement:** Wood packaging (pallets, crates) must be treated against pests.
• **Treatment:** Heat Treatment (HT - 56°C for 30 min) or Methyl Bromide (MB) fumigation.
• **Marking:** Must bear international stamp with Country Code, Treatment Type, and Manufacturer ID. Non-compliance risks destruction or return.`,
      he: `• **דרישה:** אריזות עץ (משטחים, ארגזים) חייבות לעבור טיפול נגד מזיקים כדי למנוע העברת מחלות צמחים.
• **הטיפול:** טיפול בחום (HT - 56 מעלות ל-30 דקות) או חיטוי במתיל ברומיד (MB).
• **סימון:** האריזה חייבת לשאת חותמת תקן בינלאומית הכוללת קוד מדינה, סוג הטיפול ומספר היצרן. אי עמידה בתקן עלולה לגרור השמדת האריזה או החזרת המטען.`,
      ar: `• **المتطلبات:** يجب معالجة التعبئة الخشبية (المنصات، الصناديق) ضد الآفات.
• **المعالجة:** المعالجة الحرارية (HT - 56 درجة مئوية لمدة 30 دقيقة) أو التبخير بميثيل بروميد (MB).
• **العلامات:** يجب أن تحمل ختما دوليًا يوضح رمز الدولة، نوع المعالجة، ومعرف المصنع. عدم الامتثال يعرضها للإتلاف أو الإعادة.`,
    },
  },
  {
    id: '9',
    category: 'regulations',
    title: {
      en: '9. Trade with Palestinian Authority',
      he: '9. סחר עם הרשות הפלסטינית',
      ar: '9. التجارة مع السلطة الفلسطينية',
    },
    content: {
      en: `• **Single Customs Envelope:** Israel and PA operate as one economic unit. Sales to PA are not "exports" (except security goods).
• **Principles:** Same tax rates and import policy (standards, licenses).
• **Exceptions (Paris Protocol):**
  - **List A1/A2:** PA determines taxes/legality for specific goods (e.g., basic foods from Arab nations).
  - **List B:** Industrial equipment/raw materials - PA sets taxes, Israel sets legality/standards.
• **Crossings:** Tarkumiya, Kerem Shalom, Shaar Efraim, Bitunia.`,
      he: `• **מעטפת מכס אחת:** ישראל והרש"פ פועלות במסגרת כלכלית אחת. מכירה לרש"פ אינה נחשבת "יצוא" וקניה אינה "יבוא" (למעט ציוד ביטחוני).
• **עקרונות:** שיעורי המס ומדיניות היבוא (תקינה, רישוי) זהים לישראל.
• **רשימות חריגות (הסכם פריז):**
  - **רשימה A1/A2:** טובין מסוימים (בעיקר ממדינות ערב או מוצרי יסוד כמו אורז, בשר, מלט) לגביהם הרש"פ רשאית לקבוע עצמאית את המיסים והחוקיות.
  - **רשימה B:** ציוד לתעשייה וחומרי גלם – הרש"פ קובעת מיסים, אך חוקיות היבוא נשארת לפי התקן הישראלי.
• **מעברי סחורות:** מעברים מוגדרים כגון תרקומיא, כרם שלום, שער אפרים וביטוניה.`,
      ar: `• **غلاف جمركي واحد:** تعمل إسرائيل والسلطة الفلسطينية كوحدة اقتصادية واحدة. لا تعتبر المبيعات للسلطة الفلسطينية "صادرات" (باستثناء البضائع الأمنية).
• **المبادئ:** نفس معدلات الضرائب وسياسة الاستيراد (المعايير، التراخيص).
• **استثناءات (بروتوكول باريس):**
  - **القائمة A1/A2:** تحدد السلطة الفلسطينية الضرائب/القانونية لبضائع محددة (مثل الأغذية الأساسية من الدول العربية).
  - **القائمة B:** المعدات الصناعية/المواد الخام - تحدد السلطة الفلسطينية الضرائب، وتحدد إسرائيل القانونية/المعايير.
• **المعابر:** ترقوميا، كرم أبو سالم، شاعر إفرايم، بيتونيا.`,
    },
  },
  {
    id: '10',
    category: 'calculation',
    title: {
      en: '10. Import Cost Calculation',
      he: '10. חישוב עלויות יבוא',
      ar: '10. حساب تكلفة الاستيراد',
    },
    content: {
      en: `Final Import Cost ("Import Coefficient") Process:
1. **CIF Value:** Cost of Goods (FOB) + Freight + Insurance.
2. **Customs Duty:** Percentage of CIF value.
3. **Purchase Tax (if any):** Calculated on weighted value (CIF + Duty + Uplift/TAMA).
4. **Local Port Expenses:** Port fees, Brokerage, Inland haulage, Standards Institute.
5. **VAT:** Calculated on TOTAL (CIF + Duty + Purchase Tax + Levies).`,
      he: `תהליך חישוב העלות הסופית ליבואן ("מקדם יבוא") כולל:
1. **ערך CIF:** עלות סחורה (FOB) + הובלה + ביטוח.
2. **מכס:** אחוז מסוים מערך ה-CIF.
3. **מס קניה (אם חל):** מחושב על הערך המשוקלל (CIF + מכס + תוספת מכסת אחוזים/תמ"א).
4. **הוצאות בארץ:** אגרות נמל, עמילות מכס, הובלה יבשתית, מכון תקנים.
5. **מע"מ:** מחושב על סך הכל (CIF + מכסים + מס קניה + היטלים).`,
      ar: `عملية حساب تكلفة الاستيراد النهائية ("معامل الاستيراد"):
1. **قيمة CIF:** تكلفة البضائع (FOB) + الشحن + التأمين.
2. **الرسوم الجمركية:** نسبة مئوية من قيمة CIF.
3. **ضريبة الشراء (إن وجدت):** تحسب على القيمة المرجحة (CIF + الرسوم + التاما).
4. **نفقات الميناء المحلي:** رسوم الميناء، التخليص الجمركي، النقل الداخلي، معهد المعايير.
5. **ضريبة القيمة المضافة:** تحسب على الإجمالي (CIF + الرسوم + ضريبة الشراء + الرسوم الإضافية).`,
    },
  },
];
