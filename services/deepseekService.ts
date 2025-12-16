import OpenAI from 'openai';
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

const getRandomFallback = (language: Language): SentenceData => {
    const list = FALLBACK_SENTENCES[language];
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
};

export const generateGameLevel = async (difficulty: Difficulty, language: Language): Promise<SentenceData> => {
    try {
        const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
        if (!apiKey) {
            console.warn("DeepSeek API Key missing, using fallback data.");
            return getRandomFallback(language);
        }

        const openai = new OpenAI({
            baseURL: '/api/deepseek',
            apiKey: apiKey,
            dangerouslyAllowBrowser: true
        });

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
    Example (if English): "I go to school" -> ["I", "go", "to", "school"]
    
    Return ONLY a JSON object with this structure:
    {
      "id": "unique_id",
      "correctSentence": "full sentence",
      "words": ["word1", "word2", ...]
    }`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "deepseek-chat",
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("No response from AI");

        const data = JSON.parse(content) as SentenceData;
        if (!data.id) data.id = Math.random().toString(36).substr(2, 9);

        return data;

    } catch (error) {
        console.error("DeepSeek API Error:", error);
        return getRandomFallback(language);
    }
};
