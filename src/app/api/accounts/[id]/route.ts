import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { withAuth, createErrorResponse, parseJsonBody } from "@/lib/api"
import { authorize } from "@/lib/authorization"
import { z } from "zod"

const updateAccountSchema = z.object({
  institution: z.string().min(1, "Institution is required").max(100).optional(),
  label: z.string().min(1, "Label is required").max(100).optional(),
})

export const PATCH = withAuth(async (request, session) => {
  const url = new URL(request.url)
  const accountId = url.pathname.split('/').pop()

  if (!accountId) {
    return createErrorResponse('invalid-id', 'Account ID is required', 400)
  }

  // Check if account exists and get owner
  const account = await db.account.findUnique({
    where: { id: BigInt(accountId) }
  })

  if (!account) {
    return createErrorResponse('not-found', 'Account not found', 404)
  }

  await authorize("account:update", {
    userId: session.user.id,
    role: session.user.role,
    resourceOwnerId: account.ownerUserId.toString()
  })

  const body = await parseJsonBody(request)
  const validatedData = updateAccountSchema.parse(body)

  // Update account
  const updatedAccount = await db.account.update({
    where: { id: BigInt(accountId) },
    data: validatedData
  })

  // Get current balance
  const latestSummary = await db.dailyAccountSummary.findFirst({
    where: { accountId: updatedAccount.id },
    orderBy: { date: 'desc' },
    select: { balanceEndMinor: true }
  })

  const serializedAccount = {
    ...updatedAccount,
    id: updatedAccount.id.toString(),
    ownerUserId: updatedAccount.ownerUserId.toString(),
    currentBalanceMinor: latestSummary?.balanceEndMinor || 0
  }

  return NextResponse.json(serializedAccount)
})

export const DELETE = withAuth(async (request, session) => {
  const url = new URL(request.url)
  const accountId = url.pathname.split('/').pop()

  if (!accountId) {
    return createErrorResponse('invalid-id', 'Account ID is required', 400)
  }

  // Check if account exists and get owner
  const account = await db.account.findUnique({
    where: { id: BigInt(accountId) }
  })

  if (!account) {
    return createErrorResponse('not-found', 'Account not found', 404)
  }

  await authorize("account:delete", {
    userId: session.user.id,
    role: session.user.role,
    resourceOwnerId: account.ownerUserId.toString()
  })

  // Delete account (cascades to ledger entries and summaries)
  await db.account.delete({
    where: { id: BigInt(accountId) }
  })

  return NextResponse.json({ success: true })
})
