import browser from "webextension-polyfill";
import {
  getConfig,
  generateDefaultSettings,
  fetchRemoteConfig,
} from "./configFetcher";

console.log("[Tranquilize:Backend] Background script loaded");
console.log("[Tranquilize:Backend] Runtime ID:", browser.runtime.id);

// CRITICAL: Register message listener FIRST before any async work
// This ensures content scripts can connect immediately
browser.runtime.onMessage.addListener(
  (request: any, sender, sendResponse: any) => {
    console.log(
      "[Tranquilize:Backend] Message received:",
      request.message,
      "from",
      sender.tab ? "content" : "popup"
    );
    console.log("[Tranquilize:Backend] Sender details:", {
      tabId: sender.tab?.id,
      url: sender.tab?.url,
      frameId: sender.frameId,
    });

    // Simple ping test
    if (request.message === "ping") {
      console.log("[Tranquilize:Backend] Responding to ping");
      sendResponse({ status: "ok", timestamp: Date.now() });
      return; // Sync response
    }

    if (request.message === "getConfig") {
      // Handle async response for Firefox
      (async () => {
        try {
          const config = await getConfig();
          console.log(
            "[Tranquilize:Backend] Sending config. Version:",
            config?.version
          );
          sendResponse(config);
        } catch (error) {
          console.error("[Tranquilize:Backend] Error getting config:", error);
          sendResponse(null);
        }
      })();

      // CRITICAL: Return true to keep message channel open for async response
      return true;
    }

    // For other messages, don't keep channel open
    console.log("[Tranquilize:Backend] Unknown message type:", request.message);
  }
);

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active && changeInfo.url) {
    try {
      await browser.tabs.sendMessage(tabId, { message: "processTab" });
    } catch (e) {
      console.error(e);
    }
  }
});

// Initialize on startup (not just install)
// This runs AFTER message listeners are set up
async function initialize() {
  console.log("[Tranquilize:Backend] Initializing...");

  try {
    // Fetch remote config (non-blocking for message handlers)
    console.log("[Tranquilize:Backend] Fetching remote config...");
    await fetchRemoteConfig();
    console.log("[Tranquilize:Backend] ✓ Remote config fetched");

    // Initialize settings if not present
    console.log("[Tranquilize:Backend] Checking settings...");
    const data = await browser.storage.sync.get("settings");
    if (!data.settings) {
      console.log(
        "[Tranquilize:Backend] No settings found, initializing defaults..."
      );
      const config = await getConfig();
      const settings = generateDefaultSettings(config);
      await browser.storage.sync.set({ settings });
      console.log("[Tranquilize:Backend] ✓ Default settings saved");
    } else {
      console.log("[Tranquilize:Backend] ✓ Settings already exist");
    }

    console.log("[Tranquilize:Backend] ✅ Initialization complete");
  } catch (err) {
    console.error("[Tranquilize:Backend] ❌ Initialization error:", err);
    throw err;
  }
}

// Initialize immediately on background script load (non-blocking)
console.log("[Tranquilize:Backend] Starting initialization...");
initialize().catch((err) => {
  console.error("[Tranquilize:Backend] Fatal initialization error:", err);
});

// Also initialize on install/update
browser.runtime.onInstalled.addListener(async () => {
  console.log("[Tranquilize:Backend] Extension installed/updated");
  await initialize();
});

// Periodically refresh config (every 24 hours)
browser.alarms.create("refreshConfig", { periodInMinutes: 1440 });

browser.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "refreshConfig") {
    console.log("[Tranquilize:Backend] Periodic config refresh");
    await fetchRemoteConfig();
  }
});
