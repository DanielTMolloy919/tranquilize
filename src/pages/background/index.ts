import { defaultSettings } from "@pages/popup/lib/types";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get("settings", (data) => {
    if (!data.settings) {
      chrome.storage.sync.set({ settings: defaultSettings });
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("onUpdated changeInfo", changeInfo);
  if (changeInfo.status === "complete" && tab.active) {
    chrome.tabs.sendMessage(tabId, { message: "processTab" });
  }
});
