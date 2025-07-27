/**
 * WebSocket Setup Guide Component
 * Provides instructions for configuring real-time price streaming
 */

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMarketDataContext } from "@/shared/contexts/market-data-context"
import { config } from "@/lib/config"
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ExternalLink, 
  Copy,
  Zap,
  Settings,
  Code,
  Play,
  BookOpen
} from "lucide-react"
import { cn } from "@/lib/utils"

function ApiKeyStatus() {
  const { connectionState } = useMarketDataContext()
  const isConfigured = !!config.tokenMetrics.apiKey
  
  return (
    <div className="flex items-center space-x-2">
      {isConfigured ? (
        <>
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-green-600 font-medium">API Key Configured</span>
          <Badge variant={connectionState === "connected" ? "default" : "secondary"}>
            {connectionState}
          </Badge>
        </>
      ) : (
        <>
          <XCircle className="h-4 w-4 text-red-600" />
          <span className="text-red-600 font-medium">API Key Missing</span>
        </>
      )}
    </div>
  )
}

function SetupSteps() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(step)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const steps = [
    {
      title: "Get TokenMetrics API Key",
      description: "Sign up for a TokenMetrics account and get your API key",
      action: (
        <Button variant="outline" size="sm" asChild>
          <a href="https://dashboard.tokenmetrics.com/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3 w-3 mr-1" />
            Get API Key
          </a>
        </Button>
      )
    },
    {
      title: "Set Environment Variable",
      description: "Add your API key to your environment variables",
      code: "NEXT_PUBLIC_TOKENMETRICS_API_KEY=your_api_key_here",
      action: (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => copyToClipboard("NEXT_PUBLIC_TOKENMETRICS_API_KEY=your_api_key_here", 2)}
        >
          <Copy className="h-3 w-3 mr-1" />
          {copiedStep === 2 ? "Copied!" : "Copy"}
        </Button>
      )
    },
    {
      title: "Restart Development Server",
      description: "Restart your Next.js development server to load the new environment variable",
      code: "pnpm dev",
      action: (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => copyToClipboard("pnpm dev", 3)}
        >
          <Copy className="h-3 w-3 mr-1" />
          {copiedStep === 3 ? "Copied!" : "Copy"}
        </Button>
      )
    },
    {
      title: "Test Connection",
      description: "Navigate to the Market Data page to test your WebSocket connection",
      action: (
        <Button variant="outline" size="sm" asChild>
          <a href="/market">
            <Play className="h-3 w-3 mr-1" />
            Test Now
          </a>
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
            {index + 1}
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <h4 className="font-medium">{step.title}</h4>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
            {step.code && (
              <div className="relative">
                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
                  <code>{step.code}</code>
                </pre>
              </div>
            )}
            <div>{step.action}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function CodeExamples() {
  const [copiedExample, setCopiedExample] = useState<string | null>(null)

  const copyExample = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedExample(id)
    setTimeout(() => setCopiedExample(null), 2000)
  }

  const examples = [
    {
      id: "basic-usage",
      title: "Basic Hook Usage",
      description: "Use the hook to subscribe to token prices",
      code: `import { usePriceStream } from '@/hooks/use-price-stream'

function MyComponent() {
  const { priceData, connectionState } = usePriceStream({
    tokens: ['bitcoin', 'ethereum'],
    autoConnect: true
  })

  return (
    <div>
      {Object.values(priceData).map(token => (
        <div key={token.token_symbol}>
          {token.token_name}: $\{token.price}
        </div>
      ))}
    </div>
  )
}`
    },
    {
      id: "context-usage",
      title: "Using Market Data Context",
      description: "Access shared market data across components",
      code: `import { useMarketDataContext } from '@/shared/contexts/market-data-context'

function PriceDisplay() {
  const { 
    getTokenPrice, 
    connectToSymbol,
    connectionState 
  } = useMarketDataContext()

  const handleSubscribe = () => {
    connectToSymbol('bitcoin')
  }

  const price = getTokenPrice('bitcoin')

  return (
    <div>
      <button onClick={handleSubscribe}>
        Subscribe to Bitcoin
      </button>
      {price && <p>BTC: $\{price.price}</p>}
    </div>
  )
}`
    },
    {
      id: "single-token",
      title: "Single Token Subscription",
      description: "Subscribe to a single token's price updates",
      code: `import { useTokenPrice } from '@/hooks/use-price-stream'

function BitcoinPrice() {
  const { 
    priceData, 
    connectionState, 
    isConnected 
  } = useTokenPrice('bitcoin')

  if (!isConnected) {
    return <div>Connecting...</div>
  }

  return (
    <div>
      <h3>Bitcoin Price</h3>
      {priceData && (
        <div>
          <p>Price: $\{priceData.price}</p>
          <p>Volume: $\{priceData.volume}</p>
          <p>Exchange: {priceData.exchange}</p>
        </div>
      )}
    </div>
  )
}`
    }
  ]

  return (
    <div className="space-y-6">
      {examples.map((example) => (
        <div key={example.id}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-medium">{example.title}</h4>
              <p className="text-sm text-muted-foreground">{example.description}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyExample(example.code, example.id)}
            >
              <Copy className="h-3 w-3 mr-1" />
              {copiedExample === example.id ? "Copied!" : "Copy"}
            </Button>
          </div>
          <div className="relative">
            <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
              <code>{example.code}</code>
            </pre>
          </div>
        </div>
      ))}
    </div>
  )
}

export function WebSocketSetupGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>WebSocket Setup Guide</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Current Status</h3>
            <ApiKeyStatus />
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              To enable real-time price streaming, you need to configure your TokenMetrics API key.
              This unlocks live WebSocket connections for up-to-the-second cryptocurrency price data.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="setup" className="space-y-4">
            <TabsList>
              <TabsTrigger value="setup" className="flex items-center space-x-1">
                <Settings className="h-3 w-3" />
                <span>Setup</span>
              </TabsTrigger>
              <TabsTrigger value="examples" className="flex items-center space-x-1">
                <Code className="h-3 w-3" />
                <span>Code Examples</span>
              </TabsTrigger>
              <TabsTrigger value="docs" className="flex items-center space-x-1">
                <BookOpen className="h-3 w-3" />
                <span>Documentation</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="space-y-4">
              <SetupSteps />
            </TabsContent>

            <TabsContent value="examples" className="space-y-4">
              <CodeExamples />
            </TabsContent>

            <TabsContent value="docs" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">API Features</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                    <li>• Real-time price updates via WebSocket</li>
                    <li>• Support for 250+ cryptocurrencies</li>
                    <li>• Exchange information and volume data</li>
                    <li>• Automatic reconnection handling</li>
                    <li>• Plan-based rate limiting</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Plan Limits</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(config.planLimits).map(([plan, limits]) => (
                      <div key={plan} className="text-center p-3 bg-muted rounded-lg">
                        <div className="font-semibold capitalize">{plan}</div>
                        <div className="text-sm text-muted-foreground">{limits.symbols} symbols</div>
                        <div className="text-xs text-muted-foreground">{limits.messagesPerSec}/sec</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Integration Points</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-1">Dashboard</h5>
                      <p className="text-sm text-muted-foreground">
                        Real-time metrics, price widgets, and live performance indicators
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Calendar</h5>
                      <p className="text-sm text-muted-foreground">
                        Live price overlays on calendar cells with historical context
                      </p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Note:</strong> The WebSocket connection will automatically reconnect if it's lost.
                    Make sure your API key is valid and your plan has sufficient limits for your usage.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
