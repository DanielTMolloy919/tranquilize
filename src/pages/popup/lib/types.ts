export type Settings = {
  hideHomeFeed: boolean;
  hideSidebar: boolean;
  hideSuggestions: boolean;
  hideTrendingSearches: boolean;
};

export const defaultSettings: Settings = {
  hideHomeFeed: true,
  hideSidebar: true,
  hideSuggestions: true,
  hideTrendingSearches: true,
};

export const managedSites = ["reddit.com"];
