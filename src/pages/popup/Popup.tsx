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
      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
      <div className="flex flex-col gap-2">
        {Object.entries(settingsDisplayNames).map(([key, displayName]) => (
          <div key={key} className="flex items-center gap-2">
            <Label>{displayName}</Label>
            <Switch
              checked={settings[key as keyof Settings]}
              onChange={(checked) =>
                setSettings((prev) => prev && { ...prev, [key]: checked })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
