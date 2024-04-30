import {defaultSettings} from "@pages/popup/lib/types";

chrome.runtime.onInstalled.addListener(() => {
        chrome.storage.sync.get("settings", (data) => {
            if (!data.settings) {
                chrome.storage.sync.set({ settings: defaultSettings });
            }
        });
    }
)
