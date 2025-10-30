<div align="center">
  <img src="public/icon-128.png" alt="Tranquilize Logo" width="128" height="128"/>
  <h1>Tranquilize</h1>
  <p><em>Reclaim your focus by removing distracting elements from YouTube, Reddit, and Instagram</em></p>
  
  [![Version](https://img.shields.io/badge/version-1.1.2-blue.svg)](https://github.com/DanielTMolloy919/tranquilize)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
  [![Chrome](https://img.shields.io/badge/Chrome-Compatible-orange.svg)](https://chrome.google.com/webstore/)
  [![Firefox](https://img.shields.io/badge/Firefox-Compatible-red.svg)](https://addons.mozilla.org/)
</div>

## ✨ Features

Tranquilize helps you browse mindfully by selectively hiding distracting content without completely blocking websites. Take control of your online experience with granular settings for each platform.

### 🎯 YouTube

- **Hide Home Feed**
- **Hide Channel Feeds**
- **Hide Sidebar**
- **Hide Suggested Videos**

### 🗨️ Reddit

- **Hide Home Feed**
- **Hide Subreddit Feeds**
- **Hide Sidebar**
- **Hide Suggested Posts**

### 📸 Instagram

- **Hide Home Feed**
- **Hide Reels**

## 🚀 Installation

### From Chrome Web Store

_Coming soon - the extension will be available on the Chrome Web Store_

### From Firefox Add-ons

_Coming soon - the extension will be available on Firefox Add-ons_

### Manual Installation (Developer Mode)

Tranquilize can be manually installed on both Chrome and Firefox browsers:

<details>
<summary><strong>Chrome Installation</strong></summary>

1. **Download and build the extension**

   ```bash
   git clone https://github.com/DanielTMolloy919/tranquilize.git
   cd tranquilize
   pnpm install  # or npm install
   pnpm build    # or npm run build
   ```

2. **Load in Chrome**

   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right corner)
   - Click **Load unpacked**
   - Select the `dist` folder from this project

3. **Verify installation**
   - The Tranquilize icon should appear in your Chrome toolbar
   - Visit YouTube, Reddit, or Instagram to test the functionality

</details>

<details>
<summary><strong>Firefox Installation</strong></summary>

1. **Download and build the extension**

   ```bash
   git clone https://github.com/DanielTMolloy919/tranquilize.git
   cd tranquilize
   pnpm install          # or npm install
   pnpm build:firefox    # or npm run build:firefox
   ```

2. **Load in Firefox**

   - Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
   - Click **Load Temporary Add-on**
   - Navigate to the `dist-firefox` folder and select the `manifest.json` file

3. **Verify installation**
   - The Tranquilize icon should appear in your Firefox toolbar
   - Visit YouTube, Reddit, or Instagram to test the functionality

**Note:** Temporary add-ons in Firefox are removed when you close the browser. For permanent installation during development, you can use [web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/) or wait for the official Firefox Add-ons release.

</details>

## 🛠️ Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Chrome and/or Firefox browser

### Project Structure

```
tranquilize/
├── src/
│   ├── pages/
│   │   ├── background/     # Background script
│   │   ├── content/        # Content scripts for websites
│   │   └── popup/          # Extension popup UI
│   └── assets/             # Static assets
└── public/                 # Public assets and icons
```

### Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite with CRXJS plugin
- **UI Components**: Radix UI primitives
- **Extension API**: WebExtension API (Manifest V3) for Chrome & Firefox
- **Cross-Browser Support**: webextension-polyfill

### Development Commands

```bash
# Chrome development
pnpm dev              # Start Chrome development with hot reload
pnpm build            # Build for Chrome production

# Firefox development
pnpm dev:firefox      # Start Firefox development with hot reload
pnpm build:firefox    # Build for Firefox production

# Build for both browsers
pnpm build:all        # Build for Chrome and Firefox

# Type checking
pnpm type-check       # Run TypeScript type checking
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [CRXJS](https://crxjs.dev/) for Chrome extension development
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
