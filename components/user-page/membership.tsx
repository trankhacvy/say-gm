"use client"

import { Typography } from "../ui/typography"
import { Database } from "@/types/supabase.types"
import { useMembershipTiers } from "@/hooks/use-membership-tiers"
import { AspectRatio } from "../ui/aspect-ratio"
import Image from "next/image"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import ConnectWalletButton from "../connect-wallet-button"
import { useState } from "react"
import { useToast } from "../ui/toast"
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js"
import { nftStorage } from "@metaplex-foundation/js-plugin-nft-storage"
import { Keypair } from "@solana/web3.js"
import Pyth from "@/utils/pyth"
import { getTransferTransaction } from "@/lib/solana"
import { PublicKey } from "@solana/web3.js"
import supabase from "@/lib/supabase"

type MembershipProps = {
  user: Database["public"]["Tables"]["tbl_users"]["Row"]
}

export default function Membership({ user }: MembershipProps) {
  const { data: membershipTiers, isLoading } = useMembershipTiers(String(user.id))
  const { publicKey } = useWallet()

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-card">
      <Typography as="h2" level="body2" className="font-bold">
        Membership
      </Typography>
      {isLoading ? (
        <div className="mt-6 grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="w-full rounded-2xl bg-gray-200 p-4">
              <AspectRatio className="rounded-2xl">
                <Skeleton className="h-full w-full" />
              </AspectRatio>
              <div className="flex flex-col gap-3 py-3">
                <Skeleton className="h-4 w-2/3 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {membershipTiers?.length === 0 ? (
            <div className="pt-6">
              <Typography color="secondary" className="text-center font-semibold">
                No membership
              </Typography>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4">
              {membershipTiers?.map((item) => (
                <MembershipCard
                  key={item.id}
                  tier={item}
                  user={user}
                  hideAction={!!publicKey && publicKey.toBase58() === user.wallet}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

const MembershipCard = ({
  tier,
  user,
  hideAction,
}: {
  tier: Database["public"]["Tables"]["tbl_memberships_tiers"]["Row"]
  user: Database["public"]["Tables"]["tbl_users"]["Row"]
  hideAction?: boolean
}) => {
  const wallet = useWallet()
  const { publicKey, sendTransaction } = wallet
  const { connection } = useConnection()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleJoin = async () => {
    try {
      if (!publicKey || !tier || !user.wallet) return
      setLoading(true)

      const { solUsdPrice } = await Pyth.getSolUsdPrice()
      if (!solUsdPrice) throw new Error("Unknow error :(")

      const solAmount = (tier.price ?? 0) / solUsdPrice

      const metaplex = Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet))
        .use(
          nftStorage({
            token: process.env.NEXT_PUBLIC_NFT_STORAGE!,
          })
        )

      const { uri } = await metaplex.nfts().uploadMetadata({
        name: tier.name ?? "",
        symbol: tier?.name?.substring(0, 6)?.toUpperCase() ?? "",
        description: tier.description ?? "",
        image: tier.image ?? "",
      })

      if (!uri) throw new Error("Upload error")

      const mint = Keypair.generate()

      const mintTx = await metaplex
        .nfts()
        .builders()
        .create({
          useNewMint: mint,
          name: tier.name ?? "",
          symbol: tier?.name?.substring(0, 6)?.toUpperCase(),
          sellerFeeBasisPoints: 0,
          uri: uri,
        })

      const blockhash = await connection.getLatestBlockhash()
      const tx = mintTx.toTransaction(blockhash)

      const transferTx = getTransferTransaction(publicKey, new PublicKey(user.wallet), solAmount)
      tx.add(...transferTx.instructions)

      const signature = await sendTransaction(tx, connection, { signers: [mint] })
      await connection.confirmTransaction(signature, "processed")

      await supabase.createMembership(tier.id, publicKey.toBase58(), mint.publicKey.toBase58(), signature)

      toast({
        variant: "success",
        title: "Successfully join membership",
      })
    } catch (error: any) {
      console.error(error)
      toast({
        variant: "error",
        title: error?.message ?? "Server error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full rounded-2xl bg-gray-200 p-4">
      <AspectRatio>
        <Image className="rounded-xl" src={tier.image ?? ""} alt={tier.name ?? ""} fill />
      </AspectRatio>
      <div className="flex flex-col gap-3 py-5">
        <Typography className="font-bold">{tier.name}</Typography>
        <div className="flex">
          <Typography color="primary" className="font-bold">
            $
          </Typography>
          <Typography color="primary" level="h4" className="font-bold">
            {tier.price}
          </Typography>
        </div>
        <Typography level="body4" color="secondary">
          {tier.benefit}
        </Typography>
      </div>
      {!hideAction && (
        <>
          {publicKey ? (
            <Button loading={loading} onClick={handleJoin} fullWidth color="primary">
              Join
            </Button>
          ) : (
            <ConnectWalletButton />
          )}
        </>
      )}
    </div>
  )
}
