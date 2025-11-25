import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, SentenceData, Language, Difficulty } from '../types';
import { generateGameLevel, generateSpeech } from '../services/geminiService';
import { playSuccessSound, playErrorSound, playClickSound, playPCMFromBase64 } from '../services/audioService';
import { t } from '../services/translations';
import { Button } from './ui/Button';
import { CheckCircle2, RotateCcw, ArrowRight, Home, Volume2, Coins, Loader2 } from 'lucide-react';

interface GameLevelProps {
  user: User;
  difficulty: Difficulty;
  language: Language;
  onUpdateScore: (points: number) => void;
  onBack: () => void;
}

export const GameLevel: React.FC<GameLevelProps> = ({ user, difficulty, language, onUpdateScore, onBack }) => {
  const [levelData, setLevelData] = useState<SentenceData | null>(null);
  const [availableWords, setAvailableWords] = useState<{id: string, text: string}[]>([]);
  const [selectedWords, setSelectedWords] = useState<{id: string, text: string}[]>([]);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'success' | 'failure'>('loading');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  
  const HINT_COST = 5;

  useEffect(() => {
    loadNewLevel();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNewLevel = async () => {
    setGameState('loading');
    setFeedbackMsg('');
    setSelectedWords([]);
    
    const data = await generateGameLevel(difficulty, language);
    setLevelData(data);
    
    // Shuffle words for the bank
    const shuffled = [...data.words]
      .map((word, idx) => ({ id: `${word}-${idx}-${Math.random()}`, text: word }))
      .sort(() => Math.random() - 0.5);
      
    setAvailableWords(shuffled);
    setGameState('playing');
  };

  const handleSelectWord = (wordObj: {id: string, text: string}) => {
    if (gameState !== 'playing') return;
    playClickSound();
    setAvailableWords(prev => prev.filter(w => w.id !== wordObj.id));
    setSelectedWords(prev => [...prev, wordObj]);
  };

  const handleDeselectWord = (wordObj: {id: string, text: string}) => {
    if (gameState !== 'playing') return;
    playClickSound();
    setSelectedWords(prev => prev.filter(w => w.id !== wordObj.id));
    setAvailableWords(prev => [...prev, wordObj]);
  };

  const handleAudioHint = async () => {
    if (!levelData || isAudioLoading) return;

    if (user.score < HINT_COST) {
      setFeedbackMsg(t(language, 'needPoints'));
      playErrorSound();
      return;
    }

    setIsAudioLoading(true);
    let hintUsed = false;
    
    try {
      // Attempt Gemini TTS first (works best for Persian)
      const audioBase64 = await generateSpeech(levelData.correctSentence);
      
      if (audioBase64) {
        onUpdateScore(-HINT_COST);
        hintUsed = true;
        await playPCMFromBase64(audioBase64);
      } else {
        // Fallback to browser TTS if API fails/missing
        // Deduct points as we are providing the service via browser
        onUpdateScore(-HINT_COST);
        hintUsed = true;
        
        const utterance = new SpeechSynthesisUtterance(levelData.correctSentence);
        utterance.lang = language === 'fa' ? 'fa-IR' : 'en-US';
        utterance.rate = 0.8; 
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.error("Audio hint failed", e);
      if (!hintUsed) playErrorSound();
    } finally {
      setIsAudioLoading(false);
    }
  };

  const checkAnswer = () => {
    if (!levelData) return;

    // Simple strict comparison
    const isCorrect = selectedWords.map(w => w.text).join('') === levelData.words.join('');

    if (isCorrect) {
      playSuccessSound();
      setGameState('success');
      setFeedbackMsg(t(language, 'successMsg'));
      
      // Calculate points based on difficulty
      let points = 10;
      if (difficulty === 'medium') points = 20;
      if (difficulty === 'hard') points = 30;

      onUpdateScore(points);
    } else {
      playErrorSound();
      setGameState('failure');
      setFeedbackMsg(t(language, 'errorMsg'));
    }
  };

  const resetCurrentLevel = () => {
    if (!levelData) return;
    playClickSound();
    setGameState('playing');
    setFeedbackMsg('');
    setSelectedWords([]);
    const allWords = levelData.words.map((word, idx) => ({ id: `${word}-${idx}-${Math.random()}`, text: word }));
    setAvailableWords(allWords.sort(() => Math.random() - 0.5));
  };

  if (gameState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">{t(language, 'loading')}</p>
      </div>
    );
  }

  // Determine direction for the specific sentence based on its language
  const contentDir = language === 'fa' ? 'rtl' : 'ltr';

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow text-gray-600">
          <Home className="w-6 h-6" />
        </button>
        <div className="flex gap-2">
           <div className="bg-indigo-50 px-3 py-1 rounded-full text-indigo-600 font-bold text-xs uppercase border border-indigo-100">
            {t(language, difficulty)}
          </div>
          <div className="bg-amber-100 px-4 py-1 rounded-full text-amber-700 font-bold text-sm flex items-center gap-1 border border-amber-200">
            <Coins className="w-4 h-4" />
            {user.score}
          </div>
        </div>
      </div>

      {/* Target Area (Sentence Line) */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="w-full flex justify-between items-center mb-2 px-2">
            <h2 className="text-gray-500 text-sm font-medium">{t(language, 'sentencePlaceholder')}</h2>
            
            {gameState === 'playing' && (
              <button 
                onClick={handleAudioHint}
                disabled={user.score < HINT_COST || isAudioLoading}
                className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold hover:bg-amber-200 disabled:opacity-50 disabled:grayscale transition-colors"
              >
                {isAudioLoading ? (
                   <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                   <Volume2 className="w-3 h-3" />
                )}
                {t(language, 'hintCost')}
              </button>
            )}
        </div>
        
        <div 
          dir={contentDir}
          className="w-full min-h-[120px] bg-white rounded-2xl border-2 border-dashed border-indigo-200 p-4 flex flex-wrap gap-2 items-center justify-center content-center transition-colors shadow-inner"
        >
          <AnimatePresence>
            {selectedWords.length === 0 && (
              <p className="text-gray-300 text-sm absolute select-none pointer-events-none">...</p>
            )}
            {selectedWords.map((word) => (
              <motion.button
                key={word.id}
                layoutId={word.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={() => handleDeselectWord(word)}
                className="bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold shadow-md active:scale-95"
              >
                {word.text}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
        
        {/* Feedback Message */}
        <div className="h-12 mt-4 flex items-center justify-center">
            {gameState === 'success' && (
                <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-emerald-600 font-bold flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" /> {feedbackMsg}
                </motion.div>
            )}
             {gameState === 'failure' && (
                <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-red-500 font-bold bg-red-50 px-4 py-2 rounded-lg">
                     {feedbackMsg}
                </motion.div>
            )}
             {gameState === 'playing' && feedbackMsg && (
                <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="text-amber-600 font-bold text-sm bg-amber-50 px-4 py-2 rounded-lg">
                     {feedbackMsg}
                </motion.div>
            )}
        </div>
      </div>

      {/* Word Bank */}
      <div className="mt-8 mb-8">
        <div className="flex flex-wrap gap-3 justify-center" dir={contentDir}>
          <AnimatePresence>
            {availableWords.map((word) => (
              <motion.button
                key={word.id}
                layoutId={word.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={() => handleSelectWord(word)}
                className="bg-white text-gray-800 border-b-4 border-gray-200 active:border-b-0 active:translate-y-[4px] px-5 py-3 rounded-xl font-bold text-lg shadow-sm hover:bg-gray-50 transition-all"
              >
                {word.text}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="pb-6 grid grid-cols-2 gap-4">
        {gameState === 'playing' && (
            <>
                <Button variant="secondary" onClick={resetCurrentLevel}>
                    <RotateCcw className="w-5 h-5" />
                    {t(language, 'restart')}
                </Button>
                <Button 
                    variant="primary" 
                    onClick={checkAnswer} 
                    disabled={availableWords.length > 0 && selectedWords.length === 0}
                >
                    <CheckCircle2 className="w-5 h-5" />
                    {t(language, 'check')}
                </Button>
            </>
        )}
        
        {gameState === 'failure' && (
             <Button variant="secondary" fullWidth className="col-span-2" onClick={resetCurrentLevel}>
                <RotateCcw className="w-5 h-5" />
                {t(language, 'retry')}
            </Button>
        )}

        {gameState === 'success' && (
             <Button variant="success" fullWidth className="col-span-2" onClick={loadNewLevel}>
                {language === 'fa' 
                  ? <><ArrowRight className="w-5 h-5" /> {t(language, 'nextLevel')}</>
                  : <>{t(language, 'nextLevel')} <ArrowRight className="w-5 h-5" /></>
                }
            </Button>
        )}
      </div>
    </div>
  );
};