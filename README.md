# LinkIt

A [Raycast](https://raycast.com) extension that searches the web for your selected text and lets you paste results as markdown links, cards, or rich HTML embeds — without leaving your keyboard.

## How it works

1. Select any text in any app
2. Trigger **Link It** from Raycast
3. Browse search results with a live detail panel
4. Select one or more results and paste them directly into your document

Searches are routed through a **Startpage → DuckDuckGo → Bing** fallback chain for reliability.

## Screenshots

![Search results](screenshots/01-search-results.png)
![Multi-select results](screenshots/02-multiselect-results.png)
![Action panel](screenshots/03-actionpane.png)

## Actions

### On a single result

| Action | Shortcut |
|---|---|
| Select / Deselect | `⌥ Space` |
| Paste selected links | `↵` |
| Select all | `⌘ A` |
| Deselect all | `⌘ D` |
| Copy URL | `⌘ C` |
| Copy title | `⌘ ⇧ T` |
| Copy as markdown link | `⌘ ⇧ L` |
| Copy as markdown card | `⌘ ⇧ C` |
| Open in browser | `⌘ O` |

### With results selected

| Action | Shortcut |
|---|---|
| Paste as markdown links | `↵` |
| Paste as markdown cards | `⌘ ⇧ M` |
| Paste as HTML embed cards | `⌘ ⇧ H` |
| Copy as markdown links | `⌘ ⇧ L` |
| Copy as markdown cards | `⌘ ⇧ C` |
| Deselect all | `⌘ D` |

## Output formats

**Markdown link** — inline link, one per result:
```
[Page Title](https://example.com)
```

**Markdown card** — title, URL, and snippet as a block:
```
### [Page Title](https://example.com)
> Snippet text from the page...
```

**HTML embed card** — rich card with title, domain, and snippet, suitable for pasting into rich-text editors that accept HTML.

## Installation

### Raycast Store

The easiest way — install directly from the [Raycast Store](https://www.raycast.com/avital_ben_natan/linkit).

### Install from GitHub

**Prerequisites:** [Raycast](https://raycast.com) 1.26.0+, [Node.js](https://nodejs.org) 22.14+, npm 7+.  
Git comes with macOS; if missing, macOS will prompt you to install Xcode Command Line Tools automatically.

1. **Clone the repo**
   ```bash
   git clone https://github.com/avital-ben-natan/linkit.git
   cd linkit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Import into Raycast**
   ```bash
   npm run dev
   ```
   Open Raycast — the extension appears at the top of root search under **Development**.  
   Press `⌃C` to stop the dev server. The extension stays installed in Raycast.

## Development

```bash
npm run dev        # Live-reload in Raycast
npm run build      # Production build
npm run lint       # Lint
npm run fix-lint   # Lint + auto-fix
```

CI runs `lint` → `build` on every push/PR to `main`.

## License

MIT
