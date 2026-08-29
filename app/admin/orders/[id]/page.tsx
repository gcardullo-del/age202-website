import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
  Truck,
  TriangleAlert,
  UserRound,
} from "lucide-react";

import CreateInPostShipmentButton from "@/components/admin/orders/CreateInPostShipmentButton";
import SyncInPostTrackingButton from "@/components/admin/orders/SyncInPostTrackingButton";
import { prisma } from "@/lib/prisma";

type AdminOrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatCurrency(
  value: number,
  currency: string,
) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
  }).format(value);
}

function formatDate(
  date: Date | null,
) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getShippingStatusLabel(
  status: string,
) {
  switch (status) {
    case "NOT_CREATED":
      return "Not created";

    case "READY_TO_CREATE":
      return "Ready to create";

    case "CREATED":
      return "Created";

    case "LABEL_READY":
      return "Label ready";

    case "IN_TRANSIT":
      return "In transit";

    case "DELIVERED":
      return "Delivered";

    case "CANCELLED":
      return "Cancelled";

    case "ERROR":
      return "Error";

    default:
      return status;
  }
}

function getShippingStatusIcon(
  status: string,
) {
  if (
    status === "DELIVERED"
  ) {
    return (
      <PackageCheck className="h-5 w-5 text-emerald-300" />
    );
  }

  if (
    status === "IN_TRANSIT"
  ) {
    return (
      <Truck className="h-5 w-5 text-sky-300" />
    );
  }

  return (
    <Clock3 className="h-5 w-5 text-white/35" />
  );
}

function getOrderStatusLabel(
  status: string,
) {
  switch (status) {
    case "PENDING":
      return "Pending";

    case "PAID":
      return "Paid";

    case "PROCESSING":
      return "Preparing";

    case "SHIPPED":
      return "Shipped";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    case "REFUNDED":
      return "Refunded";

    default:
      return status;
  }
}

async function markOrderAsPreparing(
  formData: FormData,
) {
  "use server";

  const orderId =
    formData.get("orderId");

  if (
    typeof orderId !== "string" ||
    !orderId.trim()
  ) {
    throw new Error(
      "ID ordine non valido.",
    );
  }

  const order =
    await prisma.order.findUnique({
      where: {
        id: orderId,
      },

      select: {
        id: true,
        status: true,
        paymentStatus: true,
        preparingAt: true,
        isTest: true,
      },
    });

  if (!order) {
    throw new Error(
      "Ordine non trovato.",
    );
  }

  if (order.isTest) {
    throw new Error(
      "Gli ordini Stripe TEST non possono entrare nel flusso logistico reale.",
    );
  }

  if (
    order.paymentStatus !== "PAID"
  ) {
    throw new Error(
      "L'ordine non risulta pagato.",
    );
  }

  /*
   * Il passaggio normale è:
   *
   * PAID
   *   ↓
   * PROCESSING
   *
   * Contestualmente registriamo
   * preparingAt.
   */
  if (
    order.status === "PAID"
  ) {
    await prisma.order.update({
      where: {
        id: orderId,
      },

      data: {
        status: "PROCESSING",
        preparingAt: new Date(),
      },
    });
  }

  revalidatePath(
    `/admin/orders/${orderId}`,
  );

  revalidatePath(
    "/admin/orders",
  );
}

