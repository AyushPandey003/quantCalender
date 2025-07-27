"use client"

import { useState, useEffect } from "react"
import { applyColorScheme, getColorSchemeValues } from "@/lib/utils/theme-utils"

export interface ThemeSettings {
  colorScheme: string
  fontSize: string
  contrast: number[]
  reducedMotion: boolean
  highContrast: boolean
  compactMode: boolean
  hardwareAcceleration: boolean
  smoothScrolling: boolean
}

const defaultSettings: ThemeSettings = {
  colorScheme: "default",
  fontSize: "medium",
  contrast: [100],
  reducedMotion: false,
  highContrast: false,
  compactMode: false,
  hardwareAcceleration: true,
  smoothScrolling: true,
}

export function useThemeSettings() {
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings)
  const [mounted, setMounted] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    setMounted(true)
    if (typeof window === "undefined") return

    const loadedSettings: ThemeSettings = {
      colorScheme: localStorage.getItem("colorScheme") || defaultSettings.colorScheme,
      fontSize: localStorage.getItem("fontSize") || defaultSettings.fontSize,
      contrast: [parseInt(localStorage.getItem("contrast") || "100")],
      reducedMotion: localStorage.getItem("reducedMotion") === "true",
      highContrast: localStorage.getItem("highContrast") === "true",
      compactMode: localStorage.getItem("compactMode") === "true",
      hardwareAcceleration: localStorage.getItem("hardwareAcceleration") !== "false",
      smoothScrolling: localStorage.getItem("smoothScrolling") !== "false",
    }

    setSettings(loadedSettings)
    
    // Apply color scheme CSS variables
    applyColorScheme(loadedSettings.colorScheme)
  }, [])

  // Update a specific setting
  const updateSetting = <K extends keyof ThemeSettings>(
    key: K,
    value: ThemeSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    
    // Save to localStorage
    if (typeof window !== "undefined") {
      if (key === "contrast") {
        localStorage.setItem(key, (value as number[])[0].toString())
      } else {
        localStorage.setItem(key, value.toString())
      }
      
      // Apply color scheme changes immediately
      if (key === "colorScheme") {
        applyColorScheme(value as string)
      }
    }
  }

  // Get chart colors based on current color scheme
  const getChartColors = () => {
    return getColorSchemeValues(settings.colorScheme)
  }

  return {
    settings,
    updateSetting,
    getChartColors,
    mounted,
  }
}
