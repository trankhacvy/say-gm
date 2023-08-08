import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { SigninMessage } from "@/lib/signin-message"
import Supabase from "@/lib/supabase"
import { Database } from "@/types/supabase.types"

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Solana",
      credentials: {
        message: {
          label: "Message",
          type: "text",
        },
        signature: {
          label: "Signature",
          type: "text",
        },
      },
      async authorize(credentials) {
        try {
          const signinMessage = new SigninMessage(JSON.parse(credentials?.message || "{}") as any)
          // const nextAuthUrl = new URL(process.env.NEXTAUTH_URL);
          // if (signinMessage.domain !== nextAuthUrl.host) {
          //   return null;
          // }

          // if (signinMessage.nonce !== (await getCsrfToken({ req }))) {
          //   return null;
          // }

          const validationResult = await signinMessage.validate(credentials?.signature || "")

          if (!validationResult) throw new Error("Could not validate the signed message")

          const wallet = signinMessage.publicKey

          let user: Database["public"]["Tables"]["tbl_users"]["Row"] | null = null
          try {
            user = await Supabase.findUserByWallet(wallet)
          } catch (error) {
            console.error(error)
            user = await Supabase.createUser(wallet)
          }

          return user
        } catch (e) {
          return null
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
        domain: VERCEL_DEPLOYMENT ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    jwt: async ({ token, user, trigger }) => {
      // console.log("[jwt] token", token)
      // console.log("[jwt] user", user)

      if (user) {
        token.user = user as Database["public"]["Tables"]["tbl_users"]["Row"]
      }

      if (trigger === "update") {
        if (token.user?.wallet) {
          const updatedUser = await Supabase.findUserByWallet(token.user?.wallet)
          token.user = updatedUser
        }
      }

      return token
    },
    session: async ({ session, token }) => {
      // console.log("[session] session", session)
      // console.log("[session] token", token)
      session.user = {
        ...session.user,
        ...token.user,
      }

      return session
    },
  },
}

export default NextAuth(authOptions)
