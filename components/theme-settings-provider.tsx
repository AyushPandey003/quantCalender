"use client"

import React, { createContext, useContext, useEffect } from "react"
import { useThemeSettings, ThemeSettings } from "@/hooks/use-theme-settings"
import { applyColorScheme } from "@/lib/utils/theme-utils"

interface ThemeSettingsContextType {
  settings: ThemeSettings
  updateSetting: <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => void
  getChartColors: () => string[]
  mounted: boolean
}

const ThemeSettingsContext = createContext<ThemeSettingsContextType | null>(null)

export function useThemeSettingsContext() {
  const context = useContext(ThemeSettingsContext)
  if (!context) {
    throw new Error("useThemeSettingsContext must be used within ThemeSettingsProvider")
  }
  return context
}

interface ThemeSettingsProviderProps {
  children: React.ReactNode
}

export function ThemeSettingsProvider({ children }: ThemeSettingsProviderProps) {
  const themeSettings = useThemeSettings()

  // Apply global theme settings on mount and when settings change
  useEffect(() => {
    if (!themeSettings.mounted) return

    const { settings } = themeSettings
    
    // Apply color scheme
    applyColorScheme(settings.colorScheme)
    
    // Apply body classes and CSS variables
    if (typeof window !== "undefined") {
      const body = document.body

      // Font size as CSS variable
      const fontSizeMap = {
        small: "14px",
        medium: "16px", 
        large: "18px",
        xl: "20px",
      }
      const fontPx = fontSizeMap[settings.fontSize as keyof typeof fontSizeMap] || "16px"
      body.style.setProperty("--app-font-size", fontPx)
      
      // Apply font size class for dynamic scaling
      body.classList.remove("font-small", "font-medium", "font-large", "font-xl")
      body.classList.add(`font-${settings.fontSize}`)

      // Contrast as CSS variable
      body.style.setProperty("--app-contrast", `${settings.contrast[0]}%`)
      
      // Contrast filter
      if (settings.contrast[0] !== 100) {
        body.style.setProperty("filter", `contrast(${settings.contrast[0]}%)`)
      } else {
        body.style.removeProperty("filter")
      }

      // Theme classes
      body.classList.toggle("high-contrast", settings.highContrast)
      body.classList.toggle("reduced-motion", settings.reducedMotion)
      body.classList.toggle("compact-mode", settings.compactMode)
      body.classList.toggle("hardware-acceleration", settings.hardwareAcceleration)
      body.classList.toggle("smooth-scrolling", settings.smoothScrolling)
    }
  }, [themeSettings.settings, themeSettings.mounted])

  return (
    <ThemeSettingsContext.Provider value={themeSettings}>
      {children}
    </ThemeSettingsContext.Provider>
  )
}
