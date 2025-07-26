/**
 * Market Data Demo Page
 * Demonstrates real-time cryptocurrency price streaming via WebSocket
 */

import PriceTicker from "../../components/market/price-ticker"
import { WebSocketSetupGuide } from "../../components/websocket-setup-guide"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { 
  Activity, 
  Zap, 
  Globe, 
  Shield, 
  TrendingUp,
  Clock,
  Settings
} from "lucide-react"

export default function MarketDataPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Real-Time Market Data</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Live cryptocurrency prices powered by TokenMetrics WebSocket API
        </p>
        <div className="flex justify-center space-x-2">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Zap className="h-3 w-3" />
            <span>Real-time</span>
          </Badge>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Globe className="h-3 w-3" />
            <span>WebSocket</span>
          </Badge>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Shield className="h-3 w-3" />
            <span>Authenticated</span>
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="demo" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="demo">Live Demo</TabsTrigger>
          <TabsTrigger value="setup">Setup Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="demo" className="space-y-6">
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <span>Live Updates</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Real-time price updates streamed directly from multiple exchanges with millisecond precision.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span>Multi-Token Support</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Subscribe to multiple cryptocurrencies simultaneously with automatic reconnection handling.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  <span>Low Latency</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Optimized WebSocket connection with automatic reconnection and error recovery mechanisms.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Price Ticker Component */}
          <PriceTicker />

          {/* API Information */}
          <Card>
            <CardHeader>
              <CardTitle>TokenMetrics WebSocket API</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Connection Details</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• WebSocket URL: <code className="bg-muted px-1 rounded">wss://price.data-service.tokenmetrics.com</code></li>
                    <li>• Authentication: API Key in headers</li>
                    <li>• Real-time price streaming</li>
                    <li>• Automatic reconnection</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Subscription Features</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Subscribe to multiple tokens</li>
                    <li>• Add/remove tokens dynamically</li>
                    <li>• Exchange information included</li>
                    <li>• Volume and timestamp data</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Plan Limits</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold">Basic (Free)</div>
                    <div className="text-muted-foreground">15 symbols</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold">Advanced</div>
                    <div className="text-muted-foreground">60 symbols</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold">Premium</div>
                    <div className="text-muted-foreground">120 symbols</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold">VIP</div>
                    <div className="text-muted-foreground">250 symbols</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup" className="space-y-6">
          <WebSocketSetupGuide />
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              This demo uses the TokenMetrics WebSocket API to stream real-time cryptocurrency prices.
              Make sure to set your <code className="bg-muted px-1 rounded">NEXT_PUBLIC_TOKENMETRICS_API_KEY</code> environment variable.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
