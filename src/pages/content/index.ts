import { Settings } from "@pages/popup/lib/types";

chrome.runtime.onMessage.addListener((message, sender, response) => {
  processTab(message.url, message.settings);
});

function processTab(url: string, settings: Settings) {
  if (url.includes("reddit.com")) {
    processReddit(url, settings);
  }
}

function processReddit(url: string, settings: Settings) {
  const homeFeedRes = document.getElementsByClassName("subgrid-container");

  if (
    homeFeedRes.length &&
    !url.includes("/comments") &&
    !url.includes("/search")
  ) {
    (homeFeedRes[0] as HTMLElement).style.display = settings.hideHomeFeed
      ? "none"
      : "block";
  }

  const sidebarRes = document.getElementsByTagName("reddit-sidebar-nav");

  if (sidebarRes.length) {
    (sidebarRes[0] as HTMLElement).style.display = settings.hideSidebar
      ? "none"
      : "block";
  }

  const suggestionsRes = document.getElementsByTagName("pdp-right-rail");

  if (suggestionsRes.length) {
    (suggestionsRes[0] as HTMLElement).style.display = settings.hideSuggestions
      ? "none"
      : "inline";
  }
}
