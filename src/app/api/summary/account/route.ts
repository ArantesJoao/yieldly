import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { withAuth, createErrorResponse } from "@/lib/api"
import { authorize } from "@/lib/authorization"
import { accountSummaryQuerySchema } from "@/lib/validations"
import { getAccountSummary } from "@/lib/summary"

export const GET = withAuth(async (request, session) => {
  const { searchParams } = new URL(request.url)

  const queryData = accountSummaryQuerySchema.parse({
    accountId: searchParams.get('accountId'),
    from: searchParams.get('from'),
    to: searchParams.get('to')
  })

  // Check if user owns the account
  const account = await db.account.findUnique({
    where: { id: queryData.accountId }
  })

  if (!account) {
    return createErrorResponse('not-found', 'Account not found', 404)
  }

  await authorize("summary:read", {
    userId: session.user.id,
    role: session.user.role,
    resourceOwnerId: account.ownerUserId.toString()
  })

  const summary = await getAccountSummary(
    queryData.accountId,
    queryData.from,
    queryData.to
  )

  return NextResponse.json(summary)
})
