"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  createClient,
} from "@/lib/supabase/client";


const ADMIN_EMAIL =
  "g.cardullo@gmail.com";


export default function AdminLoginPage() {
  const router =
    useRouter();

  const [email, setEmail] =
    useState(ADMIN_EMAIL);

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isCheckingSession, setIsCheckingSession] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);


  useEffect(() => {
    let active = true;

    async function checkExistingSession() {
      const supabase =
        createClient();

      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

      if (!active) {
        return;
      }

      if (
        user?.email?.toLowerCase() ===
        ADMIN_EMAIL.toLowerCase()
      ) {
        router.replace("/admin");
        router.refresh();

        return;
      }

      if (user) {
        await supabase.auth.signOut();
      }

      setIsCheckingSession(false);
    }

    void checkExistingSession();

    return () => {
      active = false;
    };
  }, [router]);


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage(null);

    const normalizedEmail =
      email.trim().toLowerCase();

    if (
      normalizedEmail !==
      ADMIN_EMAIL.toLowerCase()
    ) {
      setErrorMessage(
        "This account is not authorized for the AGE202 Museum Admin.",
      );

      return;
    }

    if (!password) {
      setErrorMessage(
        "Enter your password to continue.",
      );

      return;
    }

    setIsSubmitting(true);

    try {
      const supabase =
        createClient();

      const {
        data,
        error,
      } =
        await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

      if (
        error ||
        !data.user
      ) {
        setErrorMessage(
          "Invalid email or password.",
        );

        return;
      }

      if (
        data.user.email?.toLowerCase() !==
        ADMIN_EMAIL.toLowerCase()
      ) {
        await supabase.auth.signOut();

        setErrorMessage(
          "This account is not authorized for the AGE202 Museum Admin.",
        );

        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setErrorMessage(
        "Unable to connect to the authentication service. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050B18] px-6 py-12 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(204,255,0,.12),transparent_32%),radial-gradient(circle_at_10%_100%,rgba(59,130,246,.08),transparent_30%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-[#ccff00]/25 bg-[#ccff00]/[.06] shadow-[0_0_50px_rgba(204,255,0,.08)]">
            <ShieldCheck
              className="h-7 w-7 text-[#ccff00]"
              strokeWidth={1.5}
            />
          </div>

          <p className="mt-6 text-[10px] font-black uppercase tracking-[.32em] text-[#ccff00]">
            AGE202 Museum Admin
          </p>

          <h1 className="mt-3 text-4xl font-black uppercase tracking-[-.05em]">
            Secure Access
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/40">
            Sign in to manage the AGE202 digital museum archive.
          </p>
        </div>


        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#08101f]/90 p-6 shadow-[0_30px_100px_rgba(0,0,0,.4)] backdrop-blur-xl sm:p-8">
          {isCheckingSession ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#ccff00]" />

              <p className="mt-4 text-[9px] font-black uppercase tracking-[.22em] text-white/30">
                Checking secure session
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-2 block text-[9px] font-black uppercase tracking-[.22em] text-white/40"
                >
                  Administrator email
                </label>

                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => {
                    setEmail(
                      event.target.value,
                    );
                  }}
                  disabled={isSubmitting}
                  className="h-13 w-full rounded-2xl border border-white/10 bg-[#050B18] px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#ccff00]/50 focus:ring-2 focus:ring-[#ccff00]/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>


              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-2 block text-[9px] font-black uppercase tracking-[.22em] text-white/40"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

                  <input
                    id="admin-password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => {
                      setPassword(
                        event.target.value,
                      );
                    }}
                    disabled={isSubmitting}
                    className="h-13 w-full rounded-2xl border border-white/10 bg-[#050B18] pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#ccff00]/50 focus:ring-2 focus:ring-[#ccff00]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    onClick={() => {
                      setShowPassword(
                        (current) =>
                          !current,
                      );
                    }}
                    disabled={isSubmitting}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>


              {errorMessage ? (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-400/20 bg-red-400/[.06] px-4 py-3 text-sm leading-6 text-red-200"
                >
                  {errorMessage}
                </div>
              ) : null}


              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex h-13 w-full items-center justify-center gap-3 rounded-2xl bg-[#ccff00] px-5 text-[10px] font-black uppercase tracking-[.2em] text-[#050B18] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Authenticating
                  </>
                ) : (
                  <>
                    Enter Museum Admin
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          )}


          <div className="mt-7 border-t border-white/[.07] pt-5">
            <div className="flex items-center justify-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,.75)]" />

              <p className="text-[8px] font-black uppercase tracking-[.2em] text-white/25">
                Protected by AGE202 secure authentication
              </p>
            </div>
          </div>
        </div>


        <p className="mt-6 text-center font-mono text-[8px] uppercase tracking-[.18em] text-white/15">
          AGE202 / Museum Administration System
        </p>
      </div>
    </main>
  );
}