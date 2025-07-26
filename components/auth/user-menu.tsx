"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuthContext } from "./auth-provider"
import { SignInDialog } from "./sign-in-dialog"
import { Settings, LogOut, Crown, BarChart3 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export function UserMenu() {
  const { user, isAuthenticated, signOut } = useAuthContext()
  const [showSignInDialog, setShowSignInDialog] = useState(false)

  if (!user) {
    return null
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "pro":
        return (
          <Badge variant="default" className="bg-blue-500">
            Pro
          </Badge>
        )
      case "enterprise":
        return (
          <Badge variant="default" className="bg-purple-500">
            Enterprise
          </Badge>
        )
      default:
        return <Badge variant="secondary">Free</Badge>
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
            <AvatarFallback>
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              {user?.plan && getPlanBadge(user.plan)}
            </div>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              {user?.plan && getPlanBadge(user.plan)}
            </div>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Dashboard
          <Link href="/dashboard" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center">
          <Link href="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Settings
            Settings
          </Link>
        </DropdownMenuItem>
        {user?.plan === "pro" || user?.plan === "enterprise" ? (
          <DropdownMenuItem asChild>
            <Link href="/premium" className="flex items-center">
              <Crown className="mr-2 h-4 w-4" />
              Premium Features
            </Link>
          </DropdownMenuItem>
        ) : null}
        {user?.plan === "pro" || user?.plan === "enterprise" ? (
          <DropdownMenuItem asChild>
            <Link href="/premium" className="flex items-center">
              <Crown className="mr-2 h-4 w-4" />
              Premium Features
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
