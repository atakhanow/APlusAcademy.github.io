# Vercel Avtomatik Sozlash Qo'llanmasi 🚀

Bu qo'llanma Vercel'ni avtomatik sozlash uchun barcha kerakli ko'rsatmalarni o'z ichiga oladi.

## 📋 Usullar

### Usul 1: Vercel CLI orqali (Tavsiya etiladi) ⚡

#### 1. Vercel CLI o'rnatish

```bash
npm i -g vercel
```

#### 2. Vercel'ga login qilish

```bash
vercel login
```

#### 3. Project'ni ulash

```bash
vercel link
```

#### 4. Environment Variables sozlash

**Windows (PowerShell):**

```powershell
.\vercel-setup.ps1
```

**Linux/Mac (Bash):**

```bash
chmod +x vercel-setup.sh
./vercel-setup.sh
```

Yoki qo'lda:

```bash
# Production
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

# Preview
vercel env add VITE_SUPABASE_URL preview
vercel env add VITE_SUPABASE_ANON_KEY preview

# Development
vercel env add VITE_SUPABASE_URL development
vercel env add VITE_SUPABASE_ANON_KEY development
```

#### 5. Deploy qilish

```bash
vercel --prod
```

---

### Usul 2: Vercel Dashboard orqali 🌐

#### 1. Environment Variables sozlash

1. [Vercel Dashboard](https://vercel.com/dashboard) ga kiring
2. Project'ni tanlang
3. **Settings** → **Environment Variables**
4. Quyidagilarni qo'shing:

**Production:**

```
VITE_SUPABASE_URL = your_supabase_url
VITE_SUPABASE_ANON_KEY = your_anon_key
```

**Preview:**

```
VITE_SUPABASE_URL = your_supabase_url
VITE_SUPABASE_ANON_KEY = your_anon_key
```

**Development:**

```
VITE_SUPABASE_URL = your_supabase_url
VITE_SUPABASE_ANON_KEY = your_anon_key
```

#### 2. Project Settings

**Settings** → **General** → **Build & Development Settings:**

```
Framework Preset: Vite
Root Directory: . (root)
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### 3. Deploy

Git'ga push qiling yoki **Deployments** → **Redeploy**

---

### Usul 3: Git Integration orqali 🔗

1. GitHub/GitLab repository'ni Vercel'ga ulang
2. Vercel avtomatik detect qiladi
3. Environment Variables'ni Dashboard'da sozlang
4. Avtomatik deploy bo'ladi

---

## ⚙️ Avtomatik Sozlamalar

Quyidagi fayllar avtomatik sozlanadi:

- ✅ `vercel.json` - Routing va headers
- ✅ `vite.config.ts` - Build konfiguratsiyasi
- ✅ `.vercelignore` - Deploy'da e'tiborga olinmaydigan fayllar
- ✅ `.env.example` - Environment variables namunasi

## 🔍 Tekshirish

Deploy qilgandan keyin:

1. **Browser Console** (F12) - Xatolarni tekshiring
2. **Network Tab** - Asset'lar yuklanayaptimi?
3. **Vercel Logs** - Build va runtime loglar

## 🐛 Muammolarni Hal Qilish

### Environment Variables ishlamayapti

```bash
# Tekshirish
vercel env ls

# Qayta qo'shish
vercel env rm VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_URL production
```

### Build Xatosi

```bash
# Local'da test
npm run build

# Vercel loglarini ko'rish
vercel logs
```

### 404 Xatosi

- `vercel.json` da `rewrites` to'g'ri sozlanganligini tekshiring
- Output Directory `dist` bo'lishi kerak

## 📝 Checklist

- [ ] Vercel CLI o'rnatilgan
- [ ] Vercel'ga login qilingan
- [ ] Project ulangan (`vercel link`)
- [ ] Environment Variables sozlangan
- [ ] Project Settings to'g'ri
- [ ] Build muvaffaqiyatli
- [ ] Deploy muvaffaqiyatli
- [ ] Sayt ishlayapti

## 🔗 Foydali Linklar

- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
