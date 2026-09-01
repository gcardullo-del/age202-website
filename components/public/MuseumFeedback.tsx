"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  Lightbulb,
  LockKeyhole,
  MessageCircle,
  Star,
} from "lucide-react";

const categories = [
  {
    value: "LIKE",
    label: "I like it",
    icon: Check,
  },
  {
    value: "MISSING_SOMETHING",
    label: "Something's missing",
    icon: MessageCircle,
  },
  {
    value: "IDEA",
    label: "I have an idea",
    icon: Lightbulb,
  },
] as const;

type Category =
  (typeof categories)[number]["value"];

export default function MuseumFeedback() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] =
    useState(0);
  const [category, setCategory] =
    useState<Category | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] =
    useState<string | null>(null);

  async function handleSubmit() {
    if (!rating || !category || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          category,
          message,
          sourcePath: window.location.pathname,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to send feedback.");
      }

      setIsSent(true);
    } catch {
      setError(
        "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const visibleRating = hoveredRating || rating;

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[#050b18] px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_45%,rgba(200,255,0,.075),transparent_34%)]" />

      <div className="relative w-full">
        <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#071021] shadow-[0_36px_120px_rgba(0,0,0,.3)] lg:grid lg:min-h-[620px] lg:grid-cols-[35%_65%]">
          <div className="relative overflow-hidden border-b border-white/10 px-7 py-12 sm:px-10 sm:py-14 lg:border-b-0 lg:border-r lg:px-14 lg:py-16 xl:px-20 xl:py-20">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_30%,rgba(200,255,0,.11),transparent_40%)]" />
            <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full border border-[#c8ff00]/10" />
            <div className="pointer-events-none absolute bottom-10 right-10 h-px w-28 bg-gradient-to-r from-transparent via-[#c8ff00]/25 to-transparent" />

            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="mb-7 flex items-center gap-3">
                  <span className="h-px w-10 bg-[#c8ff00]" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c8ff00]">
                    Help us build the museum
                  </p>
                </div>

                <h2 className="max-w-2xl text-4xl font-black uppercase leading-[0.93] tracking-[-0.05em] text-white sm:text-5xl lg:text-[3.4rem] xl:text-[4.1rem]">
                  Tell us what
                  <br />
                  you think.
                </h2>

                <p className="mt-8 max-w-xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
                  AGE202 is always evolving. Tell us
                  what you enjoyed, what is missing,
                  or what you would like to discover
                  next.
                </p>
              </div>

              <div className="mt-12 flex max-w-xl items-start gap-3 border-t border-white/10 pt-7 text-[10px] font-black uppercase leading-5 tracking-[0.14em] text-white/45 sm:text-[11px]">
                <LockKeyhole
                  size={16}
                  className="mt-0.5 shrink-0 text-[#c8ff00]"
                />
                <span>
                  Your feedback is private and will
                  not be published.
                </span>
              </div>
            </div>
          </div>

          <div className="px-7 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16 xl:px-20 xl:py-20">
            {isSent ? (
              <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#c8ff00]/35 bg-[#c8ff00]/10 text-[#c8ff00] shadow-[0_0_50px_rgba(200,255,0,.08)]">
                  <Check size={34} />
                </div>

                <p className="mt-9 text-[10px] font-black uppercase tracking-[0.3em] text-[#c8ff00]">
                  Feedback received
                </p>

                <h3 className="mt-4 max-w-2xl text-3xl font-black uppercase leading-[1.02] tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                  Thank you for contributing to the
                  museum.
                </h3>

                <p className="mt-6 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
                  Your feedback helps us shape the
                  next chapter of AGE202.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#c8ff00]">
                      Your visit
                    </p>
                    <h3 className="mt-2 text-2xl font-black uppercase tracking-[-0.035em] text-white sm:text-3xl">
                      How would you rate it?
                    </h3>
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
                    1 Poor · 5 Excellent
                  </p>
                </div>

                <div
                  className="mt-8 flex flex-wrap gap-3 sm:gap-4"
                  role="radiogroup"
                  aria-label="Visit rating"
                  onMouseLeave={() =>
                    setHoveredRating(0)
                  }
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      onMouseEnter={() =>
                        setHoveredRating(value)
                      }
                      className="group flex h-16 w-16 items-center justify-center rounded-[1.15rem] border border-white/10 bg-white/[0.025] transition duration-200 hover:-translate-y-1 hover:border-[#c8ff00]/55 hover:bg-[#c8ff00]/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8ff00] sm:h-[74px] sm:w-[74px]"
                      aria-label={`${value} star${
                        value > 1 ? "s" : ""
                      }`}
                      aria-checked={rating === value}
                      role="radio"
                    >
                      <Star
                        size={34}
                        strokeWidth={1.7}
                        className={
                          visibleRating >= value
                            ? "fill-[#c8ff00] text-[#c8ff00]"
                            : "text-white/25 transition group-hover:text-[#c8ff00]/60"
                        }
                      />
                    </button>
                  ))}
                </div>

                <div className="my-9 h-px bg-white/10" />

                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/45">
                  What best describes your feedback?
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {categories.map(
                    ({ value, label, icon: Icon }) => {
                      const selected = category === value;

                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            setCategory(value)
                          }
                          className={`group flex min-h-[118px] flex-col items-start justify-between rounded-[1.25rem] border p-5 text-left transition duration-200 ${
                            selected
                              ? "border-[#c8ff00] bg-[#c8ff00] text-[#050b18] shadow-[0_14px_40px_rgba(200,255,0,.08)]"
                              : "border-white/10 bg-white/[0.025] text-white hover:-translate-y-0.5 hover:border-[#c8ff00]/45 hover:bg-white/[0.045]"
                          }`}
                        >
                          <Icon
                            size={21}
                            className={
                              selected
                                ? "text-[#050b18]"
                                : "text-[#c8ff00]"
                            }
                          />

                          <span className="mt-6 text-[10px] font-black uppercase tracking-[0.13em] sm:text-[11px]">
                            {label}
                          </span>
                        </button>
                      );
                    },
                  )}
                </div>

                <div className="mt-8">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <label
                      htmlFor="museum-feedback-message"
                      className="text-[10px] font-black uppercase tracking-[0.22em] text-white/45"
                    >
                      Tell us more
                    </label>

                    <span className="text-[10px] font-bold tracking-[0.12em] text-white/25">
                      {message.length}/2000
                    </span>
                  </div>

                  <textarea
                    id="museum-feedback-message"
                    value={message}
                    onChange={(event) =>
                      setMessage(
                        event.target.value.slice(0, 2000),
                      )
                    }
                    placeholder="What could make AGE202 better? (optional)"
                    rows={6}
                    className="min-h-[170px] w-full resize-none rounded-[1.25rem] border border-white/10 bg-[#050b18]/75 px-5 py-5 text-sm leading-7 text-white outline-none transition placeholder:text-white/25 focus:border-[#c8ff00]/60 focus:bg-[#050b18] sm:px-6 sm:py-6"
                  />
                </div>

                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/55 sm:text-[11px]">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#c8ff00]/25 bg-[#c8ff00]/[0.06]">
                      <LockKeyhole
                        size={14}
                        className="text-[#c8ff00]"
                      />
                    </span>
                    Private feedback
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={
                      !rating || !category || isSubmitting
                    }
                    className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#c8ff00] px-8 text-[10px] font-black uppercase tracking-[0.16em] text-[#050b18] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 sm:min-h-16 sm:px-10 sm:text-[11px]"
                  >
                    {isSubmitting
                      ? "Sending..."
                      : "Send private feedback"}

                    {!isSubmitting ? (
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    ) : null}
                  </button>
                </div>

                {error ? (
                  <p className="mt-4 text-sm text-red-300">
                    {error}
                  </p>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
