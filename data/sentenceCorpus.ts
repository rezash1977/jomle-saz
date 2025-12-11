import { Language } from '../types';

export interface CorpusEntry {
    text: string;
    language: Language;
    tags?: string[]; // e.g., 'nature', 'daily', 'philosophy'
}

export const SENTENCE_CORPUS: CorpusEntry[] = [
    // Persian - Easy
    { text: "من سیب می‌خورم", language: 'fa' },
    { text: "هوا سرد است", language: 'fa' },
    { text: "این توپ قرمز است", language: 'fa' },
    { text: "مادر من مهربان است", language: 'fa' },
    { text: "ما به خانه می‌رویم", language: 'fa' },
    { text: "او آب می‌نوشد", language: 'fa' },
    { text: "گربه روی دیوار است", language: 'fa' },
    { text: "من کتاب دارم", language: 'fa' },
    { text: "من آب می‌خورم", language: 'fa' },
    { text: "او سیب دارد", language: 'fa' },
    { text: "گربه روی میز است", language: 'fa' },
    { text: "این توپ آبی است", language: 'fa' },
    { text: "ما به مدرسه می‌رویم", language: 'fa' },
    { text: "مادر من زیبا است", language: 'fa' },

    // Persian - Medium
    { text: "من دیروز به مدرسه رفتم", language: 'fa' },
    { text: "دوست من فوتبال بازی می‌کند", language: 'fa' },
    { text: "آسمان امروز خیلی آبی و صاف است", language: 'fa' },
    { text: "ما باید به طبیعت احترام بگذاریم", language: 'fa' },
    { text: "خوردن صبحانه برای سلامتی مهم است", language: 'fa' },
    { text: "برادرم یک ماشین جدید خرید", language: 'fa' },

    // Persian - Hard
    { text: "یادگیری زبان جدید دریچه‌ای به دنیای تازه است", language: 'fa' },
    { text: "تلاش و پشتکار کلید موفقیت در زندگی است", language: 'fa' },
    { text: "تاریخ معلم انسان‌ها برای ساختن آینده است", language: 'fa' },
    { text: "هنر بازتاب‌دهنده فرهنگ و تمدن یک جامعه است", language: 'fa' },
    { text: "حفاظت از محیط زیست وظیفه همه انسان‌هاست", language: 'fa' },

    // English - Easy
    { text: "I eat an apple", language: 'en' },
    { text: "The sky is blue", language: 'en' },
    { text: "She runs fast", language: 'en' },
    { text: "We are happy", language: 'en' },
    { text: "The cat is black", language: 'en' },
    { text: "I have a pen", language: 'en' },
    { text: "I eat a banana", language: 'en' },
    { text: "The cat is white", language: 'en' },
    { text: "She runs slow", language: 'en' },
    { text: "We are sad", language: 'en' },
    { text: "I have an apple", language: 'en' },
    { text: "The sky is dark", language: 'en' },

    // English - Medium
    { text: "I went to the park yesterday", language: 'en' },
    { text: "Reading books is very fun", language: 'en' },
    { text: "My friend plays soccer well", language: 'en' },
    { text: "Breakfast is the most important meal", language: 'en' },
    { text: "The weather is sunny today", language: 'en' },

    // English - Hard
    { text: "Learning a new language opens many doors", language: 'en' },
    { text: "Perseverance is the key to success in life", language: 'en' },
    { text: "History teaches us how to build the future", language: 'en' },
    { text: "Art reflects the culture of a society", language: 'en' },
    { text: "Protecting the environment is everyone's duty", language: 'en' }
];
