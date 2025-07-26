"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, BarChart3, Zap, Shield, Smartphone, Brain, Globe, Clock } from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Interactive Calendar Heatmaps",
    description:
      "Visualize market patterns with color-coded calendar views showing volatility, liquidity, and performance data across different timeframes.",
    badge: "Core Feature",
    color: "text-primary",
  },
  {
    icon: Zap,
    title: "Real-time Data Streaming",
    description:
      "Connect to live market data via WebSocket connections with sub-second updates and automatic reconnection handling.",
    badge: "Live Data",
    color: "text-yellow-500",
  },
  {
    icon: TrendingUp,
    title: "Advanced Analytics",
    description:
      "Deep dive into market metrics with volatility analysis, liquidity scoring, and performance tracking across multiple assets.",
    badge: "Analytics",
    color: "text-blue-500",
  },
  {
    icon: Brain,
    title: "Pattern Recognition",
    description:
      "AI-powered seasonal pattern detection helps identify recurring market behaviors and optimal trading windows.",
    badge: "AI Powered",
    color: "text-purple-500",
  },
  {
    icon: BarChart3,
    title: "Multi-timeframe Analysis",
    description:
      "Analyze data across daily, weekly, monthly, and quarterly timeframes with seamless switching and comparison tools.",
    badge: "Flexible",
    color: "text-green-500",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-grade security with encrypted connections, secure API key management, and compliance with industry standards.",
    badge: "Secure",
    color: "text-red-500",
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description:
      "Fully responsive design optimized for desktop, tablet, and mobile devices with touch-friendly interactions.",
    badge: "Responsive",
    color: "text-indigo-500",
  },
  {
    icon: Globe,
    title: "Global Markets",
    description:
      "Support for major cryptocurrency exchanges worldwide with real-time price feeds and market depth data.",
    badge: "Global",
    color: "text-cyan-500",
  },
  {
    icon: Clock,
    title: "Historical Data",
    description:
      "Access years of historical market data with advanced filtering, export capabilities, and trend analysis tools.",
    badge: "Historical",
    color: "text-orange-500",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="px-4 py-2">
            Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Everything you need for{" "}
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              market analysis
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful tools and insights to help you understand market patterns, identify opportunities, and make
            informed decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/60 backdrop-blur-sm"
            >
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg bg-muted/50 ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
