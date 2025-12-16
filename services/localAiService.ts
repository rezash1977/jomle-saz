// services/localAiService.ts
export interface PuzzleData {
    original: string;
    scrambled: string[];
    lang?: string;
  }
  const API_URL = 'https://rezash1977-jomle-sazi-api.hf.space';
  export const localAiService = {
    // دقت کنید ورودی‌ها اینجا تعریف شده باشند
    async getScrambledSentence(lang: string, difficulty: string): Promise<PuzzleData | null> {
      try {
        console.log(`Sending request to AI: Lang=${lang}, Diff=${difficulty}`); // این لاین را برای تست اضافه کنید
        
        const response = await fetch(`${API_URL}/get-puzzle?lang=${lang}&difficulty=${difficulty}`);
        
        if (!response.ok) throw new Error('AI Server Error');
        return await response.json();
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  };