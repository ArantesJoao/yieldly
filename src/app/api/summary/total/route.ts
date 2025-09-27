import { NextRequest } from "next/server"
import { withAuth } from "@/lib/api"
import { authorize } from "@/lib/authorization"
import { summaryQuerySchema } from "@/lib/validations"
import { getTotalSummary } from "@/lib/summary"

export const GET = withAuth(async (request, session) => {
  const { searchParams } = new URL(request.url)
  
  const queryData = summaryQuerySchema.parse({
    from: searchParams.get('from'),
    to: searchParams.get('to')
  })

  await authorize("summary:read", {
    userId: session.user.id,
    role: session.user.role
  })

  const summary = await getTotalSummary(
    BigInt(session.user.id),
    queryData.from,
    queryData.to
  )

  return Response.json(summary)
})
