import "dotenv/config";

import {
  Resend,
} from "resend";


async function main() {
  console.log("");
  console.log(
    "AGE202 · RESEND EMAIL TEST",
  );
  console.log(
    "==========================",
  );
  console.log("");

  const apiKey =
    process.env.RESEND_API_KEY
      ?.trim();

  const from =
    process.env.ORDER_EMAIL_FROM
      ?.trim();

  const to =
    process.env.TEST_EMAIL_TO
      ?.trim();


  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY non configurata.",
    );
  }


  if (!from) {
    throw new Error(
      "ORDER_EMAIL_FROM non configurata.",
    );
  }


  if (!to) {
    throw new Error(
      "TEST_EMAIL_TO non configurata.",
    );
  }


  console.log(
    `Mittente: ${from}`,
  );

  console.log(
    `Destinatario test: ${to}`,
  );

  console.log("");


  const resend =
    new Resend(
      apiKey,
    );


  const {
    data,
    error,
  } =
    await resend.emails.send({
      from,

      to: [
        to,
      ],

      subject:
        "AGE202 · Test email conferma ordine",

      text:
        [
          "AGE202 · The Digital Tennis Museum",
          "",
          "Questa è una email di test.",
          "",
          "La configurazione Resend di AGE202 funziona correttamente.",
          "",
          "Nessun ordine reale è stato creato o modificato.",
        ].join(
          "\n",
        ),

      html: `
        <!doctype html>

        <html>
          <body
            style="
              margin: 0;
              padding: 0;
              background: #050b18;
              color: #ffffff;
              font-family:
                Arial,
                Helvetica,
                sans-serif;
            "
          >
            <div
              style="
                max-width: 640px;
                margin: 0 auto;
                padding: 48px 24px;
              "
            >
              <div
                style="
                  color: #c8ff00;
                  font-size: 13px;
                  font-weight: 700;
                  letter-spacing: 0.18em;
                  text-transform: uppercase;
                  margin-bottom: 14px;
                "
              >
                AGE202
              </div>

              <h1
                style="
                  margin: 0 0 20px;
                  font-size: 30px;
                  line-height: 1.15;
                "
              >
                Email test configurata
              </h1>

              <p
                style="
                  margin: 0 0 20px;
                  color: #cbd5e1;
                  font-size: 16px;
                  line-height: 1.7;
                "
              >
                Questa email conferma che
                Resend è collegato correttamente
                ad AGE202.
              </p>

              <div
                style="
                  margin-top: 28px;
                  padding: 20px;
                  border: 1px solid #273449;
                  border-radius: 14px;
                  background: #0b1424;
                "
              >
                <strong
                  style="
                    color: #c8ff00;
                  "
                >
                  TEST ONLY
                </strong>

                <p
                  style="
                    margin: 10px 0 0;
                    color: #cbd5e1;
                    line-height: 1.6;
                  "
                >
                  Nessun ordine reale è stato
                  creato o modificato.
                </p>
              </div>

              <p
                style="
                  margin-top: 40px;
                  color: #64748b;
                  font-size: 13px;
                "
              >
                AGE202 · The Digital Tennis Museum
              </p>
            </div>
          </body>
        </html>
      `,
    });


  if (error) {
    throw new Error(
      `Errore Resend: ${error.message}`,
    );
  }


  console.log(
    "✅ EMAIL TEST INVIATA",
  );

  console.log(
    `Resend email ID: ${data?.id ?? "non disponibile"}`,
  );

  console.log("");
  console.log(
    "Nessun ordine AGE202 è stato modificato.",
  );
}


main()
  .catch(
    (
      error,
    ) => {
      console.error("");
      console.error(
        "❌ TEST FALLITO",
      );

      console.error(
        error,
      );

      process.exitCode =
        1;
    },
  );