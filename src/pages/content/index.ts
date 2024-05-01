import { defaultSettings, Settings } from "@pages/popup/lib/types";

let settings: Settings | null = null;

window.onload = () => {
  chrome.storage.sync.get("settings", (data) => {
    settings = data.settings;
    if (!settings) {
      settings = defaultSettings;
      chrome.storage.sync.set({ settings });
    }
    processTab();
  });
};

chrome.storage.onChanged.addListener((changes) => {
  if (changes.settings) {
    settings = changes.settings.newValue;
    processTab();
  }
});

function processTab() {
  if (!settings) return;

  const url = window.location.href;

  if (url.includes("reddit.com")) {
    processReddit(url, settings);
  } else if (url.includes("youtube.com")) {
    processYoutube(url, settings);
  }
}

function processReddit(url: string, settings: Settings) {
  const homeFeedRes = document.getElementsByClassName("subgrid-container");
  if (homeFeedRes.length) {
    const hideContainer =
      settings["reddit.hideHomeFeed"] &&
      !url.includes("/comments") &&
      !url.includes("/search");

    (homeFeedRes[0] as HTMLElement).style.cssText = `visibility: ${
      hideContainer ? "hidden" : "visible"
    } !important`;
  }

  const sidebarRes = document.getElementsByTagName("reddit-sidebar-nav");
  if (sidebarRes.length) {
    (sidebarRes[0] as HTMLElement).style.cssText = `visibility: ${
      settings["reddit.hideSidebar"] ? "hidden" : "visible"
    } !important`;
  }

  const suggestionsRes = document.getElementsByTagName("pdp-right-rail");
  if (suggestionsRes.length) {
    (suggestionsRes[0] as HTMLElement).style.cssText = `visibility: ${
      settings["reddit.hideSuggestions"] ? "hidden" : "visible"
    } !important`;
  }

  const redditSearchRes = document
    .getElementsByTagName("reddit-search-large")[0]
    ?.shadowRoot?.getElementById("reddit-trending-searches-partial-container");

  if (redditSearchRes) {
    redditSearchRes.style.cssText = `visibility: ${settings["reddit.hideTrendingSearches"] ? "hidden" : "visible"} !important`;

    // hide the title as well
    const siblingDiv = redditSearchRes.previousElementSibling;
    if (siblingDiv && siblingDiv instanceof HTMLElement) {
      siblingDiv.style.cssText = `visibility: ${settings["reddit.hideTrendingSearches"] ? "hidden" : "visible"} !important`;
    }
  }
}

function processYoutube(url: string, settings: Settings) {
  const homeFeedRes = document.getElementsByTagName("ytd-rich-grid-renderer");

  if (homeFeedRes.length) {
    (homeFeedRes[0] as HTMLElement).style.cssText = `display: ${
      settings["youtube.hideHomeFeed"] ? "none" : "flex"
    } !important`;
  }

  const suggestionsRes = document.getElementById("related");

  if (suggestionsRes) {
    suggestionsRes.style.cssText = `visibility: ${
      settings["youtube.hideSuggestions"] ? "hidden" : "visible"
    } !important`;
  }

  const shortsRes = document.getElementById("shorts-container");

  if (shortsRes) {
    shortsRes.style.cssText = `visibility: ${
      settings["youtube.hideShorts"] ? "hidden" : "visible"
    } !important`;
  }
}
