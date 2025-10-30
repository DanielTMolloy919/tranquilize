import browser from "webextension-polyfill";
import {
  getConfig,
  generateDefaultSettings,
  fetchRemoteConfig,
} from "./configFetcher";

console.log("[Tranquilize] Background script loaded");

// Initialize on startup (not just install)
async function initialize() {
  console.log("[Tranquilize] Initializing...");
  
  // Fetch remote config
  await fetchRemoteConfig();

  // Initialize settings if not present
  const data = await browser.storage.sync.get("settings");
  if (!data.settings) {
    console.log("[Tranquilize] Initializing default settings");
    const config = await getConfig();
    const settings = generateDefaultSettings(config);
    await browser.storage.sync.set({ settings });
  }
  
  console.log("[Tranquilize] Initialization complete");
}

// Initialize immediately on background script load
initialize().catch(err => {
  console.error("[Tranquilize] Initialization error:", err);
});

// Also initialize on install/update
browser.runtime.onInstalled.addListener(async () => {
  console.log("[Tranquilize] Extension installed/updated");
  await initialize();
});

// Periodically refresh config (every 24 hours)
browser.alarms.create("refreshConfig", { periodInMinutes: 1440 });

browser.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "refreshConfig") {
    console.log("[Tranquilize] Periodic config refresh");
    await fetchRemoteConfig();
  }
});

// Listen for messages from content scripts and popup
// Using a more Firefox-compatible approach
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("[Tranquilize] Background received message:", request.message, "from", sender.tab ? "content" : "popup");
  
  // Simple ping test
  if (request.message === "ping") {
    console.log("[Tranquilize] Responding to ping");
    sendResponse({ status: "ok", timestamp: Date.now() });
    return false; // Sync response
  }
  
  if (request.message === "getConfig") {
    // Handle async response for Firefox
    (async () => {
      try {
        const config = await getConfig();
        console.log("[Tranquilize] Got config, sending response. Version:", config?.version);
        sendResponse(config);
      } catch (error) {
        console.error("[Tranquilize] Error getting config:", error);
        sendResponse(null);
      }
    })();
    
    // CRITICAL: Return true to keep message channel open for async response
    return true;
  }
  
  // For other messages, don't keep channel open
  console.log("[Tranquilize] Unknown message type:", request.message);
  return false;
});

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active && changeInfo.url) {
    try {
      await browser.tabs.sendMessage(tabId, { message: "processTab" });
    } catch (e) {
      console.error(e);
    }
  }
});
