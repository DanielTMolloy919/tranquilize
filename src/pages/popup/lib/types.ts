export type Settings = {
  hideHomeFeed: boolean;
  hideSidebar: boolean;
  hideSuggestions: boolean;
};

export const defaultSettings: Settings = {
  hideHomeFeed: true,
  hideSidebar: true,
  hideSuggestions: true,
};

export const managedSites = ["reddit.com"];
