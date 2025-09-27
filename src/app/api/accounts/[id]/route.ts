import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { withAuth, createErrorResponse } from "@/lib/api"
import { authorize } from "@/lib/authorization"

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
