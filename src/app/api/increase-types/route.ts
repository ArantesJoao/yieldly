import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { withAuth, parseJsonBody } from "@/lib/api"
import { authorize } from "@/lib/authorization"
import { createIncreaseTypeSchema } from "@/lib/validations"

export const GET = withAuth(async (request, session) => {
  await authorize("increase-type:read", {
    userId: session.user.id,
    role: session.user.role
  })

  const increaseTypes = await db.increaseType.findMany({
    where: {
      ownerUserId: BigInt(session.user.id)
    },
    orderBy: {
      name: 'asc'
    }
  })

  const serializedTypes = increaseTypes.map(type => ({
    ...type,
    id: type.id.toString(),
    ownerUserId: type.ownerUserId.toString()
  }))

  return NextResponse.json(serializedTypes)
})

export const POST = withAuth(async (request, session) => {
  await authorize("increase-type:create", {
    userId: session.user.id,
    role: session.user.role
  })

  const body = await parseJsonBody(request)
  const validatedData = createIncreaseTypeSchema.parse(body)

  const increaseType = await db.increaseType.create({
    data: {
      ownerUserId: BigInt(session.user.id),
      name: validatedData.name
    }
  })

  const serializedType = {
    ...increaseType,
    id: increaseType.id.toString(),
    ownerUserId: increaseType.ownerUserId.toString()
  }

  return NextResponse.json(serializedType, { status: 201 })
})
