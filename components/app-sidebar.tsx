"use client"

import { Calendar, BarChart3, Settings, Filter, TrendingUp, Activity, DollarSign } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { ConnectionStatus } from "@/components/connection-status"
import { UserMenu } from "@/components/auth/user-menu"

const navigationItems = [
  {
    title: "Calendar",
    url: "#calendar",
    icon: Calendar,
    description: "Interactive calendar heatmap",
  },
  {
    title: "Dashboard",
    url: "#dashboard",
    icon: BarChart3,
    description: "Performance metrics overview",
  },
  {
    title: "Filters",
    url: "#filters",
    icon: Filter,
    description: "Data filtering options",
  },
  {
    title: "Settings",
    url: "#settings",
    icon: Settings,
    description: "Application preferences",
  },
]

const metricsItems = [
  {
    title: "Volatility",
    icon: TrendingUp,
    color: "text-red-500",
  },
  {
    title: "Liquidity",
    icon: Activity,
    color: "text-blue-500",
  },
  {
    title: "Performance",
    icon: DollarSign,
    color: "text-green-500",
  },
]

export function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Market Explorer</span>
            <span className="truncate text-xs text-muted-foreground">Analytics Platform</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.description}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Metrics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {metricsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <item.icon className={item.color} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="space-y-2 px-2 py-2">
          <ConnectionStatus />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Account</span>
            <UserMenu />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
