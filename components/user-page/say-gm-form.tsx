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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { USD_PER_GM } from "@/config/donation"
import { Database } from "@/types/supabase.types"
import { getTransferTransaction } from "@/lib/solana"
import { PublicKey } from "@solana/web3.js"
import supabase from "@/lib/supabase"

type SayGMFormProps = {
  user: Database["public"]["Tables"]["tbl_users"]["Row"]
}

const formSchema = z.object({
  numOfGum: z.number().min(1).max(5),
  name: z.string().trim(),
  message: z.string().trim().optional(),
})

export default function SayGMForm({ user }: SayGMFormProps) {
  const { toast } = useToast()
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numOfGum: 1,
      name: "",
      message: "",
    },
  })

  const { control, formState, reset } = form

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!publicKey || !user.wallet) return

      // TODO convert USD to SOL
      const tx = getTransferTransaction(publicKey, new PublicKey(user.wallet), values.numOfGum / 100)

      const signature = await sendTransaction(tx, connection)
      await connection.confirmTransaction(signature, "processed")

      await supabase.donate(
        publicKey.toBase58(),
        user.id,
        values.name,
        values.message ?? "",
        values.numOfGum,
        values.numOfGum / 100,
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
            name="numOfGum"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select times" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={4} className="!w-[var(--radix-select-trigger-width)]">
                      <SelectItem value="1">One time (${USD_PER_GM * 1})</SelectItem>
                      <SelectItem value="3">Three times (${USD_PER_GM * 3})</SelectItem>
                      <SelectItem value="5">Five times (${USD_PER_GM * 5})</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Your nickname</FormLabel>
                <FormControl>
                  <Input fullWidth placeholder="Enter your nickname" {...field} />
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
