import browser from "webextension-polyfill";

// ⚠️ DEVELOPMENT MODE CONFIGURATION ⚠️
// Controlled via .env file - VITE_USE_DEV_CONFIG
// When 'true': Fetches config from local server (http://localhost:3001)
// When 'false': Fetches config from GitHub (production)
//
// To use dev mode:
// 1. Copy .env.example to .env (if not already done)
// 2. Set VITE_USE_DEV_CONFIG=true in .env file
// 3. Run: pnpm dev:config (starts local server)
// 4. Build and test extension: pnpm build
// 5. .env file is gitignored - safe to modify locally!
//
// See LOCAL_TESTING_GUIDE.md for complete instructions

// Read from environment variable (Vite automatically provides this)
const USE_DEV_SERVER = import.meta.env.VITE_USE_DEV_CONFIG === "true";

// Development server URL (when USE_DEV_SERVER is true)
const DEV_CONFIG_URL = "http://localhost:3001/remote-config.json";

// Production URL - fetches from GitHub
const PROD_CONFIG_URL =
  "https://raw.githubusercontent.com/DanielTMolloy919/tranquilize/master/remote-config.json";

// Use dev or prod URL based on environment variable
const CONFIG_URL = USE_DEV_SERVER ? DEV_CONFIG_URL : PROD_CONFIG_URL;

const CACHE_KEY = "remote_config";
const CACHE_TIMESTAMP_KEY = "config_timestamp";
const CACHE_VERSION_KEY = "config_version";
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

export interface RemoteConfig {
  version: string;
  lastUpdated: string;
  sites: {
    [siteName: string]: SiteConfig;
  };
}

export interface SiteConfig {
  patterns: string[];
  rules: BlockRule[];
}

export interface BlockRule {
  id: string;
  displayName: string;
  urlPatterns: string[];
  selectors: string[];
  defaultEnabled: boolean;
}

