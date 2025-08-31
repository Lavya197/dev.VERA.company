// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Use only NEXT_PUBLIC keys here (safe for client)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
