import { db } from "./db"
import { convertDateToUTC } from "./validations"

export async function updateDailyAccountSummary(accountId: bigint, date: Date) {
  // Get all ledger entries for this account on this date
  const dayEntries = await db.ledgerEntry.findMany({
    where: {
      accountId,
      date
    },
    include: {
      transactionType: true
    }
  })

  // Calculate totals for the day
  const dayTotal = dayEntries.reduce((sum, entry) => sum + entry.amountMinor, 0)
  const yieldsMinor = dayEntries
    .filter(entry => entry.transactionType.name === "Yields")
    .reduce((sum, entry) => sum + entry.amountMinor, 0)
  const depositsMinor = dayEntries
    .filter(entry => entry.transactionType.name === "Deposit")
    .reduce((sum, entry) => sum + entry.amountMinor, 0)

  // Get previous day's balance
  const previousDay = new Date(date)
  previousDay.setUTCDate(previousDay.getUTCDate() - 1)

  const previousSummary = await db.dailyAccountSummary.findUnique({
    where: {
      accountId_date: {
        accountId,
        date: previousDay
      }
    }
  })

  const previousBalance = previousSummary?.balanceEndMinor || 0
  const balanceEndMinor = previousBalance + dayTotal

  // Upsert the summary for this day
  await db.dailyAccountSummary.upsert({
    where: {
      accountId_date: {
        accountId,
        date
      }
    },
    update: {
      balanceEndMinor,
      yieldsMinor,
      depositsMinor
    },
    create: {
      accountId,
      date,
      balanceEndMinor,
      yieldsMinor,
      depositsMinor
    }
  })

  // Update future summaries if they exist (balance rollover)
  await rollForwardBalances(accountId, date)
}

async function rollForwardBalances(accountId: bigint, fromDate: Date) {
  // Get all future summaries that need balance updates
  const futureSummaries = await db.dailyAccountSummary.findMany({
    where: {
      accountId,
      date: {
        gt: fromDate
      }
    },
    orderBy: {
      date: 'asc'
    }
  })

  let currentBalance = await getCurrentBalance(accountId, fromDate)

  // Update each future summary with correct balance
  for (const summary of futureSummaries) {
    const dayTotal = summary.yieldsMinor + summary.depositsMinor
    currentBalance += dayTotal

    await db.dailyAccountSummary.update({
      where: {
        id: summary.id
      },
      data: {
        balanceEndMinor: currentBalance
      }
    })
  }
}

async function getCurrentBalance(accountId: bigint, date: Date): Promise<number> {
  const summary = await db.dailyAccountSummary.findUnique({
    where: {
      accountId_date: {
        accountId,
        date
      }
    }
  })

  return summary?.balanceEndMinor || 0
}

export async function getAccountSummary(
  accountId: bigint,
  fromDate?: string,
  toDate?: string
) {
  const summaries = await db.dailyAccountSummary.findMany({
    where: {
      accountId,
      ...(fromDate || toDate ? {
        date: {
          ...(fromDate ? { gte: convertDateToUTC(fromDate) } : {}),
          ...(toDate ? { lte: convertDateToUTC(toDate) } : {})
        }
      } : {})
    },
    orderBy: {
      date: 'asc'
    }
  })

  return summaries.map(summary => ({
    date: summary.date.toISOString().split('T')[0],
    balanceEndMinor: summary.balanceEndMinor,
    yieldsMinor: summary.yieldsMinor,
    depositsMinor: summary.depositsMinor
  }))
}

export async function getTotalSummary(
  userId: bigint,
  fromDate?: string,
  toDate?: string
) {
  const summaries = await db.dailyAccountSummary.findMany({
    where: {
      account: {
        ownerUserId: userId
      },
      ...(fromDate || toDate ? {
        date: {
          ...(fromDate ? { gte: convertDateToUTC(fromDate) } : {}),
          ...(toDate ? { lte: convertDateToUTC(toDate) } : {})
        }
      } : {})
    },
    orderBy: {
      date: 'asc'
    }
  })

  interface DailySummary {
    date: string
    balanceEndMinor: number
    yieldsMinor: number
    depositsMinor: number
  }

  // Group by date and sum across accounts
  const dateGroups = summaries.reduce((acc, summary) => {
    const dateKey = summary.date.toISOString().split('T')[0]

    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dateKey,
        balanceEndMinor: 0,
        yieldsMinor: 0,
        depositsMinor: 0
      }
    }

    acc[dateKey].balanceEndMinor += summary.balanceEndMinor
    acc[dateKey].yieldsMinor += summary.yieldsMinor
    acc[dateKey].depositsMinor += summary.depositsMinor

    return acc
  }, {} as Record<string, DailySummary>)

  return Object.values(dateGroups).sort((a: DailySummary, b: DailySummary) => a.date.localeCompare(b.date))
}
