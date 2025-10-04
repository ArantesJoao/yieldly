import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { withAuth, parseJsonBody, createErrorResponse } from "@/lib/api"
import { authorize } from "@/lib/authorization"
import { ledgerSpreadSchema, convertDateToUTC } from "@/lib/validations"
import { updateDailyAccountSummary } from "@/lib/summary"

export const POST = withAuth(async (request, session) => {
  await authorize("ledger:create", {
    userId: session.user.id,
    role: session.user.role
  })

  const body = await parseJsonBody(request)
  const validatedData = ledgerSpreadSchema.parse(body)

  // Check if user owns the account
  const account = await db.account.findUnique({
    where: { id: validatedData.accountId }
  })

  if (!account) {
    return createErrorResponse('not-found', 'Account not found', 404)
  }

  if (account.ownerUserId.toString() !== session.user.id) {
    return createErrorResponse('forbidden', 'Account not owned by user', 403)
  }

  // Check if user owns the transaction type
  const transactionType = await db.transactionType.findUnique({
    where: { id: validatedData.transactionTypeId }
  })

  if (!transactionType) {
    return createErrorResponse('not-found', 'Transaction type not found', 404)
  }

  if (transactionType.ownerUserId.toString() !== session.user.id) {
    return createErrorResponse('forbidden', 'Transaction type not owned by user', 403)
  }

  const startDate = convertDateToUTC(validatedData.startDate)
  const endDate = convertDateToUTC(validatedData.endDate)

  // Calculate number of days
  const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  // Calculate amounts per day
  const perDay = Math.floor(validatedData.totalAmountMinor / daysDiff)
  const remainder = validatedData.totalAmountMinor - (perDay * daysDiff)

  // Create entries for each day
  const entries = []

  for (let i = 0; i < daysDiff; i++) {
    const currentDate = new Date(startDate)
    currentDate.setUTCDate(currentDate.getUTCDate() + i)

    // Last day gets the remainder (per roundingMode)
    const amount = i === daysDiff - 1 ? perDay + remainder : perDay

    const entry = await db.ledgerEntry.create({
      data: {
        accountId: validatedData.accountId,
        date: currentDate,
        transactionTypeId: validatedData.transactionTypeId,
        amountMinor: amount,
        note: `Spread entry ${i + 1}/${daysDiff}`
      }
    })

    entries.push(entry)

    // Update summary sequentially so previous day's balance is available
    await updateDailyAccountSummary(validatedData.accountId, currentDate)
  }

  return NextResponse.json({
    inserted: daysDiff,
    entries: entries.map(entry => ({
      ...entry,
      id: entry.id.toString(),
      accountId: entry.accountId.toString(),
      transactionTypeId: entry.transactionTypeId.toString(),
      date: entry.date.toISOString().split('T')[0]
    }))
  }, { status: 201 })
})
