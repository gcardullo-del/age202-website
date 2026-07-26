import { createClient } from "@/lib/supabase/server";

type ConnectionResult =
  | { ok: true; data: unknown; error: unknown }
  | { ok: false; error: string };

async function checkSupabaseConnection(): Promise<ConnectionResult> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("_healthcheck").select("*");

    return { ok: true, data, error };
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}

export default async function TestPage() {
  const result = await checkSupabaseConnection();

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div
        className={`rounded-xl border p-8 ${result.ok ? "" : "text-red-600"}`}
      >
        <h1 className="mb-4 text-2xl font-bold">
          {result.ok ? "✅ Supabase Connected" : "Connection Error"}
        </h1>

        <pre className="text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    </main>
  );
}
