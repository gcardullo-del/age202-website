import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Variabile NEXT_PUBLIC_SUPABASE_URL mancante nel file .env.local"
    );
  }

  if (!supabasePublishableKey) {
    throw new Error(
      "Variabile NEXT_PUBLIC_SUPABASE_ANON_KEY mancante nel file .env.local"
    );
  }

  return createBrowserClient(
    supabaseUrl,
    supabasePublishableKey
  );
}