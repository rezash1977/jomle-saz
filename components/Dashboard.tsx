import React from 'react';
import { User, Language, Difficulty } from '../types';
import { Button } from './ui/Button';
import { Play, LogOut, Trophy, Star, Globe, Gauge } from 'lucide-react';
import { t } from '../services/translations';

interface DashboardProps {
  user: User;
  onPlay: () => void;
  onLogout: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  difficulty: Difficulty;
  setDifficulty: (diff: Difficulty) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  onPlay, 
  onLogout, 
  language, 
  setLanguage,
  difficulty,
  setDifficulty
}) => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-2xl font-black text-gray-800">{t(language, 'dashboardTitle', { name: user.username })}</h1>
          <p className="text-gray-500 text-sm mt-1">{t(language, 'dashboardSubtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setLanguage(language === 'fa' ? 'en' : 'fa')}
            className="p-2 bg-white rounded-xl shadow-sm text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <Globe className="w-5 h-5" />
          </button>
          <button 
            onClick={onLogout}
            className="p-2 bg-white rounded-xl shadow-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut className={`w-5 h-5 ${language === 'fa' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-x-10 -translate-y-10"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full translate-x-8 translate-y-8"></div>
        
        <div className="flex justify-around items-center relative z-10">
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
              <Trophy className="w-6 h-6 text-yellow-300" />
            </div>
            <p className="text-indigo-100 text-xs mb-1">{t(language, 'score')}</p>
            <p className="text-2xl font-bold">{user.score}</p>
          </div>
          
          <div className="w-px h-12 bg-indigo-400/50"></div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
              <Star className="w-6 h-6 text-yellow-300" />
            </div>
            <p className="text-indigo-100 text-xs mb-1">{t(language, 'level')}</p>
            <p className="text-2xl font-bold">{user.level}</p>
          </div>
        </div>
      </div>

      {/* Difficulty Selection */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 px-1">
          <Gauge className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-bold text-gray-700">{t(language, 'selectDifficulty')}</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                difficulty === d 
                  ? getDifficultyColor(d) + ' shadow-md scale-105' 
                  : 'bg-white border-transparent text-gray-500 hover:bg-gray-50'
              }`}
            >
              {t(language, d)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Action */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-xl text-center border-b-4 border-gray-100">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl animate-bounce-slow">
            🎮
          </div>
          <Button onClick={onPlay} fullWidth className="py-4 text-lg">
            <Play className={`w-6 h-6 fill-current ${language === 'fa' ? 'rotate-180' : ''}`} />
            {t(language, 'play')}
          </Button>
        </div>
      </div>
      
      <p className="text-center text-gray-400 text-xs mt-8">
        {t(language, 'designedBy')}
      </p>
    </div>
  );
};
