import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, generateToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Authenticate user
    const user = await authenticateUser(email, password)
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Generate token and set cookie
    const token = await generateToken(user)
    await setAuthCookie(token)

    return NextResponse.json({
      user,
      message: "Signed in successfully",
    })
  } catch (error) {
    console.error("Sign in error:", error)
    return NextResponse.json({ error: "Sign in failed" }, { status: 500 })
  }
}
