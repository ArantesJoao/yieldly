import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { withAuth, parseJsonBody, createErrorResponse } from "@/lib/api"
import { authorize } from "@/lib/authorization"
import { createAccountSchema, convertDateToUTC } from "@/lib/validations"
import { updateDailyAccountSummary } from "@/lib/summary"

export const GET = withAuth(async (request, session) => {
  await authorize("account:read", {
    userId: session.user.id,
    role: session.user.role
  })

  const accounts = await db.account.findMany({
    where: {
      ownerUserId: BigInt(session.user.id)
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  // Get the most recent balance for each account
  const accountsWithBalance = await Promise.all(
    accounts.map(async (account) => {
      const latestSummary = await db.dailyAccountSummary.findFirst({
        where: {
          accountId: account.id
        },
        orderBy: {
          date: 'desc'
        },
        select: {
          balanceEndMinor: true
        }
      })

      return {
        ...account,
        currentBalanceMinor: latestSummary?.balanceEndMinor || 0
      }
    })
  )

  // Convert BigInt IDs to strings for JSON serialization
  const serializedAccounts = accountsWithBalance.map(account => ({
    ...account,
    id: account.id.toString(),
    ownerUserId: account.ownerUserId.toString()
  }))

  return NextResponse.json(serializedAccounts)
})

export const POST = withAuth(async (request, session) => {
  await authorize("account:create", {
    userId: session.user.id,
    role: session.user.role
  })

  const body = await parseJsonBody(request)
  const validatedData = createAccountSchema.parse(body)

  const account = await db.account.create({
    data: {
      ownerUserId: BigInt(session.user.id),
      institution: validatedData.institution,
      label: validatedData.label
    }
  })

  let currentBalanceMinor = 0

  // Handle initial balance if provided
  if (validatedData.initialBalanceMinor && validatedData.initialBalanceMinor > 0) {
    const startDate = validatedData.startDate
      ? convertDateToUTC(validatedData.startDate)
      : new Date()

    // Find the "Deposit" transaction type for this user
    const depositType = await db.transactionType.findFirst({
      where: {
        ownerUserId: BigInt(session.user.id),
        name: "Deposit"
      }
    })

    if (!depositType) {
      return createErrorResponse('missing-transaction-type', 'Deposit transaction type not found', 400)
    }

    // Create initial balance entry
    await db.ledgerEntry.create({
      data: {
        accountId: account.id,
        date: startDate,
        transactionTypeId: depositType.id,
        amountMinor: validatedData.initialBalanceMinor,
        note: "Initial balance"
      }
    })

    // Update daily summary
    await updateDailyAccountSummary(account.id, startDate)

    currentBalanceMinor = validatedData.initialBalanceMinor
  }

  const serializedAccount = {
    ...account,
    id: account.id.toString(),
    ownerUserId: account.ownerUserId.toString(),
    currentBalanceMinor
  }

  return NextResponse.json(serializedAccount, { status: 201 })
})
