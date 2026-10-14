// DRAFT written by Claude; pending the owner's legal review.
import { CONTACT_EMAIL, type LegalDocument } from './types';

export const privacyPolicy: LegalDocument = {
  effectiveDate: '2026-10-14',
  sections: {
    en: [
      {
        heading: 'Summary',
        body: [
          'Import Calculator has no accounts and does not ask for your name, email or any other personal details. Your calculations stay in your own browser.',
        ],
      },
      {
        heading: 'What is stored on your device',
        body: [
          'The site uses your browser’s local storage to keep: form drafts, your History of Saved Calculations, your language choice and the last Bank of Israel exchange rates fetched. This data never leaves your device unless you export it or share a link yourself.',
          'You can delete it at any time with Clear History, the clear button on each calculator, or by clearing your browser’s site data.',
        ],
      },
      {
        heading: 'Share links and exported files',
        body: [
          'A share link contains the inputs of a calculation in the address. Anyone you send it to can see those inputs. Exported History, image and PDF files are created on your device and are only shared if you choose to.',
        ],
      },
      {
        heading: 'Exchange rates',
        body: [
          'To show today’s rates, your browser asks our server function for them, and the function fetches them from the Bank of Israel. No calculation data is sent with this request.',
        ],
      },
      {
        heading: 'Analytics',
        body: [
          'We use Vercel Web Analytics to count page views and see which pages are used. It does not use cookies and reports only aggregate data; it does not identify you.',
        ],
      },
      {
        heading: 'Contact',
        body: [
          `If you email us at ${CONTACT_EMAIL}, we receive your email address and message and use them only to reply.`,
        ],
      },
      {
        heading: 'Changes',
        body: [
          'If this policy changes, the new version will be posted on this page with a new effective date.',
        ],
      },
    ],
    he: [
      {
        heading: 'תקציר',
        body: [
          'במחשבון היבוא אין חשבונות משתמש, ואיננו מבקשים שם, דוא״ל או כל פרט אישי אחר. החישובים שלכם נשמרים בדפדפן שלכם בלבד.',
        ],
      },
      {
        heading: 'מה נשמר במכשיר שלכם',
        body: [
          'האתר משתמש באחסון המקומי של הדפדפן כדי לשמור: טיוטות של טפסים, היסטוריית החישובים השמורים, בחירת השפה ושערי בנק ישראל האחרונים שנטענו. מידע זה אינו יוצא מהמכשיר אלא אם תייצאו אותו או תשתפו קישור בעצמכם.',
          'ניתן למחוק אותו בכל עת באמצעות ניקוי ההיסטוריה, כפתור הניקוי בכל מחשבון, או ניקוי נתוני האתר בדפדפן.',
        ],
      },
      {
        heading: 'קישורי שיתוף וקבצים מיוצאים',
        body: [
          'קישור שיתוף מכיל את נתוני החישוב בכתובת. כל מי שתשלחו אליו את הקישור יוכל לראות נתונים אלה. קבצי היסטוריה, תמונה ו־PDF נוצרים במכשיר שלכם ומשותפים רק אם תבחרו בכך.',
        ],
      },
      {
        heading: 'שערי חליפין',
        body: [
          'כדי להציג את שערי היום, הדפדפן פונה לפונקציית השרת שלנו, והיא מביאה אותם מבנק ישראל. נתוני החישוב אינם נשלחים בבקשה זו.',
        ],
      },
      {
        heading: 'ניתוח שימוש',
        body: [
          'אנו משתמשים ב־Vercel Web Analytics כדי לספור צפיות בדפים ולדעת באילו דפים משתמשים. השירות אינו משתמש בעוגיות ומדווח נתונים מצרפיים בלבד; הוא אינו מזהה אתכם.',
        ],
      },
      {
        heading: 'יצירת קשר',
        body: [
          `אם תשלחו אלינו דוא״ל לכתובת ${CONTACT_EMAIL}, נקבל את כתובת הדוא״ל ואת ההודעה ונשתמש בהן רק כדי להשיב.`,
        ],
      },
      {
        heading: 'שינויים',
        body: [
          'אם מדיניות זו תשתנה, הגרסה החדשה תפורסם בדף זה עם תאריך תחולה חדש.',
        ],
      },
    ],
    ar: [
      {
        heading: 'ملخص',
        body: [
          'لا توجد حسابات في حاسبة الاستيراد، ولا نطلب اسمك أو بريدك الإلكتروني أو أي بيانات شخصية أخرى. تبقى حساباتك في متصفحك فقط.',
        ],
      },
      {
        heading: 'ما يُحفظ على جهازك',
        body: [
          'يستخدم الموقع التخزين المحلي في متصفحك لحفظ: مسودات النماذج، وسجل الحسابات المحفوظة، واختيار اللغة، وآخر أسعار صرف تم جلبها من بنك إسرائيل. لا تغادر هذه البيانات جهازك إلا إذا قمت بتصديرها أو مشاركة رابط بنفسك.',
          'يمكنك حذفها في أي وقت عبر مسح السجل، أو زر المسح في كل حاسبة، أو مسح بيانات الموقع من المتصفح.',
        ],
      },
      {
        heading: 'روابط المشاركة والملفات المصدّرة',
        body: [
          'يحتوي رابط المشاركة على مدخلات الحساب في العنوان، ويمكن لأي شخص ترسله إليه رؤية هذه المدخلات. تُنشأ ملفات السجل والصور وPDF على جهازك ولا تُشارك إلا إذا اخترت ذلك.',
        ],
      },
      {
        heading: 'أسعار الصرف',
        body: [
          'لعرض أسعار اليوم، يطلبها متصفحك من دالة الخادم لدينا، والتي تجلبها من بنك إسرائيل. لا تُرسل بيانات الحساب مع هذا الطلب.',
        ],
      },
      {
        heading: 'التحليلات',
        body: [
          'نستخدم Vercel Web Analytics لعدّ مشاهدات الصفحات ومعرفة الصفحات المستخدمة. لا يستخدم ملفات تعريف الارتباط ويقدّم بيانات إجمالية فقط، ولا يحدد هويتك.',
        ],
      },
      {
        heading: 'التواصل',
        body: [
          `إذا راسلتنا على ${CONTACT_EMAIL}، نتلقى عنوان بريدك ورسالتك ونستخدمهما للرد فقط.`,
        ],
      },
      {
        heading: 'التغييرات',
        body: [
          'إذا تغيّرت هذه السياسة، ستُنشر النسخة الجديدة في هذه الصفحة مع تاريخ سريان جديد.',
        ],
      },
    ],
  },
};
