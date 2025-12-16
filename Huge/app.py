import uvicorn
import os
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline, set_seed
import random
import re

app = FastAPI()

# تنظیمات CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("--- STARTING SERVER ---")
print("Loading Models...")

# تنظیم سید تصادفی
set_seed(random.randint(0, 10000))

# لود مدل‌ها (اینجا مدل‌ها در کش ذخیره می‌شوند)
fa_generator = pipeline('text-generation', model='HooshvareLab/gpt2-fa')
en_generator = pipeline('text-generation', model='gpt2')
print("--- MODELS READY ---")

def clean_and_validate(text, lang, min_len, max_len):
    # 1. حذف کاراکترهای مزاحم
    text = text.replace('\n', ' ').replace('\r', '').strip()
    
    # 2. رد کردن جملات دارای پرانتز و کروشه
    if re.search(r'[(){}\[\]<>]', text):
        return None

    # 3. بریدن جمله تا اولین پایان‌بندی
    endings = ['.', '!', '?', '؟', '!']
    best_end_index = -1
    for char in endings:
        idx = text.find(char)
        if idx != -1:
            if best_end_index == -1 or idx < best_end_index:
                best_end_index = idx
    
    if best_end_index != -1:
        text = text[:best_end_index+1]
    
    # 4. چک کردن طول
    words = text.split()
    if len(words) < min_len or len(words) > max_len:
        return None
        
    return text

def generate_sentence(lang: str, difficulty: str):
    # تنظیم طول بر اساس سختی
    if difficulty == 'easy':
        min_len, max_len = 4, 8
    elif difficulty == 'medium':
        min_len, max_len = 8, 15
    else: 
        min_len, max_len = 12, 25

    # تنظیمات مدل
    if lang == 'en' or lang == 'english':
        generator = en_generator
        starters = ["The cat is", "I want to", "She can read", "We go to", "Life is"]
    else:
        generator = fa_generator
        starters = ["من در مدرسه", "آسمان آبی", "دانش‌آموزان خوب", "ما باید به", "کتاب خواندن"]

    prompt = random.choice(starters)

    try:
        candidates = generator(
            prompt,
            max_length=max_len + 10,
            min_length=min_len,
            num_return_sequences=5,
            temperature=0.7,
            top_k=50,
            do_sample=True,
            pad_token_id=50256
        )

        valid_sentence = None
        
        for cand in candidates:
            raw_text = cand['generated_text']
            cleaned = clean_and_validate(raw_text, lang, min_len, max_len)
            if cleaned:
                valid_sentence = cleaned
                break
        
        if not valid_sentence:
            if lang == 'fa':
                backup_list = ["زندگی مانند یک سفر است.", "من عاشق یادگیری هستم.", "هوا امروز عالی است."]
            else:
                backup_list = ["Learning is fun.", "The sky is very blue.", "I like to play games."]
            valid_sentence = random.choice(backup_list)

        words = valid_sentence.split()
        original_sentence = " ".join(words)
        shuffled_words = words.copy()
        random.shuffle(shuffled_words)

        return {
            "original": original_sentence,
            "scrambled": shuffled_words,
            "lang": lang,
            "difficulty": difficulty
        }

    except Exception as e:
        print(f"Error: {e}")
        return {"original": "Error", "scrambled": ["Error"], "lang": lang}

@app.get("/get-puzzle")
async def get_puzzle(
    lang: str = Query('fa'), 
    difficulty: str = Query('easy')
):
    return generate_sentence(lang, difficulty)

@app.get("/")
async def root():
    return {"message": "AI Sentence Generator is Running!"}

# --- بخش اجرایی سرور ---
if __name__ == "__main__":
    # اجرای سرور روی پورت 7860 (مخصوص Hugging Face)
    uvicorn.run(app, host="0.0.0.0", port=7860)