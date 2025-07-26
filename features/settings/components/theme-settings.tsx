"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Monitor, Sun, Moon, Palette, Eye, Type, Zap } from "lucide-react"

const colorSchemes = [
  { name: "Default", value: "default", colors: ["bg-blue-500", "bg-green-500", "bg-red-500"] },
  { name: "Ocean", value: "ocean", colors: ["bg-cyan-500", "bg-blue-500", "bg-indigo-500"] },
  { name: "Forest", value: "forest", colors: ["bg-green-500", "bg-emerald-500", "bg-teal-500"] },
  { name: "Sunset", value: "sunset", colors: ["bg-orange-500", "bg-red-500", "bg-pink-500"] },
  { name: "Purple", value: "purple", colors: ["bg-purple-500", "bg-violet-500", "bg-fuchsia-500"] },
  { name: "Monochrome", value: "mono", colors: ["bg-gray-600", "bg-gray-500", "bg-gray-400"] },
]

const fontSizes = [
  { name: "Small", value: "small", size: "14px" },
  { name: "Medium", value: "medium", size: "16px" },
  { name: "Large", value: "large", size: "18px" },
  { name: "Extra Large", value: "xl", size: "20px" },
]

export function ThemeSettings() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [colorScheme, setColorScheme] = useState("default")
  const [fontSize, setFontSize] = useState("medium")
  const [contrast, setContrast] = useState([100])
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [compactMode, setCompactMode] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Theme Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Mode
          </CardTitle>
          <CardDescription>Choose your preferred theme mode for the application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
              className="h-20 flex-col gap-2"
            >
              <Sun className="h-6 w-6" />
              <span>Light</span>
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
              className="h-20 flex-col gap-2"
            >
              <Moon className="h-6 w-6" />
              <span>Dark</span>
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              onClick={() => setTheme("system")}
              className="h-20 flex-col gap-2"
            >
              <Monitor className="h-6 w-6" />
              <span>System</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Color Scheme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Scheme
          </CardTitle>
          <CardDescription>Select a color palette for charts and data visualization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {colorSchemes.map((scheme) => (
              <Button
                key={scheme.value}
                variant={colorScheme === scheme.value ? "default" : "outline"}
                onClick={() => setColorScheme(scheme.value)}
                className="h-16 flex-col gap-2 relative"
              >
                <div className="flex gap-1">
                  {scheme.colors.map((color, index) => (
                    <div key={index} className={`w-3 h-3 rounded-full ${color}`} />
                  ))}
                </div>
                <span className="text-sm">{scheme.name}</span>
                {scheme.value === "default" && (
                  <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs">
                    Default
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Typography
          </CardTitle>
          <CardDescription>Customize font size and text appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Font Size</Label>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger>
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{size.name}</span>
                      <span className="text-muted-foreground ml-4" style={{ fontSize: size.size }}>
                        Aa
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Text Contrast</Label>
            <div className="px-3">
              <Slider value={contrast} onValueChange={setContrast} max={150} min={50} step={10} className="w-full" />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Low</span>
                <span>{contrast[0]}%</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Accessibility
          </CardTitle>
          <CardDescription>Configure accessibility and visual preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>High Contrast Mode</Label>
              <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
            </div>
            <Switch checked={highContrast} onCheckedChange={setHighContrast} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
            </div>
            <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Compact Mode</Label>
              <p className="text-sm text-muted-foreground">Reduce spacing for more content density</p>
            </div>
            <Switch checked={compactMode} onCheckedChange={setCompactMode} />
          </div>
        </CardContent>
      </Card>

      {/* Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance
          </CardTitle>
          <CardDescription>Optimize visual performance and rendering</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Hardware Acceleration</Label>
              <p className="text-sm text-muted-foreground">Use GPU acceleration for smoother animations</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Smooth Scrolling</Label>
              <p className="text-sm text-muted-foreground">Enable smooth scrolling behavior</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Preview</CardTitle>
          <CardDescription>Preview how your theme settings will look</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Sample Dashboard</h3>
              <Badge>Live Preview</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-background border rounded p-3 text-center">
                <div className="text-2xl font-bold text-primary">$45,123</div>
                <div className="text-sm text-muted-foreground">BTC Price</div>
              </div>
              <div className="bg-background border rounded p-3 text-center">
                <div className="text-2xl font-bold text-green-500">+5.2%</div>
                <div className="text-sm text-muted-foreground">24h Change</div>
              </div>
              <div className="bg-background border rounded p-3 text-center">
                <div className="text-2xl font-bold text-blue-500">2.1M</div>
                <div className="text-sm text-muted-foreground">Volume</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