async function markOrderReadyForShipment(
  formData: FormData,
) {
  "use server";

  const orderId =
    formData.get("orderId");

  if (
    typeof orderId !== "string" ||
    !orderId.trim()
  ) {
    throw new Error(
      "ID ordine non valido.",
    );
  }

  const order =
    await prisma.order.findUnique({
      where: {
        id: orderId,
      },

      select: {
        id: true,
        status: true,
        paymentStatus: true,
        shippingStatus: true,
        isTest: true,
      },
    });

  if (!order) {
    throw new Error(
      "Ordine non trovato.",
    );
  }

  if (order.isTest) {
    throw new Error(
      "Gli ordini Stripe TEST non possono essere preparati per una spedizione reale.",
    );
  }

  if (
    order.paymentStatus !== "PAID"
  ) {
    throw new Error(
      "L'ordine non risulta pagato.",
    );
  }

  if (
    order.status !== "PROCESSING"
  ) {
    throw new Error(
      "L'ordine deve essere in preparazione prima di poter essere segnato come pronto per la spedizione.",
    );
  }

  if (
    order.shippingStatus ===
    "NOT_CREATED"
  ) {
    await prisma.order.update({
      where: {
        id: orderId,
      },

      data: {
        shippingStatus:
          "READY_TO_CREATE",
      },
    });
  }

  revalidatePath(
    `/admin/orders/${orderId}`,
  );

  revalidatePath(
    "/admin/orders",
  );
}

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { id } =
    await params;

  const order =
    await prisma.order.findUnique({
      where: {
        id,
      },

      include: {
        items: true,
      },
    });

  if (!order) {
    notFound();
  }

  const shippingAddress = [
    order.shippingLine1,
    order.shippingLine2,

    [
      order.shippingPostalCode,
      order.shippingCity,
    ]
      .filter(Boolean)
      .join(" "),

    order.shippingState,
    order.shippingCountry,
  ]
    .filter(Boolean)
    .join(", ");

  const isPreparing =
    order.status ===
    "PROCESSING";

  const isReadyToShip =
    order.shippingStatus ===
    "READY_TO_CREATE";

  const isShipmentCreated =
    [
      "CREATED",
      "LABEL_READY",
      "IN_TRANSIT",
      "DELIVERED",
    ].includes(
      order.shippingStatus,
    );

  const isInTransit =
    order.shippingStatus ===
    "IN_TRANSIT";

  const isDelivered =
    order.shippingStatus ===
    "DELIVERED";

  const hasReachedShipmentStage =
    isReadyToShip ||
    isShipmentCreated;

  const inPostShippingEnabled =
    process.env
      .INPOST_SHIPPING_ENABLED ===
    "true";

  const webhookSecret =
    process.env
      .INPOST_WEBHOOK_SECRET
      ?.trim();

  const inPostWebhookConfigured =
    Boolean(
      webhookSecret &&
        webhookSecret !==
          "INSERIREMO_IL_SECRET_INPOST",
    );

  const canMarkPreparing =
    !order.isTest &&
    order.status === "PAID" &&
    order.paymentStatus ===
      "PAID";

  const canMarkReadyForShipment =
    !order.isTest &&
    isPreparing &&
    order.paymentStatus ===
      "PAID" &&
    order.shippingStatus ===
      "NOT_CREATED";

  return (
    <main className="min-h-screen bg-[#050b18] px-5 py-8 text-white sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="mb-8">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/45 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to orders
          </Link>
        </div>

        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#c8ff00]">
              AGE202 Admin · Order
            </p>

            <h1 className="mt-3 break-all text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
              {order.orderNumber}
            </h1>

            <p className="mt-4 text-sm text-white/40">
              Created{" "}
              {formatDate(
                order.createdAt,
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {order.isTest ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/[0.08] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
                <TriangleAlert className="h-4 w-4" />
                Stripe test order
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                Live order
              </div>
            )}

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />

              {order.paymentStatus}
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/55">
              {getShippingStatusIcon(
                order.shippingStatus,
              )}

              {getShippingStatusLabel(
                order.shippingStatus,
              )}
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#c8ff00]/15 bg-[#c8ff00]/[0.05] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#c8ff00]">
              {isReadyToShip ? (
                <Truck className="h-4 w-4" />
              ) : isPreparing ? (
                <PackageCheck className="h-4 w-4" />
              ) : (
                <Clock3 className="h-4 w-4" />
              )}

              {isReadyToShip
                ? "Ready to ship"
                : getOrderStatusLabel(
                    order.status,
                  )}
            </div>
          </div>
        </div>

        {order.isTest ? (
          <section className="mb-8 overflow-hidden rounded-[28px] border border-amber-300/25 bg-amber-300/[0.055]">
            <div className="flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-300/25 bg-amber-300/[0.08]">
                  <TriangleAlert className="h-6 w-6 text-amber-200" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-200/75">
                    Stripe test mode
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-amber-100">
                    TEST ORDER · No real fulfillment
                  </h2>

                  <p className="mt-2 max-w-3xl text-sm leading-7 text-white/50">
                    Questo ordine proviene da Stripe TEST. Rimane nel CMS per
                    verificare checkout, pagamento e dati ordine, ma è escluso
                    dal flusso operativo reale e non può generare una spedizione
                    InPost.
                  </p>
                </div>
              </div>

              <div className="rounded-full border border-amber-300/20 bg-black/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
                Logistics locked
              </div>
            </div>
          </section>
        ) : null}

        {canMarkPreparing ? (
          <section className="mb-8 rounded-[28px] border border-[#c8ff00]/20 bg-[#c8ff00]/[0.035] p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c8ff00]">
                  Next action
                </p>

                <h2 className="mt-3 text-xl font-semibold">
                  Prepare this order
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-7 text-white/45">
                  Il pagamento è stato
                  confermato. Puoi segnare
                  l&apos;ordine come in
                  preparazione prima della
                  creazione della spedizione.
                </p>
              </div>

              <form
                action={
                  markOrderAsPreparing
                }
              >
                <input
                  type="hidden"
                  name="orderId"
                  value={
                    order.id
                  }
                />

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-[#c8ff00] px-6 py-3.5 text-sm font-bold text-[#050b18] transition hover:bg-[#d6ff42]"
                >
                  <PackageCheck className="h-4 w-4" />

                  Mark as preparing
                </button>
              </form>
            </div>
          </section>
        ) : null}

        {(
          isPreparing ||
          isReadyToShip
        ) ? (
          <>
            {isPreparing ? (
              <section className="mb-8 rounded-[24px] border border-emerald-300/15 bg-emerald-300/[0.035] p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-300/15 bg-emerald-300/[0.07]">
                    <PackageCheck className="h-5 w-5 text-emerald-300" />
                  </div>

                  <div>
                    <p className="font-semibold text-emerald-300">
                      Order in preparation
                    </p>

                    <p className="mt-2 text-sm leading-6 text-white/45">
                      Il pagamento è
                      confermato e
                      l&apos;ordine è ora
                      nella fase di
                      preparazione.
                    </p>

                    <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-white/30">
                      Preparing since
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white/65">
                      {order.preparingAt
                        ? formatDate(
                            order.preparingAt,
                          )
                        : "Timestamp non disponibile"}
                    </p>
                  </div>
                </div>
              </section>
            ) : null}

            {canMarkReadyForShipment ? (
              <section className="mb-8 rounded-[28px] border border-[#c8ff00]/20 bg-[#c8ff00]/[0.035] p-6 sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c8ff00]">
                      Next action
                    </p>

                    <h2 className="mt-3 text-xl font-semibold">
                      Mark ready for shipment
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-7 text-white/45">
                      La preparazione fisica dell&apos;ordine è completata.
                      Segnalo come pronto per la spedizione prima della
                      creazione effettiva della spedizione InPost.
                    </p>
                  </div>

                  <form
                    action={
                      markOrderReadyForShipment
                    }
                  >
                    <input
                      type="hidden"
                      name="orderId"
                      value={order.id}
                    />

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-[#c8ff00] px-6 py-3.5 text-sm font-bold text-[#050b18] transition hover:bg-[#d6ff42]"
                    >
                      <Truck className="h-4 w-4" />

                      Mark ready for shipment
                    </button>
                  </form>
                </div>
              </section>
            ) : null}

            <section className="mb-8 rounded-[28px] border border-sky-300/15 bg-sky-300/[0.035] p-6 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-sky-300">
                    Next logistics step
                  </p>

                  <h2 className="mt-3 text-xl font-semibold">
                    {isReadyToShip
                      ? "Ready to create shipment"
                      : "Create shipment"}
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-7 text-white/45">
                    {isReadyToShip
                      ? inPostShippingEnabled
                        ? "L'ordine è pronto. Il pulsante può creare una spedizione InPost reale: usalo soltanto per un ordine LIVE verificato."
                        : "L'ordine è pronto, ma la creazione reale InPost resta bloccata dal safety switch INPOST_SHIPPING_ENABLED. Nessuna spedizione può partire finché rimane false."
                      : "L'ordine è in preparazione. Quando la preparazione sarà completata, potrà essere segnato come pronto per la spedizione."}
                  </p>
                </div>

                <CreateInPostShipmentButton
                  orderId={order.id}
                  disabled={
                    order.isTest ||
                    !isReadyToShip
                  }
                  disabledReason={
                    order.isTest
                      ? "Stripe TEST order: la creazione della spedizione InPost è bloccata per sicurezza."
                      : !isReadyToShip
                        ? "L'ordine deve essere READY_TO_CREATE prima di poter creare la spedizione InPost."
                        : undefined
                  }
                />
              </div>

              <div className="mt-6 rounded-[20px] border border-[#c8ff00]/15 bg-[#c8ff00]/[0.035] p-5">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-4 w-4 text-[#c8ff00]" />

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c8ff00]">
                    {isReadyToShip
                      ? inPostShippingEnabled
                        ? "Production shipment creation enabled"
                        : "Production shipment creation locked"
                      : "Waiting for preparation completion"}
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : null}

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
              Total
            </p>

            <p className="mt-4 text-3xl font-semibold">
              {formatCurrency(
                Number(
                  order.total,
                ),
                order.currency,
              )}
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
              Subtotal
            </p>

            <p className="mt-4 text-3xl font-semibold">
              {formatCurrency(
                Number(
                  order.subtotal,
                ),
                order.currency,
              )}
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
              Shipping
            </p>

            <p className="mt-4 text-3xl font-semibold">
              {formatCurrency(
                Number(
                  order.shipping,
                ),
                order.currency,
              )}
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
              Items
            </p>

            <p className="mt-4 text-3xl font-semibold">
              {order.items.length}
            </p>
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#08101f]">
              <div className="border-b border-white/10 px-6 py-5 sm:px-8">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5 text-[#c8ff00]" />

                  <h2 className="text-lg font-semibold">
                    Purchased items
                  </h2>
                </div>
              </div>

              <div className="divide-y divide-white/[0.06]">
                {order.items.map(
                  (item) => (
                    <div
                      key={
                        item.id
                      }
                      className="p-6 sm:p-8"
                    >
                      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
                            {item.itemType.replaceAll(
                              "_",
                              " ",
                            )}
                          </p>

                          <h3 className="mt-2 text-xl font-semibold">
                            {
                              item.productName
                            }
                          </h3>

                          {item.productSlug ? (
                            <p className="mt-2 text-xs text-white/30">
                              {
                                item.productSlug
                              }
                            </p>
                          ) : null}

                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/45">
                              Qty{" "}
                              {
                                item.quantity
                              }
                            </span>

                            {item.size ? (
                              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/45">
                                Size{" "}
                                {
                                  item.size
                                }
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-xs text-white/35">
                            Unit price
                          </p>

                          <p className="mt-1 text-lg font-semibold">
                            {formatCurrency(
                              Number(
                                item.unitPrice,
                              ),
                              item.currency,
                            )}
                          </p>

                          <p className="mt-4 text-xs text-white/35">
                            Item total
                          </p>

                          <p className="mt-1 text-xl font-semibold">
                            {formatCurrency(
                              Number(
                                item.totalPrice,
                              ),
                              item.currency,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-[#08101f] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-emerald-300" />

                <h2 className="text-lg font-semibold">
                  Payment
                </h2>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[20px] border border-white/10 bg-white/[0.025] p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Payment status
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />

                    <p className="font-semibold text-emerald-300">
                      {
                        order.paymentStatus
                      }
                    </p>
                  </div>
                </div>

                <div className="rounded-[20px] border border-white/10 bg-white/[0.025] p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Paid at
                  </p>

                  <p className="mt-3 text-sm font-medium text-white/70">
                    {formatDate(
                      order.paidAt,
                    )}
                  </p>
                </div>

                <div className="rounded-[20px] border border-white/10 bg-white/[0.025] p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Stripe Checkout
                  </p>

                  <p className="mt-3 break-all text-xs leading-5 text-white/45">
                    {order.stripeCheckoutSessionId ??
                      "—"}
                  </p>
                </div>

                <div className="rounded-[20px] border border-white/10 bg-white/[0.025] p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Payment Intent
                  </p>

                  <p className="mt-3 break-all text-xs leading-5 text-white/45">
                    {order.stripePaymentIntentId ??
                      "—"}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="rounded-[28px] border border-white/10 bg-[#08101f] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <UserRound className="h-5 w-5 text-white/50" />

                <h2 className="text-lg font-semibold">
                  Customer
                </h2>
              </div>

              <div className="mt-7 space-y-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Name
                  </p>

                  <p className="mt-2 font-medium text-white/80">
                    {order.customerName ??
                      "AGE202 customer"}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                      Email
                    </p>

                    <p className="mt-2 break-all text-sm text-white/70">
                      {
                        order.customerEmail
                      }
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                      Phone
                    </p>

                    <p className="mt-2 text-sm text-white/70">
                      {order.customerPhone ??
                        "—"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-[#08101f] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-white/50" />

                <h2 className="text-lg font-semibold">
                  Shipping address
                </h2>
              </div>

              <div className="mt-7">
                <p className="font-medium text-white/80">
                  {order.shippingName ??
                    order.customerName ??
                    "—"}
                </p>

                <p className="mt-2 text-sm leading-7 text-white/50">
                  {shippingAddress ||
                    "—"}
                </p>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-[#08101f] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-sky-300" />

                <h2 className="text-lg font-semibold">
                  Shipping
                </h2>
              </div>

              <div className="mt-7 space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-white/40">
                    Provider
                  </span>

                  <span className="text-sm font-semibold text-white/70">
                    {order.shippingProvider ??
                      "Not assigned"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-white/40">
                    Method
                  </span>

                  <span className="text-sm font-semibold text-white/70">
                    {order.shippingMethod
                      ? order.shippingMethod.replaceAll(
                          "_",
                          " ",
                        )
                      : "Not selected"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-white/40">
                    Status
                  </span>

                  <span className="text-sm font-semibold text-white/70">
                    {getShippingStatusLabel(
                      order.shippingStatus,
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-white/40">
                    Tracking
                  </span>

                  <span className="max-w-[220px] break-all text-right text-xs font-medium text-white/55">
                    {order.inpostTrackingNumber ??
                      "—"}
                  </span>
                </div>

                {order.inpostTrackingNumber ? (
                  <div className="space-y-4 pt-2">
                    <a
                      href={`/api/inpost/shipments/${encodeURIComponent(
                        order.inpostTrackingNumber,
                      )}/label`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#c8ff00] px-5 py-3 text-sm font-bold text-[#050b18] transition hover:bg-[#d6ff42]"
                    >
                      <Download className="h-4 w-4" />

                      Download InPost label
                    </a>

                    <SyncInPostTrackingButton
                      trackingNumber={
                        order.inpostTrackingNumber
                      }
                      isTest={
                        order.isTest
                      }
                    />

                    <p className="text-center text-xs leading-5 text-white/30">
                      Scarica l&apos;etichetta oppure sincronizza manualmente lo stato della spedizione con InPost.
                    </p>
                  </div>
                ) : null}
              </div>
            </section>

            <section className="relative overflow-hidden rounded-[28px] border border-[#c8ff00]/15 bg-[#c8ff00]/[0.035] p-6 sm:p-8">
              <div className="absolute right-[-50px] top-[-50px] h-32 w-32 rounded-full border border-[#c8ff00]/10" />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#c8ff00]" />

                  <h2 className="text-lg font-semibold">
                    InPost integration
                  </h2>
                </div>

                <p className="mt-5 text-sm leading-7 text-white/50">
                  {order.isTest
                    ? "Ordine Stripe TEST: l'integrazione InPost è bloccata per sicurezza e nessuna spedizione reale può essere creata."
                    : inPostShippingEnabled
                      ? "La creazione spedizioni InPost Production è abilitata. Il tracking viene gestito dagli eventi InPost non appena la subscription webhook Production sarà attiva."
                      : "Le API InPost Production sono integrate, ma la creazione reale delle spedizioni resta disabilitata dal safety switch. È la configurazione corretta finché non completiamo il go-live."}
                </p>

                <div className="mt-6 grid gap-3">
                  <div className="rounded-[20px] border border-white/10 bg-black/10 p-5">
                    <div className="flex items-center gap-3">
                      {inPostShippingEnabled ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                      ) : (
                        <ShieldCheck className="h-4 w-4 text-[#c8ff00]" />
                      )}

                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c8ff00]">
                        {order.isTest
                          ? "Test order · InPost locked"
                          : inPostShippingEnabled
                            ? "Real shipment creation enabled"
                            : "Real shipment creation safely disabled"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[20px] border border-white/10 bg-black/10 p-5">
                    <div className="flex items-center gap-3">
                      {inPostWebhookConfigured ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                      ) : (
                        <Clock3 className="h-4 w-4 text-amber-200" />
                      )}

                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                        {inPostWebhookConfigured
                          ? "Webhook secret configured"
                          : "Webhook Production pending InPost"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-[#08101f] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <ReceiptText className="h-5 w-5 text-white/50" />

                <h2 className="text-lg font-semibold">
                  Order lifecycle
                </h2>
              </div>

              <div className="mt-7 space-y-5">
                <div className="flex gap-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />

                  <div>
                    <p className="text-sm font-semibold">
                      Payment confirmed
                    </p>

                    <p className="mt-1 text-xs text-white/35">
                      {formatDate(
                        order.paidAt,
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />

                  <div>
                    <p className="text-sm font-semibold">
                      Order registered
                    </p>

                    <p className="mt-1 text-xs text-white/35">
                      {formatDate(
                        order.createdAt,
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  {isPreparing ||
                  hasReachedShipmentStage ? (
                    <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#c8ff00]" />
                  ) : (
                    <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-white/30" />
                  )}

                  <div>
                    <p
                      className={
                        isPreparing ||
                        hasReachedShipmentStage
                          ? "text-sm font-semibold text-[#c8ff00]"
                          : "text-sm font-semibold text-white/60"
                      }
                    >
                      {hasReachedShipmentStage
                        ? "Preparation completed"
                        : isPreparing
                          ? "Order preparing"
                          : "Preparation pending"}
                    </p>

                    <p className="mt-1 text-xs text-white/35">
                      {order.preparingAt
                        ? formatDate(
                            order.preparingAt,
                          )
                        : "Waiting for admin action"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  {isShipmentCreated ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                  ) : isReadyToShip ? (
                    <Truck className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
                  ) : (
                    <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-white/30" />
                  )}

                  <div>
                    <p
                      className={
                        isShipmentCreated
                          ? "text-sm font-semibold text-emerald-300"
                          : isReadyToShip
                            ? "text-sm font-semibold text-sky-300"
                            : "text-sm font-semibold text-white/60"
                      }
                    >
                      {isShipmentCreated
                        ? "InPost shipment created"
                        : isReadyToShip
                          ? "Ready to create shipment"
                          : "Shipment creation pending"}
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      {order.shippingCreatedAt
                        ? formatDate(
                            order.shippingCreatedAt,
                          )
                        : isReadyToShip
                          ? "Waiting for InPost shipment creation"
                          : "Waiting for preparation completion"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  {order.inpostTrackingNumber ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                  ) : (
                    <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-white/30" />
                  )}

                  <div>
                    <p
                      className={
                        order.inpostTrackingNumber
                          ? "text-sm font-semibold text-emerald-300"
                          : "text-sm font-semibold text-white/60"
                      }
                    >
                      {order.inpostTrackingNumber
                        ? "Tracking assigned"
                        : "Tracking pending"}
                    </p>

                    <p className="mt-1 break-all text-xs text-white/30">
                      {order.inpostTrackingNumber ??
                        "Generated after shipment creation"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  {isInTransit ||
                  isDelivered ? (
                    <Truck className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
                  ) : (
                    <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-white/30" />
                  )}

                  <div>
                    <p
                      className={
                        isInTransit ||
                        isDelivered
                          ? "text-sm font-semibold text-sky-300"
                          : "text-sm font-semibold text-white/60"
                      }
                    >
                      {isDelivered
                        ? "Transit completed"
                        : isInTransit
                          ? "Shipment in transit"
                          : "Transit pending"}
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      {order.shippedAt
                        ? formatDate(
                            order.shippedAt,
                          )
                        : order.inpostStatus
                          ? `InPost: ${order.inpostStatus}`
                          : "Waiting for tracking event"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  {isDelivered ? (
                    <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                  ) : (
                    <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-white/30" />
                  )}

                  <div>
                    <p
                      className={
                        isDelivered
                          ? "text-sm font-semibold text-emerald-300"
                          : "text-sm font-semibold text-white/60"
                      }
                    >
                      {isDelivered
                        ? "Delivered"
                        : "Delivery pending"}
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      {order.deliveredAt
                        ? formatDate(
                            order.deliveredAt,
                          )
                        : "Waiting for InPost delivery event"}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}