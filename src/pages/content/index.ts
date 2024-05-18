import { defaultSettings, Settings } from "@pages/popup/lib/types";

let settings: Settings | null = null;

chrome.storage.sync.get("settings", (data) => {
  settings = data.settings;
  if (!settings) {
    settings = defaultSettings;
    chrome.storage.sync.set({ settings });
  }
  processTab();
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.settings) {
    settings = changes.settings.newValue;
    processTab();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "processTab") {
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
  const strippedUrl = url
    .replace(/\/$/, "") // trailing slash
    .replace(/https?:\/\//, "") // protocol
    .replace("www.", ""); // www

  const isHomeFeed =
    strippedUrl === "reddit.com" ||
    strippedUrl.startsWith("reddit.com/?") ||
    strippedUrl.startsWith("reddit.com/hot") ||
    strippedUrl.startsWith("reddit.com/top") ||
    strippedUrl.startsWith("reddit.com/rising") ||
    strippedUrl.startsWith("reddit.com/best") ||
    strippedUrl.startsWith("reddit.com/new") ||
    strippedUrl.startsWith("reddit.com/r/popular") ||
    strippedUrl.startsWith("reddit.com/r/all");

  processElement(
    ".subgrid-container",
    settings["reddit.hideHomeFeed"] && isHomeFeed,
  );

  const shouldHideSubreddits =
    settings["reddit.hideSubreddits"] &&
    strippedUrl.includes("reddit.com/r/") &&
    !strippedUrl.includes("/comments") &&
    !strippedUrl.includes("/wiki");

  processElement("#main-content > div:last-of-type", shouldHideSubreddits);

  processElement("reddit-sidebar-nav", settings["reddit.hideSidebar"]);

  processElement("pdp-right-rail", settings["reddit.hideSuggestions"]);

  const redditSearchRes = document
    .getElementsByTagName("reddit-search-large")[0]
    ?.shadowRoot?.getElementById("reddit-trending-searches-partial-container");

  if (redditSearchRes) {
    processElement(redditSearchRes, settings["reddit.hideTrendingSearches"]);

    // hide the title as well
    const siblingDiv = redditSearchRes.previousElementSibling;
    if (siblingDiv && siblingDiv instanceof HTMLElement) {
      processElement(siblingDiv, settings["reddit.hideTrendingSearches"]);
    }
  }
}

function processYoutube(url: string, settings: Settings) {
  processElement(
    "ytd-rich-grid-renderer",
    settings["youtube.hideHomeFeed"],
    "display-flex",
  );

  processElement("#related", settings["youtube.hideSuggestions"], "visibility");

  processElement(
    "#guide-content",
    settings["youtube.hideSidebar"],
    "visibility",
  );
  processElement("#guide-button", settings["youtube.hideSidebar"]);
  processElement("ytd-mini-guide-renderer", settings["youtube.hideSidebar"]);
}

function processElement(
  _element: string | HTMLElement,
  shouldHide: boolean,
  type: "display-block" | "display-flex" | "visibility" = "display-block",
) {
  const element =
    typeof _element === "string"
      ? (document.querySelector(_element) as HTMLElement)
      : _element;

  if (!element) return;

  if (type === "display-block") {
    element.style.cssText = `display: ${shouldHide ? "none" : "block"} !important`;
  } else if (type === "display-flex") {
    element.style.cssText = `display: ${shouldHide ? "none" : "flex"} !important`;
  } else {
    element.style.cssText = `visibility: ${shouldHide ? "hidden" : "visible"} !important`;
  }
}
