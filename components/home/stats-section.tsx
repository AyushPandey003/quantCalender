"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, Zap, Globe } from "lucide-react"

const stats = [
  {
    icon: TrendingUp,
    value: "50+",
    label: "Cryptocurrencies Tracked",
    description: "Real-time data from major exchanges",
  },
  {
    icon: Users,
    value: "10K+",
    label: "Active Users",
    description: "Traders and analysts worldwide",
  },
  {
    icon: Zap,
    value: "99.9%",
    label: "Uptime Guarantee",
    description: "Reliable 24/7 market monitoring",
  },
  {
    icon: Globe,
    value: "15+",
    label: "Global Exchanges",
    description: "Connected data sources",
  },
]

export function StatsSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Trusted by traders{" "}
            <span className="bg-gradient-to-r from-primary to-green-500 bg-clip-text text-transparent">worldwide</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of traders who rely on our platform for accurate market insights and real-time data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-8 pb-6 space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-primary">{stat.value}</div>
                  <div className="text-lg font-semibold">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.description}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
