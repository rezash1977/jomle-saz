import React, { useState, useEffect } from 'react';
import { User, AppView, Language, Difficulty } from './types';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { GameLevel } from './components/GameLevel';

// 1. ایمپورت کردن سرویس هوش مصنوعی و تایپ آن
// تغییر جدید: اضافه کردن ایمپورت سرویس
import { localAiService, PuzzleData } from './services/localAiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>(AppView.AUTH);
  const [language, setLanguage] = useState<Language>('fa');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  // 2. استیت برای نگهداری دیتای بازی و وضعیت لودینگ
  // تغییر جدید: اضافه کردن استیت‌های جدید
  const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('jomle_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setView(AppView.DASHBOARD);
      } catch (e) {
        localStorage.removeItem('jomle_user');
      }
    }
  }, []);

  useEffect(() => {
    const dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    localStorage.removeItem('jomle_user');
    setUser(null);
    setView(AppView.AUTH);
  };

  // 3. تابع جدید برای شروع بازی و دریافت اطلاعات از هوش مصنوعی
  // تغییر جدید: این تابع جایگزین دستور ساده setView می‌شود
  const handleStartGame = async () => {
    setIsLoading(true); // فعال کردن حالت لودینگ
    
    // درخواست به سرویس لوکال
    const puzzle = await localAiService.getScrambledSentence(language, difficulty);    
    setIsLoading(false); // غیرفعال کردن لودینگ

    if (puzzle) {
      setCurrentPuzzle(puzzle); // ذخیره جمله دریافتی
      setView(AppView.GAME);    // رفتن به صفحه بازی
    } else {
      // نمایش خطا در صورت خاموش بودن سرور پایتون
      alert(language === 'fa' 
        ? 'ارتباط با هوش مصنوعی برقرار نشد. لطفاً از اجرای فایل پایتون مطمئن شوید.' 
        : 'Could not connect to AI service. Please ensure Python script is running.');
    }
  };

  const handleUpdateScore = (points: number) => {
    
    if (!user) return;
    const updatedUser = {
      ...user,
      score: user.score + points,
      level: Math.floor((user.score + points) / 50) + 1
    };
    setUser(updatedUser);
    localStorage.setItem('jomle_user', JSON.stringify(updatedUser));
  };

  return (
    <div className={`w-full max-w-md mx-auto bg-gray-50 min-h-screen shadow-2xl relative overflow-hidden transition-all duration-300 ${language === 'fa' ? 'font-vazir' : 'font-sans'}`}>
        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600 z-50"></div>
        
        {view === AppView.AUTH && (
          <Auth 
            onLogin={handleLogin} 
            language={language} 
            setLanguage={setLanguage} 
          />
        )}

        {view === AppView.DASHBOARD && user && (
          <Dashboard 
            user={user} 
            // 4. تغییر دکمه شروع بازی برای فراخوانی تابع جدید
            // تغییر جدید: استفاده از handleStartGame به جای تغییر مستقیم view
            onPlay={handleStartGame} 
            onLogout={handleLogout} 
            language={language}
            setLanguage={setLanguage}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
          />
        )}

        {/* نمایش لودینگ تمام صفحه در هنگام دریافت اطلاعات از هوش مصنوعی */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center text-white">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mb-4"></div>
              <p>{language === 'fa' ? 'در حال دریافت جمله از هوش مصنوعی...' : 'Generating puzzle with AI...'}</p>
            </div>
          </div>
        )}

        {view === AppView.GAME && user && currentPuzzle && (
          <GameLevel 
            user={user} 
            difficulty={difficulty}
            language={language}
            // 5. ارسال دیتای پازل به کامپوننت بازی
            // تغییر جدید: پاس دادن دیتای دریافتی به عنوان prop
            initialPuzzle={currentPuzzle} 
            onUpdateScore={handleUpdateScore}
            onBack={() => setView(AppView.DASHBOARD)} 
          />
        )}
    </div>
  );
};

export default App;