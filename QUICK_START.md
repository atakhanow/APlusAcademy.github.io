# Vercel Deploy - Tezkor Boshlash 🚀

## ⚡ Eng Tez Usul (5 daqiqa)

### 1. Vercel CLI o'rnatish va Login

```bash
npm i -g vercel
vercel login
```

### 2. Project'ni Ulash

```bash
vercel link
```

### 3. Environment Variables Sozlash

**Windows:**

```powershell
.\vercel-setup.ps1
```

**Linux/Mac:**

```bash
chmod +x vercel-setup.sh
./vercel-setup.sh
```

### 4. Deploy!

```bash
npm run vercel:deploy
```

Yoki:

```bash
vercel --prod
```

---

## 📋 Batafsil Qo'llanma

Batafsil ko'rsatmalar uchun **`VERCEL_AUTO_SETUP.md`** faylini ko'ring.

---

## ✅ Tekshirish

Deploy qilgandan keyin:

1. Vercel URL'ini oching
2. F12 → Console - Xatolarni tekshiring
3. Agar oq ekran bo'lsa → Environment Variables tekshiring

---

## 🆘 Yordam

- **VERCEL_AUTO_SETUP.md** - To'liq qo'llanma
- **VERCEL_DEPLOY_FIX.md** - Muammolarni hal qilish
