"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Bell, Mail, Smartphone, Volume2, AlertTriangle, TrendingUp } from "lucide-react"

export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [volume, setVolume] = useState([75])

  return (
    <div className="space-y-6">
      {/* General Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            General Notifications
          </CardTitle>
          <CardDescription>Configure how you receive notifications and alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
            </div>
            <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Sound Alerts
              </Label>
              <p className="text-sm text-muted-foreground">Play sound when receiving notifications</p>
            </div>
            <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
          </div>

          {soundEnabled && (
            <div className="space-y-2">
              <Label>Notification Volume</Label>
              <div className="px-3">
                <Slider value={volume} onValueChange={setVolume} max={100} min={0} step={5} className="w-full" />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>Mute</span>
                  <span>{volume[0]}%</span>
                  <span>Max</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Price Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Price Alerts
          </CardTitle>
          <CardDescription>Set up alerts for price movements and market changes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Price Change Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when prices change by a certain percentage</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price Increase Threshold</Label>
              <div className="flex gap-2">
                <Input type="number" defaultValue="5" min="1" max="100" />
                <span className="flex items-center text-sm text-muted-foreground">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Price Decrease Threshold</Label>
              <div className="flex gap-2">
                <Input type="number" defaultValue="5" min="1" max="100" />
                <span className="flex items-center text-sm text-muted-foreground">%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Volume Spike Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when trading volume increases significantly</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Volatility Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when market volatility exceeds normal levels</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Market Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Market Events
          </CardTitle>
          <CardDescription>Configure alerts for important market events and news</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Market Open/Close</Label>
              <p className="text-sm text-muted-foreground">Get notified when markets open and close</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Breaking News</Label>
              <p className="text-sm text-muted-foreground">Receive alerts for important cryptocurrency news</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Regulatory Updates</Label>
              <p className="text-sm text-muted-foreground">Get notified about regulatory changes and announcements</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Exchange Maintenance</Label>
              <p className="text-sm text-muted-foreground">Receive alerts about exchange maintenance and downtime</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Notification Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Schedule</CardTitle>
          <CardDescription>Set quiet hours and notification frequency preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Do Not Disturb</Label>
              <p className="text-sm text-muted-foreground">Enable quiet hours to pause non-critical notifications</p>
            </div>
            <Switch />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Quiet Hours Start</Label>
              <Input type="time" defaultValue="22:00" />
            </div>
            <div className="space-y-2">
              <Label>Quiet Hours End</Label>
              <Input type="time" defaultValue="08:00" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notification Frequency</Label>
            <Select defaultValue="immediate">
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="5min">Every 5 minutes</SelectItem>
                <SelectItem value="15min">Every 15 minutes</SelectItem>
                <SelectItem value="30min">Every 30 minutes</SelectItem>
                <SelectItem value="1hour">Every hour</SelectItem>
                <SelectItem value="daily">Daily digest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
          <CardDescription>Manage your currently active price and market alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div>
                  <div className="font-medium">BTC {">"} $50,000</div>
                  <div className="text-sm text-muted-foreground">Price alert</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Active</Badge>
                <Button variant="ghost" size="sm">
                  Remove
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div>
                  <div className="font-medium">ETH Volume {">"} 1M</div>
                  <div className="text-sm text-muted-foreground">Volume alert</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Active</Badge>
                <Button variant="ghost" size="sm">
                  Remove
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <div>
                  <div className="font-medium">Market Volatility {">"} 5%</div>
                  <div className="text-sm text-muted-foreground">Volatility alert</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Active</Badge>
                <Button variant="ghost" size="sm">
                  Remove
                </Button>
              </div>
            </div>
          </div>

          <Button className="w-full">
            <TrendingUp className="mr-2 h-4 w-4" />
            Create New Alert
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
