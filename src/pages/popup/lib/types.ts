export type Settings = {
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

export const settingsDisplayNames: Record<keyof Settings, string> = {
  "reddit.home_feed": "Hide Home Feeds",
  "reddit.subreddits": "Hide Subreddit Feeds",
  "reddit.sidebar": "Hide Sidebar",
  "reddit.suggestions": "Hide Suggested Posts",
  "youtube.home_feed": "Hide Home Feeds",
  "youtube.channel_feeds": "Hide Channel Feeds",
  "youtube.sidebar": "Hide Sidebar",
  "youtube.suggestions": "Hide Suggested Videos",
  "instagram.home_feed": "Hide Home Feed",
  "instagram.reels": "Hide Reels",
};

export const defaultSettings: Settings = {
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
