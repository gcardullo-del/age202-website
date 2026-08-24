"use client";

import {
  Bell,
  BellOff,
  CheckCircle2,
  Loader2,
  Smartphone,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

type PushState =
  | "loading"
  | "unsupported"
  | "denied"
  | "inactive"
  | "active"
  | "working"
  | "error";

function urlBase64ToUint8Array(
  base64String: string,
) {
  const padding = "=".repeat(
    (4 - (base64String.length % 4)) % 4,
  );

  const base64 = (
    base64String + padding
  )
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from(
    [...rawData].map((character) =>
      character.charCodeAt(0),
    ),
  );
}

export default function PushNotificationsControl() {
  const [state, setState] =
    useState<PushState>("loading");
  const [message, setMessage] =
    useState<string>("");

  useEffect(() => {
    void refreshState();
  }, []);

  async function refreshState() {
    if (
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !("Notification" in window)
    ) {
      setState("unsupported");
      return;
    }

    if (Notification.permission === "denied") {
      setState("denied");
      return;
    }

    try {
      const registration =
        await navigator.serviceWorker.register(
          "/sw.js",
        );

      const subscription =
        await registration.pushManager.getSubscription();

      setState(
        subscription ? "active" : "inactive",
      );
    } catch (error) {
      console.error(error);
      setState("error");
      setMessage(
        "Impossibile inizializzare le notifiche.",
      );
    }
  }

  async function enableNotifications() {
    setState("working");
    setMessage("");

    try {
      const permission =
        await Notification.requestPermission();

      if (permission !== "granted") {
        setState(
          permission === "denied"
            ? "denied"
            : "inactive",
        );
        return;
      }

      const publicKey =
        process.env
          .NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!publicKey) {
        throw new Error(
          "NEXT_PUBLIC_VAPID_PUBLIC_KEY mancante.",
        );
      }

      const registration =
        await navigator.serviceWorker.register(
          "/sw.js",
        );

      await navigator.serviceWorker.ready;

      let subscription =
        await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription =
          await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey:
              urlBase64ToUint8Array(publicKey),
          });
      }

      const response = await fetch(
        "/api/push/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            subscription.toJSON(),
          ),
        },
      );

      if (!response.ok) {
        throw new Error(
          "Registrazione server non riuscita.",
        );
      }

      setState("active");
      setMessage(
        "Questo dispositivo riceverà le notifiche delle vendite LIVE.",
      );
    } catch (error) {
      console.error(error);
      setState("error");
      setMessage(
        "Non è stato possibile attivare le notifiche.",
      );
    }
  }

  async function disableNotifications() {
    setState("working");
    setMessage("");

    try {
      const registration =
        await navigator.serviceWorker.ready;

      const subscription =
        await registration.pushManager.getSubscription();

      if (subscription) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
          }),
        });

        await subscription.unsubscribe();
      }

      setState("inactive");
      setMessage(
        "Notifiche disattivate su questo dispositivo.",
      );
    } catch (error) {
      console.error(error);
      setState("error");
      setMessage(
        "Non è stato possibile disattivare le notifiche.",
      );
    }
  }

  const isActive = state === "active";
  const isWorking =
    state === "working" ||
    state === "loading";

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#08101f]">
      <div className="border-b border-white/10 px-6 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-[#c8ff00]/15 bg-[#c8ff00]/[0.07]">
            <Bell className="size-5 text-[#c8ff00]" />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#c8ff00]">
              Sales alerts
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white">
              Notifiche vendite
            </h2>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <Smartphone className="size-5 text-white/40" />

              <p className="text-sm font-semibold text-white/80">
                Questo dispositivo
              </p>
            </div>

            <p className="mt-3 text-sm leading-7 text-white/45">
              Ricevi una push immediata quando
              Stripe conferma una nuova vendita
              AGE202 LIVE. Gli ordini TEST sono
              esclusi automaticamente.
            </p>

            {message ? (
              <p className="mt-4 text-sm text-white/55">
                {message}
              </p>
            ) : null}
          </div>

          {state === "unsupported" ? (
            <div className="rounded-full border border-amber-300/20 bg-amber-300/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-200">
              Browser non supportato
            </div>
          ) : state === "denied" ? (
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] px-5 py-4 text-sm text-amber-100/80">
              Le notifiche sono bloccate nelle
              impostazioni del browser.
            </div>
          ) : (
            <button
              type="button"
              disabled={isWorking}
              onClick={() => {
                if (isActive) {
                  void disableNotifications();
                } else {
                  void enableNotifications();
                }
              }}
              className={[
                "inline-flex min-w-56 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition",
                isActive
                  ? "border border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.07]"
                  : "bg-[#c8ff00] text-[#050b18] hover:bg-[#d6ff42]",
                isWorking
                  ? "cursor-wait opacity-60"
                  : "",
              ].join(" ")}
            >
              {isWorking ? (
                <Loader2 className="size-4 animate-spin" />
              ) : isActive ? (
                <BellOff className="size-4" />
              ) : (
                <Bell className="size-4" />
              )}

              {isWorking
                ? "Attendi..."
                : isActive
                  ? "Disattiva notifiche"
                  : "Attiva notifiche vendite"}
            </button>
          )}
        </div>

        {isActive ? (
          <div className="mt-6 flex items-center gap-3 rounded-[20px] border border-emerald-300/15 bg-emerald-300/[0.04] px-5 py-4">
            <CheckCircle2 className="size-5 text-emerald-300" />

            <p className="text-sm font-semibold text-emerald-200">
              Push attive su questo dispositivo
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
