"use client";

import {
  useState,
} from "react";

import Link from "next/link";
import {
  usePathname,
} from "next/navigation";

import {
  Archive,
  Bell,
  BookOpen,
  ChevronRight,
  Crown,
  Gem,
  Gift,
  Handshake,
  Home,
  Image,
  Layers3,
  LayoutDashboard,
  ListOrdered,
  LoaderCircle,
  LogOut,
  MessageSquareText,
  ReceiptText,
  Settings,
  ShoppingBag,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

import {
  createClient,
} from "@/lib/supabase/client";


const navigationItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Homepage",
    href: "/admin/homepage",
    icon: Home,
  },
  {
    label: "Artifacts",
    href: "/admin/artifacts",
    icon: Archive,
  },
  {
    label: "Originals",
    href: "/admin/originals",
    icon: ShoppingBag,
  },
  {
    label: "Memorabilia",
    href: "/admin/memorabilia",
    icon: Gem,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ReceiptText,
  },
  {
    label: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    label: "Feedback",
    href: "/admin/feedback",
    icon: MessageSquareText,
  },
  {
    label: "Players",
    href: "/admin/players",
    icon: Users,
  },
  {
    label: "NEXT GEN",
    href: "/admin/next-gen",
    icon: Sparkles,
  },
  {
    label: "Legends",
    href: "/admin/legends",
    icon: Crown,
  },
  {
    label: "ATP Ranking",
    href: "/admin/atp-ranking",
    icon: ListOrdered,
  },
  {
    label: "Tournaments",
    href: "/admin/tournaments",
    icon: Trophy,
  },
  {
    label: "Tennis History",
    href: "/admin/tennis-history",
    icon: BookOpen,
  },
  {
    label: "Collaborations",
    href: "/admin/collaborations",
    icon: Handshake,
  },
  {
    label: "Contribute",
    href: "/admin/contribute",
    icon: Gift,
  },
  {
    label: "Collections",
    href: "/admin/collections",
    icon: Layers3,
  },
  {
    label: "Media Library",
    href: "/admin/media",
    icon: Image,
  },
];


function isRouteActive(
  pathname: string,
  href: string,
) {
  if (href === "/admin") {
    return pathname === href;
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}


export default function AdminSidebar() {
  const pathname = usePathname();

  const [
    isSigningOut,
    setIsSigningOut,
  ] = useState(false);

  const [
    signOutError,
    setSignOutError,
  ] = useState<string | null>(null);


  async function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);
    setSignOutError(null);

    try {
      const supabase = createClient();

      const {
        error,
      } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      window.location.replace(
        "/admin/login",
      );
    } catch (error) {
      console.error(
        "AGE202 admin sign-out failed:",
        error,
      );

      setSignOutError(
        "Unable to sign out. Please try again.",
      );

      setIsSigningOut(false);
    }
  }


  return (
    <aside className="flex h-screen w-[280px] shrink-0 flex-col border-r border-white/10 bg-[#060D1A]">
      <div className="border-b border-white/10 px-7 py-7">
        <Link
          href="/admin"
          aria-label="Vai alla dashboard AGE202"
          className="inline-flex flex-col"
        >
          <span className="text-2xl font-black tracking-[-0.04em] text-white">
            AGE202
          </span>

          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-lime-300">
            Museum Admin
          </span>
        </Link>
      </div>

      <nav
        aria-label="Navigazione amministrazione"
        className="flex-1 overflow-y-auto px-4 py-6"
      >
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/35">
          Museum Archive
        </p>

        <ul className="space-y-1.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            const active = isRouteActive(
              pathname,
              item.href,
            );

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={
                    active
                      ? "page"
                      : undefined
                  }
                  className={[
                    "group flex min-h-12 items-center gap-3 rounded-2xl border px-3.5 py-3 transition-all duration-200",
                    active
                      ? "border-lime-300/25 bg-lime-300/10 text-white shadow-[0_0_30px_rgba(190,242,100,0.06)]"
                      : "border-transparent text-white/55 hover:border-white/10 hover:bg-white/[0.04] hover:text-white",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                      active
                        ? "bg-lime-300 text-[#050B18]"
                        : "bg-white/[0.05] text-white/55 group-hover:text-white",
                    ].join(" ")}
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.8}
                    />
                  </span>

                  <span className="flex-1 text-sm font-medium">
                    {item.label}
                  </span>

                  <ChevronRight
                    size={15}
                    strokeWidth={1.8}
                    className={[
                      "transition-all duration-200",
                      active
                        ? "translate-x-0 text-lime-300 opacity-100"
                        : "-translate-x-1 text-white/30 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                    ].join(" ")}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mx-3 my-7 border-t border-white/10" />

        <div className="px-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/35">
            Museum Content
          </p>

          <p className="mt-3 text-xs leading-5 text-white/25">
            Grand Slams, Masters 1000, ATP 500 and ATP 250 are managed
            centrally from Tournament Studio.
          </p>
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href="/admin/settings"
          className="group flex min-h-12 items-center gap-3 rounded-2xl px-3.5 py-3 text-white/55 transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-white/[0.05]">
            <Settings
              size={18}
              strokeWidth={1.8}
            />
          </span>

          <span className="flex-1 text-sm font-medium">
            Settings
          </span>
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          aria-busy={isSigningOut}
          className="group mt-1 flex min-h-12 w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-white/40 transition-colors hover:bg-red-400/10 hover:text-red-300 disabled:cursor-wait disabled:opacity-60"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-white/[0.05] transition-colors group-hover:bg-red-400/10">
            {isSigningOut ? (
              <LoaderCircle
                size={18}
                strokeWidth={1.8}
                className="animate-spin"
              />
            ) : (
              <LogOut
                size={18}
                strokeWidth={1.8}
              />
            )}
          </span>

          <span className="flex-1 text-sm font-medium">
            {isSigningOut
              ? "Signing out..."
              : "Sign out"}
          </span>
        </button>

        {signOutError ? (
          <p
            role="alert"
            className="mt-2 px-3 text-xs leading-5 text-red-300"
          >
            {signOutError}
          </p>
        ) : null}

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-lime-300 shadow-[0_0_12px_rgba(190,242,100,0.8)]" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
              System online
            </span>
          </div>

          <p className="mt-2 text-xs leading-5 text-white/30">
            AGE202 Museum CMS
          </p>
        </div>
      </div>
    </aside>
  );
}