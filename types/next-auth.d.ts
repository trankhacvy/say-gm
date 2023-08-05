import NextAuth, { DefaultSession, User as NAUser } from "next-auth"
import { JWT as BaseJWT } from "next-auth/jwt"
import { Database } from "@/types/supabase.types"

declare module "next-auth" {
  interface Session {
    user: {
      id: number
    } & DefaultSession["user"] &
      Database["public"]["Tables"]["tbl_users"]["Row"]
  }

  interface User extends Database["public"]["Tables"]["tbl_users"]["Row"] {
    id: number
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends BaseJWT {
    user?: Database["public"]["Tables"]["tbl_users"]["Row"]
  }
}
