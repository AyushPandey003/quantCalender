"use client"

import { useTransition } from "react"
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
import { useAuth } from "@/hooks/use-auth"
import { User, Settings, LogOut, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export function UserMenu() {
  const { user, signOut } = useAuth()
  const [isPending, startTransition] = useTransition()

  if (!user) {
    return null
  }

  const handleSignOut = () => {
    startTransition(async () => {
      try {
        await signOut()
        toast.success("Signed out successfully")
      } catch (error) {
        toast.error("Failed to sign out")
      }
    })
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
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
        <DropdownMenuItem onClick={handleSignOut} disabled={isPending} className="cursor-pointer">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
