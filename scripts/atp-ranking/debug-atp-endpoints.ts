import "dotenv/config";

type EndpointTest = {
  label: string;
  url: string;
};

const endpoints: EndpointTest[] = [
  {
    label: "LIVE STANDARD",
    url: "https://www.atptour.com/en/rankings/singles/live",
  },
  {
    label: "LIVE AJAX",
    url: "https://www.atptour.com/en/rankings/singles/live?ajax=true",
  },
  {
    label: "LIVE EMBED",
    url: "https://www.atptour.com/en/rankings/singles/live?embed=true",
  },
  {
    label: "LIVE RANK RANGE",
    url: "https://www.atptour.com/en/rankings/singles/live?rankRange=0-100",
  },
  {
    label: "SINGLES AJAX",
    url: "https://www.atptour.com/en/rankings/singles?ajax=true",
  },
];

async function testEndpoint(
  endpoint: EndpointTest,
) {
  console.log("");
  console.log(
    `🔎 ${endpoint.label}`,
  );

  console.log(
    `🌐 ${endpoint.url}`,
  );

  try {
    const response =
      await fetch(
        endpoint.url,
        {
          method: "GET",

          headers: {
            Accept:
              "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",

            "Accept-Language":
              "en-US,en;q=0.9",

            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
              "AppleWebKit/537.36 (KHTML, like Gecko) " +
              "Chrome/151.0.0.0 Safari/537.36",
          },

          redirect:
            "follow",

          cache:
            "no-store",
        },
      );

    const contentType =
      response.headers.get(
        "content-type",
      ) ?? "unknown";

    console.log(
      `📡 Status: ${response.status} ${response.statusText}`,
    );

    console.log(
      `📦 Content-Type: ${contentType}`,
    );

    if (!response.ok) {
      console.log(
        "❌ Endpoint non accessibile.",
      );

      return;
    }

    const body =
      await response.text();

    console.log(
      `📏 Response size: ${body.length.toLocaleString("en-US")} characters`,
    );

    const containsSinner =
      body
        .toLowerCase()
        .includes(
          "jannik sinner",
        );

    const containsRanking =
      body
        .toLowerCase()
        .includes(
          "live rank",
        );

    const playerLinks =
      body.match(
        /\/en\/players\/[^"'<>\\s]+\/[^"'<>\\s]+\/overview/gi,
      ) ?? [];

    const uniquePlayerLinks =
      new Set(
        playerLinks,
      );

    console.log(
      `🎾 Contains Jannik Sinner: ${containsSinner ? "YES" : "NO"}`,
    );

    console.log(
      `📊 Contains "Live Rank": ${containsRanking ? "YES" : "NO"}`,
    );

    console.log(
      `🔗 Player links detected: ${uniquePlayerLinks.size}`,
    );

    if (
      containsSinner &&
      containsRanking
    ) {
      console.log(
        "🟢 POSSIBLE RANKING SOURCE",
      );
    } else {
      console.log(
        "🟡 Response received, but ranking data not confirmed.",
      );
    }
  } catch (error) {
    console.error(
      "❌ Request failed:",
      error,
    );
  }
}

async function main() {
  console.log(
    "🎾 AGE202 ATP ENDPOINT DIAGNOSTIC",
  );

  console.log(
    "────────────────────────────────",
  );

  for (
    const endpoint
    of endpoints
  ) {
    await testEndpoint(
      endpoint,
    );
  }

  console.log("");
  console.log(
    "────────────────────────────────",
  );

  console.log(
    "🏁 Diagnostic completed.",
  );
}

main().catch(
  (error) => {
    console.error(
      "❌ Fatal diagnostic error:",
      error,
    );

    process.exitCode = 1;
  },
);