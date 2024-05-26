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
  const url = window.location.href;
  const urlObject = new URL(url);
  let strippedUrl = urlObject.origin + urlObject.pathname; // remove query params
  strippedUrl = strippedUrl
    .replace(/\/$/, "") // trailing slash
    .replace(/https?:\/\//, "") // protocol
    .replace("www.", ""); // www

  let localSettings = Object.entries(settings || {});

  if (url.includes("youtube.com")) {
    localSettings = localSettings.filter(([key]) => key.startsWith("youtube"));
  } else if (url.includes("reddit.com")) {
    localSettings = localSettings.filter(([key]) => key.startsWith("reddit"));
  } else {
    return;
  }

  for (const [key, value] of localSettings) {
    const modifiedValue = modifyValue(key, value, strippedUrl);

    document.documentElement.setAttribute(
      `tranquilize_${key.replace(".", "_")}`,
      modifiedValue.toString(),
    );
  }
}

function modifyValue(
  key: string,
  value: boolean,
  strippedUrl: string,
): boolean {
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
  } else if (key === "youtube.home_feed") {
    const isHomeFeed = strippedUrl === "youtube.com";

    return value && isHomeFeed;
  } else if (key === "youtube.channel_feeds") {
    const isChannelHomeFeed =
      /^youtube.com\/(channel\/[^\/]+|c\/[^\/]+|user\/[^\/]+|@[^\/]+)?(\/featured)?$/.test(
        strippedUrl,
      );

    return value && isChannelHomeFeed;
  }

  return value;
}
