import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { withAuth, parseJsonBody, createErrorResponse } from "@/lib/api"
import { authorize } from "@/lib/authorization"
import { createLedgerEntrySchema, ledgerQuerySchema, convertDateToUTC } from "@/lib/validations"
import { updateDailyAccountSummary } from "@/lib/summary"

export const GET = withAuth(async (request, session) => {
  const { searchParams } = new URL(request.url)

  const queryData = ledgerQuerySchema.parse({
    accountId: searchParams.get('accountId'),
    from: searchParams.get('from'),
    to: searchParams.get('to'),
    transactionTypeId: searchParams.get('transactionTypeId') || undefined
  })

  // Check if user owns the account
  const account = await db.account.findUnique({
    where: { id: queryData.accountId }
  })

  if (!account) {
    return createErrorResponse('not-found', 'Account not found', 404)
  }

  await authorize("ledger:read", {
    userId: session.user.id,
    role: session.user.role,
    resourceOwnerId: account.ownerUserId.toString()
  })

  interface LedgerWhereClause {
    accountId: bigint
    date: {
      gte: Date
      lte: Date
    }
    transactionTypeId?: bigint
  }

  const where: LedgerWhereClause = {
    accountId: queryData.accountId,
    date: {
      gte: convertDateToUTC(queryData.from),
      lte: convertDateToUTC(queryData.to)
    }
  }

  if (queryData.transactionTypeId) {
    where.transactionTypeId = queryData.transactionTypeId
  }

  const entries = await db.ledgerEntry.findMany({
    where,
    include: {
      transactionType: true
    },
    orderBy: {
      date: 'asc'
    }
  })

  const serializedEntries = entries.map(entry => ({
    ...entry,
    id: entry.id.toString(),
    accountId: entry.accountId.toString(),
    transactionTypeId: entry.transactionTypeId.toString(),
    date: entry.date.toISOString().split('T')[0],
    transactionType: {
      ...entry.transactionType,
      id: entry.transactionType.id.toString(),
      ownerUserId: entry.transactionType.ownerUserId.toString()
    }
  }))

  return NextResponse.json(serializedEntries)
})

export const POST = withAuth(async (request, session) => {
  await authorize("ledger:create", {
    userId: session.user.id,
    role: session.user.role
  })

  const body = await parseJsonBody(request)
  const validatedData = createLedgerEntrySchema.parse(body)

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

  const date = convertDateToUTC(validatedData.date)

  const entry = await db.ledgerEntry.create({
    data: {
      accountId: validatedData.accountId,
      date,
      transactionTypeId: validatedData.transactionTypeId,
      amountMinor: validatedData.amountMinor,
      note: validatedData.note
    },
    include: {
      transactionType: true
    }
  })

  // Update daily summary
  await updateDailyAccountSummary(validatedData.accountId, date)

  const serializedEntry = {
    ...entry,
    id: entry.id.toString(),
    accountId: entry.accountId.toString(),
    transactionTypeId: entry.transactionTypeId.toString(),
    date: entry.date.toISOString().split('T')[0],
    transactionType: {
      ...entry.transactionType,
      id: entry.transactionType.id.toString(),
      ownerUserId: entry.transactionType.ownerUserId.toString()
    }
  }

  return NextResponse.json(serializedEntry, { status: 201 })
})
