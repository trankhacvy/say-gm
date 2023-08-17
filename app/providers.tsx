"use client"

import { GumProvider, SessionWalletProvider, UploaderProvider, useSessionKeyManager } from "@gumhq/react-sdk"
import {
  AnchorWallet,
  ConnectionProvider,
  useAnchorWallet,
  useConnection,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { Analytics } from "@vercel/analytics/react"
import { SessionProvider, signOut, useSession } from "next-auth/react"
import { ReactNode, useEffect, useMemo } from "react"
import { useGumSDK } from "@/hooks/use-gum-sdk"
import { SOLANA_CLUSTER, SOLANA_PRC } from "@/utils/env"

const UploadProviderWraper = ({ children }: { children: ReactNode }) => {
  const cluster = SOLANA_CLUSTER as "devnet" | "mainnet-beta"
  const { connection } = useConnection()
  const anchorWallet = useAnchorWallet() as AnchorWallet
  const sdk = useGumSDK()

  const sessionWallet = useSessionKeyManager(anchorWallet, connection, cluster)
  return (
    <GumProvider sdk={sdk}>
      <SessionWalletProvider sessionWallet={sessionWallet}>
        <UploaderProvider
          uploaderType="arweave"
          connection={connection}
          cluster={SOLANA_CLUSTER as "devnet" | "mainnet-beta"}
        >
          <SessionProvider>
            {children}
            <Analytics />
          </SessionProvider>
        </UploaderProvider>
      </SessionWalletProvider>
    </GumProvider>
  )
}

const Wrapper = ({ children }: { children: ReactNode }) => {
  const { publicKey } = useWallet()
  const { data, status } = useSession()

  useEffect(() => {
    if (process.env.NODE_ENV === "development") return

    if (status === "authenticated") {
      if (!publicKey) {
        signOut()
        return
      } else if (publicKey.toBase58() !== data.user.wallet) {
        signOut()
      }
    }
  }, [publicKey, status, data])

  return <>{children}</>
}

export default function Providers({ children }: { children: ReactNode }) {
  const network = SOLANA_CLUSTER

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      // @ts-ignore
      new SolflareWalletAdapter({ network }),
    ],
    [network]
  )

  return (
    <ConnectionProvider endpoint={SOLANA_PRC}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <UploadProviderWraper>
            <SessionProvider>
              <Wrapper>{children}</Wrapper>
              <Analytics />
            </SessionProvider>
          </UploadProviderWraper>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
