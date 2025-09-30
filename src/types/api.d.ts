import { NextRequest, NextResponse } from "next/server"
import { Session } from "next-auth"

export interface ApiError {
  error: string
  message: string
}

export type ApiHandler<T = unknown> = (
  request: NextRequest,
  session: Session
) => Promise<NextResponse<T | ApiError>>

export interface AuthenticatedSession extends Session {
  user: {
    id: string
    role: "admin" | "member" | "viewer"
    email: string
    name?: string
    image?: string
  }
}

export interface CreateAccountData {
  institution: string
  label: string
  initialBalanceMinor?: number
  startDate?: string
}
