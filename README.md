<div align="center">
  <img src="public/icon-128.png" alt="Tranquilize Logo" width="128" height="128"/>
  <h1>Tranquilize</h1>
  <p><em>Reclaim your focus by removing distracting elements from YouTube, Reddit, and Instagram</em></p>
  
  [![Version](https://img.shields.io/badge/version-1.1.2-blue.svg)](https://github.com/DanielTMolloy919/tranquilize)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
  [![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-orange.svg)](https://chrome.google.com/webstore/)
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

### Option 1: From Chrome Web Store (Recommended)

_Coming soon - the extension will be available on the Chrome Web Store_

### Option 2: Manual Installation (Developer Mode)

1. **Download the extension**

   ```bash
   git clone https://github.com/DanielTMolloy919/tranquilize.git
   cd tranquilize
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Build the extension**

   ```bash
   pnpm build
   # or
   npm run build
   ```

4. **Load in Chrome**

   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right corner)
   - Click **Load unpacked**
   - Select the `dist` folder from this project

5. **Verify installation**
   - The Tranquilize icon should appear in your Chrome toolbar
   - Visit YouTube, Reddit, or Instagram to test the functionality

## 🛠️ Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Chrome browser

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
- **Extension API**: Chrome Extension Manifest V3

### Development Commands

```bash
pnpm dev          # Start development with hot reload
pnpm build        # Build for production
pnpm type-check   # Run TypeScript type checking
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [CRXJS](https://crxjs.dev/) for Chrome extension development
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
