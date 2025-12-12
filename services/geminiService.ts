import { GoogleGenAI, Type } from "@google/genai";
import { SentenceData, Language, Difficulty } from "../types";

// Fallback data
const FALLBACK_SENTENCES: Record<Language, SentenceData[]> = {
  fa: [
    { id: "fb_fa_1", correctSentence: "من سیب می‌خورم", words: ["من", "سیب", "می‌خورم"] },
    { id: "fb_fa_2", correctSentence: "امروز هوا آفتابی است", words: ["امروز", "هوا", "آفتابی", "است"] },
    { id: "fb_fa_3", correctSentence: "دوست من مهربان است", words: ["دوست", "من", "مهربان", "است"] }
  ],
  en: [
    { id: "fb_en_1", correctSentence: "I eat an apple", words: ["I", "eat", "an", "apple"] },
    { id: "fb_en_2", correctSentence: "The sky is blue", words: ["The", "sky", "is", "blue"] },
    { id: "fb_en_3", correctSentence: "She likes to read books", words: ["She", "likes", "to", "read", "books"] }
  ]
};

export const generateGameLevel = async (difficulty: Difficulty, language: Language): Promise<SentenceData> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API Key missing, using fallback data.");
      return getRandomFallback(language);
    }

    const ai = new GoogleGenAI({ apiKey });
    
    let difficultyPrompt = "";
    switch (difficulty) {
      case 'easy': difficultyPrompt = "very simple, short (3-4 words)"; break;
      case 'medium': difficultyPrompt = "moderate length (5-7 words), maybe one adjective"; break;
      case 'hard': difficultyPrompt = "complex structure, longer (8+ words) or using abstract concepts"; break;
    }

    const langName = language === 'fa' ? "Persian" : "English";
    
    const prompt = `Generate a single ${difficultyPrompt} ${langName} sentence suitable for a language learning game. 
    Split it into logical word blocks.
    Example (if Persian): "من به مدرسه می‌روم" -> ["من", "به", "مدرسه", "می‌روم"]
    Example (if English): "I go to school" -> ["I", "go", "to", "school"]`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            correctSentence: { type: Type.STRING, description: `The full correct sentence in ${langName}` },
            words: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Array of words forming the sentence in the correct order"
            }
          },
          required: ["correctSentence", "words"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text) as SentenceData;
    if (!data.id) data.id = Math.random().toString(36).substr(2, 9);
    
    return data;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return getRandomFallback(language);
  }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: {
        parts: [{ text: text.trim() }] 
      },
      config: {
        responseModalities: ['AUDIO'] as any, // Using string literal to avoid runtime enum issues
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' }, // Puck often works well for general usage
          },
        },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return audioData || null;

  } catch (error) {
    console.error("Gemini TTS Error:", error);
    return null;
  }
};

const getRandomFallback = (language: Language): SentenceData => {
  const list = FALLBACK_SENTENCES[language];
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
};