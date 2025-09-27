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
      createdAt: 'desc'
    }
  })

  // Convert BigInt IDs to strings for JSON serialization
  const serializedAccounts = accounts.map(account => ({
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

  // Handle initial balance if provided
  if (validatedData.initialBalanceMinor && validatedData.initialBalanceMinor > 0) {
    const startDate = validatedData.startDate
      ? convertDateToUTC(validatedData.startDate)
      : new Date()

    // Find the "Contribution" increase type for this user
    const contributionType = await db.increaseType.findFirst({
      where: {
        ownerUserId: BigInt(session.user.id),
        name: "Contribution"
      }
    })

    if (!contributionType) {
      return createErrorResponse('missing-increase-type', 'Contribution increase type not found', 400)
    }

    // Create initial balance entry
    await db.ledgerEntry.create({
      data: {
        accountId: account.id,
        date: startDate,
        increaseTypeId: contributionType.id,
        amountMinor: validatedData.initialBalanceMinor,
        note: "Initial balance"
      }
    })

    // Update daily summary
    await updateDailyAccountSummary(account.id, startDate)
  }

  const serializedAccount = {
    ...account,
    id: account.id.toString(),
    ownerUserId: account.ownerUserId.toString()
  }

  return NextResponse.json(serializedAccount, { status: 201 })
})
