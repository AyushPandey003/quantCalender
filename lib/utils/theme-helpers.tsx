import { cn } from "../../lib/utils"

interface ThemeUtilsProps {
  className?: string
}

export const themeUtils = {
  // Background utilities using chart colors
  chartBg: (index: number = 1, opacity: number = 0.1) =>
    `bg-[hsl(var(--chart-${index})//${opacity})]`,
  
  // Text utilities using chart colors
  chartText: (index: number = 1) =>
    `text-[hsl(var(--chart-${index}))]`,
  
  // Border utilities using chart colors
  chartBorder: (index: number = 1, opacity: number = 0.2) =>
    `border-[hsl(var(--chart-${index})//${opacity})]`,
  
  // Combine multiple theme-aware classes
  themeAware: (className?: string) =>
    cn("theme-aware-bg theme-aware-text theme-aware-border", className),
}

// Hook to get current theme colors
export function useThemeColors() {
  if (typeof window === "undefined") {
    return {
      chart1: "hsl(220 70% 50%)",
      chart2: "hsl(160 60% 45%)",
      chart3: "hsl(0 70% 50%)",
      chart4: "hsl(280 65% 60%)",
      chart5: "hsl(340 75% 55%)",
    }
  }

  const computedStyle = getComputedStyle(document.documentElement)
  
  return {
    chart1: `hsl(${computedStyle.getPropertyValue("--chart-1").trim()})`,
    chart2: `hsl(${computedStyle.getPropertyValue("--chart-2").trim()})`,
    chart3: `hsl(${computedStyle.getPropertyValue("--chart-3").trim()})`,
    chart4: `hsl(${computedStyle.getPropertyValue("--chart-4").trim()})`,
    chart5: `hsl(${computedStyle.getPropertyValue("--chart-5").trim()})`,
  }
}

// Component wrapper for theme-aware styling
export function ThemeAware({ 
  children, 
  className,
  variant = "default"
}: {
  children: React.ReactNode
  className?: string
  variant?: "default" | "subtle" | "bold"
}) {
  const variantClasses = {
    default: "theme-aware-bg theme-aware-text theme-aware-border",
    subtle: "bg-[hsl(var(--chart-1)/0.05)] border-[hsl(var(--chart-1)/0.1)]",
    bold: "bg-[hsl(var(--chart-1)/0.2)] text-[hsl(var(--chart-1))] border-[hsl(var(--chart-1)/0.3)]"
  }

  return (
    <div className={cn(variantClasses[variant], className)}>
      {children}
    </div>
  )
}
