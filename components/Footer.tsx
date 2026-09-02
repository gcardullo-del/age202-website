import Link from "next/link";
import {
  ArrowRight,
} from "lucide-react";


const museumLinks = [
  {
    href: "/players/other-players",
    label: "ATP Archive",
  },
  {
    href: "/players/women/archive",
    label: "WTA Archive",
  },
  {
    href: "/legends",
    label: "Legends",
  },
  {
    href: "/tennis-history",
    label: "Tennis History",
  },
] as const;


const exploreLinks = [
  {
    href: "/atp-ranking",
    label: "ATP Ranking",
  },
  {
    href: "/results",
    label: "Results",
  },
  {
    href: "/memorabilia",
    label: "Memorabilia",
  },
  {
    href: "/age202-originals",
    label: "AGE202 Originals",
  },
] as const;


const age202Links = [
  {
    href: "/about",
    label: "About",
  },
  {
    href: "/collaborations",
    label: "Partnerships",
  },
  {
    href: "/contribute",
    label: "Contribute",
  },
] as const;


const socialLinks = [
  {
    href: "https://www.instagram.com/age.202",
    label: "Instagram",
    icon: "instagram",
  },
  {
    href: "https://www.facebook.com/profile.php?id=61577964475066",
    label: "Facebook",
    icon: "facebook",
  },
  {
    href: "https://x.com/age202museum",
    label: "X",
    icon: "x",
  },
] as const;


const linkClassName =
  "text-sm font-semibold text-white/70 transition hover:text-[#C8FF00]";


const socialLinkClassName =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:border-[#C8FF00]/50 hover:bg-[#C8FF00]/10 hover:text-[#C8FF00]";


function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        ry="5"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
      />

      <circle
        cx="17.5"
        cy="6.5"
        r="1"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}


function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.5 22v-9h3l.5-3.5h-3.5V7.25c0-1 .3-1.75 1.75-1.75H17V2.35c-.3-.05-1.35-.15-2.55-.15-2.55 0-4.3 1.55-4.3 4.4v2.9H7.25V13h2.9v9h3.35Z" />
    </svg>
  );
}


function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.48 22H3.36l7.25-8.29L2.97 2h6.4l4.42 5.84L18.9 2Zm-1.1 17.84h1.72L8.43 4.05H6.58L17.8 19.84Z" />
    </svg>
  );
}


export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#030711] text-white">
      <div className="mx-auto max-w-[1500px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-2 lg:grid-cols-[1.5fr_.7fr_.7fr_.7fr]">
          {/* Brand */}

          <div>
            <Link
              href="/"
              className="inline-flex items-baseline text-3xl font-black uppercase tracking-[-0.06em]"
            >
              AGE
              <span className="text-[#C8FF00]">
                202
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              The Digital Tennis Museum preserving authentic apparel,
              legendary champions, historic tournaments and the stories
              behind every artifact.
            </p>

            <p className="mt-7 text-[10px] font-black uppercase tracking-[0.25em] text-[#C8FF00]">
              The Digital Tennis Museum
            </p>

            <div className="mt-6">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
                Follow AGE202
              </p>

              <div className="mt-4 flex items-center gap-3">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow AGE202 on ${item.label}`}
                    title={item.label}
                    className={socialLinkClassName}
                  >
                    {item.icon === "instagram" && (
                      <InstagramIcon />
                    )}

                    {item.icon === "facebook" && (
                      <FacebookIcon />
                    )}

                    {item.icon === "x" && (
                      <XIcon />
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>


          {/* Museum */}

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
              Museum
            </p>

            <nav
              aria-label="Museum footer navigation"
              className="mt-5 flex flex-col items-start gap-4"
            >
              {museumLinks.map(
                (item) => (
                  <Link
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    className={
                      linkClassName
                    }
                  >
                    {
                      item.label
                    }
                  </Link>
                ),
              )}
            </nav>
          </div>


          {/* Explore */}

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
              Explore
            </p>

            <nav
              aria-label="Explore footer navigation"
              className="mt-5 flex flex-col items-start gap-4"
            >
              {exploreLinks.map(
                (item) => (
                  <Link
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    className={
                      linkClassName
                    }
                  >
                    {
                      item.label
                    }
                  </Link>
                ),
              )}
            </nav>
          </div>


          {/* AGE202 */}

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
              AGE202
            </p>

            <nav
              aria-label="AGE202 footer navigation"
              className="mt-5 flex flex-col items-start gap-4"
            >
              {age202Links.map(
                (item) => (
                  <Link
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    className={
                      linkClassName
                    }
                  >
                    {
                      item.label
                    }
                  </Link>
                ),
              )}

              <a
                href="mailto:curator@age202.com"
                className={
                  linkClassName
                }
              >
                Contact
              </a>
            </nav>

            <Link
              href="/#explore-the-museum"
              className="group mt-7 inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#C8FF00]"
            >
              Enter the Museum

              <ArrowRight
                size={
                  15
                }
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>


        {/* Bottom bar */}

        <div className="flex flex-col gap-6 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C8FF00]">
              The Digital Tennis Museum
            </p>

            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
              ©{" "}
              {
                new Date().getFullYear()
              }{" "}
              AGE202. All rights reserved.
            </p>
          </div>

          <p className="max-w-md text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35 sm:text-right">
            Preserving tennis history, one artifact at a time.
          </p>
        </div>
      </div>
    </footer>
  );
}