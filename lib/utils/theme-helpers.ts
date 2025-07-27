// Utility functions for applying theme classes to components
import { cn } from "@/lib/utils"

/**
 * Get theme-aware chart color classes
 */
export const getChartColorClasses = (index: number = 1) => ({
  background: `bg-chart-${index}`,
  text: `text-chart-${index}`,
  border: `border-chart-${index}`,
})

/**
 * Apply theme-aware styling to chart elements
 */
export const applyChartStyling = (element: HTMLElement, colorIndex: number = 1) => {
  const chartColor = `hsl(var(--chart-${colorIndex}))`
  element.style.backgroundColor = chartColor
  element.style.color = 'white'
}

/**
 * Get CSS custom property value for chart colors
 */
export const getChartColorVariable = (index: number = 1) => `var(--chart-${index})`

/**
 * Utility to combine theme classes with component classes
 */
export const withThemeClasses = (baseClasses: string, themeClasses?: string) => {
  return cn(baseClasses, themeClasses)
}
