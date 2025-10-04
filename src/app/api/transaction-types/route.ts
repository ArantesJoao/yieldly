import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { withAuth, parseJsonBody } from "@/lib/api"
import { authorize } from "@/lib/authorization"
import { createTransactionTypeSchema } from "@/lib/validations"

export const GET = withAuth(async (request, session) => {
  await authorize("transaction-type:read", {
    userId: session.user.id,
    role: session.user.role
  })

  const transactionTypes = await db.transactionType.findMany({
    where: {
      ownerUserId: BigInt(session.user.id)
    },
    orderBy: {
      name: 'asc'
    }
  })

  const serializedTypes = transactionTypes.map(type => ({
    ...type,
    id: type.id.toString(),
    ownerUserId: type.ownerUserId.toString()
  }))

  return NextResponse.json(serializedTypes)
})

export const POST = withAuth(async (request, session) => {
  await authorize("transaction-type:create", {
    userId: session.user.id,
    role: session.user.role
  })

  const body = await parseJsonBody(request)
  const validatedData = createTransactionTypeSchema.parse(body)

  const transactionType = await db.transactionType.create({
    data: {
      ownerUserId: BigInt(session.user.id),
      name: validatedData.name,
      direction: validatedData.direction
    }
  })

  const serializedType = {
    ...transactionType,
    id: transactionType.id.toString(),
    ownerUserId: transactionType.ownerUserId.toString()
  }

  return NextResponse.json(serializedType, { status: 201 })
})

