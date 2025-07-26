"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Key, Zap } from "lucide-react"
import { config } from "@/lib/config"

export function SetupGuide() {
  const hasApiKey = !!config.tokenMetrics.apiKey

  if (hasApiKey) {
    return null // Don't show if API key is configured
  }

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Setup Required
        </CardTitle>
        <CardDescription>Configure your TokenMetrics API key to enable real-time data streaming</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Missing API Key</AlertTitle>
          <AlertDescription>To enable live data streaming, you need to set your TokenMetrics API key.</AlertDescription>
        </Alert>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Step 1</Badge>
            <span className="text-sm">Get your API key from TokenMetrics dashboard</span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline">Step 2</Badge>
            <span className="text-sm">Set environment variable:</span>
          </div>

          <div className="bg-muted p-3 rounded-md font-mono text-sm">
            NEXT_PUBLIC_TOKENMETRICS_API_KEY=your_api_key_here
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline">Step 3</Badge>
            <span className="text-sm">Restart the application</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Zap className="h-4 w-4" />
          <span>Once configured, you'll see live price updates and real-time data streaming</span>
        </div>
      </CardContent>
    </Card>
  )
}
