import { defaultSettings, Settings } from "@pages/popup/lib/types";

const url = window.location.href;
const urlObject = new URL(url);
let strippedUrl = urlObject.origin + urlObject.pathname; // remove query params
strippedUrl = strippedUrl
  .replace(/\/$/, "") // trailing slash
  .replace(/https?:\/\//, "") // protocol
  .replace("www.", ""); // www

chrome.storage.sync.get("settings", (data) => {
  let settings = data.settings;
  if (!settings) {
    settings = defaultSettings;
    chrome.storage.sync.set({ settings });
  }
  processTab(settings);
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.settings) {
    processTab(changes.settings.newValue);
  }
});

function processTab(settings: Settings) {
  let localSettings = Object.entries(settings || {});

  if (url.includes("youtube.com")) {
    localSettings = localSettings.filter(([key]) => key.startsWith("youtube"));
  } else if (url.includes("reddit.com")) {
    localSettings = localSettings.filter(([key]) => key.startsWith("reddit"));
  } else {
    return;
  }

  for (const [key, value] of localSettings) {
    const modifiedValue = modifyValue(key, value);

    document.documentElement.setAttribute(
      `tranquilize_${key.replace(".", "_")}`,
      modifiedValue.toString(),
    );
  }
}

function modifyValue(key: string, value: boolean): boolean {
  if (key === "reddit.home_feed") {
    const homeSubPages = [
      "hot",
      "top",
      "rising",
      "best",
      "new",
      "r/popular",
      "r/all",
    ];

    const isHomeFeed =
      strippedUrl === "reddit.com" ||
      homeSubPages.some((page) => strippedUrl.startsWith(`reddit.com/${page}`));

    return value && isHomeFeed;
  } else if (key === "reddit.subreddits") {
    const isSubredditFeed =
      /^reddit.com\/r\/[^\/]+(\/hot|\/new|\/top|\/rising)?$/.test(strippedUrl);

    return value && isSubredditFeed;
  }

  return value;
}
