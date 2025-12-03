import { createClient } from "@supabase/supabase-js";
import type {
  Course,
  Teacher,
  Application,
  Event,
  Achievement,
  Admin,
  Category,
  ContentBlock,
  SiteStat,
  Testimonial,
  GalleryItem,
  ScheduleEntry,
} from "@shared/schema";

// Supabase konfiguratsiyasi
// Bu qiymatlar environment variable'lardan olinishi kerak
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌ Supabase URL va Anon Key topilmadi!\n" +
      "Iltimos, Vercel Dashboard → Settings → Environment Variables bo'limiga o'ting va quyidagilarni qo'shing:\n" +
      "- VITE_SUPABASE_URL\n" +
      "- VITE_SUPABASE_ANON_KEY"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Re-export types from shared schema for convenience
export type {
  Course,
  Teacher,
  Application,
  Event,
  Achievement,
  Admin,
  Category,
  ContentBlock,
  SiteStat,
  Testimonial,
  GalleryItem,
  ScheduleEntry,
};
