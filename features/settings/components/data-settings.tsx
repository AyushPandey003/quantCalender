"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { Database, Download, Upload, Trash2, RefreshCw, HardDrive, Cloud, Archive } from "lucide-react"

export function DataSettings() {
  const [cacheSize, setCacheSize] = useState([500])
  const [autoBackup, setAutoBackup] = useState(true)
  const [dataRetention, setDataRetention] = useState("30")

  return (
    <div className="space-y-6">
      {/* Data Storage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Storage
          </CardTitle>
          <CardDescription>Manage local data storage and caching preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <HardDrive className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">2.4 GB</div>
              <div className="text-sm text-muted-foreground">Local Storage Used</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Cloud className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">1.2 GB</div>
              <div className="text-sm text-muted-foreground">Cloud Backup</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Archive className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">850 MB</div>
              <div className="text-sm text-muted-foreground">Compressed Data</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Cache Size Limit</Label>
                <span className="text-sm text-muted-foreground">{cacheSize[0]} MB</span>
              </div>
              <Slider
                value={cacheSize}
                onValueChange={setCacheSize}
                max={2000}
                min={100}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>100 MB</span>
                <span>2 GB</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Storage Usage</Label>
              <Progress value={65} className="w-full" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1.6 GB used</span>
                <span>2.5 GB available</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Cache Cleanup</Label>
              <p className="text-sm text-muted-foreground">Automatically remove old cached data to free up space</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card>
        <CardHeader>
          <CardTitle>Data Retention</CardTitle>
          <CardDescription>Configure how long data is stored locally and in the cloud</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Historical Data Retention</Label>
            <Select value={dataRetention} onValueChange={setDataRetention}>
              <SelectTrigger>
                <SelectValue placeholder="Select retention period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="180">6 months</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
                <SelectItem value="unlimited">Unlimited</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">Older data will be automatically archived or deleted</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Compress Old Data</Label>
              <p className="text-sm text-muted-foreground">Compress data older than 30 days to save storage space</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Archive</Label>
              <p className="text-sm text-muted-foreground">Automatically move old data to long-term storage</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Backup & Sync */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Backup & Sync
          </CardTitle>
          <CardDescription>Configure automatic backups and data synchronization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Backup</Label>
              <p className="text-sm text-muted-foreground">Automatically backup your data to the cloud</p>
            </div>
            <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
          </div>

          {autoBackup && (
            <div className="space-y-4 pl-4 border-l-2 border-muted">
              <div className="space-y-2">
                <Label>Backup Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue placeholder="Select backup frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Every hour</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Encrypt Backups</Label>
                  <p className="text-sm text-muted-foreground">Encrypt backup data for additional security</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Backup Now
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Restore Backup
            </Button>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Last Backup</span>
              <Badge variant="secondary">Success</Badge>
            </div>
            <div className="text-sm text-muted-foreground">January 15, 2024 at 3:42 PM</div>
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Export
          </CardTitle>
          <CardDescription>Export your data in various formats for external analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Download className="h-6 w-6" />
              <span>Export as CSV</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Download className="h-6 w-6" />
              <span>Export as JSON</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Download className="h-6 w-6" />
              <span>Export as Excel</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Download className="h-6 w-6" />
              <span>Export Charts</span>
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Export Date Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">From</Label>
                <input type="date" className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">To</Label>
                <input type="date" className="w-full px-3 py-2 border rounded-md" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>Manage and clean up your stored data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Clear Cache
            </Button>
            <Button variant="outline">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Old Data
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete All Data
            </Button>
          </div>

          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <Trash2 className="h-4 w-4" />
              <span className="font-medium">Warning</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Deleting data is permanent and cannot be undone. Make sure to backup important data before proceeding.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
