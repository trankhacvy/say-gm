"use client"

import { MenuIcon } from "lucide-react"
import bs58 from "bs58"
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { IconButton } from "@/components/ui/icon-button"
import { cn } from "@/utils/cn"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Separator } from "../ui/separator"
import { Typography } from "../ui/typography"
import { useWallet } from "@solana/wallet-adapter-react"
import ConnectWalletButton from "../connect-wallet-button"
import { Button } from "../ui/button"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useRouter } from "next/navigation"
import { SigninMessage } from "@/lib/signin-message"
import Link from "next/link"
import { Routes } from "@/config/routes"

export function UserPageHeader() {
  const [small, setSmall] = useState(false)

  useEffect(() => {
    function handler() {
      setSmall(window.pageYOffset > 60)
    }

    window.addEventListener("scroll", handler)

    return () => {
      window.removeEventListener("scroll", handler)
    }
  }, [])

  return (
    <header
      className={cn("fixed right-0 top-0 z-10 h-16 w-full transition-[height] duration-200 ease-in-out lg:h-20", {
        "bg-white/80 lg:h-[60px]": small,
      })}
    >
      <div className="relative mx-auto flex h-full min-h-[56px] w-full max-w-screen-xl items-center px-4 md:min-h-[64px] md:px-6 lg:px-10">
        <Link href="/" className="text-3xl font-bold text-primary-500 underline">
          gm
        </Link>

        <IconButton className="mr-2 lg:hidden" size="sm">
          <MenuIcon />
        </IconButton>
        <div className="flex grow items-center justify-end gap-4">
          <ConnectWalletButton />
          <AdminUserMenu />
        </div>
      </div>
    </header>
  )
}

const AdminUserMenu = () => {
  const { data: session, status } = useSession()
  const wallet = useWallet()
  const walletModal = useWalletModal()
  const router = useRouter()
  const [openConnectWallet, setOpenConnectWallet] = useState(false)
  const [loading, setLoading] = useState(false)

  const login = async () => {
    try {
      if (session) {
        router.push(`/dashboard`)
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
        callbackUrl: "/dashboard",
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

  if (status === "loading") return null

  if (status === "unauthenticated")
    return (
      <Button loading={loading} onClick={login}>
        Become Creator
      </Button>
    )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <Avatar>
            <AvatarImage
              className="bg-gray-500/24"
              // @ts-ignore
              src={session?.user.profile_metadata?.avatar}
              // @ts-ignore
              alt={session?.user?.profile_metadata?.name}
            />
            <AvatarFallback className="bg-primary-500 text-xl text-white">
              {/* @ts-ignore */}
              {session?.user?.profile_metadata?.name?.charAt(0)}A
            </AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-52 p-0">
        <div className="px-5 py-3">
          <Link href={Routes.DASHBOARD}>
            <Typography className="truncate font-semibold" as="h6" level="body4">
              Dashboard
            </Typography>
          </Link>
        </div>
        <Separator />
        <div className="p-2">
          <li
            onClick={() => {
              signOut()
            }}
            className="cursor-pointer list-none rounded-md px-2 py-1.5 hover:bg-gray-500/8"
          >
            <Typography as="span" level="body4">
              Logout
            </Typography>
          </li>
        </div>
      </PopoverContent>
    </Popover>
  )
}
