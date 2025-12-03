import { createClient } from '@supabase/supabase-js';
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
} from '@shared/schema';

// Supabase konfiguratsiyasi
// Bu qiymatlar environment variable'lardan olinishi kerak
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL va Anon Key topilmadi. ' +
    'Iltimos, .env faylida VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY ni belgilang.'
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

