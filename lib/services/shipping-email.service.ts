import "server-only";


import { Resend } from "resend";

import { prisma } from "@/lib/prisma";


type SendShippingEmailResult = {
  sent: boolean;
  skipped: boolean;
  reason?: string;
  emailId?: string;
};


function getResendApiKey() {
  return (
    process.env.RESEND_API_KEY
      ?.trim() ||
    null
  );
}


function getOrderFromEmail() {
  return (
    process.env.ORDER_EMAIL_FROM
      ?.trim() ||
    "AGE202 <orders@age202.com>"
  );
}


function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL
      ?.trim()
      ?.replace(/\/+$/, "") ||
    "https://www.age202.com"
  );
}


function escapeHtml(
  value: string,
) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


async function getOrderForShippingEmail(
  orderId: string,
) {
  return prisma.order.findUnique({
    where: {
      id: orderId,
    },

    include: {
      items: true,
    },
  });
}


async function sendShippingEmail(
  orderId: string,
  type:
    | "IN_TRANSIT"
    | "DELIVERED",
  options: {
    allowTestOrder: boolean;
    requireTestOrder: boolean;
    recipientOverride: string | null;
    subjectPrefix: string;
  },
): Promise<SendShippingEmailResult> {
  const normalizedOrderId =
    orderId.trim();

  if (!normalizedOrderId) {
    return {
      sent: false,
      skipped: true,
      reason: "orderId mancante.",
    };
  }


  const apiKey =
    getResendApiKey();

  if (!apiKey) {
    return {
      sent: false,
      skipped: true,
      reason: "RESEND_API_KEY non configurata.",
    };
  }


  const order =
    await getOrderForShippingEmail(
      normalizedOrderId,
    );

  if (!order) {
    return {
      sent: false,
      skipped: true,
      reason: "Ordine AGE202 non trovato.",
    };
  }


  if (
    order.isTest &&
    !options.allowTestOrder
  ) {
    return {
      sent: false,
      skipped: true,
      reason:
        "Ordine Stripe TEST: email spedizione cliente bloccata per sicurezza.",
    };
  }


  if (
    options.requireTestOrder &&
    !order.isTest
  ) {
    return {
      sent: false,
      skipped: true,
      reason:
        "Preview consentita soltanto con un ordine Stripe TEST.",
    };
  }


  const customerEmail =
    order.customerEmail?.trim() ||
    null;


  const recipientEmail =
    options.recipientOverride ||
    customerEmail;


  if (!recipientEmail) {
    return {
      sent: false,
      skipped: true,
      reason: "Email destinatario mancante.",
    };
  }


  const customerName =
    order.customerName?.trim() ||
    order.shippingName?.trim() ||
    "Cliente AGE202";


  const productName =
    order.items[0]
      ?.productName
      ?.trim() ||
    "AGE202 item";


  const trackingNumber =
    order.inpostTrackingNumber
      ?.trim() ||
    "Tracking in aggiornamento";


  const pickupName =
    order.inpostPointName
      ?.trim() ||
    order.inpostPointId
      ?.trim() ||
    "Punto InPost selezionato";


  const pickupAddress =
    order.inpostPointAddress
      ?.trim() ||
    "";


  const siteUrl =
    getSiteUrl();


  const isDelivered =
    type ===
    "DELIVERED";


  const baseSubject =
    isDelivered
      ? `AGE202 · Ordine ${order.orderNumber} consegnato`
      : `AGE202 · Ordine ${order.orderNumber} in viaggio`;


  const subject =
    `${options.subjectPrefix}${baseSubject}`;


  const eyebrow =
    isDelivered
      ? "Delivery completed"
      : "Shipment update";


  const title =
    isDelivered
      ? "Il tuo ordine è arrivato."
      : "Il tuo ordine è in viaggio.";


  const intro =
    isDelivered
      ? `Ciao ${escapeHtml(
          customerName,
        )}, InPost ha confermato la consegna del tuo ordine AGE202.`
      : `Ciao ${escapeHtml(
          customerName,
        )}, il tuo ordine AGE202 è stato affidato a InPost ed è ora in viaggio.`;


  const statusLabel =
    isDelivered
      ? "Consegnato"
      : "In transito";


  const statusDescription =
    isDelivered
      ? "La spedizione risulta completata."
      : "La spedizione è entrata nel network InPost.";


  const text = [
    "AGE202 · The Digital Tennis Museum",
    "",
    title,
    "",
    `Ciao ${customerName},`,
    isDelivered
      ? "InPost ha confermato la consegna del tuo ordine AGE202."
      : "Il tuo ordine AGE202 è stato affidato a InPost ed è ora in viaggio.",
    "",
    `Ordine: ${order.orderNumber}`,
    `Articolo: ${productName}`,
    `Tracking: ${trackingNumber}`,
    "",
    `Punto InPost: ${pickupName}`,
    ...(pickupAddress
      ? [
          pickupAddress,
        ]
      : []),
    "",
    `Stato: ${statusLabel}`,
    "",
    `AGE202: ${siteUrl}`,
    "",
    "Second Hand. First Set.",
  ].join("\n");


  const html = `
<!doctype html>
<html lang="it">
  <head>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1"
    />
    <meta
      name="color-scheme"
      content="dark"
    />
    <meta
      name="supported-color-schemes"
      content="dark"
    />
    <title>${escapeHtml(subject)}</title>
  </head>

  <body
    style="
      margin:0;
      padding:0;
      background:#050b18;
      color:#ffffff;
      font-family:Arial,Helvetica,sans-serif;
    "
  >
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="
        width:100%;
        background:#050b18;
        border-collapse:collapse;
      "
    >
      <tr>
        <td
          align="center"
          style="
            padding:32px 14px 48px;
          "
        >
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              width:100%;
              max-width:720px;
              border-collapse:separate;
              background:#08111f;
              border:1px solid #1b2738;
              border-radius:24px;
              overflow:hidden;
            "
          >
            <tr>
              <td
                style="
                  padding:34px;
                  background:#07101d;
                  border-bottom:1px solid #1b2738;
                "
              >
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    width:100%;
                    border-collapse:collapse;
                  "
                >
                  <tr>
                    <td>
                      <div
                        style="
                          font-size:12px;
                          line-height:1;
                          font-weight:900;
                          letter-spacing:3.5px;
                          text-transform:uppercase;
                          color:#c8ff00;
                        "
                      >
                        AGE202
                      </div>

                      <div
                        style="
                          margin-top:8px;
                          font-size:11px;
                          line-height:1.5;
                          letter-spacing:1.8px;
                          text-transform:uppercase;
                          color:#6f7c90;
                        "
                      >
                        The Digital Tennis Museum
                      </div>
                    </td>

                    <td
                      align="right"
                    >
                      <span
                        style="
                          display:inline-block;
                          padding:8px 12px;
                          border:1px solid #33420a;
                          border-radius:999px;
                          background:#111b0b;
                          font-size:10px;
                          line-height:1;
                          font-weight:800;
                          letter-spacing:1.4px;
                          text-transform:uppercase;
                          color:#c8ff00;
                        "
                      >
                        ${escapeHtml(
                          statusLabel,
                        )}
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>


            <tr>
              <td
                style="
                  padding:40px 34px 18px;
                "
              >
                <div
                  style="
                    font-size:11px;
                    line-height:1;
                    letter-spacing:2.5px;
                    text-transform:uppercase;
                    color:#8290a5;
                    font-weight:700;
                  "
                >
                  ${escapeHtml(
                    eyebrow,
                  )}
                </div>

                <h1
                  style="
                    margin:14px 0 0;
                    font-size:38px;
                    line-height:1.08;
                    letter-spacing:-1.2px;
                    color:#ffffff;
                  "
                >
                  ${escapeHtml(
                    title,
                  )}
                </h1>

                <p
                  style="
                    margin:20px 0 0;
                    font-size:16px;
                    line-height:1.75;
                    color:#aab5c6;
                  "
                >
                  ${intro}
                </p>
              </td>
            </tr>


            <tr>
              <td
                style="
                  padding:18px 34px 0;
                "
              >
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    width:100%;
                    border-collapse:separate;
                    background:#0b1524;
                    border:1px solid #223047;
                    border-radius:18px;
                  "
                >
                  <tr>
                    <td
                      style="
                        padding:22px;
                      "
                    >
                      <div
                        style="
                          font-size:10px;
                          line-height:1;
                          letter-spacing:2px;
                          text-transform:uppercase;
                          color:#748198;
                        "
                      >
                        Ordine
                      </div>

                      <div
                        style="
                          margin-top:7px;
                          font-size:18px;
                          line-height:1.4;
                          font-weight:800;
                          color:#ffffff;
                        "
                      >
                        ${escapeHtml(
                          order.orderNumber,
                        )}
                      </div>

                      <div
                        style="
                          margin-top:18px;
                          font-size:10px;
                          line-height:1;
                          letter-spacing:2px;
                          text-transform:uppercase;
                          color:#748198;
                        "
                      >
                        Articolo
                      </div>

                      <div
                        style="
                          margin-top:7px;
                          font-size:16px;
                          line-height:1.5;
                          font-weight:700;
                          color:#ffffff;
                        "
                      >
                        ${escapeHtml(
                          productName,
                        )}
                      </div>

                      <div
                        style="
                          margin-top:18px;
                          font-size:10px;
                          line-height:1;
                          letter-spacing:2px;
                          text-transform:uppercase;
                          color:#748198;
                        "
                      >
                        Tracking InPost
                      </div>

                      <div
                        style="
                          margin-top:7px;
                          font-size:17px;
                          line-height:1.4;
                          font-weight:800;
                          color:#c8ff00;
                        "
                      >
                        ${escapeHtml(
                          trackingNumber,
                        )}
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>


            <tr>
              <td
                style="
                  padding:28px 34px 0;
                "
              >
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    width:100%;
                    border-collapse:separate;
                    background:#0d160c;
                    border:1px solid #33420a;
                    border-radius:18px;
                  "
                >
                  <tr>
                    <td
                      style="
                        padding:22px;
                      "
                    >
                      <div
                        style="
                          font-size:10px;
                          line-height:1;
                          letter-spacing:2px;
                          text-transform:uppercase;
                          color:#c8ff00;
                          font-weight:800;
                        "
                      >
                        Pickup location · InPost
                      </div>

                      <div
                        style="
                          margin-top:10px;
                          font-size:18px;
                          line-height:1.4;
                          font-weight:800;
                          color:#ffffff;
                        "
                      >
                        ${escapeHtml(
                          pickupName,
                        )}
                      </div>

                      ${
                        pickupAddress
                          ? `
                      <div
                        style="
                          margin-top:7px;
                          font-size:14px;
                          line-height:1.65;
                          color:#a8b39d;
                        "
                      >
                        ${escapeHtml(
                          pickupAddress,
                        )}
                      </div>
                      `
                          : ""
                      }
                    </td>
                  </tr>
                </table>
              </td>
            </tr>


            <tr>
              <td
                style="
                  padding:30px 34px 0;
                "
              >
                <div
                  style="
                    font-size:11px;
                    line-height:1;
                    letter-spacing:2px;
                    text-transform:uppercase;
                    color:#c8ff00;
                    font-weight:800;
                  "
                >
                  Stato spedizione
                </div>

                <div
                  style="
                    margin-top:12px;
                    padding:18px 20px;
                    border:1px solid #223047;
                    border-radius:16px;
                    background:#0b1524;
                  "
                >
                  <div
                    style="
                      font-size:17px;
                      line-height:1.4;
                      font-weight:800;
                      color:#ffffff;
                    "
                  >
                    ${escapeHtml(
                      statusLabel,
                    )}
                  </div>

                  <div
                    style="
                      margin-top:5px;
                      font-size:13px;
                      line-height:1.6;
                      color:#8995a8;
                    "
                  >
                    ${escapeHtml(
                      statusDescription,
                    )}
                  </div>
                </div>
              </td>
            </tr>


            <tr>
              <td
                align="center"
                style="
                  padding:36px 34px 10px;
                "
              >
                <a
                  href="${escapeHtml(
                    siteUrl,
                  )}"
                  style="
                    display:inline-block;
                    padding:15px 24px;
                    border-radius:999px;
                    background:#c8ff00;
                    color:#050b18;
                    text-decoration:none;
                    font-size:12px;
                    line-height:1;
                    font-weight:900;
                    letter-spacing:1.4px;
                    text-transform:uppercase;
                  "
                >
                  Explore AGE202
                </a>
              </td>
            </tr>


            <tr>
              <td
                style="
                  padding:28px 34px 34px;
                "
              >
                <div
                  style="
                    padding-top:24px;
                    border-top:1px solid #1b2738;
                    text-align:center;
                  "
                >
                  <div
                    style="
                      font-size:11px;
                      line-height:1;
                      font-weight:900;
                      letter-spacing:3px;
                      text-transform:uppercase;
                      color:#c8ff00;
                    "
                  >
                    AGE202
                  </div>

                  <div
                    style="
                      margin-top:9px;
                      font-size:10px;
                      line-height:1.6;
                      letter-spacing:1.7px;
                      text-transform:uppercase;
                      color:#657186;
                    "
                  >
                    Second Hand. First Set.
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;


  const resend =
    new Resend(
      apiKey,
    );


  const response =
    await resend.emails.send({
      from:
        getOrderFromEmail(),

      to: [
        recipientEmail,
      ],

      subject,

      text,

      html,
    });


  if (
    response.error
  ) {
    throw new Error(
      `Errore Resend: ${response.error.message}`,
    );
  }


  return {
    sent:
      true,

    skipped:
      false,

    emailId:
      response.data
        ?.id,
  };
}


export async function sendShippingInTransitEmail(
  orderId: string,
): Promise<SendShippingEmailResult> {
  return sendShippingEmail(orderId, "IN_TRANSIT", {
    allowTestOrder: false,
    requireTestOrder: false,
    recipientOverride: null,
    subjectPrefix: "",
  });
}


export async function sendShippingDeliveredEmail(
  orderId: string,
): Promise<SendShippingEmailResult> {
  return sendShippingEmail(orderId, "DELIVERED", {
    allowTestOrder: false,
    requireTestOrder: false,
    recipientOverride: null,
    subjectPrefix: "",
  });
}


async function sendShippingEmailPreview(
  orderId: string,
  type: "IN_TRANSIT" | "DELIVERED",
): Promise<SendShippingEmailResult> {
  const testRecipient =
    process.env.TEST_EMAIL_TO?.trim();

  if (!testRecipient) {
    return {
      sent: false,
      skipped: true,
      reason: "TEST_EMAIL_TO non configurata.",
    };
  }

  return sendShippingEmail(orderId, type, {
    allowTestOrder: true,
    requireTestOrder: true,
    recipientOverride: testRecipient,
    subjectPrefix: "[PREVIEW] ",
  });
}


export async function sendShippingInTransitEmailPreview(
  orderId: string,
): Promise<SendShippingEmailResult> {
  return sendShippingEmailPreview(orderId, "IN_TRANSIT");
}


export async function sendShippingDeliveredEmailPreview(
  orderId: string,
): Promise<SendShippingEmailResult> {
  return sendShippingEmailPreview(orderId, "DELIVERED");
}
