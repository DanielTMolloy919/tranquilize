import React from 'react'
import { Switch } from '@pages/popup/components/ui/switch'
import { Label } from '@pages/popup/components/ui/label'

export default function Popup(): JSX.Element {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3">
      <div className="flex items-center space-x-2">
        <Switch id="reddit-home-feed" />
        <Label htmlFor="reddit-home-feed">Hide Home Feed</Label>
      </div>
    </div>
  )
}
