import NextAuth, { DefaultSession, User as NAUser } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  //   interface Session {
  //     user: {
  //       /** The user's postal address. */
  //       address: string
  //     } & DefaultSession["user"]
  //   }

  interface User extends NAUser {
    profile?: {
      address: string
      screen_name: string
      authority: string
      metadata_uri: string
      metadata: any
      slot_created_at: number
      slot_updated_at: number
    } | null
  }
}
