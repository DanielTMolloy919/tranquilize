import { useEffect, useState } from "react";
import { Switch } from "@pages/popup/components/ui/switch";
import { Label } from "@pages/popup/components/ui/label";
import { defaultSettings, Settings } from "@pages/popup/lib/types";

const settingsList = [
  { id: "reddit-home-feed", label: "Hide All Feeds", key: "hideHomeFeed" },
  { id: "reddit-sidebar", label: "Hide Sidebar", key: "hideSidebar" },
  {
    id: "reddit-suggestions",
    label: "Hide Suggested Posts",
    key: "hideSuggestions",
  },
  {
    id: "reddit-trending-searches",
    label: "Hide Trending Searches",
    key: "hideTrendingSearches",
  },
];

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
      {settingsList.map(({ id, label, key }) => (
        <div key={id} className="flex items-center space-x-2">
          <Switch
            id={id}
            checked={settings[key]}
            onCheckedChange={(checked) => {
              setSettings({ ...settings, [key]: checked });
            }}
          />
          <Label htmlFor={id}>{label}</Label>
        </div>
      ))}
    </div>
  );
}
