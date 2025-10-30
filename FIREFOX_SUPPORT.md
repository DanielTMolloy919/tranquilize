# Firefox Support Implementation

This document outlines the changes made to add Firefox support to the Tranquilize extension.

## Summary

Tranquilize has been converted from a Chrome-only extension to a cross-browser extension that works on both Chrome and Firefox. The extension now uses the WebExtension API with the `webextension-polyfill` library for maximum compatibility.

## Changes Made

### 1. Code Modifications

All Chrome-specific API calls have been replaced with cross-browser compatible code:

**Files Updated:**
- `src/pages/background/index.ts` - Background script now uses `browser` API
- `src/pages/content/index.ts` - Content script now uses `browser` API
- `src/pages/popup/Popup.tsx` - Popup UI now uses `browser` API

**Before:**
```typescript
chrome.storage.sync.get("settings", (data) => { ... });
chrome.tabs.query({ active: true }, (tabs) => { ... });
```

**After:**
```typescript
import browser from "webextension-polyfill";
const data = await browser.storage.sync.get("settings");
const tabs = await browser.tabs.query({ active: true });
```

### 2. Firefox-Specific Configuration

**New Files:**
- `manifest.firefox.json` - Firefox-specific manifest with `browser_specific_settings`
- `vite.config.firefox.ts` - Firefox build configuration outputting to `dist-firefox`

**Key Differences in Firefox Manifest:**
- Includes `browser_specific_settings.gecko` with extension ID
- Specifies minimum Firefox version (109.0)
- Uses `scripts` array for background scripts

### 3. Build System Updates

**Updated `package.json` with new scripts:**
```json
{
  "build": "vite build",                    // Build for Chrome
  "build:firefox": "vite build --config vite.config.firefox.ts",  // Build for Firefox
  "build:all": "npm run build && npm run build:firefox",          // Build both
  "dev": "nodemon",                         // Chrome dev mode
  "dev:firefox": "__DEV__=true vite build --config vite.config.firefox.ts --watch"  // Firefox dev mode
}
```

### 4. Documentation Updates

**README.md Updates:**
- Added Firefox badge alongside Chrome badge
- Expanded installation section with separate Chrome and Firefox instructions
- Updated prerequisites to mention both browsers
- Enhanced development commands section
- Updated tech stack to mention WebExtension API and webextension-polyfill

### 5. Git Configuration

**Updated `.gitignore`:**
- Added `/dist-firefox` to ignore Firefox build output
- Added `vite.config.ts.timestamp-*` to ignore Vite temp files

## Building the Extension

### For Chrome:
```bash
pnpm install
pnpm build
# Output: dist/
```

### For Firefox:
```bash
pnpm install
pnpm build:firefox
# Output: dist-firefox/
```

### For Both Browsers:
```bash
pnpm install
pnpm build:all
# Output: dist/ and dist-firefox/
```

## Testing

### Chrome:
1. Navigate to `chrome://extensions/`
2. Enable Developer mode
3. Load unpacked extension from `dist/` folder

### Firefox:
1. Navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `manifest.json` from `dist-firefox/` folder

## Browser Compatibility

- **Chrome**: Version 109+ (Manifest V3)
- **Firefox**: Version 109+ (Manifest V3)
- **Edge**: Should work (Chromium-based, uses Chrome build)
- **Other Chromium browsers**: Should work with Chrome build

## Key Features of Cross-Browser Implementation

1. **Promise-based API**: Using `webextension-polyfill` provides consistent Promise-based APIs across browsers
2. **Automatic polyfill**: The polyfill handles differences between Chrome's callback-based API and Firefox's native Promise API
3. **Single codebase**: No browser-specific code branches needed in the main application
4. **Manifest V3**: Both builds use the modern Manifest V3 specification

## Using web-ext (Optional)

For a better Firefox development experience, you can use Mozilla's official `web-ext` tool:

### Installation:
```bash
pnpm add -D web-ext
# or
npm install --save-dev web-ext
```

### Usage:
```bash
# Build and run in Firefox
pnpm build:firefox && npx web-ext run

# Lint the extension
npx web-ext lint

# Package for distribution
npx web-ext build
```

The project includes a `web-ext-config.js` file with sensible defaults for development.

## Future Enhancements

- [ ] Add automated browser testing (Playwright)
- [ ] Add web-ext as a dev dependency
- [ ] Create CI/CD pipeline for dual-browser builds
- [ ] Package for Chrome Web Store and Firefox Add-ons distribution
- [ ] Add Safari support (requires additional configuration)

## Dependencies

The extension relies on `webextension-polyfill` which was already in the project but wasn't being used. No new dependencies were added.

## Notes

- Firefox temporary add-ons are removed when the browser closes. For permanent local installation, use web-ext or create a signed XPI file.
- The extension ID in `manifest.firefox.json` should remain consistent for updates to work properly.
- Both builds share the same source code - only the manifest and output directory differ.

