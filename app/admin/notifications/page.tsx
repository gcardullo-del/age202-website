import {
  BellRing,
  ShieldCheck,
} from "lucide-react";

import PushNotificationsControl from "@/components/admin/PushNotificationsControl";

export default function AdminNotificationsPage() {
  return (
    <main className="min-h-screen bg-[#050b18] px-5 py-8 text-white sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#c8ff00]">
            AGE202 Admin
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Notifications
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
            Collega questo smartphone o browser
            al sistema di avvisi vendite AGE202.
          </p>
        </div>

        <div className="grid gap-6">
          <PushNotificationsControl />

          <section className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-emerald-300/15 bg-emerald-300/[0.06]">
                <ShieldCheck className="size-5 text-emerald-300" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Solo vendite reali
                </h2>

                <p className="mt-2 text-sm leading-7 text-white/45">
                  Il sistema invierà notifiche
                  soltanto per ordini Stripe LIVE.
                  Gli acquisti TEST restano esclusi.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
