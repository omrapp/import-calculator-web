// Ported verbatim from the React Native app's guide data.
import type { ImagePath, LocalizedString } from './types';

export interface PresentationSlide {
  id: string;
  image: ImagePath;
  title: LocalizedString;
}

export const presentationSlides: PresentationSlide[] = [
  {
    id: '1',
    image: '/guides/1-import-guide',
    title: {
      en: 'Import Guide',
      he: 'מדריך ייבוא',
      ar: 'دليل الاستيراد',
    },
  },
  {
    id: '2',
    image: '/guides/2-import-system',
    title: {
      en: 'Import System',
      he: 'מערכת הייבוא',
      ar: 'نظام الاستيراد',
    },
  },
  {
    id: '3',
    image: '/guides/3-incoterms-1',
    title: {
      en: 'Incoterms (Part 1)',
      he: 'אינקוטרמס (חלק 1)',
      ar: 'شروط التجارة الدولية (الجزء 1)',
    },
  },
  {
    id: '4',
    image: '/guides/4-incoterms-2',
    title: {
      en: 'Incoterms (Part 2)',
      he: 'אינקוטרמס (חלק 2)',
      ar: 'شروط التجارة الدولية (الجزء 2)',
    },
  },
  {
    id: '5',
    image: '/guides/5-incoterms-3',
    title: {
      en: 'Incoterms (Part 3)',
      he: 'אינקוטרמס (חלק 3)',
      ar: 'شروط التجارة الدولية (الجزء 3)',
    },
  },
  {
    id: '6',
    image: '/guides/6-incoterms-4',
    title: {
      en: 'Incoterms (Part 4)',
      he: 'אינקוטרמס (חלק 4)',
      ar: 'شروط التجارة الدولية (الجزء 4)',
    },
  },
  {
    id: '7',
    image: '/guides/7-cif',
    title: {
      en: 'CIF Calculation',
      he: 'חישוב CIF',
      ar: 'حساب CIF',
    },
  },
  {
    id: '8',
    image: '/guides/8-import-docs',
    title: {
      en: 'Import Documents',
      he: 'מסמכי ייבוא',
      ar: 'مستندات الاستيراد',
    },
  },
  {
    id: '9',
    image: '/guides/9-insurance',
    title: {
      en: 'Insurance',
      he: 'ביטוח',
      ar: 'التأمين',
    },
  },
  {
    id: '10',
    image: '/guides/10-payment',
    title: {
      en: 'Payment Methods',
      he: 'שיטות תשלום',
      ar: 'طرق الدفع',
    },
  },
  {
    id: '11',
    image: '/guides/11-containers-sizes',
    title: {
      en: 'Container Sizes',
      he: 'גדלי מכולות',
      ar: 'أحجام الحاويات',
    },
  },
  {
    id: '12',
    image: '/guides/12-tax',
    title: {
      en: 'Tax Overview',
      he: 'סקירת מסים',
      ar: 'نظرة عامة على الضرائب',
    },
  },
  {
    id: '13',
    image: '/guides/13-taxes',
    title: {
      en: 'Taxes & Duties',
      he: 'מסים ומכסים',
      ar: 'الضرائب والرسوم',
    },
  },
  {
    id: '14',
    image: '/guides/14-calculation',
    title: {
      en: 'Calculation Guide',
      he: 'מדריך חישוב',
      ar: 'دليل الحساب',
    },
  },
  {
    id: '15',
    image: '/guides/15-import-personal-1',
    title: {
      en: 'Personal Import (Part 1)',
      he: 'ייבוא אישי (חלק 1)',
      ar: 'الاستيراد الشخصي (الجزء 1)',
    },
  },
  {
    id: '16',
    image: '/guides/16-import-personal-2',
    title: {
      en: 'Personal Import (Part 2)',
      he: 'ייבוא אישי (חלק 2)',
      ar: 'الاستيراد الشخصي (الجزء 2)',
    },
  },
  {
    id: '17',
    image: '/guides/17-import-rules',
    title: {
      en: 'Import Rules',
      he: 'כללי ייבוא',
      ar: 'قواعد الاستيراد',
    },
  },
  {
    id: '18',
    image: '/guides/18-prohibited-countries',
    title: {
      en: 'Prohibited Countries',
      he: 'מדינות אסורות',
      ar: 'الدول المحظورة',
    },
  },
  {
    id: '19',
    image: '/guides/19-product-required',
    title: {
      en: 'Product Requirements',
      he: 'דרישות מוצר',
      ar: 'متطلبات المنتج',
    },
  },
  {
    id: '20',
    image: '/guides/20-world-gate',
    title: {
      en: 'World Gate',
      he: 'שער עולמי',
      ar: 'البوابة العالمية',
    },
  },
  {
    id: '21',
    image: '/guides/21-tips',
    title: {
      en: 'Import Tips',
      he: 'טיפים לייבוא',
      ar: 'نصائح الاستيراد',
    },
  },
  {
    id: '22',
    image: '/guides/22-checklist',
    title: {
      en: 'Import Checklist',
      he: 'רשימת תיוג לייבוא',
      ar: 'قائمة مراجعة الاستيراد',
    },
  },
];
