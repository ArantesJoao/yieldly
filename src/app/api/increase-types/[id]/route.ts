import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { withAuth, createErrorResponse } from "@/lib/api"
import { authorize } from "@/lib/authorization"

export const DELETE = withAuth(async (request, session) => {
  const url = new URL(request.url)
  const increaseTypeId = url.pathname.split('/').pop()

  if (!increaseTypeId) {
    return createErrorResponse('invalid-id', 'Increase type ID is required', 400)
  }

  // Check if increase type exists and get owner
  const increaseType = await db.increaseType.findUnique({
    where: { id: BigInt(increaseTypeId) }
  })

  if (!increaseType) {
    return createErrorResponse('not-found', 'Increase type not found', 404)
  }

  await authorize("increase-type:delete", {
    userId: session.user.id,
    role: session.user.role,
    resourceOwnerId: increaseType.ownerUserId.toString()
  })

  // Delete increase type
  await db.increaseType.delete({
    where: { id: BigInt(increaseTypeId) }
  })

  return NextResponse.json({ success: true })
})
