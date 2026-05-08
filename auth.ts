import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
        role: { label: "Rol", type: "text" },
      },

      async authorize(credentials) {
        const testUsers = [
          { id: "1", email: "rector@cice.edu.co", password: "cice2025", role: "rector", name: "Rector Demo" },
          { id: "2", email: "analista@cice.edu.co", password: "cice2025", role: "analista", name: "Analista Demo" },
          { id: "3", email: "admin@cice.edu.co", password: "cice2025", role: "superadmin", name: "Admin CICE" },
          { id: "4", email: "comite@cice.edu.co", password: "cice2025", role: "comite", name: "Comité Ético" },
          { id: "5", email: "secretaria@cice.edu.co", password: "cice2025", role: "secretaria", name: "Secretaría Edu" },
        ]

        const user = testUsers.find(
          (u) =>
            u.email === credentials?.email &&
            u.password === credentials?.password
        )

        if (!user) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role
      return token
    },

    async session({ session, token }) {
      if (session.user) session.user.role = token.role as string
      return session
    },
  },

  pages: {
    signIn: "/portal/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.AUTH_SECRET,
})