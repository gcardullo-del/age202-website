export function getAvailabilityBadgeClass(
  availability: string,
): string {
  switch (availability) {
    case "AVAILABLE":
      return "border-[#D7FF00]/35 bg-[#D7FF00]/12 text-[#D7FF00]";

    case "SOLD":
      return "border-white/15 bg-white/[0.08] text-white/62";

    default:
      return "border-[#7DD3FC]/25 bg-[#7DD3FC]/10 text-[#BAE6FD]";
  }
}

export function formatPrice(
  value: {
    toString(): string;
  } | null,
  currency: string,
): string | null {
  if (!value) {
    return null;
  }

  const numericValue =
    Number(value.toString());

  if (
    !Number.isFinite(
      numericValue,
    )
  ) {
    return null;
  }

  return new Intl.NumberFormat(
    "it-IT",
    {
      style: "currency",
      currency,
    },
  ).format(numericValue);
}