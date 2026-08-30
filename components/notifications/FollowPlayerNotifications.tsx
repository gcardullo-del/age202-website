"use client";


import {
  Bell,
  BellOff,
  Check,
  Loader2,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

type FollowState =
  | "loading"
  | "unsupported"
  | "denied"
  | "inactive"
  | "following"
  | "working"
  | "error";

/*
 * Manteniamo temporaneamente la stessa firma del
 * componente perché ChampionArchive lo usa già.
 *
 * playerId e playerName non servono più alla logica:
 * FOLLOW ARTIFACTS segue l'intero Archive.
 */
type FollowPlayerNotificationsProps = {
  playerId: string;
  playerName: string;
  accent?: string;
};

type PublicPushStatusResponse = {
  active?: boolean;
  followAllArtifacts?: boolean;
};

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

  const rawData =
    window.atob(base64);

  return Uint8Array.from(
    [...rawData].map(
      (character) =>
        character.charCodeAt(0),
    ),
  );
}

export default function FollowPlayerNotifications({
  accent = "#c8ff00",
}: FollowPlayerNotificationsProps) {
  const [state, setState] =
    useState<FollowState>("loading");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    void refreshState();
  }, []);

  async function getRegistration() {
    const registration =
      await navigator.serviceWorker.register(
        "/sw.js",
      );

    await navigator.serviceWorker.ready;

    return registration;
  }

  async function refreshState() {
    if (
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !("Notification" in window)
    ) {
      setState("unsupported");
      return;
    }

    if (
      Notification.permission ===
      "denied"
    ) {
      setState("denied");
      return;
    }

    try {
      const registration =
        await getRegistration();

      const subscription =
        await registration.pushManager.getSubscription();

      if (!subscription) {
        setState("inactive");
        return;
      }

      const searchParams =
        new URLSearchParams({
          endpoint:
            subscription.endpoint,
        });

      const response = await fetch(
        `/api/public-push/subscribe?${searchParams.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(
          "Impossibile leggere lo stato delle notifiche.",
        );
      }

      const data =
        (await response.json()) as PublicPushStatusResponse;

      setState(
        data.active &&
          data.followAllArtifacts
          ? "following"
          : "inactive",
      );
    } catch (error) {
      console.error(error);

      setState("error");
      setMessage(
        "Impossibile controllare le notifiche.",
      );
    }
  }

  async function followArtifacts() {
    setState("working");
    setMessage("");

    try {
      const permission =
        await Notification.requestPermission();

      if (
        permission !== "granted"
      ) {
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
        await getRegistration();

      let subscription =
        await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription =
          await registration.pushManager.subscribe(
            {
              userVisibleOnly: true,
              applicationServerKey:
                urlBase64ToUint8Array(
                  publicKey,
                ),
            },
          );
      }

      const response = await fetch(
        "/api/public-push/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ...subscription.toJSON(),
            followAllArtifacts: true,
            playerIds: [],
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "Registrazione server non riuscita.",
        );
      }

      setState("following");

      setMessage(
        "Riceverai una notifica ogni volta che AGE202 pubblica un nuovo Artifact.",
      );
    } catch (error) {
      console.error(error);

      setState("error");

      setMessage(
        "Non è stato possibile attivare le notifiche.",
      );
    }
  }

  async function unfollowArtifacts() {
    setState("working");
    setMessage("");

    try {
      const registration =
        await getRegistration();

      const subscription =
        await registration.pushManager.getSubscription();

      if (!subscription) {
        setState("inactive");
        return;
      }

      const response = await fetch(
        "/api/public-push/subscribe",
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            endpoint:
              subscription.endpoint,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "Disattivazione server non riuscita.",
        );
      }

      /*
       * Non chiamiamo subscription.unsubscribe().
       *
       * La stessa PushSubscription del browser può
       * essere utilizzata anche dal sistema Admin
       * AGE202.
       */
      setState("inactive");

      setMessage(
        "Non riceverai più notifiche per i nuovi Artifact.",
      );
    } catch (error) {
      console.error(error);

      setState("error");

      setMessage(
        "Non è stato possibile modificare le notifiche.",
      );
    }
  }

  const isWorking =
    state === "working" ||
    state === "loading";

  if (state === "unsupported") {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-y border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
            Archive notifications
          </p>

          <p className="mt-1 text-sm text-white/65">
            Get notified whenever a new{" "}
            <span className="font-semibold text-white">
              Artifact
            </span>{" "}
            enters the AGE202 Archive.
          </p>

          {message ? (
            <p className="mt-2 text-xs text-white/40">
              {message}
            </p>
          ) : null}
        </div>

        {state === "denied" ? (
          <div className="text-xs text-amber-200/70">
            Notifications are blocked
            in your browser.
          </div>
        ) : (
          <button
            type="button"
            disabled={isWorking}
            onClick={() => {
              if (
                state === "following"
              ) {
                void unfollowArtifacts();
              } else {
                void followArtifacts();
              }
            }}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] transition disabled:cursor-wait disabled:opacity-50"
            style={{
              borderColor:
                state === "following"
                  ? "rgba(255,255,255,0.12)"
                  : accent,
              backgroundColor:
                state === "following"
                  ? "rgba(255,255,255,0.04)"
                  : accent,
              color:
                state === "following"
                  ? "rgba(255,255,255,0.75)"
                  : "#050b18",
            }}
          >
            {isWorking ? (
              <Loader2 className="size-4 animate-spin" />
            ) : state ===
              "following" ? (
              <Check className="size-4" />
            ) : (
              <Bell className="size-4" />
            )}

            {isWorking
              ? "Please wait"
              : state ===
                  "following"
                ? "Following Artifacts"
                : "Follow Artifacts"}
          </button>
        )}

        {state === "error" ? (
          <BellOff className="hidden size-4 text-white/30" />
        ) : null}
      </div>
    </div>
  );
}
