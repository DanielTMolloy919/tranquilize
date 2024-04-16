// preload settings from storage
import { defaultSettings, Settings } from "@pages/popup/lib/types";

let settings: Settings | null = null;

chrome.storage.sync.get("settings", (data) => {
  if (!data.settings) {
    chrome.storage.sync.set({ settings: defaultSettings });
    return;
  }

  settings = data.settings;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  tab.url && updateTab(tabId, tab.url);
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.settings) {
    settings = changes.settings.newValue;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      updateTab(tabs[0].id, tabs[0].url || "");
    }
  });
});

function updateTab(tabId: number, url: string) {
  chrome.tabs.sendMessage(tabId, { url, settings });
}
