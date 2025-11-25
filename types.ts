export type Language = 'fa' | 'en';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface User {
  username: string;
  score: number;
  level: number;
}

export interface SentenceData {
  id: string;
  correctSentence: string;
  words: string[]; // Correct order
}

export interface GameState {
  currentLevelData: SentenceData | null;
  scrambledWords: string[];
  userSelection: string[];
  status: 'loading' | 'playing' | 'success' | 'error';
  message: string;
}

export enum AppView {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  GAME = 'GAME'
}