export async function fetchRemoteConfig(): Promise<RemoteConfig | null> {
  try {
    if (USE_DEV_SERVER) {
      console.warn(
        "⚠️ [Tranquilize:Backend] DEV MODE ENABLED - Using local config server!"
      );
      console.warn(
        "⚠️ Remember to set USE_DEV_SERVER = false before production!"
      );
    }
    console.log(
      "[Tranquilize:Backend] Fetching remote config from:",
      CONFIG_URL
    );

    // Check cache first
    const cached = await browser.storage.local.get([
      CACHE_KEY,
      CACHE_TIMESTAMP_KEY,
      CACHE_VERSION_KEY,
    ]);
    const timestamp = cached[CACHE_TIMESTAMP_KEY] || 0;
    const cachedVersion = cached[CACHE_VERSION_KEY] || null;

    // Return cached config if it's still fresh
    if (Date.now() - timestamp < CACHE_DURATION && cached[CACHE_KEY]) {
      console.log(
        "[Tranquilize:Backend] Using cached config, version:",
        cachedVersion
      );
      return cached[CACHE_KEY] as RemoteConfig;
    }

    // Fetch fresh config
    const response = await fetch(CONFIG_URL, {
      cache: "no-cache",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch config: ${response.status} ${response.statusText}`
      );
    }

    const config: RemoteConfig = await response.json();
    console.log(
      "[Tranquilize:Backend] Fetched remote config, version:",
      config.version
    );

    // Validate config structure
    if (!config.version || !config.sites) {
      throw new Error("Invalid config structure");
    }

    // Cache the config
    await browser.storage.local.set({
      [CACHE_KEY]: config,
      [CACHE_TIMESTAMP_KEY]: Date.now(),
      [CACHE_VERSION_KEY]: config.version,
    });

    // If version changed, notify user
    if (cachedVersion && cachedVersion !== config.version) {
      console.log(
        `[Tranquilize:Backend] Config updated from ${cachedVersion} to ${config.version}`
      );
      // You could add a notification here if desired
    }

    return config;
  } catch (error) {
    console.error(
      "[Tranquilize:Backend] Failed to fetch remote config:",
      error
    );

    // Return cached config as fallback
    const cached = await browser.storage.local.get(CACHE_KEY);
    if (cached[CACHE_KEY]) {
      console.log("[Tranquilize:Backend] Using cached config as fallback");
      return cached[CACHE_KEY] as RemoteConfig;
    }

    // Last resort: return hardcoded defaults
    console.log("[Tranquilize:Backend] Using hardcoded default config");
    return getDefaultConfig();
  }
}

export async function getConfig(): Promise<RemoteConfig> {
  const remoteConfig = await fetchRemoteConfig();
  return remoteConfig || getDefaultConfig();
}

export async function forceRefreshConfig(): Promise<RemoteConfig> {
  // Clear cache and fetch fresh
  await browser.storage.local.remove([
    CACHE_KEY,
    CACHE_TIMESTAMP_KEY,
    CACHE_VERSION_KEY,
  ]);
  return await getConfig();
}

export function generateDefaultSettings(
  config: RemoteConfig
): Record<string, boolean> {
  const settings: Record<string, boolean> = {};

  for (const [siteName, siteConfig] of Object.entries(config.sites)) {
    for (const rule of siteConfig.rules) {
      const settingKey = `${siteName}.${rule.id}`;
      settings[settingKey] = rule.defaultEnabled;
    }
  }

  return settings;
}

function getDefaultConfig(): RemoteConfig {
  // Fallback hardcoded config in case remote fetch fails
  return {
    version: "1.0.0-fallback",
    lastUpdated: "2025-10-30",
    sites: {
      youtube: {
        patterns: ["https://*.youtube.com/*"],
        rules: [
          {
            id: "home_feed",
            displayName: "Hide Home Feeds",
            urlPatterns: ["^youtube\\.com$"],
            selectors: ["ytd-rich-grid-renderer"],
            defaultEnabled: true,
          },
          {
            id: "channel_feeds",
            displayName: "Hide Channel Feeds",
            urlPatterns: [
              "^youtube\\.com/(channel/[^/]+|c/[^/]+|user/[^/]+|@[^/]+)?(/featured)?$",
            ],
            selectors: ["#contents"],
            defaultEnabled: true,
          },
          {
            id: "sidebar",
            displayName: "Hide Sidebar",
            urlPatterns: [".*"],
            selectors: [
              "#guide-content",
              "#guide-button",
              "ytd-mini-guide-renderer",
            ],
            defaultEnabled: true,
          },
          {
            id: "suggestions",
            displayName: "Hide Suggested Videos",
            urlPatterns: [".*"],
            selectors: ["#related"],
            defaultEnabled: true,
          },
        ],
      },
      reddit: {
        patterns: ["https://*.reddit.com/*"],
        rules: [
          {
            id: "home_feed",
            displayName: "Hide Home Feeds",
            urlPatterns: [
              "^reddit\\.com$",
              "^reddit\\.com/(hot|top|rising|best|new|r/popular|r/all)",
            ],
            selectors: [".subgrid-container"],
            defaultEnabled: true,
          },
          {
            id: "subreddits",
            displayName: "Hide Subreddit Feeds",
            urlPatterns: ["^reddit\\.com/r/[^/]+(/(hot|new|top|rising))?$"],
            selectors: ["#main-content > div:last-of-type"],
            defaultEnabled: true,
          },
          {
            id: "sidebar",
            displayName: "Hide Sidebar",
            urlPatterns: [".*"],
            selectors: ["reddit-sidebar-nav", "#navbar-menu-button"],
            defaultEnabled: true,
          },
          {
            id: "suggestions",
            displayName: "Hide Suggested Posts",
            urlPatterns: [".*"],
            selectors: ["pdp-right-rail"],
            defaultEnabled: true,
          },
        ],
      },
      instagram: {
        patterns: ["https://*.instagram.com/*"],
        rules: [
          {
            id: "home_feed",
            displayName: "Hide Home Feed",
            urlPatterns: ["^instagram\\.com/?$"],
            selectors: ["main[role='main'] article"],
            defaultEnabled: true,
          },
          {
            id: "reels",
            displayName: "Hide Reels",
            urlPatterns: ["^instagram\\.com/reels"],
            selectors: [
              "[role='tablist'] a[href='/reels/']",
              "[role='tablist'] a[href='/reels']",
              "video",
            ],
            defaultEnabled: true,
          },
        ],
      },
    },
  };
}
