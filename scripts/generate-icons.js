// Script to generate PWA icons
// Run with: node scripts/generate-icons.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a simple script that uses canvas if available, otherwise provides instructions
const sizes = [192, 512];

console.log('برای تولید آیکون‌های PWA:');
console.log('1. فایل public/generate-icons.html را در مرورگر باز کنید');
console.log('2. روی دکمه‌های تولید آیکون کلیک کنید');
console.log('3. فایل‌های دانلود شده را در پوشه public قرار دهید');
console.log('\nیا از یک ابزار آنلاین مانند https://realfavicongenerator.net استفاده کنید');

// Create placeholder instructions file
const instructions = `# تولید آیکون‌های PWA

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
\`\`\`bash
convert public/icon.svg -resize 192x192 public/icon-192x192.png
convert public/icon.svg -resize 512x512 public/icon-512x512.png
\`\`\`
`;

fs.writeFileSync(path.join(__dirname, '../ICON_INSTRUCTIONS.md'), instructions);
console.log('\n✓ فایل راهنمای ICON_INSTRUCTIONS.md ایجاد شد');

