import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { withAuth, createErrorResponse } from "@/lib/api"
import { authorize } from "@/lib/authorization"

export const DELETE = withAuth(async (request, session) => {
  const url = new URL(request.url)
  const transactionTypeId = url.pathname.split('/').pop()

  if (!transactionTypeId) {
    return createErrorResponse('invalid-id', 'Transaction type ID is required', 400)
  }

  // Check if transaction type exists and get owner
  const transactionType = await db.transactionType.findUnique({
    where: { id: BigInt(transactionTypeId) }
  })

  if (!transactionType) {
    return createErrorResponse('not-found', 'Transaction type not found', 404)
  }

  await authorize("transaction-type:delete", {
    userId: session.user.id,
    role: session.user.role,
    resourceOwnerId: transactionType.ownerUserId.toString()
  })

  // Prevent deletion of default transaction types
  const defaultTypes = ['Deposit', 'Yields']
  if (defaultTypes.includes(transactionType.name)) {
    return createErrorResponse('cannot-delete-default', `Cannot delete default transaction type: ${transactionType.name}`, 400)
  }

  // Delete transaction type
  await db.transactionType.delete({
    where: { id: BigInt(transactionTypeId) }
  })

  return NextResponse.json({ success: true })
})

