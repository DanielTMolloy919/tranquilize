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

  const homeFeedRes = document.getElementsByClassName("subgrid-container");
  console.log("homeFeedRes", homeFeedRes);

  if (homeFeedRes.length) {
    const isHomeFeed =
      strippedUrl === "reddit.com" ||
      strippedUrl === "reddit.com/r/all" ||
      strippedUrl === "reddit.com/r/popular" ||
      strippedUrl === "reddit.com/?feed=home";

    const shouldHideHomeFeeds = settings["reddit.hideHomeFeed"] && isHomeFeed;

    setHTMLElement(homeFeedRes[0] as HTMLElement, shouldHideHomeFeeds);
  }

  const subredditMainContent = document.querySelector(
    "#main-content > div:last-of-type",
  );

  if (subredditMainContent) {
    const isSubreddit = strippedUrl.includes("reddit.com/r/");

    const shouldHideSubreddits =
      settings["reddit.hideSubreddits"] && isSubreddit;

    setHTMLElement(subredditMainContent as HTMLElement, shouldHideSubreddits);
  }

  const sidebarRes = document.getElementsByTagName("reddit-sidebar-nav");
  if (sidebarRes.length) {
    setHTMLElement(
      sidebarRes[0] as HTMLElement,
      settings["reddit.hideSidebar"],
    );
  }

  const sidebarButtonRes = document.getElementById("guide-button");

  if (sidebarButtonRes) {
    setHTMLElement(sidebarButtonRes, settings["reddit.hideSidebar"]);
  }

  const suggestionsRes = document.getElementsByTagName("pdp-right-rail");
  if (suggestionsRes.length) {
    setHTMLElement(
      suggestionsRes[0] as HTMLElement,
      settings["reddit.hideSuggestions"],
    );
  }

  const redditSearchRes = document
    .getElementsByTagName("reddit-search-large")[0]
    ?.shadowRoot?.getElementById("reddit-trending-searches-partial-container");

  if (redditSearchRes) {
    setHTMLElement(redditSearchRes, settings["reddit.hideTrendingSearches"]);

    // hide the title as well
    const siblingDiv = redditSearchRes.previousElementSibling;
    if (siblingDiv && siblingDiv instanceof HTMLElement) {
      setHTMLElement(siblingDiv, settings["reddit.hideTrendingSearches"]);
    }
  }
}

function processYoutube(url: string, settings: Settings) {
  const homeFeedRes = document.getElementsByTagName("ytd-rich-grid-renderer");

  if (homeFeedRes.length) {
    setHTMLElement(
      homeFeedRes[0] as HTMLElement,
      settings["youtube.hideHomeFeed"],
      "display-flex",
    );
  }

  const suggestionsRes = document.getElementById("related");

  if (suggestionsRes) {
    setHTMLElement(
      suggestionsRes,
      settings["youtube.hideSuggestions"],
      "visibility",
    );
  }

  const sidebarRes = document.getElementById("guide-content");

  if (sidebarRes) {
    setHTMLElement(sidebarRes, settings["youtube.hideSidebar"], "visibility");
  }
}

function setHTMLElement(
  element: HTMLElement,
  shouldHide: boolean,
  type: "display-block" | "display-flex" | "visibility" = "display-block",
) {
  if (type === "display-block") {
    element.style.cssText = `display: ${shouldHide ? "none" : "block"} !important`;
  } else if (type === "display-flex") {
    element.style.cssText = `display: ${shouldHide ? "none" : "flex"} !important`;
  } else {
    element.style.cssText = `visibility: ${shouldHide ? "hidden" : "visible"} !important`;
  }
}
