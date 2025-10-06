import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { db } from "@/lib/db"
import { Role } from "@prisma/client"
import type { JWT } from "next-auth/jwt"
import type { DefaultSession } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }: { token: JWT; account?: { provider: string } | null; profile?: { email?: string } | null }) {
      if (account && profile && profile.email) {
        // Find or create user in database
        let user = await db.user.findUnique({
          where: { email: profile.email }
        })

        if (!user) {
          // Determine role based on admin email
          const isAdmin = profile.email === process.env.ADMIN_EMAIL

          user = await db.user.create({
            data: {
              email: profile.email,
              role: isAdmin ? Role.admin : Role.member,
            }
          })

          // Seed default transaction types for new users
          await db.transactionType.createMany({
            data: [
              {
                ownerUserId: user.id,
                name: "Deposit",
                direction: "inflow"
              },
              {
                ownerUserId: user.id,
                name: "Yields",
                direction: "inflow"
              }
            ]
          })
        }

        token.id = user.id.toString()
        token.role = user.role
      }

      return token
    },
    async session({ session, token }: { session: DefaultSession; token: JWT }) {
      if (token.id && token.role && session.user) {
        (session.user as { id?: string; role?: Role }).id = token.id;
        (session.user as { id?: string; role?: Role }).role = token.role
      }
      return session
    }
  },
  session: {
    strategy: "jwt" as const
  }
}

