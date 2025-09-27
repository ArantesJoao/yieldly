import { z } from "zod"

// Date validation helpers
const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")

// Account schemas
export const createAccountSchema = z.object({
  institution: z.string().min(1, "Institution is required").max(100),
  label: z.string().min(1, "Label is required").max(100),
  initialBalanceMinor: z.number().int().optional(),
  startDate: dateStringSchema.optional()
})

// Increase Type schemas
export const createIncreaseTypeSchema = z.object({
  name: z.string().min(1, "Name is required").max(50)
})

// Ledger Entry schemas
export const createLedgerEntrySchema = z.object({
  accountId: z.string().transform(val => BigInt(val)),
  date: dateStringSchema,
  increaseTypeId: z.string().transform(val => BigInt(val)),
  amountMinor: z.number().int(),
  note: z.string().max(500).optional()
})

export const ledgerSpreadSchema = z.object({
  accountId: z.string().transform(val => BigInt(val)),
  increaseTypeId: z.string().transform(val => BigInt(val)),
  totalAmountMinor: z.number().int().min(0, "Amount must be non-negative"),
  startDate: dateStringSchema,
  endDate: dateStringSchema,
  roundingMode: z.enum(["lastDayGetsRemainder"]).default("lastDayGetsRemainder")
}).refine(data => data.startDate <= data.endDate, {
  message: "End date must be after or equal to start date",
  path: ["endDate"]
})

// Query schemas
export const ledgerQuerySchema = z.object({
  accountId: z.string().transform(val => BigInt(val)),
  from: dateStringSchema,
  to: dateStringSchema,
  increaseTypeId: z.string().transform(val => BigInt(val)).optional()
})

export const summaryQuerySchema = z.object({
  from: dateStringSchema,
  to: dateStringSchema
})

export const accountSummaryQuerySchema = summaryQuerySchema.extend({
  accountId: z.string().transform(val => BigInt(val))
})

// Utility functions
export function convertDateToUTC(dateString: string): Date {
  // Convert YYYY-MM-DD to UTC midnight
  return new Date(`${dateString}T00:00:00.000Z`)
}

export function formatDateToString(date: Date): string {
  return date.toISOString().split('T')[0]
}
