"use client";

import {
  type FormEvent,
  useState,
} from "react";


const contactReasons = [
  "Contribution to the Museum",
  "Memorabilia / Artifact",
  "Player or Representative",
  "Media / Press",
  "Partnership",
  "Other",
] as const;


export default function AboutContactForm() {
  const [
    name,
    setName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    reason,
    setReason,
  ] = useState(
    contactReasons[0],
  );

  const [
    message,
    setMessage,
  ] = useState("");


  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const subject =
      `AGE202 — ${reason}`;

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Topic: ${reason}`,
      "",
      message,
    ].join("\n");

    const mailto =
      `mailto:curator@age202.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href =
      mailto;
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block text-[9px] font-black uppercase tracking-[0.24em] text-white/45"
          >
            Name
          </label>

          <input
            id="contact-name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(event) =>
              setName(
                event.target.value,
              )
            }
            placeholder="Your name"
            className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.035] px-5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#C8FF00]/60 focus:bg-white/[0.05]"
          />
        </div>


        <div>
          <label
            htmlFor="contact-email"
            className="mb-2 block text-[9px] font-black uppercase tracking-[0.24em] text-white/45"
          >
            Email
          </label>

          <input
            id="contact-email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value,
              )
            }
            placeholder="your@email.com"
            className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.035] px-5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#C8FF00]/60 focus:bg-white/[0.05]"
          />
        </div>
      </div>


      <div>
        <label
          htmlFor="contact-reason"
          className="mb-2 block text-[9px] font-black uppercase tracking-[0.24em] text-white/45"
        >
          I&apos;m contacting AGE202 about
        </label>

        <div className="relative">
          <select
            id="contact-reason"
            name="reason"
            value={reason}
            onChange={(event) =>
              setReason(
                event.target.value as typeof reason,
              )
            }
            className="h-14 w-full appearance-none rounded-2xl border border-white/10 bg-[#08101F] px-5 pr-12 text-sm text-white outline-none transition focus:border-[#C8FF00]/60"
          >
            {contactReasons.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ),
            )}
          </select>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xs text-[#C8FF00]"
          >
            ↓
          </span>
        </div>
      </div>


      <div>
        <label
          htmlFor="contact-message"
          className="mb-2 block text-[9px] font-black uppercase tracking-[0.24em] text-white/45"
        >
          Message
        </label>

        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(event) =>
            setMessage(
              event.target.value,
            )
          }
          placeholder="Tell us how we can help..."
          className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-white/25 focus:border-[#C8FF00]/60 focus:bg-white/[0.05]"
        />
      </div>


      <div className="flex flex-col gap-5 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#C8FF00] px-8 text-[10px] font-black uppercase tracking-[0.2em] text-[#050B18] transition hover:scale-[1.02] hover:bg-white"
        >
          Send Message →
        </button>

        <p className="text-xs leading-6 text-white/35">
          Your email application will open
          with the message ready to send.
        </p>
      </div>
    </form>
  );
}