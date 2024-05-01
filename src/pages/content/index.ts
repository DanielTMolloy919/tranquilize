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

  // const observer = new MutationObserver((mutationsList, observer) => {
  //   for (const mutation of mutationsList) {
  //     if (mutation.type === "childList") {
  //       const url = window.location.href;
  //       if (
  //         url.includes("youtube.com") &&
  //         url.includes("/shorts") &&
  //         settings["youtube.hideShorts"]
  //       ) {
  //         //   disable video loop
  //         const videos = document.getElementsByTagName("video");
  //         for (const video of videos) {
  //           video.removeAttribute("src");
  //         }
  //       }
  //     }
  //   }
  // });
  //
  // observer.observe(document, { childList: true, subtree: true });
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

    (homeFeedRes[0] as HTMLElement).style.cssText = `display: ${
      hideContainer ? "none" : "block"
    } !important`;
  }

  const sidebarRes = document.getElementsByTagName("reddit-sidebar-nav");
  if (sidebarRes.length) {
    (sidebarRes[0] as HTMLElement).style.cssText = `display: ${
      settings["reddit.hideSidebar"] ? "none" : "block"
    } !important`;
  }

  const suggestionsRes = document.getElementsByTagName("pdp-right-rail");
  if (suggestionsRes.length) {
    (suggestionsRes[0] as HTMLElement).style.cssText = `display: ${
      settings["reddit.hideSuggestions"] ? "none" : "block"
    } !important`;
  }

  const redditSearchRes = document
    .getElementsByTagName("reddit-search-large")[0]
    ?.shadowRoot?.getElementById("reddit-trending-searches-partial-container");

  if (redditSearchRes) {
    redditSearchRes.style.cssText = `display: ${settings["reddit.hideTrendingSearches"] ? "none" : "block"} !important`;

    // hide the title as well
    const siblingDiv = redditSearchRes.previousElementSibling;
    if (siblingDiv && siblingDiv instanceof HTMLElement) {
      siblingDiv.style.cssText = `display: ${settings["reddit.hideTrendingSearches"] ? "none" : "block"} !important`;
    }
  }
}

function processYoutube(url: string, settings: Settings) {
  const homeFeedRes = document.getElementsByTagName("ytd-rich-grid-renderer");

  if (homeFeedRes.length) {
    (homeFeedRes[0] as HTMLElement).style.cssText = `visibility: ${
      settings["youtube.hideHomeFeed"] ? "hidden" : "visible"
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

  if (url.includes("/shorts") && settings["youtube.hideShorts"]) {
    //   disable video loop
    const videos = document.getElementsByTagName("video");
    for (const video of videos) {
      handleVideoElement(video);
    }
  }
}

function handleVideoElement(e: HTMLVideoElement) {
  if (!e) return;

  console.log("handleVideoElement", e);

  if (e.readyState > 0) {
    console.log("readyState > 0", e);
    e.pause();
    return;
  }
  const handleLoadStart = () => {
    console.log("handleLoadStart", e);
    e.pause();
    e.removeEventListener("canplay", handleLoadStart);
    e.removeEventListener("loadstart", handleLoadStart);
  };

  e.addEventListener("canplay", handleLoadStart);
  e.addEventListener("loadstart", handleLoadStart);
}
