// Dynamic settings type - can have any string key with boolean value
export type Settings = Record<string, boolean>;

// Legacy type definitions kept for backwards compatibility
export type LegacySettings = {
  "reddit.home_feed": boolean;
  "reddit.subreddits": boolean;
  "reddit.sidebar": boolean;
  "reddit.suggestions": boolean;
  "youtube.home_feed": boolean;
  "youtube.channel_feeds": boolean;
  "youtube.sidebar": boolean;
  "youtube.suggestions": boolean;
  "instagram.home_feed": boolean;
  "instagram.reels": boolean;
};

// Fallback default settings (used only if remote config fails)
export const defaultSettings: LegacySettings = {
  "reddit.home_feed": true,
  "reddit.subreddits": true,
  "reddit.sidebar": true,
  "reddit.suggestions": true,
  "youtube.home_feed": true,
  "youtube.channel_feeds": true,
  "youtube.sidebar": true,
  "youtube.suggestions": true,
  "instagram.home_feed": true,
  "instagram.reels": true,
};
