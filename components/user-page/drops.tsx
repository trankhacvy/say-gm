"use client"

import * as bs58 from "bs58"
import { Typography } from "../ui/typography"
import { Database } from "@/types/supabase.types"
import { AspectRatio } from "../ui/aspect-ratio"
import Image from "next/image"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import ConnectWalletButton from "../connect-wallet-button"
import { useState } from "react"
import { useToast } from "../ui/toast"
import supabase from "@/lib/supabase"
import { useCheckClaim, useDrops } from "@/hooks/use-drops"
import dayjs from "dayjs"
import shyft from "@/lib/shyft"
import { SOLANA_CLUSTER } from "@/utils/env"
import { Keypair, Transaction } from "@solana/web3.js"

type DropProps = {
  user: Database["public"]["Tables"]["tbl_users"]["Row"]
}

export default function Drops({ user }: DropProps) {
  const { data: drops, isLoading } = useDrops(String(user.id))

  return (
    <>
      {isLoading ? (
        <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
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
          {drops?.length === 0 ? (
            <div className="pt-6">
              <Typography color="secondary" className="text-center font-semibold">
                No drop
              </Typography>
            </div>
          ) : (
            <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {drops?.map((drop) => (
                <MembershipCard key={drop.id} drop={drop} user={user} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  )
}

const MembershipCard = ({
  drop,
  user,
}: {
  drop: Database["public"]["Tables"]["dev_tbl_drops"]["Row"]
  user: Database["public"]["Tables"]["tbl_users"]["Row"]
}) => {
  const wallet = useWallet()
  const { publicKey, sendTransaction } = wallet
  const { connection } = useConnection()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { data: claimResult, isLoading, mutate } = useCheckClaim(drop.id, publicKey?.toBase58())
  // @ts-ignore
  const isOwner = publicKey?.toBase58() === user.wallet

  const handleClaim = async () => {
    try {
      if (!publicKey) return
      setLoading(true)

      const uploadResult = await shyft.uploadMetadata({
        creator: publicKey.toBase58(),
        image: drop.image ?? "",
        name: drop.name ?? "",
        symbol: drop?.name?.substring(0, 6).toUpperCase() ?? "",
        description: drop.description ?? "",
        attributes: [
          {
            trait_type: "drop",
            value: drop.image ?? "",
          },
        ],
        files: [
          {
            uri: drop.image ?? "",
            type: "image/png",
          },
        ],
      })

      if (!uploadResult) throw new Error("Upload error")

      const masterKp = Keypair.fromSecretKey(bs58.decode(process.env.NEXT_PUBLIC_MASTER_WALLET!))

      const result = await shyft.createCNFT({
        network: SOLANA_CLUSTER as any,
        creatorWallet: masterKp.publicKey.toBase58(),
        merkleTree: process.env.NEXT_PUBLIC_MERKLE_TREE!,
        metadataUri: uploadResult.uri,
        receiver: publicKey.toBase58(),
        feePayer: publicKey.toBase58(),
      })

      const tx = Transaction.from(Buffer.from(result.encoded_transaction, "base64"))

      const signature = await sendTransaction(tx, connection, {
        signers: [masterKp],
      })

      await connection.confirmTransaction(signature, "processed")

      await supabase.claimDrop({
        drop_id: drop.id,
        claimant: publicKey.toBase58(),
        nft_address: result.mint,
        signature,
      })

      toast({
        variant: "success",
        title: "Successfully claimed NFT",
      })
      mutate()
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
    <div className="rounded-2xl bg-white p-6 shadow-card">
      <div className="mb-10 flex w-full">
        <div className="w-[70%]">
          <Typography level="body2" className="font-bold">
            {drop.name}
          </Typography>
          <Typography level="body5" color="secondary">
            {`${dayjs(drop.start_at).format("DD/MM/YYYY")} - ${dayjs(drop.end_at).format("DD/MM/YYYY")}`}
          </Typography>
          <Typography className="line-clamp-4">{drop.description}</Typography>
        </div>
        <div className="w-[30%]">
          <AspectRatio>
            <Image className="rounded-xl" src={drop.image ?? ""} alt={drop.name ?? ""} fill />
          </AspectRatio>
        </div>
      </div>
      {(!isOwner || isLoading) && (
        <>
          {publicKey ? (
            <Button loading={loading} onClick={handleClaim} disabled={!!claimResult} fullWidth>
              {!claimResult ? "Claim your NFT" : "Claimed"}
            </Button>
          ) : (
            <ConnectWalletButton />
          )}
        </>
      )}
    </div>
  )
}
