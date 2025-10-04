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

export interface UpdateAccountData {
  institution?: string
  label?: string
}

export interface Account {
  id: string
  ownerUserId: string
  institution: string
  label: string
  currentBalanceMinor: number
  createdAt: Date
}

export interface CreateLedgerEntryData {
  accountId: string
  date: string
  transactionTypeId: string
  amountMinor: number
  note?: string
}

export interface SpreadYieldsData {
  accountId: string
  transactionTypeId: string
  totalAmountMinor: number
  startDate: string
  endDate: string
  roundingMode?: "lastDayGetsRemainder"
}

export interface TransactionType {
  id: string
  ownerUserId: string
  name: string
  direction: "inflow" | "outflow"
}

export interface CreateTransactionTypeData {
  name: string
  direction: "inflow" | "outflow"
}
