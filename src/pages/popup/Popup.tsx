import { useEffect, useState } from "react";
import { Switch } from "@pages/popup/components/ui/switch";
import { Label } from "@pages/popup/components/ui/label";
import { defaultSettings, Settings } from "@pages/popup/lib/types";

export default function Popup() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    chrome.storage.sync.get("settings", (data) => {
      if (!data.settings) {
        chrome.storage.sync.set({ settings: defaultSettings });
        return;
      }

      setSettings(data.settings);
    });
  }, []);

  useEffect(() => {
    if (!settings) return;

    chrome.storage.sync.set({ settings });
  }, [settings]);

  if (!settings) {
    return null;
  }

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 flex flex-col gap-2">
      <div className="flex items-center space-x-2">
        <Switch
          id="reddit-home-feed"
          checked={settings.hideHomeFeed}
          onCheckedChange={(checked) => {
            setSettings({ ...settings, hideHomeFeed: checked });
          }}
        />
        <Label htmlFor="reddit-home-feed">Hide Home Feed</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="reddit-sidebar"
          checked={settings.hideSidebar}
          onCheckedChange={(checked) => {
            setSettings({ ...settings, hideSidebar: checked });
          }}
        />
        <Label htmlFor="reddit-sidebar">Hide Sidebar</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="reddit-suggestions"
          checked={settings.hideSuggestions}
          onCheckedChange={(checked) => {
            setSettings({ ...settings, hideSuggestions: checked });
          }}
        />
        <Label htmlFor="reddit-suggestions">Hide Suggestions</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="reddit-trending-searches"
          checked={settings.hideTrendingSearches}
          onCheckedChange={(checked) => {
            setSettings({ ...settings, hideTrendingSearches: checked });
          }}
        />
        <Label htmlFor="reddit-trending-searches">Trending Searches</Label>
      </div>
    </div>
  );
}
