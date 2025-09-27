import { NextRequest } from "next/server"
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
    increaseTypeId: searchParams.get('increaseTypeId') || undefined
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

  const where: any = {
    accountId: queryData.accountId,
    date: {
      gte: convertDateToUTC(queryData.from),
      lte: convertDateToUTC(queryData.to)
    }
  }

  if (queryData.increaseTypeId) {
    where.increaseTypeId = queryData.increaseTypeId
  }

  const entries = await db.ledgerEntry.findMany({
    where,
    include: {
      increaseType: true
    },
    orderBy: {
      date: 'asc'
    }
  })

  const serializedEntries = entries.map(entry => ({
    ...entry,
    id: entry.id.toString(),
    accountId: entry.accountId.toString(),
    increaseTypeId: entry.increaseTypeId.toString(),
    date: entry.date.toISOString().split('T')[0],
    increaseType: {
      ...entry.increaseType,
      id: entry.increaseType.id.toString(),
      ownerUserId: entry.increaseType.ownerUserId.toString()
    }
  }))

  return Response.json(serializedEntries)
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

  // Check if user owns the increase type
  const increaseType = await db.increaseType.findUnique({
    where: { id: validatedData.increaseTypeId }
  })

  if (!increaseType) {
    return createErrorResponse('not-found', 'Increase type not found', 404)
  }

  if (increaseType.ownerUserId.toString() !== session.user.id) {
    return createErrorResponse('forbidden', 'Increase type not owned by user', 403)
  }

  const date = convertDateToUTC(validatedData.date)

  const entry = await db.ledgerEntry.create({
    data: {
      accountId: validatedData.accountId,
      date,
      increaseTypeId: validatedData.increaseTypeId,
      amountMinor: validatedData.amountMinor,
      note: validatedData.note
    },
    include: {
      increaseType: true
    }
  })

  // Update daily summary
  await updateDailyAccountSummary(validatedData.accountId, date)

  const serializedEntry = {
    ...entry,
    id: entry.id.toString(),
    accountId: entry.accountId.toString(),
    increaseTypeId: entry.increaseTypeId.toString(),
    date: entry.date.toISOString().split('T')[0],
    increaseType: {
      ...entry.increaseType,
      id: entry.increaseType.id.toString(),
      ownerUserId: entry.increaseType.ownerUserId.toString()
    }
  }

  return Response.json(serializedEntry, { status: 201 })
})
