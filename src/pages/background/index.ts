import browser from "webextension-polyfill";
import {
  getConfig,
  generateDefaultSettings,
  fetchRemoteConfig,
} from "./configFetcher";

// Fetch config and initialize settings on install
browser.runtime.onInstalled.addListener(async () => {
  console.log("[Tranquilize] Extension installed/updated");

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
});

// Periodically refresh config (every 24 hours)
browser.alarms.create("refreshConfig", { periodInMinutes: 1440 });

browser.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "refreshConfig") {
    console.log("[Tranquilize] Periodic config refresh");
    await fetchRemoteConfig();
  }
});

// Listen for messages from content scripts
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "getConfig") {
    // Return true to indicate we'll respond asynchronously (important for Firefox)
    getConfig().then(config => {
      sendResponse(config);
    }).catch(error => {
      console.error("[Tranquilize] Error getting config:", error);
      sendResponse(null);
    });
    return true; // Keep channel open for async response
  }
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
