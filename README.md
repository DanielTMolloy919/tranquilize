<div align="center">
  <img src="public/icon-128.png" alt="Tranquilize Logo" width="128" height="128"/>
  <h1>Tranquilize</h1>
  <p><em>Remove distractions from YouTube, Reddit, and Instagram</em></p>
  
  [![Version](https://img.shields.io/badge/version-1.1.2-blue.svg)](https://github.com/DanielTMolloy919/tranquilize)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
  [![Chrome](https://img.shields.io/badge/Chrome-Compatible-orange.svg)](https://chrome.google.com/webstore/)
  [![Firefox](https://img.shields.io/badge/Firefox-Compatible-red.svg)](https://addons.mozilla.org/)
</div>

## What It Does

Selectively hides distracting elements without blocking sites completely. Toggle individual features per site:

- **YouTube**: Home feed, channel feeds, sidebar, suggestions
- **Reddit**: Home feed, subreddit feeds, sidebar, suggestions
- **Instagram**: Home feed, reels

## Remote Configuration

Blocking rules update automatically from GitHub every 24 hours. This means:

- Fix broken selectors instantly when sites change
- Add new features without publishing extension updates
- Manual refresh button in popup for immediate updates

Config file: [`remote-config.json`](remote-config.json)

## Installation

### Chrome

```bash
git clone https://github.com/DanielTMolloy919/tranquilize.git
cd tranquilize
pnpm install && pnpm build
```

Load `dist/` folder at `chrome://extensions` (enable Developer mode)

### Firefox

```bash
pnpm build:firefox
```

Load `dist-firefox/manifest.json` at `about:debugging#/runtime/this-firefox`

## Development

```bash
pnpm dev              # Chrome dev with hot reload
pnpm build:firefox    # Firefox build (watch mode has known issues)
pnpm build:all        # Build both browsers
```

## Modifying Blocking Rules

### Add/Update Rules

Edit [`remote-config.json`](remote-config.json):

```json
{
  "version": "1.0.1",
  "sites": {
    "youtube": {
      "patterns": ["https://*.youtube.com/*"],
      "rules": [
        {
          "id": "shorts",
          "displayName": "Hide Shorts",
          "urlPatterns": [".*"],
          "selectors": ["ytd-reel-shelf-renderer"],
          "defaultEnabled": true
        }
      ]
    }
  }
}
```

Commit and push. Users get updates within 24 hours.

### Test Locally

```bash
# 1. Create .env file (first time)
cp .env.example .env
echo "VITE_USE_DEV_CONFIG=true" > .env

# 2. Start dev server
pnpm dev:config

# 3. Build and test
pnpm build

# 4. Edit remote-config.json and reload extension

# 5. When done testing
echo "VITE_USE_DEV_CONFIG=false" > .env
pnpm build
```

### Finding Selectors

1. Open site in browser
2. Press F12 → Element picker
3. Click element to hide
4. Right-click in Elements panel → Copy selector
5. Test: `document.querySelector("your-selector")`

### URL Patterns

URLs are stripped to `domain.com/path` format (no protocol/www/query params).

```javascript
"^youtube\\.com$"; // Exact: youtube.com only
"^reddit\\.com/r/[^/]+$"; // Pattern: reddit.com/r/anything
".*"; // All pages
"^(twitter|x)\\.com"; // Multiple domains
```

## Tech Stack

React 18, TypeScript, Tailwind CSS, Vite, Manifest V3, WebExtension API

## License

MIT - See [LICENSE](LICENSE)
