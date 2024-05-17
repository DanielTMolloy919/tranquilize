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
import { ThemeProvider } from "@pages/popup/theme-provider";
import { Moon, Sun } from "lucide-react";

import { Button } from "@pages/popup/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@pages/popup/components/ui/dropdown-menu";
import { useTheme } from "./theme-provider";

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

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
    <ThemeProvider>
      <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 flex flex-col gap-2 justify-between">
        <div className="absolute top-0 right-0 p-3">
          <ModeToggle />
        </div>
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
                key="reddit.hideSubreddits"
                displayName={settingsDisplayNames["reddit.hideSubreddits"]}
                checked={settings["reddit.hideSubreddits"]}
                setChecked={(value) =>
                  setSettings({ ...settings, "reddit.hideSubreddits": value })
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
                displayName={
                  settingsDisplayNames["reddit.hideTrendingSearches"]
                }
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
            openLink("https://github.com/DanielTMolloy919/tranquilize")
          }
        >
          GitHub
        </button>
      </div>
    </ThemeProvider>
  );
}
