import { createClient } from "@supabase/supabase-js";

// Add these to a .env file in your project root (see .env.example)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If the keys are missing, `supabase` is null and the shop falls back
// to the sample laptops inside App.jsx, so the site never breaks.
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
