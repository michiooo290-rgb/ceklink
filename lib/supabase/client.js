import { createBrowserClient } from "@supabase/ssr";

/**
 * Dipakai di Client Component (yang ada "use client" di atasnya),
 * contoh: form login/signup, tombol logout, dsb.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}