import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ZodError } from "zod"

export type ApiError = {
  error: string
  message: string
}

export function createErrorResponse(error: string, message: string, status: number = 400): NextResponse<ApiError> {
  return NextResponse.json({ error, message }, { status })
}

export function handleValidationError(error: ZodError): NextResponse<ApiError> {
  const message = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
  return createErrorResponse('validation-error', message, 422)
}

export async function withAuth<T>(
  handler: (request: NextRequest, session: any) => Promise<NextResponse<T>>
) {
  return async (request: NextRequest) => {
    try {
      const session = await getServerSession(authOptions)

      if (!session || !session.user) {
        return createErrorResponse('unauthenticated', 'Authentication required', 401)
      }

      return await handler(request, session)
    } catch (error) {
      console.error('API Error:', error)

      if (error instanceof ZodError) {
        return handleValidationError(error)
      }

      if (error instanceof Error) {
        if (error.name === 'AuthorizationError') {
          return createErrorResponse('forbidden', error.message, 403)
        }
      }

      return createErrorResponse('internal-error', 'Internal server error', 500)
    }
  }
}

export async function parseJsonBody<T>(request: NextRequest): Promise<T> {
  try {
    return await request.json()
  } catch {
    throw new Error('Invalid JSON body')
  }
}
