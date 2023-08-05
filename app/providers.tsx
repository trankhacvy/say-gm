"use client"

import { ReactNode, useEffect, useMemo } from "react"
import { Analytics } from "@vercel/analytics/react"
import { SessionProvider, signOut, useSession } from "next-auth/react"
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from "@solana/wallet-adapter-react"
import { clusterApiUrl } from "@solana/web3.js"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { GumProvider, UploaderProvider } from "@gumhq/react-sdk"
import { SOLANA_CLUSTER } from "@/utils/env"
import { useGumSDK } from "@/hooks/use-gum-sdk"

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
              <Analytics />
            </SessionProvider>
          </UploadProviderWraper>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
