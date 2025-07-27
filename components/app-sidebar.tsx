"use client"

import { Calendar, BarChart3, Settings, Home, TrendingUp, Activity, DollarSign, Zap } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
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
import { SignInDialog } from "@/components/auth/sign-in-dialog"
import { useAuthContext } from "@/components/auth/auth-provider"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    description: "Landing page and overview",
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
    description: "Interactive calendar heatmap",
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
    description: "Performance metrics overview",
  },
  {
    title: "Market Data",
    url: "/market",
    icon: Zap,
    description: "Real-time price streaming",
  },
  {
    title: "Settings",
    url: "/settings",
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
  const pathname = usePathname()
  const { isAuthenticated } = useAuthContext()
  const [showSignInDialog, setShowSignInDialog] = useState(false)

  const handleNavigationClick = (e: React.MouseEvent, url: string) => {
    // Allow navigation to home page even when not authenticated
    if (url === "/" || isAuthenticated) {
      return // Let the Link component handle navigation normally
    }
    
    // Prevent navigation and show sign-in dialog for unauthenticated users
    e.preventDefault()
    setShowSignInDialog(true)
  }

  return (
    <>
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
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.description} 
                      isActive={pathname === item.url}
                    >
                      <Link 
                        href={item.url}
                        onClick={(e) => handleNavigationClick(e, item.url)}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
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

      <SignInDialog open={showSignInDialog} onOpenChange={setShowSignInDialog} />
    </>
  )
}
