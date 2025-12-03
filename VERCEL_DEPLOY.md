# Vercel Deployment Qo'llanmasi 🚀

Bu qo'llanma A+ Academy loyihasini Vercel'ga deploy qilish uchun batafsil ko'rsatmalarni o'z ichiga oladi.

## 📋 Talablar

- Vercel hisobi (https://vercel.com)
- Supabase project (https://supabase.com)
- Git repository (GitHub, GitLab, yoki Bitbucket)

## 🔧 Deploy Qilish

### 1. Vercel Dashboard orqali

1. [Vercel Dashboard](https://vercel.com/dashboard) ga kiring
2. "Add New Project" tugmasini bosing
3. Git repository'ni ulang (GitHub, GitLab, yoki Bitbucket)
4. Project Settings'da quyidagilarni sozlang:
   - **Framework Preset:** Vite (yoki "Other" tanlang)
   - **Root Directory:** `client` ⚠️ **MUHIM:** Agar loyiha `client` papkasida bo'lsa
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist` ⚠️ **MUHIM:** `public` emas, `dist` bo'lishi kerak!
   - **Install Command:** `npm install`

**⚠️ 404 Xatosi bo'lsa:**
- Output Directory **mutlaqo** `dist` bo'lishi kerak (Vite `dist` papkasiga build qiladi)
- Root Directory `client` bo'lishi kerak (agar loyiha `client` papkasida bo'lsa)
- Framework Preset "Vite" yoki "Other" bo'lishi mumkin

### 2. Environment Variables Sozlash

Vercel Dashboard → Settings → Environment Variables bo'limiga o'ting va quyidagilarni qo'shing:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Muhim:** 
- Production, Preview va Development uchun alohida qo'shishingiz mumkin
- Production uchun Production environment'ni tanlang

### 3. Deploy

1. "Deploy" tugmasini bosing
2. Vercel avtomatik ravishda build qiladi va deploy qiladi
3. Deploy tugagach, loyiha URL'ini olasiz

## 📁 Fayl Strukturasi

```
client/
├── vercel.json          # Vercel konfiguratsiyasi
├── .vercelignore        # Deploy'da e'tiborga olinmaydigan fayllar
├── package.json         # Dependencies va scripts
├── vite.config.ts       # Vite konfiguratsiyasi
└── dist/                # Build output (avtomatik yaratiladi)
```

## ⚙️ Vercel.json Konfiguratsiyasi

`vercel.json` fayli quyidagilarni sozlaydi:

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **SPA Routing:** Barcha route'lar `index.html` ga yo'naltiriladi
- **Caching:** Static assets uchun optimal cache headers
- **Security Headers:** XSS, clickjacking va boshqa xavfsizlik sozlamalari

## 🔍 Tekshirish

Deploy qilgandan keyin quyidagilarni tekshiring:

1. ✅ Bosh sahifa yuklanayaptimi?
2. ✅ Route'lar to'g'ri ishlayaptimi? (masalan: `/courses`, `/teachers`)
3. ✅ Admin panel ishlayaptimi? (`/admin/login`)
4. ✅ Supabase ulanishi ishlayaptimi?
5. ✅ Environment variables to'g'ri sozlanganmi?

## 🐛 Muammolarni Hal Qilish

### Build Xatosi

Agar build xatosi bo'lsa:
1. Local'da `npm run build` ni ishga tushiring va xatolarni tekshiring
2. Vercel build loglarini ko'rib chiqing
3. Environment variables to'g'ri sozlanganligini tekshiring

### Route'lar Ishlamayapti (404 Xatosi)

Agar route'lar ishlamasa yoki 404 xatosi bo'lsa:

1. **Vercel Project Settings'ni tekshiring:**
   - Settings → General → Build & Development Settings
   - **Output Directory:** `dist` (mutlaqo `dist` bo'lishi kerak, `public` emas!)
   - **Root Directory:** `client` (agar loyiha `client` papkasida bo'lsa)
   - **Build Command:** `npm run build`

2. **vercel.json tekshiring:**
   - `rewrites` bo'limi mavjudligini tekshiring
   - Barcha route'lar `index.html` ga yo'naltirilishi kerak

3. **Build output'ni tekshiring:**
   - Vercel build loglarida `dist` papkasi yaratilganini tekshiring
   - `dist/index.html` fayli mavjudligini tekshiring

4. **Qayta deploy qiling:**
   - Settings o'zgargandan keyin yangi deploy qiling

### Environment Variables Ishlamayapti

Agar environment variables ishlamasa:
1. Vercel Dashboard → Settings → Environment Variables ni tekshiring
2. `VITE_` prefiksi bilan boshlanishini tekshiring
3. Deploy'ni qayta ishga tushiring (environment variables o'zgargandan keyin)

## 📝 Qo'shimcha Ma'lumot

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Supabase Documentation](https://supabase.com/docs)

## ✅ Deploy Checklist

- [ ] Git repository'ga push qilingan
- [ ] Vercel project yaratilgan
- [ ] Environment variables sozlangan
- [ ] Build command to'g'ri sozlangan
- [ ] Output directory to'g'ri sozlangan
- [ ] Deploy muvaffaqiyatli yakunlangan
- [ ] Barcha sahifalar ishlayapti
- [ ] Supabase ulanishi ishlayapti

