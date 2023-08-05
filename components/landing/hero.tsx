"use client"

import bs58 from "bs58"
import Image from "next/image"
import { Typography } from "../ui/typography"
import { AspectRatio } from "../ui/aspect-ratio"
import { Button } from "../ui/button"
import { ArrowRightIcon } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { getCsrfToken, signIn, useSession } from "next-auth/react"
import { SigninMessage } from "@/lib/signin-message"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import supabase from "@/lib/supabase"

export default function Hero() {
  const wallet = useWallet()
  const walletModal = useWalletModal()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [openConnectWallet, setOpenConnectWallet] = useState(false)

  const login = async () => {
    try {
      if (session) {
        router.push(`/u/${session.user.domain_name}`)
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

      const message = new SigninMessage({
        domain: window.location.host,
        publicKey: wallet.publicKey?.toBase58(),
        statement: `Sign this message to sign in to the app.`,
        nonce: csrf,
      })

      const data = new TextEncoder().encode(message.prepare())
      const signature = await wallet.signMessage(data)
      const serializedSignature = bs58.encode(signature)

      const res = await signIn("credentials", {
        message: JSON.stringify(message),
        signature: serializedSignature,
        redirect: false,
      })
      if (res?.ok) {
        const user = await supabase.findUserByWallet(wallet.publicKey.toBase58())
        router.replace(`/u/${user.domain_name}`)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (openConnectWallet && wallet.connected) {
      login()
    }
  }, [openConnectWallet, wallet])

  return (
    <div className="bg-image-blur relative">
      <div className="mx-auto flex min-h-screen max-w-screen-xl items-center px-4 py-28 md:px-6 lg:px-10">
        <div className="-mx-10 flex w-full flex-wrap items-center">
          <div className="w-1/2 px-10">
            <Typography
              as="h1"
              className="mb-10 text-xl font-extrabold !leading-snug tracking-widest md:text-5xl lg:text-6xl xl:text-[64px]"
            >
              Say <span className="text-primary-500 underline">gm</span> to <br /> Your Fans <br /> On{" "}
              <span className="text-purple-700">Solana</span>
            </Typography>
            <Button onClick={login} size="lg" endDecorator={<ArrowRightIcon />}>
              Start Now
            </Button>
          </div>
          <div className="relative w-1/2 px-10">
            <AspectRatio>
              <Image src="/assets/hero.png" fill alt="hero" />
            </AspectRatio>
          </div>
        </div>
      </div>
    </div>
  )
}
