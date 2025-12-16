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
print("Loading Models (This creates logic)...")

# تنظیم سید تصادفی برای تنوع بیشتر
set_seed(random.randint(0, 10000))

# لود مدل‌ها
fa_generator = pipeline('text-generation', model='HooshvareLab/gpt2-fa')
en_generator = pipeline('text-generation', model='gpt2')
print("--- MODELS READY ---")

def clean_and_validate(text, lang, min_len, max_len):
    """
    این تابع متن را تمیز می‌کند و چک می‌کند آیا منطقی است یا خیر.
    """
    # 1. حذف کاراکترهای مزاحم و خط جدید
    text = text.replace('\n', ' ').replace('\r', '').strip()
    
    # 2. اگر پرانتز، کروشه یا علائم عجیب دارد، کلا ردش کن
    if re.search(r'[(){}\[\]<>]', text):
        return None

    # 3. بریدن جمله تا اولین نقطه، علامت سوال یا تعجب
    # این کار باعث می‌شود جمله ناقص نماند
    endings = ['.', '!', '?', '؟', '!']
    best_end_index = -1
    for char in endings:
        idx = text.find(char)
        if idx != -1:
            if best_end_index == -1 or idx < best_end_index:
                best_end_index = idx
    
    # اگر هیچ پایان‌بندی نداشت، ریسک نکن و ردش کن (مگر اینکه خیلی کوتاه باشد)
    if best_end_index != -1:
        text = text[:best_end_index+1]
    
    # 4. چک کردن طول جمله (تعداد کلمات)
    words = text.split()
    if len(words) < min_len or len(words) > max_len:
        return None
        
    return text

def generate_sentence(lang: str, difficulty: str):
    print(f">> Request: Lang={lang}, Diff={difficulty}")
    
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
        # پرامپت‌هایی که حتما به فعل ختم می‌شوند
        starters = ["The cat is", "I want to", "She can read", "We go to", "Life is"]
    else:
        generator = fa_generator
        # در فارسی سعی می‌کنیم فاعل و مفعول را بدهیم تا مدل مجبور شود فعل بیاورد
        starters = ["من در مدرسه", "آسمان آبی", "دانش‌آموزان خوب", "ما باید به", "کتاب خواندن"]

    prompt = random.choice(starters)

    try:
        # **تکنیک مهم:** تولید 5 گزینه همزمان
        candidates = generator(
            prompt,
            max_length=max_len + 10, # کمی بیشتر تولید کن تا جا برای بریدن باشد
            min_length=min_len,
            num_return_sequences=5,  # 5 تا بساز، بهترین را انتخاب می‌کنیم
            temperature=0.7,
            top_k=50,
            do_sample=True,
            pad_token_id=50256
        )

        valid_sentence = None
        
        # بررسی کاندیداها
        for cand in candidates:
            raw_text = cand['generated_text']
            cleaned = clean_and_validate(raw_text, lang, min_len, max_len)
            if cleaned:
                valid_sentence = cleaned
                break # اولین جمله سالم را پیدا کردیم
        
        # اگر هیچکدام سالم نبودند (Fallback)
        if not valid_sentence:
            print("Warning: AI failed to generate valid text. Using backup.")
            if lang == 'fa':
                backup_list = ["زندگی مانند یک سفر است.", "من عاشق یادگیری هستم.", "هوا امروز عالی است."]
            else:
                backup_list = ["Learning is fun.", "The sky is very blue.", "I like to play games."]
            valid_sentence = random.choice(backup_list)

        # پردازش نهایی برای ارسال به بازی
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
        print(f"Critical Error: {e}")
        return {"original": "Error", "scrambled": ["Error"], "lang": lang}

@app.get("/get-puzzle")
async def get_puzzle(
    lang: str = Query('fa'), 
    difficulty: str = Query('easy')
):
    return generate_sentence(lang, difficulty)