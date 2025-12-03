# Vercel Environment Variables Setup Script (PowerShell)
# Bu script Vercel CLI orqali environment variables'ni sozlash uchun

Write-Host "🚀 Vercel Environment Variables Setup" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Supabase URL ni so'ra
$SUPABASE_URL = Read-Host "Supabase Project URL ni kiriting"

# Supabase Anon Key ni so'ra
$SUPABASE_ANON_KEY = Read-Host "Supabase Anon Key ni kiriting"

Write-Host ""
Write-Host "📝 Environment Variables sozlanmoqda..." -ForegroundColor Yellow

# Vercel CLI orqali environment variables qo'shish
Write-Host "Production environment uchun..." -ForegroundColor Green
echo $SUPABASE_URL | vercel env add VITE_SUPABASE_URL production
echo $SUPABASE_ANON_KEY | vercel env add VITE_SUPABASE_ANON_KEY production

Write-Host "Preview environment uchun..." -ForegroundColor Green
echo $SUPABASE_URL | vercel env add VITE_SUPABASE_URL preview
echo $SUPABASE_ANON_KEY | vercel env add VITE_SUPABASE_ANON_KEY preview

Write-Host "Development environment uchun..." -ForegroundColor Green
echo $SUPABASE_URL | vercel env add VITE_SUPABASE_URL development
echo $SUPABASE_ANON_KEY | vercel env add VITE_SUPABASE_ANON_KEY development

Write-Host ""
Write-Host "✅ Environment Variables muvaffaqiyatli sozlandi!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Keyingi qadamlar:" -ForegroundColor Cyan
Write-Host "1. Yangi deploy qiling: vercel --prod"
Write-Host "2. Yoki Git'ga push qiling va Vercel avtomatik deploy qiladi"

