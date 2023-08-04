"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from "./ui/button"
import ConnectWalletButton from "./connect-wallet-button"
import GumService from "@/lib/gum"

export function DemoPage() {
  const { publicKey } = useWallet()

  const handleSignIn = async () => {
    try {
      if (!publicKey) return

      //   const domain = await GumService.findDomain("khacvy")
      const domains = await GumService.sdk.nameservice.getNameservicesByAuthority(publicKey.toBase58())
      const domain = domains[0]
      console.log(domain)

      const profile = await GumService.getProfile(domain.address, publicKey.toBase58())
      console.log({ profile })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col py-20">
      <ConnectWalletButton />
      <Button onClick={handleSignIn}>Go</Button>
    </div>
  )
}
