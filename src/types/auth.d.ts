import { DefaultSession, DefaultJWT } from "next-auth"
import { JWT } from "next-auth/jwt"
import { Role } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: Role
    } & DefaultSession["user"]
  }

  interface Profile {
    email?: string
    name?: string
    picture?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    role: Role
  }
}

export interface GoogleProfile {
  email?: string
  name?: string
  picture?: string
  sub?: string
}

export interface AuthAccount {
  provider: string
  type: string
  providerAccountId: string
  access_token?: string
  expires_at?: number
  refresh_token?: string
  scope?: string
  token_type?: string
  id_token?: string
}

export interface AuthJWTParams {
  token: JWT
  account?: AuthAccount | null
  profile?: GoogleProfile | null
  user?: {
    id?: string
    email?: string
    name?: string
    image?: string
  } | null
  trigger?: "signIn" | "signUp" | "update"
  isNewUser?: boolean
  session?: DefaultSession | null
}

export interface AuthSessionParams {
  session: DefaultSession
  token: JWT
  user?: {
    id?: string
    email?: string
    name?: string
    image?: string
  } | null
}
