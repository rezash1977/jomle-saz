import { Language } from '../types';

type TranslationKey = 
  | 'appName'
  | 'welcome'
  | 'loginTitle'
  | 'createAccount'
  | 'username'
  | 'enterUsername'
  | 'loginBtn'
  | 'signupBtn'
  | 'noAccount'
  | 'hasAccount'
  | 'play'
  | 'logout'
  | 'score'
  | 'level'
  | 'loading'
  | 'sentencePlaceholder'
  | 'check'
  | 'retry'
  | 'nextLevel'
  | 'restart'
  | 'successMsg'
  | 'errorMsg'
  | 'difficulty'
  | 'easy'
  | 'medium'
  | 'hard'
  | 'selectDifficulty'
  | 'dashboardTitle'
  | 'dashboardSubtitle'
  | 'designedBy'
  | 'hint'
  | 'hintCost'
  | 'needPoints';

export const translations: Record<Language, Record<TranslationKey, string>> = {
  fa: {
    appName: 'جمله‌ساز',
    welcome: 'خوش آمدید',
    loginTitle: 'ورود به بازی',
    createAccount: 'ساخت حساب کاربری',
    username: 'نام کاربری',
    enterUsername: 'علی...',
    loginBtn: 'ورود به بازی',
    signupBtn: 'ساخت حساب',
    noAccount: 'حساب ندارید؟ ثبت نام کنید',
    hasAccount: 'حساب دارید؟ وارد شوید',
    play: 'شروع بازی',
    logout: 'خروج',
    score: 'امتیاز کل',
    level: 'مرحله',
    loading: 'در حال ساخت مرحله با هوش مصنوعی...',
    sentencePlaceholder: 'کلمات را اینجا بچینید',
    check: 'بررسی',
    retry: 'تلاش دوباره',
    nextLevel: 'مرحله بعد',
    restart: 'شروع مجدد',
    successMsg: 'آفرین! کاملا درسته 👏',
    errorMsg: 'اشتباه بود، دوباره تلاش کن!',
    difficulty: 'سطح دشواری',
    easy: 'آسان',
    medium: 'متوسط',
    hard: 'سخت',
    selectDifficulty: 'انتخاب سطح',
    dashboardTitle: 'سلام، {name} 👋',
    dashboardSubtitle: 'امروز چی یاد بگیریم؟',
    designedBy: 'طراحی شده با Reza Shoja',
    hint: 'راهنمای صوتی',
    hintCost: '۵ امتیاز',
    needPoints: 'امتیاز کافی نیست!'
  },
  en: {
    appName: 'Sentence Builder',
    welcome: 'Welcome',
    loginTitle: 'Login to Play',
    createAccount: 'Create Account',
    username: 'Username',
    enterUsername: 'John...',
    loginBtn: 'Login',
    signupBtn: 'Sign Up',
    noAccount: 'No account? Sign up',
    hasAccount: 'Have an account? Login',
    play: 'Start Game',
    logout: 'Logout',
    score: 'Total Score',
    level: 'Level',
    loading: 'Generating level with AI...',
    sentencePlaceholder: 'Arrange words here',
    check: 'Check Answer',
    retry: 'Try Again',
    nextLevel: 'Next Level',
    restart: 'Reset',
    successMsg: 'Great job! That is correct 👏',
    errorMsg: 'Incorrect, try again!',
    difficulty: 'Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    selectDifficulty: 'Select Difficulty',
    dashboardTitle: 'Hi, {name} 👋',
    dashboardSubtitle: 'What shall we learn today?',
    designedBy: 'Designed with Reza Shoja',
    hint: 'Audio Hint',
    hintCost: '5 pts',
    needPoints: 'Not enough points!'
  }
};

export const t = (lang: Language, key: TranslationKey, params?: Record<string, string>): string => {
  let text = translations[lang][key] || key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
  }
  return text;
};