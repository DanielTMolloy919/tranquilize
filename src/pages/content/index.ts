interface Settings {
  "reddit.home_feed": boolean;
  "reddit.subreddits": boolean;
  "reddit.sidebar": boolean;
  "reddit.suggestions": boolean;
  "youtube.home_feed": boolean;
  "youtube.channel_feeds": boolean;
  "youtube.sidebar": boolean;
  "youtube.suggestions": boolean;
}

const defaultSettings: Settings = {
  "reddit.home_feed": true,
  "reddit.subreddits": true,
  "reddit.sidebar": true,
  "reddit.suggestions": true,
  "youtube.home_feed": true,
  "youtube.channel_feeds": true,
  "youtube.sidebar": true,
  "youtube.suggestions": true,
};

let settings: Settings | null = null;

console.log("[Tranquilize] Content script initialized");

chrome.storage.sync.get("settings", (data) => {
  console.log("[Tranquilize] Retrieved settings:", data.settings);
  settings = data.settings;
  if (!settings) {
    console.log(
      "[Tranquilize] No settings found, using defaults:",
      defaultSettings
    );
    settings = defaultSettings;
    chrome.storage.sync.set({ settings });
  }
  processTab();
});

chrome.storage.onChanged.addListener((changes) => {
  console.log("[Tranquilize] Settings changed:", changes);
  if (changes.settings) {
    settings = changes.settings.newValue;
    processTab();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("[Tranquilize] Received message:", request);
  if (request.message === "processTab") {
    processTab();
  }
});

function processTab() {
  const url = window.location.href;
  console.log("[Tranquilize] Processing URL:", url);

  const urlObject = new URL(url);
  let strippedUrl = urlObject.origin + urlObject.pathname; // remove query params
  strippedUrl = strippedUrl
    .replace(/\/$/, "") // trailing slash
    .replace(/https?:\/\//, "") // protocol
    .replace("www.", ""); // www

  console.log("[Tranquilize] Stripped URL:", strippedUrl);

  let localSettings = Object.entries(settings || {});
  console.log("[Tranquilize] All settings:", localSettings);

  if (url.includes("youtube.com")) {
    console.log("[Tranquilize] Detected YouTube page");
    localSettings = localSettings.filter(([key]) => key.startsWith("youtube"));
  } else if (url.includes("reddit.com")) {
    console.log("[Tranquilize] Detected Reddit page");
    localSettings = localSettings.filter(([key]) => key.startsWith("reddit"));
  } else {
    console.log("[Tranquilize] Not a supported page, returning");
    return;
  }

  console.log(
    "[Tranquilize] Filtered settings for current page:",
    localSettings
  );

  for (const [key, value] of localSettings) {
    const modifiedValue = modifyValue(key, value, strippedUrl);
    console.log(`[Tranquilize] Setting ${key}:`, {
      original: value,
      modified: modifiedValue,
    });

    document.documentElement.setAttribute(
      `tranquilize_${key.replace(".", "_")}`,
      modifiedValue.toString()
    );
  }
}

function modifyValue(
  key: string,
  value: boolean,
  strippedUrl: string
): boolean {
  console.log(`[Tranquilize] Modifying value for ${key}:`, {
    value,
    strippedUrl,
  });

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

    console.log("[Tranquilize] Reddit home feed check:", { isHomeFeed });
    return value && isHomeFeed;
  } else if (key === "reddit.subreddits") {
    const isSubredditFeed =
      /^reddit.com\/r\/[^/]+(\/hot|\/new|\/top|\/rising)?$/.test(strippedUrl);

    console.log("[Tranquilize] Reddit subreddit check:", { isSubredditFeed });
    return value && isSubredditFeed;
  } else if (key === "youtube.home_feed") {
    const isHomeFeed = strippedUrl === "youtube.com";

    console.log("[Tranquilize] YouTube home feed check:", { isHomeFeed });
    return value && isHomeFeed;
  } else if (key === "youtube.channel_feeds") {
    const isChannelHomeFeed =
      /^youtube.com\/(channel\/[^/]+|c\/[^/]+|user\/[^/]+|@[^/]+)?(\/featured)?$/.test(
        strippedUrl
      );

    console.log("[Tranquilize] YouTube channel feed check:", {
      isChannelHomeFeed,
    });
    return value && isChannelHomeFeed;
  }

  return value;
}
