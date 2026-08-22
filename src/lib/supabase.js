import { createClient } from '@supabase/supabase-js';

// Fallback to hardcoded values for Vercel zip deployment.
// The anon key is safe to expose (it's a public read key protected by Supabase RLS).
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://wicmrtvumrovpjiwuash.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpY21ydHZ1bXJvdnBqaXd1YXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3OTAwODQsImV4cCI6MjEwMjM2NjA4NH0.zinB9VBZ-GEWsfkQk8QAIk1Z_Jatd5CV0SJzpM_i56I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
