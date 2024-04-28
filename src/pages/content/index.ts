import { defaultSettings, Settings } from "@pages/popup/lib/types";

console.log("content index called");

chrome.runtime.onMessage.addListener((message, sender, response) => {
  processTab(message.url, message.settings);
});

let settings: Settings | null = null;

chrome.storage.sync.get("settings", (data) => {
  settings = data.settings;
  if (!settings) {
    settings = defaultSettings;
    chrome.storage.sync.set({ settings });
  }

  console.log("settings");
  processTab(window.location.href, settings);
});

function processTab(url: string, settings: Settings) {
  if (url.includes("reddit.com")) {
    processReddit(url, settings);
  }
}

function processReddit(url: string, settings: Settings) {
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        const homeFeedRes =
          document.getElementsByClassName("subgrid-container");
        if (
          homeFeedRes.length &&
          !url.includes("/comments") &&
          !url.includes("/search")
        ) {
          (homeFeedRes[0] as HTMLElement).style.cssText = `display: ${
            settings.hideHomeFeed ? "none" : "block"
          } !important`;
        }

        const sidebarRes = document.getElementsByTagName("reddit-sidebar-nav");
        if (sidebarRes.length) {
          (sidebarRes[0] as HTMLElement).style.display = settings.hideSidebar
            ? "none"
            : "block";
        }

        const suggestionsRes = document.getElementsByTagName("pdp-right-rail");
        if (suggestionsRes.length) {
          (suggestionsRes[0] as HTMLElement).style.display =
            settings.hideSuggestions ? "none" : "inline";
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
