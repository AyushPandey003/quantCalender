import { NextRequest, NextResponse } from "next/server"
import { signOut } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const result = await signOut()
    if (result.success) {
      return NextResponse.json({ success: true, message: result.message })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Sign out error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
