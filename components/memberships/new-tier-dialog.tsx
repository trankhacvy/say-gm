"use client"

import { useForm } from "react-hook-form"
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js"
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
import { Button } from "@/components/ui/button"
import { IconButton } from "../ui/icon-button"
import { Input } from "../ui/input"
import { XIcon } from "lucide-react"
import { useToast } from "../ui/toast"
import { AspectRatio } from "../ui/aspect-ratio"
import { Uploader } from "../ui/uploader"
import supabase from "@/lib/supabase"
import { useSession } from "next-auth/react"
import shyft from "@/lib/shyft"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Keypair } from "@solana/web3.js"
import ConnectWalletButton from "../connect-wallet-button"

type NewTierDialogProps = {
  trigger: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: VoidFunction
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  benefit: z.string().optional(),
  price: z.number().min(0),
  image: z.any().refine((file) => !!file, "Image is required."),
})

export const SAMPLE_KEY = [
  40, 65, 65, 141, 147, 241, 237, 107, 189, 168, 105, 136, 0, 184, 63, 160, 64, 149, 125, 225, 74, 192, 224, 145, 184,
  118, 207, 152, 73, 181, 91, 55, 77, 18, 228, 123, 206, 251, 134, 146, 91, 68, 218, 88, 194, 238, 25, 38, 244, 7, 165,
  149, 160, 152, 41, 29, 222, 45, 138, 115, 74, 60, 24, 235,
]

export const NewTierDialog = ({ trigger, onSuccess, isOpen, onOpenChange }: NewTierDialogProps) => {
  const { toast } = useToast()
  const { data: session } = useSession()
  const wallet = useWallet()
  const { publicKey, sendTransaction } = wallet
  const { connection } = useConnection()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      benefit: "",
      price: 1,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!publicKey) return

      const imageUrl = (await supabase.uploadFile(`${session?.user.id!}/${Date.now()}.png`, values.image)).data
        ?.publicUrl

      if (!imageUrl) throw new Error("Upload error")

      const uploadResult = await shyft.uploadMetadata({
        creator: publicKey.toBase58(),
        image: imageUrl,
        name: values.name,
        symbol: values.name.substring(0, 6).toUpperCase(),
        description: values.description ?? "",
        attributes: [
          {
            trait_type: "tier",
            value: values.name,
          },
        ],
      })

      if (!uploadResult) throw new Error("Upload error")

      const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet))

      const mint = Keypair.generate()
      const keypair = Keypair.fromSecretKey(Uint8Array.from(SAMPLE_KEY))

      const tx = await metaplex
        .nfts()
        .builders()
        .create({
          useNewMint: mint,
          name: values.name,
          symbol: values.name.substring(0, 6).toUpperCase(),
          sellerFeeBasisPoints: 0,
          uri: uploadResult.uri,
          isCollection: true,
          updateAuthority: keypair,
          collectionAuthorityIsDelegated: true
        })

      const txResult = await metaplex.rpc().sendAndConfirmTransaction(tx, {}, [mint, keypair])

      await supabase.createMembershipTier(
        session?.user.id!,
        values.name,
        values.description ?? "",
        values.benefit ?? "",
        values.price,
        imageUrl,
        mint.publicKey.toBase58(),
        txResult.signature
      )

      onSuccess?.()
      form.reset()
      onOpenChange?.(false)

      toast({
        variant: "success",
        title: "New Tier successfully created.",
      })
    } catch (error: any) {
      console.error(error)
      toast({
        variant: "error",
        title: error?.message ?? "Server error",
      })
    }
  }

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        <AlertDialogContent className="max-h-[calc(100vh-80px)] max-w-md overflow-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>New tier</AlertDialogTitle>
          </AlertDialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tier name</FormLabel>
                    <FormControl>
                      <Input fullWidth placeholder="eg. Diamond" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tier price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        fullWidth
                        placeholder="eg. 3$"
                        {...field}
                        onChange={(event) => field.onChange(Number(event.target.value?.replace(/[^0-9]/g, "")))}
                        endDecorator={<span>$</span>}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <FormField
                control={form.control}
                name="benefit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Benefit</FormLabel>
                    <FormControl>
                      <Input
                        as="textarea"
                        rows={4}
                        fullWidth
                        placeholder="Describe the supporter benefit."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Avatar</FormLabel>
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
