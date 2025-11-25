# تولید آیکون‌های PWA

برای تولید آیکون‌های مورد نیاز:

## روش 1: استفاده از فایل HTML
1. فایل public/generate-icons.html را در مرورگر باز کنید
2. روی دکمه‌های "تولید آیکون" کلیک کنید
3. فایل‌های دانلود شده را در پوشه public قرار دهید

## روش 2: استفاده از ابزار آنلاین
1. به https://realfavicongenerator.net بروید
2. آیکون خود را آپلود کنید
3. آیکون‌های 192x192 و 512x512 را دانلود کنید
4. آنها را در پوشه public با نام‌های زیر قرار دهید:
   - icon-192x192.png
   - icon-512x512.png

## روش 3: استفاده از ImageMagick (اگر نصب شده)
```bash
convert public/icon.svg -resize 192x192 public/icon-192x192.png
convert public/icon.svg -resize 512x512 public/icon-512x512.png
```
