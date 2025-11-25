import React, { useState, useEffect } from 'react';
import { User, AppView, Language, Difficulty } from './types';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { GameLevel } from './components/GameLevel';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>(AppView.AUTH);
  const [language, setLanguage] = useState<Language>('fa');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  useEffect(() => {
    // Check local storage for existing session
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

  // Update HTML direction based on language
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

  const handleUpdateScore = (points: number) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      score: user.score + points,
      // Simple leveling logic: level up every 50 points
      level: Math.floor((user.score + points) / 50) + 1
    };
    setUser(updatedUser);
    localStorage.setItem('jomle_user', JSON.stringify(updatedUser));
  };

  return (
    <div className={`w-full max-w-md mx-auto bg-gray-50 min-h-screen shadow-2xl relative overflow-hidden transition-all duration-300 ${language === 'fa' ? 'font-vazir' : 'font-sans'}`}>
        {/* Background decorative elements */}
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
            onPlay={() => setView(AppView.GAME)} 
            onLogout={handleLogout} 
            language={language}
            setLanguage={setLanguage}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
          />
        )}

        {view === AppView.GAME && user && (
          <GameLevel 
            user={user} 
            difficulty={difficulty}
            language={language}
            onUpdateScore={handleUpdateScore}
            onBack={() => setView(AppView.DASHBOARD)} 
          />
        )}
    </div>
  );
};

export default App;
