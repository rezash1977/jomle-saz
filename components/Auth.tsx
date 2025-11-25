import React, { useState } from 'react';
import { User, Language } from '../types';
import { Button } from './ui/Button';
import { UserPlus, LogIn, Globe } from 'lucide-react';
import { t } from '../services/translations';

interface AuthProps {
  onLogin: (user: User) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, language, setLanguage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const toggleLanguage = () => {
    setLanguage(language === 'fa' ? 'en' : 'fa');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError(language === 'fa' ? 'لطفا نام کاربری را وارد کنید' : 'Please enter a username');
      return;
    }

    // Simulate backend auth/registration
    const mockUser: User = {
      username: username,
      score: 0,
      level: 1
    };

    // Store in local storage for persistence across reloads
    localStorage.setItem('jomle_user', JSON.stringify(mockUser));
    onLogin(mockUser);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-indigo-50 to-purple-100 relative">
      <button 
        onClick={toggleLanguage}
        className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-md text-indigo-600 hover:bg-indigo-50 transition-colors z-10 flex items-center gap-2 px-3"
      >
        <Globe className="w-4 h-4" />
        <span className="text-xs font-bold uppercase">{language}</span>
      </button>

      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-indigo-50 relative z-0">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-4xl">
            📝
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-center text-gray-800 mb-2">{t(language, 'appName')}</h1>
        <p className="text-center text-gray-500 mb-8">
          {isLogin ? t(language, 'loginTitle') : t(language, 'createAccount')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t(language, 'username')}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${language === 'fa' ? 'text-right' : 'text-left'}`}
              placeholder={t(language, 'enterUsername')}
              dir="auto"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <Button type="submit" fullWidth>
            {isLogin ? (
              <>
                <LogIn className={`w-5 h-5 ${language === 'fa' ? 'rotate-180' : ''}`} />
                {t(language, 'loginBtn')}
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                {t(language, 'signupBtn')}
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 font-bold hover:underline text-sm"
          >
            {isLogin ? t(language, 'noAccount') : t(language, 'hasAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};
