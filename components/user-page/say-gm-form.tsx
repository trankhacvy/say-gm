"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { mutate } from "swr"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "../ui/toast"
import { Typography } from "../ui/typography"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import ConnectWalletButton from "../connect-wallet-button"
import { USD_PER_GM } from "@/config/donation"
import { Database } from "@/types/supabase.types"
import { getTransferTransaction } from "@/lib/solana"
import { PublicKey } from "@solana/web3.js"
import supabase from "@/lib/supabase"
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle"
import { formatCurrency } from "@/utils/currency"
import Pyth from "@/utils/pyth"

type SayGMFormProps = {
  user: Database["public"]["Tables"]["tbl_users"]["Row"]
}

const formSchema = z.object({
  numOfGm: z.number().min(1).max(10),
  message: z.string().trim().optional(),
})

export default function SayGMForm({ user }: SayGMFormProps) {
  const { toast } = useToast()
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numOfGm: 1,
      message: "",
    },
  })

  const { control, formState, reset, watch } = form
  const wTimes = watch("numOfGm")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!publicKey || !user.wallet) return

      const { solUsdPrice } = await Pyth.getSolUsdPrice()

      if (!solUsdPrice) throw new Error("Unknow error :(")

      const usdAmount = values.numOfGm * USD_PER_GM
      const solAmount = usdAmount / solUsdPrice

      const tx = getTransferTransaction(publicKey, new PublicKey(user.wallet), solAmount)

      const signature = await sendTransaction(tx, connection)
      await connection.confirmTransaction(signature, "processed")

      await supabase.donate(
        publicKey.toBase58(),
        user.id,
        "",
        values.message ?? "",
        values.numOfGm,
        usdAmount,
        signature
      )
      reset()
      await mutate(["feed", String(user.id)])
      toast({
        variant: "success",
        title: "Thank you for your support 🎊 🎊",
      })
    } catch (error: any) {
      console.error(error)
      toast({
        variant: "error",
        title: error?.message || "Server error",
      })
    }
  }

  if (publicKey && publicKey.toBase58() === user.wallet) return null

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full rounded-2xl bg-white p-6 shadow-card">
        <Typography as="h2" level="body2" className="font-bold">
          {/* @ts-ignore */}
          Say gm to {user.profile_metadata.name} 👋
        </Typography>
        <div className="flex flex-col gap-5 pb-4 pt-6">
          <FormField
            control={control}
            name="numOfGm"
            render={({ field }) => (
              <FormItem className="basis-1/2">
                <FormLabel className="flex items-center gap-2 text-gray-600">
                  Times
                  <Typography className="font-bold" color="primary" as="span">
                    ({formatCurrency(USD_PER_GM * wTimes, {})})
                  </Typography>
                </FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <ToggleGroup
                      className="!flex flex-wrap"
                      type="single"
                      aria-label="Time"
                      {...field}
                      value={String(field.value)}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <ToggleGroupItem
                        className="min-w-[100px]"
                        size="sm"
                        variant="outline"
                        value={"1"}
                        aria-label="one times"
                      >
                        One time
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        className="min-w-[100px]"
                        size="sm"
                        variant="outline"
                        value={"3"}
                        aria-label="3 time"
                      >
                        3 Times
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        className="min-w-[100px]"
                        size="sm"
                        variant="outline"
                        value={"5"}
                        aria-label="5 times"
                      >
                        5 Time
                      </ToggleGroupItem>
                      <ToggleGroupItem size="sm" variant="outline" value={"10"} aria-label="10 times">
                        10 Times
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="message"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Your message</FormLabel>
                <FormControl>
                  <Input as="textarea" rows={4} fullWidth placeholder="Enter your message (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            {publicKey ? (
              <Button loading={formState.isSubmitting} type="submit">
                {/* @ts-ignore */}
                Say gm to {user.profile_metadata.name} 👋
              </Button>
            ) : (
              <ConnectWalletButton />
            )}
          </div>
        </div>
      </form>
    </Form>
  )
}
