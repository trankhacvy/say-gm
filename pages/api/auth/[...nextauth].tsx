import NextAuth, { type NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { SigninMessage } from "@/lib/signin-message"
import GumService from "@/lib/gum"
import { PublicKey } from "@solana/web3.js"

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

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

          return {
            id: signinMessage.publicKey,
          }
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
        domain: VERCEL_DEPLOYMENT ? ".solar.xyz" : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  pages: {
    error: "/login",
  },
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      console.log("[signIn] user", user)
      console.log("[signIn] account", account)
      console.log("[signIn] profile", profile)

      if(!user.id) return false;

      try {
        const profiles = await GumService.sdk.profile.getProfilesByAuthority(new PublicKey(user.id))
        console.log("check", profiles)
      } catch (error) {
        console.error("check error", error)
      }



      return true
    },
    jwt: async ({ token, user, trigger }) => {
      console.log("[jwt] token", token)
      console.log("[jwt] user", user)

      // if (!token.email || (await isBlacklistedEmail(token.email))) {
      //   return {};
      // }
      // if (user) {
      //   token.user = user;
      // }
      // if (trigger === "update") {
      //   const refreshedUser = await prisma.user.findUnique({
      //     where: { id: token.sub },
      //   });
      //   token.user = refreshedUser;
      //   token.name = refreshedUser?.name;
      //   token.email = refreshedUser?.email;
      //   token.image = refreshedUser?.image;
      // }

      return token
    },
    session: async ({ session, token }) => {
      console.log("[session] session", session)
      console.log("[session] token", token)
      session.user = {
        // @ts-ignore
        // id: token.sub,
        ...session.user,
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
