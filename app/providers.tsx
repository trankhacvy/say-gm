"use client"

import { GumProvider, UploaderProvider } from "@gumhq/react-sdk"
import { ConnectionProvider, useConnection, useWallet, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
import { clusterApiUrl } from "@solana/web3.js"
import { Analytics } from "@vercel/analytics/react"
import { SessionProvider, signOut, useSession } from "next-auth/react"
import { ReactNode, useEffect, useMemo } from "react"
import { useGumSDK } from "@/hooks/use-gum-sdk"
import { IS_PROD, SOLANA_CLUSTER } from "@/utils/env"

const UploadProviderWraper = ({ children }: { children: ReactNode }) => {
  const { connection } = useConnection()
  const sdk = useGumSDK()

  return (
    <GumProvider sdk={sdk}>
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

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  const wallets = useMemo(
    () => [
      // new CoinbaseWalletAdapter(),
      new PhantomWalletAdapter(),
      // new GlowWalletAdapter(),
      // new SlopeWalletAdapter(),
      // new SolflareWalletAdapter({ network }),
      // new TorusWalletAdapter(),
    ],
    [network]
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <UploadProviderWraper>
            <SessionProvider>
              <Wrapper>{children}</Wrapper>
              {IS_PROD && <Analytics />}
            </SessionProvider>
          </UploadProviderWraper>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
