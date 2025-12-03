#!/bin/bash

# Vercel Environment Variables Setup Script
# Bu script Vercel CLI orqali environment variables'ni sozlash uchun

echo "🚀 Vercel Environment Variables Setup"
echo "======================================"
echo ""

# Supabase URL ni so'ra
read -p "Supabase Project URL ni kiriting: " SUPABASE_URL

# Supabase Anon Key ni so'ra
read -p "Supabase Anon Key ni kiriting: " SUPABASE_ANON_KEY

echo ""
echo "📝 Environment Variables sozlanmoqda..."

# Vercel CLI orqali environment variables qo'shish
vercel env add VITE_SUPABASE_URL production <<< "$SUPABASE_URL"
vercel env add VITE_SUPABASE_URL preview <<< "$SUPABASE_URL"
vercel env add VITE_SUPABASE_URL development <<< "$SUPABASE_URL"

vercel env add VITE_SUPABASE_ANON_KEY production <<< "$SUPABASE_ANON_KEY"
vercel env add VITE_SUPABASE_ANON_KEY preview <<< "$SUPABASE_ANON_KEY"
vercel env add VITE_SUPABASE_ANON_KEY development <<< "$SUPABASE_ANON_KEY"

echo ""
echo "✅ Environment Variables muvaffaqiyatli sozlandi!"
echo ""
echo "📋 Keyingi qadamlar:"
echo "1. Yangi deploy qiling: vercel --prod"
echo "2. Yoki Git'ga push qiling va Vercel avtomatik deploy qiladi"

