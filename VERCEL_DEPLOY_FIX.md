# Vercel Deploy - Oq Ekran Muammosini Hal Qilish 🔧

## ⚠️ Muammo: Oq Ekran

Vercel'ga deploy qilganda oq ekran ko'rinadi.

## 🔍 Asosiy Sabablar

1. **Environment Variables sozlanmagan** (eng keng tarqalgan)
2. JavaScript xatolari
3. Asset path muammolari

## ✅ Hal Qilish

### 1. Environment Variables Sozlash (MUHIM!)

Vercel Dashboard → Project → Settings → Environment Variables

Quyidagilarni **Production, Preview va Development** uchun qo'shing:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**⚠️ MUHIM:**

- `VITE_` prefiksi **majburiy**!
- Har bir environment uchun alohida qo'shing
- Deploy'ni qayta ishga tushiring

### 2. Vercel Project Settings

Settings → General → Build & Development Settings:

```
Framework Preset: Vite (yoki Other)
Root Directory: . (root papka)
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 3. Browser Console'ni Tekshirish

1. Vercel'da deploy qilingan saytni oching
2. F12 bosing (Developer Tools)
3. Console tab'ini oching
4. Qizil xatolarni ko'ring

**Keng tarqalgan xatolar:**

- `Failed to fetch` - Environment variables sozlanmagan
- `Cannot read property...` - JavaScript xatosi
- `404` - Asset topilmadi

### 4. Build Loglarini Tekshirish

Vercel Dashboard → Deployments → Eng so'nggi deploy → Build Logs

Build muvaffaqiyatli bo'lishi kerak. Agar xatolar bo'lsa, ularni hal qiling.

### 5. Local Build Test

Local'da build qilib tekshiring:

```bash
npm run build
npm run preview
```

Agar local'da ishlamasa, Vercel'da ham ishlamaydi.

## 🐛 Debug Qilish

### Browser Console'da Quyidagilarni Tekshiring:

```javascript
// Environment variables tekshirish
console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
console.log(
  "VITE_SUPABASE_ANON_KEY:",
  import.meta.env.VITE_SUPABASE_ANON_KEY ? "Mavjud" : "Yo'q"
);
```

Agar `undefined` ko'rsatilsa, environment variables sozlanmagan.

### Network Tab'ni Tekshirish

1. F12 → Network tab
2. Sahifani yangilang
3. Qizil (failed) request'larni ko'ring
4. Asset'lar (JS, CSS) yuklanayaptimi?

## ✅ Checklist

Deploy qilishdan oldin:

- [ ] Environment variables Vercel'da sozlangan
- [ ] `VITE_` prefiksi bilan boshlanadi
- [ ] Production, Preview va Development uchun qo'shilgan
- [ ] Local build muvaffaqiyatli (`npm run build`)
- [ ] Build loglarida xatolar yo'q
- [ ] Browser console'da xatolar yo'q
- [ ] Network tab'da asset'lar yuklanayapti

## 📝 Qo'shimcha

Agar muammo hal bo'lmasa:

1. **Error Boundary** qo'shildi - xatolarni ko'rsatadi
2. **Console loglar** - environment variables tekshirish uchun
3. **Vercel.json** - SPA routing uchun to'g'ri sozlangan

## 🔗 Foydali Linklar

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
