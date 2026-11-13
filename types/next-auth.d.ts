
import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    role?: string
    mfaVerified?: boolean
  }

  interface Session {
    mfaVerified: boolean
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: string
    mfaVerified?: boolean
  }
}
