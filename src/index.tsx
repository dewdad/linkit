import {
  Action,
  ActionPanel,
  Clipboard,
  Icon,
  List,
  getSelectedText,
  showToast,
  Toast,
  closeMainWindow,
} from "@raycast/api";
import { useCallback, useEffect, useState } from "react";
import { searchDuckDuckGo } from "./duckduckgo";
import type { SearchResult } from "./types";
import { formatResultsAsMarkdown } from "./utils";

export default function Command() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const text = await getSelectedText();
        if (!text.trim()) {
          await showToast({
            style: Toast.Style.Failure,
            title: "No text selected",
          });
          setIsLoading(false);
          return;
        }
        setQuery(text.trim());
      } catch {
        await showToast({
          style: Toast.Style.Failure,
          title: "Cannot read selected text",
          message: "Select some text before running this command",
        });
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!query) return;

    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const data = await searchDuckDuckGo(query);
        if (!cancelled) {
          setResults(data);
          if (data.length === 0) {
            await showToast({
              style: Toast.Style.Failure,
              title: "No results found",
            });
          }
        }
      } catch (err) {
        if (!cancelled) {
          await showToast({
            style: Toast.Style.Failure,
            title: "Search failed",
            message: err instanceof Error ? err.message : String(err),
          });
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [query]);

  const toggleSelect = useCallback((url: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(url)) {
        next.delete(url);
      } else {
        next.add(url);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelected(new Set(results.map((r) => r.url)));
  }, [results]);

  const deselectAll = useCallback(() => {
    setSelected(new Set());
  }, []);

  const pasteSelected = useCallback(async () => {
    const chosen = results.filter((r) => selected.has(r.url));
    if (chosen.length === 0) {
      await showToast({
        style: Toast.Style.Failure,
        title: "No results selected",
      });
      return;
    }
    const markdown = formatResultsAsMarkdown(chosen);
    await Clipboard.paste(markdown);
    await closeMainWindow();
  }, [results, selected]);

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Refine search..."
      navigationTitle={query ? `LinkIt: "${query}"` : "LinkIt"}
      onSearchTextChange={(text) => {
        if (text && text !== query) setQuery(text);
      }}
      throttle
    >
      {selected.size > 0 && (
        <List.Section title={`${selected.size} selected`}>
          <List.Item
            title={`Paste ${selected.size} link${selected.size > 1 ? "s" : ""}`}
            icon={Icon.Clipboard}
            actions={
              <ActionPanel>
                <Action
                  title="Paste Selected Links"
                  icon={Icon.Clipboard}
                  onAction={pasteSelected}
                />
                <Action
                  title="Deselect All"
                  icon={Icon.XMarkCircle}
                  onAction={deselectAll}
                />
              </ActionPanel>
            }
          />
        </List.Section>
      )}
      <List.Section title="Results">
        {results.map((result) => {
          const isSelected = selected.has(result.url);
          return (
            <List.Item
              key={result.url}
              title={result.title}
              subtitle={result.snippet}
              icon={isSelected ? Icon.CheckCircle : Icon.Circle}
              accessories={[{ text: new URL(result.url).hostname }]}
              actions={
                <ActionPanel>
                  <Action
                    title={isSelected ? "Deselect" : "Select"}
                    icon={isSelected ? Icon.XMarkCircle : Icon.CheckCircle}
                    onAction={() => toggleSelect(result.url)}
                  />
                  <Action
                    title="Paste Selected Links"
                    icon={Icon.Clipboard}
                    onAction={pasteSelected}
                  />
                  <Action
                    title="Select All"
                    icon={Icon.CheckCircle}
                    onAction={selectAll}
                  />
                  <Action
                    title="Deselect All"
                    icon={Icon.XMarkCircle}
                    onAction={deselectAll}
                  />
                  <Action.OpenInBrowser url={result.url} />
                  <Action.CopyToClipboard
                    title="Copy URL"
                    content={result.url}
                  />
                </ActionPanel>
              }
            />
          );
        })}
      </List.Section>
    </List>
  );
}
