import browser from "webextension-polyfill";
import { defaultSettings } from "@pages/popup/lib/types";

browser.runtime.onInstalled.addListener(async () => {
  const data = await browser.storage.sync.get("settings");
  if (!data.settings) {
    await browser.storage.sync.set({ settings: defaultSettings });
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
