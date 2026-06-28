import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

/**
 * Setelah user login via Google, Supabase redirect ke sini dengan
 * sebuah "code" di query param. Kita tukar code itu jadi session login.
 */
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Kalau gagal, lempar balik ke halaman login dengan pesan error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}