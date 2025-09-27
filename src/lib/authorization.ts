import { Role } from "@prisma/client"
import { db } from "./db"

type AuthAction =
  | "account:create"
  | "account:read"
  | "account:update"
  | "account:delete"
  | "ledger:create"
  | "ledger:read"
  | "ledger:update"
  | "ledger:delete"
  | "increase-type:create"
  | "increase-type:read"
  | "increase-type:update"
  | "increase-type:delete"
  | "summary:read"

type AuthContext = {
  userId: string
  role: Role
  resourceOwnerId?: string
  usage?: {
    accountsCount?: number
    ledgerCount?: number
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AuthorizationError"
  }
}

export async function authorize(action: AuthAction, context: AuthContext): Promise<void> {
  const { userId, role, resourceOwnerId } = context

  // Admin can do everything
  if (role === Role.admin) {
    return
  }

  // Viewer (logged-out) can't do anything
  if (role === Role.viewer) {
    throw new AuthorizationError("Authentication required")
  }

  // Member role logic
  if (role === Role.member) {
    // Check ownership for resource-specific actions
    if (resourceOwnerId && resourceOwnerId !== userId) {
      throw new AuthorizationError("Access denied: resource not owned by user")
    }

    // Check creation limits for members
    if (action === "account:create") {
      const accountsCount = await db.account.count({
        where: { ownerUserId: BigInt(userId) }
      })

      if (accountsCount >= 1) {
        throw new AuthorizationError("Demo limit: Members can only create 1 account")
      }
    }

    if (action === "ledger:create") {
      const ledgerCount = await db.ledgerEntry.count({
        where: {
          account: {
            ownerUserId: BigInt(userId)
          }
        }
      })

      if (ledgerCount >= 1) {
        throw new AuthorizationError("Demo limit: Members can only create 1 ledger entry")
      }
    }

    // Allow other actions for members (read/update/delete on owned resources)
    return
  }

  // Default deny
  throw new AuthorizationError("Access denied")
}

export async function getUsageStats(userId: string) {
  const [accountsCount, ledgerCount] = await Promise.all([
    db.account.count({
      where: { ownerUserId: BigInt(userId) }
    }),
    db.ledgerEntry.count({
      where: {
        account: {
          ownerUserId: BigInt(userId)
        }
      }
    })
  ])

  return { accountsCount, ledgerCount }
}
