import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ThemedChartProps {
  title: string
  data: Array<{
    label: string
    value: number
    color?: string
  }>
}

export function ThemedChart({ title, data }: ThemedChartProps) {
  return (
    <Card className="theme-aware-border">
      <CardHeader>
        <CardTitle className="theme-aware-text">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))` 
                  }}
                />
                <span className="text-sm">{item.label}</span>
              </div>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
