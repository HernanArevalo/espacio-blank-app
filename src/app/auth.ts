import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import prisma from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: { 
        params: {
          prompt: "select_account"
        }
      },

    })],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const email = user.email!
          let dbUser = await prisma.user.findUnique({ where: { email } })

          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                email,
                name: user.name || "user",
                image: user.image,
                role: "user",
              },
            })
          } else {
            await prisma.user.update({
              where: { email },
              data: {
                email,
                name: user.name || "user",
                image: user.image,
              },

            })
          }

          user.id = dbUser.id as unknown as string
          user.role = dbUser.role

          return true
        } catch (error) {
          console.error("Error en signIn:", error)
          return false
        }
      }
      return true
    },


    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as unknown as number
        token.role = user.role
      }
      else if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { role: true, image: true, name: true }
        })

        if (dbUser) {
          token.role = dbUser.role
          token.picture = dbUser.image
          token.name = dbUser.name
        }
      }

      if (trigger === "update" && session) {
        token = { ...token, ...session }
      }

      return token
    },

    // 3. SESSION (Igual que antes)
    async session({ session, token }) {
      if (session && session.user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id as any,
            role: token.role,
            image: token.picture,
            name: token.name
          },
        }
      }
      return session
    },
  },
})