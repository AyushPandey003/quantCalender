import { NextRequest, NextResponse } from "next/server"
import { refreshAccessToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const result = await refreshAccessToken()
    
    if (result.success) {
      return NextResponse.json({ success: true, user: result.user })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error("Token refresh error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
} 