// Ported verbatim from the React Native app's guide data.
import type { ImagePath, LocalizedString } from './types';

export interface GalleryItem {
  id: string;
  image: ImagePath;
  title: LocalizedString;
  description: LocalizedString;
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'COO',
    image: '/guides/coo',
    title: {
      en: 'Certificate of Origin',
      he: 'תעודת מקור (COO)',
      ar: 'شهادة المنشأ',
    },
    description: {
      en: 'Document certifying the country where goods were manufactured.',
      he: 'מסמך המאשר את המדינה בה יוצרו הסחורות.',
      ar: 'وثيقة تثبت الدولة التي تم تصنيع البضائع فيها.',
    },
  },
  {
    id: 'EUR1',
    image: '/guides/eur1',
    title: {
      en: 'EUR.1 Movement Certificate',
      he: 'תעודת תנועה EUR.1',
      ar: 'شهادة حركة EUR.1',
    },
    description: {
      en: 'Used for trade between EU and beneficiary countries for tariff reduction.',
      he: 'משמשת לסחר בין האיחוד האירופי למדינות נהנות להפחתת מכסים.',
      ar: 'تستخدم للتجارة بين الاتحاد الأوروبي والدول المستفيدة لخفض التعريفات الجمركية.',
    },
  },
  {
    id: 'EUR-MED',
    image: '/guides/eur-made',
    title: {
      en: 'EUR-MED Certificate',
      he: 'תעודת EUR-MED',
      ar: 'شهادة EUR-MED',
    },
    description: {
      en: 'Certificate for Pan-Euro-Mediterranean accumulation of origin.',
      he: 'תעודה לצבירת מקור פאן-אירו-ים-תיכונית.',
      ar: 'شهادة لتراكم المنشأ الأورو-متوسطي.',
    },
  },
  {
    id: 'FormA',
    image: '/guides/forma',
    title: {
      en: 'Form A (GSP)',
      he: 'טופס A (GSP)',
      ar: 'نموذج A (GSP)',
    },
    description: {
      en: 'Certificate of origin for Generalized System of Preferences.',
      he: 'תעודת מקור למערכת ההעדפות הכללית.',
      ar: 'شهادة منشأ لنظام الأفضليات المعمم.',
    },
  },
  {
    id: 'Canada',
    image: '/guides/canada',
    title: {
      en: 'Canada-Israel Free Trade',
      he: 'הסכם סחר חופשי קנדה-ישראל',
      ar: 'تجارة حرة كندا-إسرائيل',
    },
    description: {
      en: 'Declaration for the Canada-Israel Free Trade Agreement.',
      he: 'הצהרה להסכם הסחר החופשי בין קנדה לישראל.',
      ar: 'إعلان لاتفاقية التجارة الحرة بين كندا وإسرائيل.',
    },
  },
  {
    id: 'Mercosur',
    image: '/guides/mercosur',
    title: {
      en: 'Mercosur Certificate',
      he: 'תעודת מרקוסור',
      ar: 'شهادة ميركوسور',
    },
    description: {
      en: 'Certificate of origin for trade with Mercosur countries.',
      he: 'תעודת מקור לסחר עם מדינות המרקוסור.',
      ar: 'شهادة منشأ للتجارة مع دول ميركوسور.',
    },
  },
];
