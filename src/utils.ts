import type { SearchResult } from "./types";

export function formatResultsAsMarkdown(results: SearchResult[]): string {
  return results
    .map((r) => `[${escapeMdBrackets(r.title)}](${r.url})`)
    .join("\n");
}

function escapeMdBrackets(text: string): string {
  return text.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
}
