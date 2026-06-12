import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

// Public client (for client-side usage)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (server-side only, bypasses RLS)
// Falls back to anon client if service role key is not set
export const supabaseAdmin = supabaseServiceKey !== 'placeholder'
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase;

// Middleware to intercept fetch calls and throw a clearer error if env vars are missing
const originalFetch = global.fetch;
if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.error("CRITICAL: NEXT_PUBLIC_SUPABASE_URL is missing! Supabase queries will fail.");
}
