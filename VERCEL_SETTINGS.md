# Vercel Project Settings - 404 Xatosini Hal Qilish 🔧

## ⚠️ MUHIM: To'g'ri Sozlamalar

Vercel Dashboard → Project → Settings → General → Build & Development Settings

### Framework Settings

```
Framework Preset: Vite (yoki "Other")
```

### Build & Output Settings

```
Root Directory: client
Build Command: npm run build
Output Directory: dist  ⚠️ MUHIM: "public" emas, "dist" bo'lishi kerak!
Install Command: npm install
```

## ✅ To'g'ri Sozlangan Misol

```
Framework Preset: Other
Root Directory: client
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

## ❌ Noto'g'ri Sozlamalar (404 xatosiga olib keladi)

```
❌ Output Directory: public
❌ Output Directory: .
❌ Root Directory: . (agar loyiha client papkasida bo'lsa)
```

## 🔄 Sozlamalarni O'zgartirish

1. Vercel Dashboard → Project → Settings
2. General → Build & Development Settings
3. Output Directory ni `dist` ga o'zgartiring
4. Root Directory ni `client` ga o'zgartiring (agar kerak bo'lsa)
5. "Save" tugmasini bosing
6. Yangi deploy qiling

## 📝 Environment Variables

Settings → Environment Variables bo'limiga o'ting va qo'shing:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

**Muhim:** Production, Preview va Development uchun alohida qo'shishingiz mumkin.

## 🚀 Deploy Qayta Ishga Tushirish

Sozlamalarni o'zgartirgandan keyin:

1. Deployments bo'limiga o'ting
2. "Redeploy" tugmasini bosing
3. Yoki yangi commit push qiling
