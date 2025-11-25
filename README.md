<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1tdHpf4bFEHHO4I5OhkU6JvyRmZYW9e7Z

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## PWA Setup (Progressive Web App)

این پروژه به عنوان PWA پیکربندی شده است و می‌تواند روی موبایل نصب شود.

### تولید آیکون‌ها

برای تولید آیکون‌های مورد نیاز:

1. فایل `public/generate-icons.html` را در مرورگر باز کنید
2. روی دکمه‌های "تولید آیکون" کلیک کنید
3. فایل‌های دانلود شده (`icon-192x192.png` و `icon-512x512.png`) را در پوشه `public` قرار دهید

یا از ابزار آنلاین [RealFaviconGenerator](https://realfavicongenerator.net) استفاده کنید.

### Build برای Production

```bash
npm run build
```

بعد از build، فایل‌های تولید شده در پوشه `dist` قرار می‌گیرند و آماده deploy هستند.

### نصب روی موبایل

1. پروژه را روی یک سرور HTTPS deploy کنید (PWA نیاز به HTTPS دارد)
2. در مرورگر موبایل، به آدرس اپلیکیشن بروید
3. گزینه "Add to Home Screen" یا "نصب" را انتخاب کنید
