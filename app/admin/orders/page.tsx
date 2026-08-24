import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  Mail,
  PackageCheck,
  ShoppingBag,
  Truck,
  UserRound,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

function formatCurrency(
  value: number,
  currency: string,
) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
  }).format(value);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getOrderStatusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "Pending";

    case "PAID":
      return "Paid";

    case "PROCESSING":
      return "Processing";

    case "FULFILLED":
      return "Fulfilled";

    case "CANCELLED":
      return "Cancelled";

    case "REFUNDED":
      return "Refunded";

    default:
      return status;
  }
}

function getShippingStatusLabel(
  status: string,
) {
  switch (status) {
    case "NOT_CREATED":
      return "Not created";

    case "READY_TO_CREATE":
      return "Ready";

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

export default async function AdminOrdersPage() {
  const orders =
    await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: {
        items: true,
      },
    });

  const livePaidOrders = orders.filter(
    (order) =>
      !order.isTest &&
      order.paymentStatus === "PAID",
  ).length;

  const testPaidOrders = orders.filter(
    (order) =>
      order.isTest &&
      order.paymentStatus === "PAID",
  ).length;

  const liveRevenue = orders.reduce(
    (total, order) => {
      if (
        order.isTest ||
        order.paymentStatus !== "PAID"
      ) {
        return total;
      }

      return total + Number(order.total);
    },
    0,
  );

  const waitingShipment = orders.filter(
    (order) =>
      !order.isTest &&
      order.paymentStatus === "PAID" &&
      order.shippingStatus !== "DELIVERED",
  ).length;

  return (
    <main className="min-h-screen bg-[#050b18] px-5 py-8 text-white sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#c8ff00]">
              AGE202 Admin
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Orders
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
              Gestisci gli ordini AGE202,
              controlla pagamenti,
              articoli acquistati e stato
              della spedizione.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/40">
            <ShoppingBag className="h-4 w-4" />

            {orders.length} orders · {testPaidOrders} test
          </div>
        </div>

        <section className="mb-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/35">
                Live paid orders
              </p>

              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
            </div>

            <p className="mt-5 text-3xl font-semibold">
              {livePaidOrders}
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/35">
                Revenue
              </p>

              <CreditCard className="h-5 w-5 text-[#c8ff00]" />
            </div>

            <p className="mt-5 text-3xl font-semibold">
              {formatCurrency(
                liveRevenue,
                "EUR",
              )}
            </p>
            <p className="mt-2 text-xs text-white/30">
              Esclude automaticamente gli ordini Stripe TEST.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/35">
                Waiting shipment
              </p>

              <Truck className="h-5 w-5 text-sky-300" />
            </div>

            <p className="mt-5 text-3xl font-semibold">
              {waitingShipment}
            </p>
          </div>
        </section>

        {orders.length === 0 ? (
          <section className="rounded-[28px] border border-white/10 bg-white/[0.025] p-10 text-center">
            <PackageCheck className="mx-auto h-10 w-10 text-white/25" />

            <h2 className="mt-5 text-xl font-semibold">
              Nessun ordine
            </h2>

            <p className="mt-3 text-sm text-white/45">
              Gli ordini Stripe
              compariranno qui
              automaticamente.
            </p>
          </section>
        ) : (
          <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#08101f]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.025] text-left">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                      Order
                    </th>

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                      Item
                    </th>

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                      Shipping
                    </th>

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                      Total
                    </th>

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                      Date
                    </th>

                    <th className="px-6 py-4" />
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => {
                    const firstItem =
                      order.items[0];

                    return (
                      <tr
                        key={order.id}
                        className="border-b border-white/[0.06] last:border-b-0 hover:bg-white/[0.02]"
                      >
                        <td className="px-6 py-5">
                          <p className="font-semibold">
                            {order.orderNumber}
                          </p>

                          <p className="mt-1 text-xs text-white/30">
                            {getOrderStatusLabel(
                              order.status,
                            )}
                          </p>

                          <span
                            className={[
                              "mt-3 inline-flex rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em]",
                              order.isTest
                                ? "border-amber-300/20 bg-amber-300/[0.08] text-amber-200"
                                : "border-[#c8ff00]/20 bg-[#c8ff00]/[0.08] text-[#c8ff00]",
                            ].join(" ")}
                          >
                            {order.isTest
                              ? "Test order"
                              : "Live"}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-start gap-3">
                            <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />

                            <div>
                              <p className="text-sm font-medium text-white/80">
                                {order.customerName ??
                                  "AGE202 customer"}
                              </p>

                              <div className="mt-1 flex items-center gap-1.5 text-xs text-white/35">
                                <Mail className="h-3 w-3" />

                                {order.customerEmail}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p className="max-w-[260px] truncate text-sm font-medium text-white/80">
                            {firstItem?.productName ??
                              "AGE202 item"}
                          </p>

                          {firstItem?.itemType ? (
                            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                              {firstItem.itemType.replaceAll(
                                "_",
                                " ",
                              )}
                            </p>
                          ) : null}
                        </td>

                        <td className="px-6 py-5">
                          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-3 py-1.5 text-xs font-semibold text-emerald-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />

                            {order.paymentStatus}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            {order.shippingStatus ===
                            "DELIVERED" ? (
                              <PackageCheck className="h-4 w-4 text-emerald-300" />
                            ) : order.shippingStatus ===
                              "IN_TRANSIT" ? (
                              <Truck className="h-4 w-4 text-sky-300" />
                            ) : (
                              <Clock3 className="h-4 w-4 text-white/30" />
                            )}

                            {getShippingStatusLabel(
                              order.shippingStatus,
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-semibold">
                            {formatCurrency(
                              Number(order.total),
                              order.currency,
                            )}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm text-white/50">
                            {formatDate(
                              order.createdAt,
                            )}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/55 transition hover:border-[#c8ff00]/30 hover:bg-[#c8ff00]/10 hover:text-[#c8ff00]"
                            aria-label={`Apri ordine ${order.orderNumber}`}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}