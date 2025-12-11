import { SentenceData, Language, Difficulty } from "../types";
import { SENTENCE_CORPUS } from "../data/sentenceCorpus";

// --- Markov Chain Implementation ---

class MarkovGenerator {
    private chain: Record<string, string[]> = {};
    private startWords: string[] = [];

    constructor() {
        this.chain = {};
        this.startWords = [];
    }

    // Train the model on a list of sentences
    train(sentences: string[]) {
        this.chain = {};
        this.startWords = [];

        sentences.forEach(text => {
            // Normalize slightly but keep punctuation for now or handle it?
            // For simplicity, let's treat punctuation as part of the word or strip it.
            // Let's strip common punctuation to make "apple" and "apple." the same token.
            const cleanText = text.replace(/[.,!؟]/g, '');
            const words = cleanText.split(/\s+/).filter(w => w.length > 0);

            if (words.length === 0) return;

            this.startWords.push(words[0]);

            for (let i = 0; i < words.length - 1; i++) {
                const current = words[i];
                const next = words[i + 1];

                if (!this.chain[current]) {
                    this.chain[current] = [];
                }
                this.chain[current].push(next);
            }
        });
    }

    generate(maxWords: number = 15): string {
        if (this.startWords.length === 0) return "";

        let currentWord = this.startWords[Math.floor(Math.random() * this.startWords.length)];
        const sequence = [currentWord];

        while (sequence.length < maxWords) {
            const nextOptions = this.chain[currentWord];

            if (!nextOptions || nextOptions.length === 0) {
                break; // End of chain
            }

            // Pick next word
            const nextWord = nextOptions[Math.floor(Math.random() * nextOptions.length)];
            sequence.push(nextWord);
            currentWord = nextWord;

            // Randomly stop if we have enough words (to vary length)
            // but prefer to go on a bit unless it's a "natural" end (which we don't track explicitly here)
            // For now, just run until dead end or maxWords.
        }

        return sequence.join(' ');
    }
}

// --- Feature Extraction & Classification (Kept for validation) ---

const analyzeSentenceFeatures = (text: string) => {
    const words = text.split(' ');
    const wordCount = words.length;
    const avgWordLength = words.reduce((acc, w) => acc + w.length, 0) / wordCount;

    return {
        wordCount,
        avgWordLength,
        complexityScore: (wordCount * 1) + (avgWordLength * 2)
    };
};

const classifyDifficulty = (text: string): Difficulty => {
    const { wordCount, complexityScore } = analyzeSentenceFeatures(text);

    if (wordCount <= 4 || complexityScore < 10) return 'easy';
    if (wordCount <= 7 || complexityScore < 18) return 'medium';
    return 'hard';
};

// --- Service Logic ---

// Cache generators per language to avoid retraining every call
const generators: Record<string, MarkovGenerator> = {
    'en': new MarkovGenerator(),
    'fa': new MarkovGenerator()
};

let isTrained = false;

const ensureTrained = () => {
    if (isTrained) return;

    const enSentences = SENTENCE_CORPUS.filter(s => s.language === 'en').map(s => s.text);
    const faSentences = SENTENCE_CORPUS.filter(s => s.language === 'fa').map(s => s.text);

    generators['en'].train(enSentences);
    generators['fa'].train(faSentences);

    isTrained = true;
};

export const generateGameLevel = async (difficulty: Difficulty, language: Language): Promise<SentenceData> => {
    ensureTrained();

    const generator = generators[language];
    let candidateSentence = "";
    let attempts = 0;
    const MAX_ATTEMPTS = 20;

    // Try to generate a sentence that matches the requested difficulty
    while (attempts < MAX_ATTEMPTS) {
        // Generate a new sentence
        const generated = generator.generate();

        // Check if it's valid (not empty)
        if (generated.length > 0) {
            // Check difficulty
            const classifiedDiff = classifyDifficulty(generated);

            // Allow some flexibility: 
            // If we want 'medium', we accept 'medium' or 'hard' (if it's not too crazy)
            // Actually, let's try to match exactly first.
            if (classifiedDiff === difficulty) {
                candidateSentence = generated;
                break;
            }
        }
        attempts++;
    }

    // Fallback: If generation failed to produce a matching difficulty, pick one from corpus
    if (!candidateSentence) {
        console.warn(`Local AI failed to generate ${difficulty} sentence after ${MAX_ATTEMPTS} attempts. Using fallback.`);
        const fallbackPool = SENTENCE_CORPUS.filter(s => s.language === language && classifyDifficulty(s.text) === difficulty);
        // If even fallback is empty (rare), use any from language
        const finalPool = fallbackPool.length > 0 ? fallbackPool : SENTENCE_CORPUS.filter(s => s.language === language);
        const selected = finalPool[Math.floor(Math.random() * finalPool.length)];
        candidateSentence = selected.text;
    }

    // Tokenization for the game
    // We strip punctuation for the "blocks" but keep the full sentence as "correctSentence"
    const cleanText = candidateSentence.replace(/[.,!؟]/g, '');
    const words = cleanText.split(/\s+/).filter(w => w.length > 0);

    return {
        id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        correctSentence: candidateSentence,
        words: words
    };
};

export const generateSpeech = async (_text: string): Promise<string | null> => {
    // Return null to use browser TTS
    return null;
};

export const speakLocal = (text: string, language: Language) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'fa' ? 'fa-IR' : 'en-US';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
};
