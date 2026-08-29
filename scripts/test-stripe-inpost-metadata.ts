type InPostPointType =
  | "APM"
  | "PUDO";

type ShippingMethod =
  | "INPOST_LOCKER"
  | "INPOST_POINT";

function normalizeInPostPointType(
  value: string | undefined,
): InPostPointType | null {
  const normalized =
    value
      ?.trim()
      .toUpperCase();

  if (normalized === "APM") {
    return "APM";
  }

  if (normalized === "PUDO") {
    return "PUDO";
  }

  return null;
}

function mapInPostPointTypeToShippingMethod(
  pointType: InPostPointType,
): ShippingMethod {
  if (pointType === "APM") {
    return "INPOST_LOCKER";
  }

  return "INPOST_POINT";
}

function testMetadata({
  name,
  inpostPointId,
  inpostPointType,
}: {
  name: string;
  inpostPointId: string;
  inpostPointType: string;
}) {
  console.log("");
  console.log(`🧪 ${name}`);

  const pointId =
    inpostPointId.trim() || null;

  const pointType =
    normalizeInPostPointType(
      inpostPointType,
    );

  if (!pointId) {
    throw new Error(
      "inpostPointId mancante.",
    );
  }

  if (!pointType) {
    throw new Error(
      `Tipo InPost non valido: ${inpostPointType}`,
    );
  }

  const shippingMethod =
    mapInPostPointTypeToShippingMethod(
      pointType,
    );

  const simulatedOrder = {
    shippingProvider:
      "INPOST",

    shippingMethod,

    shippingStatus:
      "READY_TO_CREATE",

    inpostPointId:
      pointId,
  };

  console.log(
    "Point type:",
    pointType,
  );

  console.log(
    "Shipping method:",
    shippingMethod,
  );

  console.log(
    "Order simulato:",
    simulatedOrder,
  );

  console.log(
    "✅ TEST SUPERATO",
  );
}

function main() {
  console.log(
    "======================================",
  );

  console.log(
    " AGE202 Stripe → InPost metadata test",
  );

  console.log(
    "======================================",
  );

  console.log(
    "⚠️ Nessun pagamento verrà effettuato.",
  );

  console.log(
    "⚠️ Nessuna sessione Stripe verrà creata.",
  );

  console.log(
    "⚠️ Nessuna spedizione InPost verrà creata.",
  );

  testMetadata({
    name:
      "Locker InPost / APM",

    inpostPointId:
      "IT_TEST_APM_001",

    inpostPointType:
      "APM",
  });

  testMetadata({
    name:
      "Punto InPost / PUDO",

    inpostPointId:
      "IT_TEST_PUDO_001",

    inpostPointType:
      "PUDO",
  });

  console.log("");
  console.log(
    "======================================",
  );

  console.log(
    "✅ TUTTI I TEST COMPLETATI",
  );

  console.log(
    "======================================",
  );
}

main();