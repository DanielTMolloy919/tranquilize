export type Settings = {
  "reddit.hideHomeFeed": boolean;
  "reddit.hideSidebar": boolean;
  "reddit.hideSuggestions": boolean;
  "reddit.hideTrendingSearches": boolean;
  "youtube.hideHomeFeed": boolean;
  "youtube.hideSuggestions": boolean;
  "youtube.hideShorts": boolean;
};

export const settingsDisplayNames: Record<keyof Settings, string> = {
  "reddit.hideHomeFeed": "Hide All Feeds",
  "reddit.hideSidebar": "Hide Sidebar",
  "reddit.hideSuggestions": "Hide Suggested Posts",
  "reddit.hideTrendingSearches": "Hide Trending Searches",
  "youtube.hideHomeFeed": "Hide Home Feed",
  "youtube.hideSuggestions": "Hide Suggested Videos",
  "youtube.hideShorts": "Hide Shorts",
};

export const defaultSettings: Settings = {
  "reddit.hideHomeFeed": true,
  "reddit.hideSidebar": true,
  "reddit.hideSuggestions": true,
  "reddit.hideTrendingSearches": true,
  "youtube.hideHomeFeed": true,
  "youtube.hideSuggestions": true,
  "youtube.hideShorts": true,
};
