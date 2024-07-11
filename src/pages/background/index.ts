import { defaultSettings } from "@pages/popup/lib/types";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get("settings", (data) => {
    if (!data.settings) {
      chrome.storage.sync.set({ settings: defaultSettings });
    }
  });
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active && changeInfo.url) {
    try {
      chrome.tabs.sendMessage(tabId, { message: "processTab" });
    } catch (e) {
      console.error(e);
    }
  }
});
