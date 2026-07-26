"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CertificateLookupForm() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode) {
      return;
    }

    router.push(`/certificate/${encodeURIComponent(normalizedCode)}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 flex flex-col gap-4 sm:flex-row"
    >
      <label className="sr-only" htmlFor="certificate-code">
        Certificate code
      </label>

      <input
        id="certificate-code"
        name="certificate-code"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        placeholder="AGE202-0001"
        autoComplete="off"
        spellCheck={false}
        className="min-h-16 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-7 font-mono text-sm font-bold uppercase tracking-[0.12em] text-white outline-none transition-colors placeholder:text-white/22 focus:border-[#C8FF00]/55"
      />

      <button
        type="submit"
        className="min-h-16 rounded-full bg-[#C8FF00] px-8 text-[10px] font-black uppercase tracking-[0.26em] text-black transition-transform hover:scale-[1.02]"
      >
        Verify certificate
      </button>
    </form>
  );
}
