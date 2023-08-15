"use client"

import { mutate } from "swr"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { IconButton } from "../ui/icon-button"
import { Input } from "../ui/input"
import { PlusIcon, XIcon } from "lucide-react"
import { useToast } from "../ui/toast"
import { AspectRatio } from "../ui/aspect-ratio"
import { Uploader } from "../ui/uploader"
import supabase from "@/lib/supabase"
import { useSession } from "next-auth/react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import ConnectWalletButton from "../connect-wallet-button"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import { useMembershipTiers } from "@/hooks/use-membership-tiers"

type NewTierDialogProps = {
  trigger: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: VoidFunction
}

const formSchema = z.object({
  image: z.any().refine((file) => !!file, "Image is required."),
  name: z.string().min(1, { message: "Name is required" }),
  num_of_nfts: z.number().min(0),
  audience: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  startAt: z.string().optional(),
  endAt: z.string().optional(),
})

export const NewTierDialog = ({ trigger, onSuccess, isOpen, onOpenChange }: NewTierDialogProps) => {
  const { toast } = useToast()
  const { data: session } = useSession()
  const wallet = useWallet()
  const { publicKey } = wallet
  const { data: tiers } = useMembershipTiers(String(session?.user.id))

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      num_of_nfts: 100,
      audience: "",
      description: "",
      startAt: dayjs().add(1, "d").format("YYYY-MM-DDThh:mm"),
      endAt: dayjs().add(2, "d").format("YYYY-MM-DDThh:mm"),
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!publicKey) return
      const imageUrl = (await supabase.uploadFile(`${session?.user.id!}/${Date.now()}.png`, values.image)).data
        ?.publicUrl

      if (!imageUrl) throw new Error("Upload error")

      await supabase.createDrop({
        audience: values.audience,
        description: values.description,
        end_at: values.endAt,
        image: imageUrl,
        merkle_tree: "0x00",
        name: values.name,
        num_of_nfts: values.num_of_nfts,
        signature: "0x00",
        start_at: values.startAt,
        creator_id: session?.user.id,
      })
      onSuccess?.()
      await mutate(["drops", String(session?.user.id)])
      form.reset()
      onOpenChange?.(false)
      toast({
        variant: "success",
        title: "New drop successfully created.",
      })
    } catch (error: any) {
      console.error(error)
      toast({
        variant: "error",
        title: error?.message ?? "Server error",
      })
    }
  }

  useEffect(() => {
    if (tiers && tiers.length > 0) {
      form.resetField("audience", {
        defaultValue: tiers[0].id ?? "",
      })
    }
  }, [tiers, form])

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        <AlertDialogContent className="max-h-[calc(100vh-80px)] max-w-md overflow-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>New drop</AlertDialogTitle>
          </AlertDialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* image */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Image</FormLabel>
                    <AspectRatio ratio={1 / 1}>
                      <Uploader
                        {...field}
                        className="h-full"
                        maxFiles={1}
                        accept={{
                          "image/png": [".png"],
                          "image/jpeg": [".jpg", ".jpeg"],
                        }}
                        onExceedFileSize={() => form.setError("image", { message: "Max file size is 5MB" })}
                        value={field.value ? [field.value] : []}
                        onChange={(files) => {
                          field.onChange(files?.[0])
                        }}
                      />
                    </AspectRatio>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drop name</FormLabel>
                    <FormControl>
                      <Input fullWidth placeholder="eg. New album release" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* num of nfts */}
              <FormField
                control={form.control}
                name="num_of_nfts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Num of NFTs</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        fullWidth
                        placeholder="eg. 100"
                        {...field}
                        onChange={(event) => field.onChange(Number(event.target.value?.replace(/[^0-9]/g, "")))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* selected tiers */}
              <FormField
                control={form.control}
                name="audience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audience</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the audience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiers?.map((tier) => (
                          <SelectItem value={tier.id}>{tier.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        as="textarea"
                        rows={4}
                        fullWidth
                        placeholder="Describe what you'll offer to members of this tier."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* start at */}
              <FormField
                control={form.control}
                name="startAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start at</FormLabel>
                    <FormControl>
                      <Input fullWidth type="datetime-local" placeholder="eg." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* end at */}
              <FormField
                control={form.control}
                name="endAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End at</FormLabel>
                    <FormControl>
                      <Input fullWidth type="datetime-local" placeholder="eg." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AlertDialogFooter>
                {publicKey ? (
                  <Button loading={form.formState.isSubmitting} type="submit" fullWidth>
                    Create
                  </Button>
                ) : (
                  <ConnectWalletButton />
                )}
              </AlertDialogFooter>
            </form>
          </Form>

          <AlertDialogCancel asChild>
            <IconButton
              size="sm"
              color="default"
              className="absolute right-2 top-2 border-none text-gray-800 !shadow-none hover:bg-gray-800/8 focus:ring-0"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </IconButton>
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export const NewDropButton = () => {
  const [open, setOpen] = useState(false)
  return (
    <NewTierDialog
      isOpen={open}
      onOpenChange={setOpen}
      trigger={<Button endDecorator={<PlusIcon />}>New drop</Button>}
    />
  )
}
