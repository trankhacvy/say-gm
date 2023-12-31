"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import bs58 from "bs58"
import { ArrowRightIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { getCsrfToken, signIn, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { SigninMessage } from "@/lib/signin-message"
import { AspectRatio } from "../ui/aspect-ratio"
import { Button } from "../ui/button"
import { Typography } from "../ui/typography"
import { Routes } from "@/config/routes"

export default function Hero() {
  const wallet = useWallet()
  const walletModal = useWalletModal()
  const { data: session } = useSession()
  const router = useRouter()
  const [openConnectWallet, setOpenConnectWallet] = useState(false)
  const [loading, setLoading] = useState(false)

  const login = async () => {
    try {
      if (session) {
        router.push(Routes.DASHBOARD)
        return
      }
      if (!wallet.connected) {
        walletModal.setVisible(true)
        setOpenConnectWallet(true)
        return
      }
      setOpenConnectWallet(false)
      const csrf = await getCsrfToken()
      if (!wallet.publicKey || !csrf || !wallet.signMessage) return
      setLoading(true)
      const message = new SigninMessage({
        domain: window.location.host,
        publicKey: wallet.publicKey?.toBase58(),
        statement: `Sign this message to sign in to the app.`,
        nonce: csrf,
      })

      const data = new TextEncoder().encode(message.prepare())
      const signature = await wallet.signMessage(data)
      const serializedSignature = bs58.encode(signature)

      await signIn("credentials", {
        message: JSON.stringify(message),
        signature: serializedSignature,
        callbackUrl: Routes.DASHBOARD,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (openConnectWallet && wallet.connected) {
      login()
    }
  }, [openConnectWallet, wallet])

  return (
    <div className="bg-image-blur relative">
      <div className="mx-auto flex min-h-screen max-w-screen-xl items-center px-4 py-20 md:px-6 lg:px-10 lg:py-28">
        <div className="flex w-full flex-wrap items-center gap-10">
          <div className="w-full text-center lg:flex-1 lg:text-left">
            <Typography
              as="h1"
              className="mb-10 text-[2.5rem] font-extrabold !leading-snug tracking-widest md:text-5xl lg:text-6xl xl:text-[64px]"
            >
              Say <span className="text-primary-500 underline">gm</span> to <br /> Your Fans <br /> On{" "}
              <span className="text-purple-700">Solana</span>
            </Typography>
            <Button loading={loading} onClick={login} size="lg" endDecorator={<ArrowRightIcon />}>
              Become a creator
            </Button>
          </div>
          <div className="relative w-full lg:flex-1">
            <AspectRatio>
              <Image src="/assets/hero.png" fill alt="hero" />
            </AspectRatio>
          </div>
        </div>
      </div>
    </div>
  )
}
