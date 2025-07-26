"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthContext } from "./auth-provider"
import { Eye, EyeOff, Loader2, Mail, Lock, User, AlertCircle } from "lucide-react"

interface SignInDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}
import { useAuthContext } from "./auth-provider"
import { Eye, EyeOff, Loader2, Mail, Lock, User, AlertCircle } from "lucide-react"

interface SignInDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignInDialog() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { signIn, signUp } = useAuth()

  // Sign in form state
  // Sign in form state
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  })

  // Sign up form state
  // Sign up form state
  const [signUpData, setSignUpData] = useState({
    name: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    confirmPassword: "",
  })

  const handleSignIn = () => {
    if (!signInData.email || !signInData.password) {
      toast.error("Please fill in all fields")
      return
    }

    startTransition(async () => {
      try {
        const result = await signIn(signInData.email, signInData.password)
        if (result.success) {
          toast.success(result.message)
          setOpen(false)
          setSignInData({ email: "", password: "" })
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        toast.error("An error occurred during sign in")
      }
    })
  }

  const handleSignUp = () => {
    if (!signUpData.email || !signUpData.password || !signUpData.name) {
      toast.error("Please fill in all fields")
      return
    }

    if (signUpData.password.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }

    startTransition(async () => {
      try {
        const result = await signUp(signUpData.email, signUpData.password, signUpData.name)
        if (result.success) {
          toast.success(result.message)
          setOpen(false)
          setSignUpData({ email: "", password: "", name: "" })
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        toast.error("An error occurred during sign up")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Market Explorer</DialogTitle>
          <DialogDescription>Sign in to your account or create a new one to get started</DialogDescription>
          <DialogTitle>Welcome to Market Explorer</DialogTitle>
          <DialogDescription>Sign in to your account or create a new one to get started</DialogDescription>
        </DialogHeader>


        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>


          <TabsContent value="signin" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="Enter your email"
                value={signInData.email}
                onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <Input
                id="signin-password"
                type="password"
                placeholder="Enter your password"
                value={signInData.password}
                onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                disabled={isPending}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSignIn()
                  }
                }}
              />
            </div>
            <Button onClick={handleSignIn} className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </TabsContent>


          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name">Full Name</Label>
              <Input
                id="signup-name"
                type="text"
                placeholder="Enter your full name"
                value={signUpData.name}
                onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                value={signUpData.email}
                onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="Create a password (min. 6 characters)"
                value={signUpData.password}
                onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                disabled={isPending}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSignUp()
                  }
                }}
              />
            </div>
            <Button onClick={handleSignUp} className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
