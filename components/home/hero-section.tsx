"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, BarChart3, Calendar, Zap } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useThemeSettingsContext } from "@/components/theme-settings-provider"

export function HeroSection() {
  const { getChartColors, mounted } = useThemeSettingsContext()
  
  // Get theme colors, fallback to defaults if not mounted
  const chartColors = mounted ? getChartColors() : [
    "hsl(220 70% 50%)", 
    "hsl(160 60% 45%)", 
    "hsl(0 70% 50%)"
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      {/* Floating Elements - using dynamic colors */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full blur-xl animate-pulse" 
           style={{ backgroundColor: `${chartColors[0]}20` }} />
      <div className="absolute top-40 right-20 w-32 h-32 rounded-full blur-xl animate-pulse delay-1000" 
           style={{ backgroundColor: `${chartColors[1]}20` }} />
      <div className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full blur-xl animate-pulse delay-2000" 
           style={{ backgroundColor: `${chartColors[2]}20` }} />

      <div className="container mx-auto px-6 py-24 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <Zap className="w-4 h-4 mr-2" />
              Real-time Market Analytics Platform
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Market{" "}
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, hsl(var(--primary)), ${chartColors[1]}, ${chartColors[2]})`
                }}
              >
                Seasonality
              </span>{" "}
              Explorer
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover hidden patterns in cryptocurrency markets with advanced calendar analytics, real-time data
              streaming, and intelligent volatility insights.
            </p>
          </motion.div>

          {/* Feature Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center items-center space-x-8 py-6"
          >
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Calendar className="w-5 h-5" style={{ color: chartColors[0] }} />
              <span className="text-sm font-medium">Calendar Heatmaps</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <TrendingUp className="w-5 h-5" style={{ color: chartColors[1] }} />
              <span className="text-sm font-medium">Live Data</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <BarChart3 className="w-5 h-5" style={{ color: chartColors[2] }} />
              <span className="text-sm font-medium">Advanced Analytics</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button asChild size="lg" className="px-8 py-6 text-lg">
              <Link href="/dashboard">
                Start Exploring
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg bg-transparent">
              <Link href="#features">Learn More</Link>
            </Button>
          </motion.div>

          {/* Stats Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Cryptocurrencies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: chartColors[1] }}>24/7</div>
              <div className="text-sm text-muted-foreground">Real-time Data</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: chartColors[2] }}>99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
