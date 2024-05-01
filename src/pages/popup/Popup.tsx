import { useEffect, useState } from "react";
import { Switch } from "@pages/popup/components/ui/switch";
import { Label } from "@pages/popup/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@pages/popup/components/ui/tabs";

import {
  defaultSettings,
  Settings,
  settingsDisplayNames,
} from "@pages/popup/lib/types";

type SettingSwitchProps = {
  displayName: string;
  checked: boolean;
  setChecked: (value: boolean) => void;
};

function SettingSwitch({
  displayName,
  checked,
  setChecked,
}: SettingSwitchProps) {
  return (
    <div className="flex items-center gap-2">
      <Switch onCheckedChange={setChecked} checked={checked} />
      <Label>{displayName}</Label>
    </div>
  );
}

export default function Popup() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [activeTab, setActiveTab] = useState<string>("reddit");

  useEffect(() => {
    chrome.storage.sync.get("settings", (data) => {
      if (!data.settings) {
        chrome.storage.sync.set({ settings: defaultSettings });
        return;
      }

      setSettings(data.settings);
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0].url) return;

      const url = new URL(tabs[0].url);
      const hostname = url.hostname;

      if (hostname.includes("reddit")) {
        setActiveTab("reddit");
      } else if (hostname.includes("youtube")) {
        setActiveTab("youtube");
      }
    });
  }, []);

  useEffect(() => {
    if (!settings) return;

    chrome.storage.sync.set({ settings });
  }, [settings]);

  if (!settings) {
    return null;
  }

  function openLink(href: string) {
    chrome.tabs.create({ url: href });
  }

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 flex flex-col gap-2 justify-between">
      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList>
          <TabsTrigger value="reddit">Reddit</TabsTrigger>
          <TabsTrigger value="youtube">YouTube</TabsTrigger>
        </TabsList>
        <TabsContent value="reddit">
          <div className="flex flex-col gap-2">
            <SettingSwitch
              key="reddit.hideHomeFeed"
              displayName={settingsDisplayNames["reddit.hideHomeFeed"]}
              checked={settings["reddit.hideHomeFeed"]}
              setChecked={(value) =>
                setSettings({ ...settings, "reddit.hideHomeFeed": value })
              }
            />
            <SettingSwitch
              key="reddit.hideSidebar"
              displayName={settingsDisplayNames["reddit.hideSidebar"]}
              checked={settings["reddit.hideSidebar"]}
              setChecked={(value) =>
                setSettings({ ...settings, "reddit.hideSidebar": value })
              }
            />
            <SettingSwitch
              key="reddit.hideSuggestions"
              displayName={settingsDisplayNames["reddit.hideSuggestions"]}
              checked={settings["reddit.hideSuggestions"]}
              setChecked={(value) =>
                setSettings({ ...settings, "reddit.hideSuggestions": value })
              }
            />
            <SettingSwitch
              key="reddit.hideTrendingSearches"
              displayName={settingsDisplayNames["reddit.hideTrendingSearches"]}
              checked={settings["reddit.hideTrendingSearches"]}
              setChecked={(value) =>
                setSettings({
                  ...settings,
                  "reddit.hideTrendingSearches": value,
                })
              }
            />
          </div>
        </TabsContent>
        <TabsContent value="youtube">
          <div className="flex flex-col gap-2">
            <SettingSwitch
              key="youtube.hideHomeFeed"
              displayName={settingsDisplayNames["youtube.hideHomeFeed"]}
              checked={settings["youtube.hideHomeFeed"]}
              setChecked={(value) =>
                setSettings({ ...settings, "youtube.hideHomeFeed": value })
              }
            />
            <SettingSwitch
              key="youtube.hideSidebar"
              displayName={settingsDisplayNames["youtube.hideSidebar"]}
              checked={settings["youtube.hideSidebar"]}
              setChecked={(value) =>
                setSettings({ ...settings, "youtube.hideSidebar": value })
              }
            />
            <SettingSwitch
              key="youtube.hideSuggestions"
              displayName={settingsDisplayNames["youtube.hideSuggestions"]}
              checked={settings["youtube.hideSuggestions"]}
              setChecked={(value) =>
                setSettings({ ...settings, "youtube.hideSuggestions": value })
              }
            />
          </div>
        </TabsContent>
      </Tabs>
      <button
        onClick={() =>
          openLink("https://github.com/DanielTMolloy919/reddit-unhook")
        }
      >
        GitHub
      </button>
    </div>
  );
}
