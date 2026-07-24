import { createClient } from "@/lib/supabase/server";

export default async function TestPage() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("_healthcheck")
      .select("*");

    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="rounded-xl border p-8">
          <h1 className="text-2xl font-bold mb-4">
            ✅ Supabase Connected
          </h1>

          <pre className="text-sm">
            {JSON.stringify({ data, error }, null, 2)}
          </pre>
        </div>
      </main>
    );
  } catch (e) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="rounded-xl border p-8 text-red-600">
          <h1 className="text-2xl font-bold">
            Connection Error
          </h1>

          <pre className="mt-4">
            {String(e)}
          </pre>
        </div>
      </main>
    );
  }
}