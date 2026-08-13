import {
  ATP_LIVE_RANKING_URL,
  ATP_RANKING_SOURCE,
  type AtpLiveRankingDataset,
} from "./types";


const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/151.0.0.0 Safari/537.36";


export async function fetchAtpLiveRankingHtml(): Promise<string> {
  const response =
    await fetch(
      ATP_LIVE_RANKING_URL,
      {
        method: "GET",

        headers: {
          "User-Agent":
            USER_AGENT,

          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",

          "Accept-Language":
            "en-GB,en;q=0.9",
        },

        cache:
          "no-store",
      },
    );


  if (!response.ok) {
    throw new Error(
      [
        "ATP Live Ranking fetch fallito.",
        `HTTP ${response.status}`,
        response.statusText,
      ].join(" "),
    );
  }


  const html =
    await response.text();


  if (!html.trim()) {
    throw new Error(
      "ATP Live Ranking ha restituito HTML vuoto.",
    );
  }


  return html;
}


export function createEmptyAtpLiveRankingDataset(): AtpLiveRankingDataset {
  return {
    source:
      ATP_RANKING_SOURCE,

    sourceUrl:
      ATP_LIVE_RANKING_URL,

    fetchedAt:
      new Date(),

    entries: [],
  };
}