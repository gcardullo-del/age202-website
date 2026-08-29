import Link from "next/link";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  Home,
  Mail,
  MapPin,
  PackageCheck,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type SuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
  }).format(value);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

function formatItemType(itemType: string) {
  if (itemType === "ARTIFACT") {
    return "Archive Artifact";
  }

  if (itemType === "MEMORABILIA") {
    return "Memorabilia";
  }

  if (itemType === "ORIGINAL_PRODUCT") {
    return "AGE202 Original";
  }

  return itemType.replaceAll("_", " ");
}


function formatShippingMethod(
  shippingMethod: string | null,
) {
  if (shippingMethod === "INPOST_LOCKER") {
    return "InPost Locker";
  }

  if (shippingMethod === "INPOST_POINT") {
    return "InPost Point";
  }

  if (shippingMethod === "HOME_DELIVERY") {
    return "Home delivery";
  }

  return "InPost";
}

export default async function ShopSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-[#050b18] px-5 py-16 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[32px] border border-white/10 bg-[#0b1324] p-8 shadow-2xl sm:p-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
              <ReceiptText className="h-8 w-8 text-white/70" />
            </div>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-white/40">
              AGE202 · Order confirmation
            </p>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
              Sessione di pagamento non trovata
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/55">
              Non è stato possibile identificare una sessione Stripe valida.
              Puoi tornare ad AGE202 e riprovare.
            </p>

            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#050b18] transition hover:bg-white/90"
            >
              <Home className="h-4 w-4" />
              Torna alla home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const order = await prisma.order.findUnique({
    where: {
      stripeCheckoutSessionId: sessionId,
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-[#050b18] px-5 py-16 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[32px] border border-amber-300/20 bg-[#0b1324] p-8 shadow-2xl sm:p-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-300/10">
              <PackageCheck className="h-8 w-8 text-amber-200" />
            </div>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-amber-200/70">
              AGE202 · Payment received
            </p>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
              Il pagamento è in elaborazione
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/55">
              Stripe ha completato il pagamento, ma la conferma dell&apos;ordine
              non è ancora disponibile nel database. Ricarica questa pagina tra
              qualche secondo.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/shop/success?session_id=${encodeURIComponent(sessionId)}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#050b18] transition hover:bg-white/90"
              >
                Ricarica conferma
              </Link>

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/[0.08]"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const item = order.items[0];

  const shippingAddress = [
    order.shippingLine1,
    order.shippingLine2,
    [order.shippingPostalCode, order.shippingCity].filter(Boolean).join(" "),
    order.shippingState,
    order.shippingCountry,
  ]
    .filter(Boolean)
    .join(", ");


  const hasInPostPoint = Boolean(
    order.inpostPointId ||
      order.inpostPointName ||
      order.inpostPointAddress,
  );

  const inPostPointTitle =
    order.inpostPointName?.trim() ||
    order.inpostPointId?.trim() ||
    "Punto InPost selezionato";

  const inPostPointAddress =
    order.inpostPointAddress?.trim() ||
    "Indirizzo punto non disponibile";

  const shippingMethod = formatShippingMethod(
    order.shippingMethod,
  );

  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-[#050b18] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-white/[0.035] blur-[110px]" />

        <div className="absolute right-[-180px] top-[260px] h-[480px] w-[480px] rounded-full bg-emerald-300/[0.035] blur-[120px]" />

        <div className="absolute bottom-[-250px] left-[-150px] h-[500px] w-[500px] rounded-full bg-sky-300/[0.025] blur-[120px]" />
      </div>

      <div className="relative mx-auto w-full max-w-[2200px] px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-20">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10">
            <Check className="h-5 w-5 text-emerald-300" />
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-emerald-300/80">
              AGE202
            </p>

            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/35">
              Order successfully completed
            </p>
          </div>
        </div>

        <section className="overflow-hidden rounded-[36px] border border-white/10 bg-[#0a1221]/95 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
          <header className="relative overflow-hidden border-b border-white/10 px-7 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
            <div className="pointer-events-none absolute right-[-80px] top-[-120px] h-[360px] w-[360px] rounded-full border border-white/[0.04]" />

            <div className="pointer-events-none absolute right-[20px] top-[-70px] h-[260px] w-[260px] rounded-full border border-white/[0.04]" />

            <div className="relative max-w-5xl">
              <div className="flex h-20 w-20 items-center justify-center rounded-[24px] border border-emerald-300/20 bg-emerald-300/10 shadow-[0_0_40px_rgba(110,231,183,0.08)]">
                <CheckCircle2 className="h-10 w-10 text-emerald-300" />
              </div>

              <p className="mt-8 text-xs font-bold uppercase tracking-[0.35em] text-emerald-300">
                Payment confirmed
              </p>

              <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Thank you.
                <span className="mt-2 block text-white/35">
                  Your AGE202 piece is yours.
                </span>
              </h1>

              <p className="mt-7 max-w-3xl text-base leading-8 text-white/55 sm:text-lg">
                Il pagamento è stato confermato e il tuo ordine è stato
                registrato correttamente. Il pezzo acquistato è stato
                automaticamente rimosso dalla disponibilità del catalogo.
              </p>
            </div>
          </header>

          <div className="grid lg:grid-cols-[1.25fr_0.75fr]">
            <div className="border-b border-white/10 p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-14">
              <div className="flex flex-col gap-5 border-b border-white/10 pb-9 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/35">
                    Order number
                  </p>

                  <h2 className="mt-3 break-all text-2xl font-semibold tracking-tight sm:text-3xl">
                    {order.orderNumber}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {order.isTest ? (
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
                      Test order
                    </div>
                  ) : null}

                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                    <ShieldCheck className="h-4 w-4" />
                    Paid
                  </div>
                </div>
              </div>

              <div className="py-10">
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                    <PackageCheck className="h-6 w-6 text-white/50" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/35">
                      Purchased piece
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.02em] sm:text-3xl">
                      {item?.productName ?? "AGE202 item"}
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {item?.itemType ? (
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                          {formatItemType(item.itemType)}
                        </span>
                      ) : null}

                      {item?.size ? (
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                          Size {item.size}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[#07101d] p-6 sm:p-8">
                <div className="flex items-center justify-between gap-5">
                  <div>
                    <p className="text-xs font-medium text-white/40">
                      Totale pagato
                    </p>

                    <p className="mt-2 text-sm text-white/30">
                      Pagamento elaborato in modo sicuro tramite Stripe
                    </p>
                  </div>

                  <p className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                    {formatCurrency(Number(order.total), order.currency)}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
                    Payment status
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />

                    <p className="font-semibold text-emerald-300">
                      {order.paymentStatus}
                    </p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
                    Paid at
                  </p>

                  <p className="mt-3 text-sm font-semibold leading-6 text-white/75">
                    {order.paidAt
                      ? formatDate(order.paidAt)
                      : "Pagamento confermato"}
                  </p>
                </div>
              </div>


              {hasInPostPoint ? (
                <div className="mt-6 rounded-[28px] border border-[#c8ff00]/20 bg-[#c8ff00]/[0.035] p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#c8ff00]/20 bg-[#c8ff00]/10">
                      <MapPin className="h-5 w-5 text-[#c8ff00]" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c8ff00]/70">
                        Pickup location
                      </p>

                      <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-white/35">
                        {shippingMethod}
                      </p>

                      <h3 className="mt-2 text-lg font-semibold text-white/90">
                        {inPostPointTitle}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-white/50">
                        {inPostPointAddress}
                      </p>

                      {order.inpostPointId ? (
                        <p className="mt-3 text-xs text-white/30">
                          Point ID: {order.inpostPointId}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="p-7 sm:p-10 lg:p-12">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/35">
                  Customer details
                </p>

                <div className="mt-8 space-y-7">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                      <Mail className="h-5 w-5 text-white/45" />
                    </div>

                    <div className="min-w-0 pt-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
                        Email
                      </p>

                      <p className="mt-2 break-all text-sm leading-6 text-white/75">
                        {order.customerEmail}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                      <MapPin className="h-5 w-5 text-white/45" />
                    </div>

                    <div className="min-w-0 pt-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
                        Shipping address
                      </p>

                      <p className="mt-2 text-sm font-semibold leading-6 text-white/80">
                        {order.shippingName ||
                          order.customerName ||
                          "Cliente AGE202"}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-white/50">
                        {shippingAddress || "Indirizzo non disponibile"}
                      </p>

                      {hasInPostPoint ? (
                        <div className="mt-4 border-t border-white/10 pt-4">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c8ff00]/65">
                            Delivery point
                          </p>

                          <p className="mt-2 text-sm font-semibold text-white/75">
                            {inPostPointTitle}
                          </p>

                          <p className="mt-1 text-sm leading-6 text-white/45">
                            {inPostPointAddress}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 rounded-[26px] border border-white/10 bg-white/[0.025] p-6">
                <div className="flex items-center gap-3">
                  <ReceiptText className="h-5 w-5 text-white/45" />

                  <p className="font-semibold">
                    What happens next?
                  </p>
                </div>

                <p className="mt-4 text-sm leading-7 text-white/50">
                  AGE202 ha registrato il pagamento. Il tuo ordine verrà ora
                  preparato per la spedizione
                  {hasInPostPoint ? " verso il punto InPost selezionato." : "."}{" "}
                  Le informazioni dell&apos;acquisto rimarranno associate al
                  numero ordine.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-white/55">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    Payment confirmed
                  </div>

                  <div className="flex items-center gap-3 text-sm text-white/55">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    Order registered
                  </div>

                  {hasInPostPoint ? (
                    <div className="flex items-center gap-3 text-sm text-white/55">
                      <CheckCircle2 className="h-4 w-4 text-[#c8ff00]" />
                      InPost point selected
                    </div>
                  ) : null}

                  <div className="flex items-center gap-3 text-sm text-white/55">
                    <PackageCheck className="h-4 w-4 text-white/35" />
                    Preparing for shipment
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <footer className="flex flex-col gap-6 border-t border-white/10 bg-black/10 px-7 py-7 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14">
            <div>
              <p className="text-base font-bold tracking-tight">
                AGE202
              </p>

              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
                Second Hand. First Set.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>

              <Link
                href="/artifacts"
                className="inline-flex items-center gap-2 rounded-full bg-[#c8ff00] px-5 py-3 text-sm font-bold !text-[#050b18] transition hover:bg-[#d6ff42] hover:!text-[#050b18]"
              >
                Explore AGE202
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </footer>
        </section>

        <div className="mt-6 flex flex-col gap-2 text-center text-[10px] uppercase tracking-[0.2em] text-white/25 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
          <span>Secure payment by Stripe</span>

          <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />

          <span>Order verified by AGE202</span>
        </div>
      </div>
    </main>
  );
}