import browser from "webextension-polyfill";

interface RemoteConfig {
  version: string;
  lastUpdated: string;
  sites: {
    [siteName: string]: {
      patterns: string[];
      rules: BlockRule[];
    };
  };
}

interface BlockRule {
  id: string;
  displayName: string;
  urlPatterns: string[];
  selectors: string[];
  defaultEnabled: boolean;
}

let settings: Record<string, boolean> | null = null;
let config: RemoteConfig | null = null;

console.log("[Tranquilize] Content script initialized");

// Initialize with retry logic for Firefox
async function init(retries = 3) {
  try {
    // Get remote config from background script
    const remoteConfig = await browser.runtime.sendMessage({
      message: "getConfig",
    });
    console.log("[Tranquilize] Loaded remote config:", remoteConfig);

    if (!remoteConfig) {
      console.error("[Tranquilize] Failed to load remote config");
      return;
    }

    config = remoteConfig;

    // Load user settings
    const data = await browser.storage.sync.get("settings");
    console.log("[Tranquilize] Retrieved settings:", data.settings);
    settings = data.settings;

    if (!settings || Object.keys(settings).length === 0) {
      console.log("[Tranquilize] No settings found, generating defaults");
      // config is guaranteed to be non-null here due to check above
      settings = generateDefaultSettings(config as RemoteConfig);
      await browser.storage.sync.set({ settings });
    }

    processTab();
  } catch (error) {
    console.error("[Tranquilize] Initialization error:", error);

    // Retry if background script not ready yet (common in Firefox)
    if (
      retries > 0 &&
      error instanceof Error &&
      error.message.includes("Receiving end does not exist")
    ) {
      console.log(
        `[Tranquilize] Retrying initialization (${retries} attempts left)...`
      );
      setTimeout(() => init(retries - 1), 500);
    }
  }
}

init();

// Listen for settings changes
browser.storage.onChanged.addListener((changes) => {
  console.log("[Tranquilize] Settings changed:", changes);
  if (changes.settings) {
    settings = changes.settings.newValue;
    processTab();
  }
});

// Listen for messages from background script
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("[Tranquilize] Received message:", request);
  if (request.message === "processTab") {
    processTab();
  }
});

function processTab() {
  if (!config || !settings) {
    console.log("[Tranquilize] Config or settings not ready");
    return;
  }

  const url = window.location.href;
  console.log("[Tranquilize] Processing URL:", url);

  const urlObject = new URL(url);
  let strippedUrl = urlObject.origin + urlObject.pathname;
  strippedUrl = strippedUrl
    .replace(/\/$/, "") // remove trailing slash
    .replace(/https?:\/\//, "") // remove protocol
    .replace("www.", ""); // remove www

  console.log("[Tranquilize] Stripped URL:", strippedUrl);

  // Find matching site config
  const siteName = getSiteNameFromUrl(strippedUrl);
  if (!siteName) {
    console.log("[Tranquilize] No matching site config found");
    return;
  }

  const siteConfig = config.sites[siteName];
  if (!siteConfig) {
    console.log("[Tranquilize] Site config not found for:", siteName);
    return;
  }

  console.log(`[Tranquilize] Applying rules for ${siteName}`);
  applyRules(siteConfig.rules, strippedUrl, siteName);
}

function applyRules(rules: BlockRule[], currentUrl: string, siteName: string) {
  // Remove all existing Tranquilize styles
  document
    .querySelectorAll("style[data-tranquilize]")
    .forEach((el) => el.remove());

  const cssRules: string[] = [];
  let appliedCount = 0;

  for (const rule of rules) {
    const settingKey = `${siteName}.${rule.id}`;
    const isEnabled = settings?.[settingKey];

    console.log(`[Tranquilize] Rule ${settingKey}:`, {
      enabled: isEnabled,
      currentUrl,
      urlPatterns: rule.urlPatterns,
    });

    if (!isEnabled) {
      console.log(`[Tranquilize] Rule ${settingKey} is disabled, skipping`);
      continue;
    }

    // Check if rule applies to current URL
    const matches = rule.urlPatterns.some((pattern) => {
      try {
        const regex = new RegExp(pattern);
        return regex.test(currentUrl);
      } catch (error) {
        console.error(`[Tranquilize] Invalid regex pattern: ${pattern}`, error);
        return false;
      }
    });

    if (matches) {
      console.log(
        `[Tranquilize] Rule ${settingKey} matches, applying selectors`
      );
      // Generate CSS for this rule
      const selectors = rule.selectors
        .map((selector) => `${selector}`)
        .join(", ");
      cssRules.push(`${selectors} { display: none !important; }`);
      appliedCount++;
    } else {
      console.log(
        `[Tranquilize] Rule ${settingKey} does not match current URL`
      );
    }
  }

  // Inject CSS
  if (cssRules.length > 0) {
    const style = document.createElement("style");
    style.setAttribute("data-tranquilize", "true");
    style.textContent = cssRules.join("\n");
    document.head.appendChild(style);
    console.log(
      `[Tranquilize] Applied ${appliedCount} rules, injected CSS:`,
      style.textContent
    );
  } else {
    console.log("[Tranquilize] No rules matched, no CSS injected");
  }
}

function getSiteNameFromUrl(url: string): string | null {
  if (url.includes("youtube.com")) return "youtube";
  if (url.includes("reddit.com")) return "reddit";
  if (url.includes("instagram.com")) return "instagram";
  return null;
}

function generateDefaultSettings(
  config: RemoteConfig
): Record<string, boolean> {
  const settings: Record<string, boolean> = {};

  for (const [siteName, siteConfig] of Object.entries(config.sites)) {
    for (const rule of siteConfig.rules) {
      const settingKey = `${siteName}.${rule.id}`;
      settings[settingKey] = rule.defaultEnabled;
    }
  }

  console.log("[Tranquilize] Generated default settings:", settings);
  return settings;
}
