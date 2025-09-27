import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { db } from "@/lib/db"
import { Role } from "@prisma/client"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }: any) {
      if (account && profile) {
        // Find or create user in database
        let user = await db.user.findUnique({
          where: { email: profile.email! }
        })

        if (!user) {
          // Determine role based on admin email
          const isAdmin = profile.email === process.env.ADMIN_EMAIL

          user = await db.user.create({
            data: {
              email: profile.email!,
              role: isAdmin ? Role.admin : Role.member,
            }
          })

          // Seed increase types for new users
          await db.increaseType.createMany({
            data: [
              {
                ownerUserId: user.id,
                name: "Contribution"
              },
              {
                ownerUserId: user.id,
                name: "Yields"
              }
            ]
          })
        }

        token.id = user.id.toString()
        token.role = user.role
      }

      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    }
  },
  session: {
    strategy: "jwt" as const
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
