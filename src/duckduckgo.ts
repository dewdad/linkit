import { parse } from "node-html-parser";
import type { SearchResult } from "./types";

const DDG_HTML_ENDPOINT = "https://html.duckduckgo.com/html/";
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

function decodeDuckDuckGoUrl(rawUrl: string): string {
  try {
    const normalized = rawUrl.startsWith("//") ? `https:${rawUrl}` : rawUrl;
    const parsed = new URL(normalized);
    const uddg = parsed.searchParams.get("uddg");
    if (uddg) return decodeURIComponent(uddg);
  } catch {
    // intentional: rawUrl is already a direct link
  }
  return rawUrl;
}

export async function searchDuckDuckGo(
  query: string,
  maxResults = 10,
): Promise<SearchResult[]> {
  const url = `${DDG_HTML_ENDPOINT}?q=${encodeURIComponent(query)}`;

  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`DuckDuckGo search failed: HTTP ${response.status}`);
  }

  const html = await response.text();
  const root = parse(html);
  const resultNodes = root.querySelectorAll(".result.web-result");
  const results: SearchResult[] = [];

  for (const node of resultNodes) {
    if (results.length >= maxResults) break;

    const titleNode = node.querySelector(".result__a");
    const snippetNode = node.querySelector(".result__snippet");

    if (!titleNode) continue;

    const title = titleNode.text.trim();
    const rawHref = titleNode.getAttribute("href") ?? "";
    const url = decodeDuckDuckGoUrl(rawHref);
    const snippet = snippetNode?.text.trim() ?? "";

    if (title && url && url.startsWith("http")) {
      results.push({ title, url, snippet });
    }
  }

  return results;
}
