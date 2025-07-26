"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"
import { Key, Eye, EyeOff, Copy, RefreshCw, AlertCircle, CheckCircle, Zap } from "lucide-react"
import { config } from "@/lib/config"

export function APISettings() {
  const [apiKey, setApiKey] = useState(config.tokenMetrics.apiKey || "")
  const [showApiKey, setShowApiKey] = useState(false)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")

  const handleTestConnection = async () => {
    setIsTestingConnection(true)
    setConnectionStatus("idle")

    // Simulate API test
    setTimeout(() => {
      setConnectionStatus(apiKey ? "success" : "error")
      setIsTestingConnection(false)
    }, 2000)
  }

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
  }

  const generateNewKey = () => {
    const newKey = "tm_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setApiKey(newKey)
  }

  return (
    <div className="space-y-6">
      {/* TokenMetrics API */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            TokenMetrics API Configuration
          </CardTitle>
          <CardDescription>Configure your TokenMetrics API key for real-time market data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="api-key"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your TokenMetrics API key"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button variant="outline" size="icon" onClick={copyApiKey} disabled={!apiKey}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Get your API key from the{" "}
              <a href="#" className="underline hover:text-foreground">
                TokenMetrics dashboard
              </a>
            </p>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleTestConnection} disabled={isTestingConnection || !apiKey}>
              {isTestingConnection ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Zap className="mr-2 h-4 w-4" />
              )}
              Test Connection
            </Button>
            <Button variant="outline" onClick={generateNewKey}>
              Generate Demo Key
            </Button>
          </div>

          {connectionStatus === "success" && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>API connection successful! Real-time data streaming is enabled.</AlertDescription>
            </Alert>
          )}

          {connectionStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to connect to TokenMetrics API. Please check your API key and try again.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* API Usage */}
      <Card>
        <CardHeader>
          <CardTitle>API Usage & Limits</CardTitle>
          <CardDescription>Monitor your API usage and current plan limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">1,247</div>
              <div className="text-sm text-muted-foreground">Requests Today</div>
              <div className="text-xs text-muted-foreground mt-1">of 5,000 limit</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-500">3</div>
              <div className="text-sm text-muted-foreground">Active Connections</div>
              <div className="text-xs text-muted-foreground mt-1">of 6 limit</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-500">15</div>
              <div className="text-sm text-muted-foreground">Symbols Tracked</div>
              <div className="text-xs text-muted-foreground mt-1">of 60 limit</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Daily Request Limit</span>
              <Badge variant="secondary">Premium Plan</Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: "25%" }} />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>1,247 used</span>
              <span>5,000 total</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Settings</CardTitle>
          <CardDescription>Configure WebSocket connection behavior and retry policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-reconnect</Label>
              <p className="text-sm text-muted-foreground">Automatically reconnect when connection is lost</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Compression</Label>
              <p className="text-sm text-muted-foreground">Enable data compression to reduce bandwidth usage</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Rate Limiting</Label>
              <p className="text-sm text-muted-foreground">Respect API rate limits to prevent connection issues</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Reconnect Attempts</Label>
              <Input type="number" defaultValue="5" min="1" max="10" />
            </div>
            <div className="space-y-2">
              <Label>Timeout (seconds)</Label>
              <Input type="number" defaultValue="30" min="5" max="120" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook Configuration</CardTitle>
          <CardDescription>Set up webhooks to receive real-time notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input placeholder="https://your-app.com/webhook" />
          </div>

          <div className="space-y-2">
            <Label>Secret Key</Label>
            <Input type="password" placeholder="Enter webhook secret" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Webhooks</Label>
              <p className="text-sm text-muted-foreground">Receive price alerts and market notifications</p>
            </div>
            <Switch />
          </div>

          <Button variant="outline" className="w-full bg-transparent">
            Test Webhook
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
