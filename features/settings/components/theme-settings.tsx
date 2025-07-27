"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { useEffect } from "react"
import { Monitor, Sun, Moon, Palette, Eye, Type, Zap } from "lucide-react"
import { useThemeSettingsContext } from "@/components/theme-settings-provider"
import { colorSchemes } from "@/lib/themes"

const fontSizes = [
  { name: "Small", value: "small", size: "14px" },
  { name: "Medium", value: "medium", size: "16px" },
  { name: "Large", value: "large", size: "18px" },
  { name: "Extra Large", value: "xl", size: "20px" },
]


export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const { settings, updateSetting, getChartColors, mounted } = useThemeSettingsContext();

  if (!mounted) {
    return null;
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
                variant={settings.colorScheme === scheme.value ? "default" : "outline"}
                onClick={() => updateSetting("colorScheme", scheme.value)}
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
            <Select value={settings.fontSize} onValueChange={(value) => updateSetting("fontSize", value)}>
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
              <Slider value={settings.contrast} onValueChange={(value) => updateSetting("contrast", value)} max={150} min={50} step={10} className="w-full" />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Low</span>
                <span>{settings.contrast[0]}%</span>
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
            <Switch checked={settings.highContrast} onCheckedChange={(value) => updateSetting("highContrast", value)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
            </div>
            <Switch checked={settings.reducedMotion} onCheckedChange={(value) => updateSetting("reducedMotion", value)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Compact Mode</Label>
              <p className="text-sm text-muted-foreground">Reduce spacing for more content density</p>
            </div>
            <Switch checked={settings.compactMode} onCheckedChange={(value) => updateSetting("compactMode", value)} />
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
            <Switch 
              checked={settings.hardwareAcceleration} 
              onCheckedChange={(value) => updateSetting("hardwareAcceleration", value)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Smooth Scrolling</Label>
              <p className="text-sm text-muted-foreground">Enable smooth scrolling behavior</p>
            </div>
            <Switch 
              checked={settings.smoothScrolling} 
              onCheckedChange={(value) => updateSetting("smoothScrolling", value)} 
            />
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
              <h3 className="text-lg font-semibold text-primary">Sample Dashboard</h3>
              <Badge className="bg-accent text-accent-foreground">Live Preview</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {getChartColors().slice(0, 3).map((color, index) => {
                const labels = ["BTC Price", "24h Change", "Volume"];
                const values = ["$45,123", "+5.2%", "2.1M"];
                return (
                  <div
                    key={index}
                    className="border rounded p-3 text-center"
                    style={{ backgroundColor: color, color: 'white' }}
                  >
                    <div className="text-2xl font-bold">{values[index]}</div>
                    <div className="text-sm opacity-90">{labels[index]}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 mt-4">
              <div className="text-sm text-muted-foreground">Chart Colors:</div>
              <div className="flex gap-1">
                {getChartColors().map((color, index) => (
                  <div 
                    key={index}
                    className="w-4 h-4 rounded-full border" 
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
