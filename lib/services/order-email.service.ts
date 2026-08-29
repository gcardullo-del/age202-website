import "server-only";


import { Resend } from "resend";

import { prisma } from "@/lib/prisma";


type SendOrderConfirmationEmailResult = {
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


function formatCurrency(
  value: {
    toString(): string;
  },
  currency: string,
) {
  const amount =
    Number(
      value.toString(),
    );

  if (
    !Number.isFinite(
      amount,
    )
  ) {
    return `${value.toString()} ${currency}`;
  }

  return new Intl.NumberFormat(
    "it-IT",
    {
      style:
        "currency",

      currency,
    },
  ).format(
    amount,
  );
}


function escapeHtml(
  value:
    string,
) {
  return value
    .replaceAll(
      "&",
      "&amp;",
    )
    .replaceAll(
      "<",
      "&lt;",
    )
    .replaceAll(
      ">",
      "&gt;",
    )
    .replaceAll(
      '"',
      "&quot;",
    )
    .replaceAll(
      "'",
      "&#039;",
    );
}


function renderOrderItemRows(
  items: Array<{
    productName: string;
    quantity: number;
    totalPrice: {
      toString(): string;
    };
    currency: string;
    size: string | null;
  }>,
) {
  return items
    .map(
      (
        item,
      ) => {
        const price =
          formatCurrency(
            item.totalPrice,
            item.currency,
          );

        const size =
          item.size?.trim();

        return `
          <tr>
            <td style="padding:18px 0;border-bottom:1px solid #1c2738;vertical-align:top;">
              <div style="font-size:16px;line-height:1.5;font-weight:700;color:#ffffff;">
                ${escapeHtml(item.productName)}
              </div>
              <div style="margin-top:5px;font-size:12px;line-height:1.5;color:#778399;">
                Quantità: ${item.quantity}${
                  size
                    ? `&nbsp;&nbsp;·&nbsp;&nbsp;Taglia: ${escapeHtml(size)}`
                    : ""
                }
              </div>
            </td>
            <td align="right" style="padding:18px 0 18px 18px;border-bottom:1px solid #1c2738;vertical-align:top;white-space:nowrap;font-size:16px;line-height:1.5;font-weight:700;color:#ffffff;">
              ${escapeHtml(price)}
            </td>
          </tr>
        `;
      },
    )
    .join("");
}


type SendOrderConfirmationEmailOptions = {
  allowTestOrder: boolean;
  requireTestOrder: boolean;
  recipientOverride?: string;
  subjectPrefix?: string;
};


async function sendOrderConfirmationEmailInternal(
  orderId:
    string,
  options:
    SendOrderConfirmationEmailOptions,
): Promise<SendOrderConfirmationEmailResult> {
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
    await prisma.order.findUnique({
      where: {
        id: normalizedOrderId,
      },
      include: {
        items: true,
      },
    });

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
      reason: "Ordine Stripe TEST: email cliente bloccata per sicurezza.",
    };
  }

  if (
    options.requireTestOrder &&
    !order.isTest
  ) {
    return {
      sent: false,
      skipped: true,
      reason: "Preview consentita solo su ordini Stripe TEST.",
    };
  }

  const recipientEmail =
    options.recipientOverride?.trim() ||
    order.customerEmail?.trim();

  if (!recipientEmail) {
    return {
      sent: false,
      skipped: true,
      reason: options.recipientOverride
        ? "Email destinatario preview mancante."
        : "Email cliente mancante.",
    };
  }

  const customerName =
    order.customerName?.trim() ||
    order.shippingName?.trim() ||
    "Cliente AGE202";

  const subtotal =
    formatCurrency(order.subtotal, order.currency);

  const shipping =
    formatCurrency(order.shipping, order.currency);

  const total =
    formatCurrency(order.total, order.currency);

  const hasInPostPoint =
    Boolean(
      order.inpostPointId ||
      order.inpostPointName ||
      order.inpostPointAddress,
    );

  const inPostPointName =
    order.inpostPointName?.trim() ||
    order.inpostPointId?.trim() ||
    "Punto InPost selezionato";

  const inPostPointAddress =
    order.inpostPointAddress?.trim() ||
    "";

  const siteUrl =
    getSiteUrl();

  const subject =
    `${options.subjectPrefix ?? ""}AGE202 · Ordine ${order.orderNumber} confermato`;

  const itemRows =
    renderOrderItemRows(order.items);

  const text = [
    "AGE202 · The Digital Tennis Museum",
    "",
    `Ordine ${order.orderNumber} confermato`,
    "",
    `Ciao ${customerName},`,
    "il pagamento è stato confermato e il tuo ordine AGE202 è stato registrato correttamente.",
    "",
    ...order.items.flatMap((item) => [
      item.productName,
      `Quantità: ${item.quantity}${item.size ? ` · Taglia: ${item.size}` : ""}`,
      `Totale articolo: ${formatCurrency(item.totalPrice, item.currency)}`,
      "",
    ]),
    `Subtotale: ${subtotal}`,
    `Spedizione: ${shipping}`,
    `Totale: ${total}`,
    "",
    ...(hasInPostPoint
      ? [
          "Punto InPost selezionato:",
          inPostPointName,
          ...(inPostPointAddress ? [inPostPointAddress] : []),
          ...(order.inpostPointId ? [`Point ID: ${order.inpostPointId}`] : []),
          "",
        ]
      : []),
    "Cosa succede adesso?",
    "1. Prepariamo e controlliamo il tuo ordine.",
    "2. Affidiamo il pacco a InPost.",
    "3. Riceverai gli aggiornamenti di spedizione e ritiro.",
    "",
    `Visita AGE202: ${siteUrl}`,
    "",
    "Second Hand. First Set.",
  ].join("\n");

  const html = `
<!doctype html>
<html lang="it">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="dark" />
    <meta name="supported-color-schemes" content="dark" />
    <title>Ordine AGE202 confermato</title>
  </head>
  <body style="margin:0;padding:0;background:#050b18;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      Il tuo ordine AGE202 ${escapeHtml(order.orderNumber)} è stato confermato.
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#050b18;border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:32px 14px 48px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:720px;border-collapse:separate;background:#08111f;border:1px solid #1b2738;border-radius:24px;overflow:hidden;">
            <tr>
              <td style="padding:34px 34px 26px;background:#07101d;border-bottom:1px solid #1b2738;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td style="vertical-align:middle;">
                      <div style="font-size:12px;line-height:1;font-weight:900;letter-spacing:3.5px;text-transform:uppercase;color:#c8ff00;">AGE202</div>
                      <div style="margin-top:8px;font-size:11px;line-height:1.5;letter-spacing:1.8px;text-transform:uppercase;color:#6f7c90;">The Digital Tennis Museum</div>
                    </td>
                    <td align="right" style="vertical-align:middle;">
                      <span style="display:inline-block;padding:8px 12px;border:1px solid #33420a;border-radius:999px;background:#111b0b;font-size:10px;line-height:1;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#c8ff00;">Payment confirmed</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:40px 34px 18px;">
                <div style="font-size:11px;line-height:1;letter-spacing:2.5px;text-transform:uppercase;color:#8290a5;font-weight:700;">Order confirmed</div>
                <h1 style="margin:14px 0 0;font-size:38px;line-height:1.08;letter-spacing:-1.2px;color:#ffffff;">Il tuo pezzo AGE202 è tuo.</h1>
                <p style="margin:20px 0 0;max-width:600px;font-size:16px;line-height:1.75;color:#aab5c6;">
                  Ciao ${escapeHtml(customerName)}, il pagamento è stato confermato. Il tuo ordine è entrato ufficialmente nell'archivio ordini AGE202 e ora inizieremo a prepararlo per la spedizione.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 34px 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:separate;background:#0b1524;border:1px solid #223047;border-radius:18px;">
                  <tr>
                    <td style="padding:20px 22px;">
                      <div style="font-size:10px;line-height:1;letter-spacing:2px;text-transform:uppercase;color:#748198;">Numero ordine</div>
                      <div style="margin-top:8px;font-size:20px;line-height:1.25;font-weight:800;color:#ffffff;">${escapeHtml(order.orderNumber)}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:28px 34px 0;">
                <div style="font-size:11px;line-height:1;letter-spacing:2px;text-transform:uppercase;color:#c8ff00;font-weight:800;">Il tuo ordine</div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin-top:10px;border-collapse:collapse;">
                  ${itemRows}
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 34px 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td style="padding:6px 0;font-size:14px;line-height:1.5;color:#8491a5;">Subtotale</td>
                    <td align="right" style="padding:6px 0;font-size:14px;line-height:1.5;color:#dce3ec;">${escapeHtml(subtotal)}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:14px;line-height:1.5;color:#8491a5;">Spedizione</td>
                    <td align="right" style="padding:6px 0;font-size:14px;line-height:1.5;color:#dce3ec;">${escapeHtml(shipping)}</td>
                  </tr>
                  <tr>
                    <td style="padding:16px 0 0;border-top:1px solid #223047;font-size:16px;line-height:1.5;font-weight:800;color:#ffffff;">Totale</td>
                    <td align="right" style="padding:16px 0 0;border-top:1px solid #223047;font-size:26px;line-height:1.2;font-weight:900;color:#c8ff00;">${escapeHtml(total)}</td>
                  </tr>
                </table>
              </td>
            </tr>

            ${hasInPostPoint ? `
            <tr>
              <td style="padding:32px 34px 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:separate;background:#0d160c;border:1px solid #33420a;border-radius:18px;">
                  <tr>
                    <td style="padding:22px;">
                      <div style="font-size:10px;line-height:1;letter-spacing:2px;text-transform:uppercase;color:#c8ff00;font-weight:800;">Pickup location · InPost</div>
                      <div style="margin-top:11px;font-size:19px;line-height:1.35;font-weight:800;color:#ffffff;">${escapeHtml(inPostPointName)}</div>
                      ${inPostPointAddress ? `<div style="margin-top:7px;font-size:14px;line-height:1.65;color:#a8b39d;">${escapeHtml(inPostPointAddress)}</div>` : ""}
                      ${order.inpostPointId ? `<div style="margin-top:10px;font-size:11px;line-height:1.5;letter-spacing:.6px;color:#6f7d67;">Point ID: ${escapeHtml(order.inpostPointId)}</div>` : ""}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            ` : ""}

            <tr>
              <td style="padding:34px 34px 0;">
                <div style="font-size:11px;line-height:1;letter-spacing:2px;text-transform:uppercase;color:#c8ff00;font-weight:800;">What happens next?</div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin-top:16px;border-collapse:collapse;">
                  <tr>
                    <td width="42" style="padding:0 14px 18px 0;vertical-align:top;"><div style="width:30px;height:30px;line-height:30px;text-align:center;border-radius:50%;background:#c8ff00;color:#050b18;font-size:12px;font-weight:900;">1</div></td>
                    <td style="padding:2px 0 18px;vertical-align:top;"><div style="font-size:15px;line-height:1.4;font-weight:800;color:#ffffff;">Preparazione</div><div style="margin-top:4px;font-size:13px;line-height:1.6;color:#8995a8;">Controlliamo e prepariamo il tuo articolo con cura prima della spedizione.</div></td>
                  </tr>
                  <tr>
                    <td width="42" style="padding:0 14px 18px 0;vertical-align:top;"><div style="width:30px;height:30px;line-height:30px;text-align:center;border-radius:50%;border:1px solid #33420a;background:#10190c;color:#c8ff00;font-size:12px;font-weight:900;">2</div></td>
                    <td style="padding:2px 0 18px;vertical-align:top;"><div style="font-size:15px;line-height:1.4;font-weight:800;color:#ffffff;">Spedizione InPost</div><div style="margin-top:4px;font-size:13px;line-height:1.6;color:#8995a8;">Quando il pacco verrà affidato a InPost, inizieranno gli aggiornamenti di tracking.</div></td>
                  </tr>
                  <tr>
                    <td width="42" style="padding:0 14px 0 0;vertical-align:top;"><div style="width:30px;height:30px;line-height:30px;text-align:center;border-radius:50%;border:1px solid #33420a;background:#10190c;color:#c8ff00;font-size:12px;font-weight:900;">3</div></td>
                    <td style="padding:2px 0 0;vertical-align:top;"><div style="font-size:15px;line-height:1.4;font-weight:800;color:#ffffff;">Ritiro</div><div style="margin-top:4px;font-size:13px;line-height:1.6;color:#8995a8;">InPost ti avviserà quando il pacco sarà disponibile nel punto selezionato.</div></td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:36px 34px 10px;">
                <a href="${escapeHtml(siteUrl)}" style="display:inline-block;padding:15px 24px;border-radius:999px;background:#c8ff00;color:#050b18;text-decoration:none;font-size:12px;line-height:1;font-weight:900;letter-spacing:1.4px;text-transform:uppercase;">Explore AGE202</a>
              </td>
            </tr>

            <tr>
              <td style="padding:28px 34px 34px;">
                <div style="padding-top:24px;border-top:1px solid #1b2738;text-align:center;">
                  <div style="font-size:11px;line-height:1;font-weight:900;letter-spacing:3px;text-transform:uppercase;color:#c8ff00;">AGE202</div>
                  <div style="margin-top:9px;font-size:10px;line-height:1.6;letter-spacing:1.7px;text-transform:uppercase;color:#657186;">Second Hand. First Set.</div>
                  <div style="margin-top:14px;font-size:11px;line-height:1.6;color:#596579;">Conserva questa email come riferimento per il tuo ordine.</div>
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
    new Resend(apiKey);

  const response =
    await resend.emails.send({
      from: getOrderFromEmail(),
      to: [recipientEmail],
      subject,
      text,
      html,
    });

  if (response.error) {
    throw new Error(
      `Errore Resend: ${response.error.message}`,
    );
  }

  return {
    sent: true,
    skipped: false,
    emailId: response.data?.id,
  };
}

export async function sendOrderConfirmationEmail(
  orderId:
    string,
): Promise<SendOrderConfirmationEmailResult> {
  return sendOrderConfirmationEmailInternal(
    orderId,
    {
      allowTestOrder:
        false,

      requireTestOrder:
        false,
    },
  );
}


export async function sendOrderConfirmationEmailPreview(
  orderId:
    string,
): Promise<SendOrderConfirmationEmailResult> {
  const testRecipient =
    process.env.TEST_EMAIL_TO
      ?.trim();

  if (
    !testRecipient
  ) {
    return {
      sent:
        false,

      skipped:
        true,

      reason:
        "TEST_EMAIL_TO non configurata.",
    };
  }

  return sendOrderConfirmationEmailInternal(
    orderId,
    {
      allowTestOrder:
        true,

      requireTestOrder:
        true,

      recipientOverride:
        testRecipient,

      subjectPrefix:
        "[PREVIEW] ",
    },
  );
}
