// Utility functions for theme management
import { chartColors } from "@/lib/themes"

export const applyColorScheme = (schemeName: string) => {
  if (typeof window === "undefined") return

  const colorSchemes = {
    default: {
      "--chart-1": chartColors.default["1"],
      "--chart-2": chartColors.default["2"],
      "--chart-3": chartColors.default["3"],
      "--chart-4": chartColors.default["4"],
      "--chart-5": chartColors.default["5"],
    },
    ocean: {
      "--chart-1": chartColors.ocean["1"],
      "--chart-2": chartColors.ocean["2"],
      "--chart-3": chartColors.ocean["3"],
      "--chart-4": chartColors.ocean["4"],
      "--chart-5": chartColors.ocean["5"],
    },
    forest: {
      "--chart-1": chartColors.forest["1"],
      "--chart-2": chartColors.forest["2"],
      "--chart-3": chartColors.forest["3"],
      "--chart-4": chartColors.forest["4"],
      "--chart-5": chartColors.forest["5"],
    },
    sunset: {
      "--chart-1": chartColors.sunset["1"],
      "--chart-2": chartColors.sunset["2"],
      "--chart-3": chartColors.sunset["3"],
      "--chart-4": chartColors.sunset["4"],
      "--chart-5": chartColors.sunset["5"],
    },
    purple: {
      "--chart-1": chartColors.purple["1"],
      "--chart-2": chartColors.purple["2"],
      "--chart-3": chartColors.purple["3"],
      "--chart-4": chartColors.purple["4"],
      "--chart-5": chartColors.purple["5"],
    },
    mono: {
      "--chart-1": chartColors.mono["1"],
      "--chart-2": chartColors.mono["2"],
      "--chart-3": chartColors.mono["3"],
      "--chart-4": chartColors.mono["4"],
      "--chart-5": chartColors.mono["5"],
    },
  }

  const scheme = colorSchemes[schemeName as keyof typeof colorSchemes] || colorSchemes.default
  const root = document.documentElement

  Object.entries(scheme).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })
  
  // Apply theme class to document element for themeable plugin
  root.className = root.className.replace(/theme-\w+/g, "")
  root.classList.add(`theme-${schemeName}`)
}

export const getColorSchemeValues = (schemeName: string) => {
  const colorSchemes = {
    default: [
      `hsl(${chartColors.default["1"]})`,
      `hsl(${chartColors.default["2"]})`,
      `hsl(${chartColors.default["3"]})`,
      `hsl(${chartColors.default["4"]})`,
      `hsl(${chartColors.default["5"]})`
    ],
    ocean: [
      `hsl(${chartColors.ocean["1"]})`,
      `hsl(${chartColors.ocean["2"]})`,
      `hsl(${chartColors.ocean["3"]})`,
      `hsl(${chartColors.ocean["4"]})`,
      `hsl(${chartColors.ocean["5"]})`
    ],
    forest: [
      `hsl(${chartColors.forest["1"]})`,
      `hsl(${chartColors.forest["2"]})`,
      `hsl(${chartColors.forest["3"]})`,
      `hsl(${chartColors.forest["4"]})`,
      `hsl(${chartColors.forest["5"]})`
    ],
    sunset: [
      `hsl(${chartColors.sunset["1"]})`,
      `hsl(${chartColors.sunset["2"]})`,
      `hsl(${chartColors.sunset["3"]})`,
      `hsl(${chartColors.sunset["4"]})`,
      `hsl(${chartColors.sunset["5"]})`
    ],
    purple: [
      `hsl(${chartColors.purple["1"]})`,
      `hsl(${chartColors.purple["2"]})`,
      `hsl(${chartColors.purple["3"]})`,
      `hsl(${chartColors.purple["4"]})`,
      `hsl(${chartColors.purple["5"]})`
    ],
    mono: [
      `hsl(${chartColors.mono["1"]})`,
      `hsl(${chartColors.mono["2"]})`,
      `hsl(${chartColors.mono["3"]})`,
      `hsl(${chartColors.mono["4"]})`,
      `hsl(${chartColors.mono["5"]})`
    ],
  }

  return colorSchemes[schemeName as keyof typeof colorSchemes] || colorSchemes.default
}
