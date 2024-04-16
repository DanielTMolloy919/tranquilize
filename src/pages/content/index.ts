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
  if (url.includes("/comments") || url.includes("/search")) return;

  const subgrid = document.getElementsByClassName("subgrid-container");

  if (subgrid.length) {
    (subgrid[0] as HTMLElement).style.display = settings.hideHomeFeed
      ? "none"
      : "block";
  }
}
