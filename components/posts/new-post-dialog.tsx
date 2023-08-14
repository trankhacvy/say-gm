"use client"

import { useCreatePost, useGumContext, useSessionWallet, useUploaderContext } from "@gumhq/react-sdk"
import { zodResolver } from "@hookform/resolvers/zod"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { XIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useMembershipTiers } from "@/hooks/use-membership-tiers"
import Supabase, { PostModel } from "@/lib/supabase"
import { AUDIENCE_OPTIONS } from "@/utils/constants"
import { useProfileAccounts } from "../../hooks/useProfileAccounts"
import { updateSessionWallet } from "../../utils/sessionManager"
import ConnectWalletButton from "../connect-wallet-button"
import { AspectRatio } from "../ui/aspect-ratio"
import { IconButton } from "../ui/icon-button"
import { Input } from "../ui/input"
import { useToast } from "../ui/toast"
import { Uploader } from "../ui/uploader"

type NewPostDialogProps = {
  trigger: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: VoidFunction
}

const formSchema = z.object({
  content: z.string(),
  audience: z.string(),
  minMembershipTier: z.string().optional(),
  image: z.any().optional(),
})

export const NewPostDialog = ({ trigger, onSuccess, isOpen, onOpenChange }: NewPostDialogProps) => {
  const { sdk } = useGumContext()
  const { toast } = useToast()
  const { handleUpload } = useUploaderContext()
  const { data: authSession } = useSession()
  const wallet = useWallet()
  const { publicKey } = wallet
  const { publicKey: sessionPublicKey, sessionToken, createSession, sendTransaction, signMessage } = useSessionWallet()
  const userProfileAccounts = useProfileAccounts(sdk)
  const { createWithSession, postPDA, isCreatingPost } = useCreatePost(sdk)
  const [newPost, setNewPostData] = useState<PostModel>()
  const { data: tiers = [] } = useMembershipTiers(String(authSession?.user.id))
  const [selectedAudience, setSelectedAudience] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      image: "",
      audience: AUDIENCE_OPTIONS[0].value,
      minMembershipTier: undefined,
    },
  })

  const { control } = form

  useEffect(() => {
    if (isCreatingPost || !newPost || !postPDA) return

    const createPost = async () => {
      try {
        await Supabase.createPost({
          ...newPost,
          postAddress: postPDA?.toBase58() ?? "",
        })
        setNewPostData(undefined)
      } catch (ex) {
        console.error("[Post] create post error:", ex)
        throw ex
      }
    }

    createPost()
  }, [postPDA, isCreatingPost, newPost])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const session = await updateSessionWallet(sessionPublicKey, sessionToken, createSession)
      if (!session || !session.sessionPublicKey || !session.sessionToken || !sendTransaction || !signMessage) return

      const postArray = new TextEncoder().encode(values.content)
      const signature = await signMessage(postArray)
      const signatureString = JSON.stringify(signature.toString())

      let imageUrl = ""
      if (values.image) {
        const avatarUpload = await Supabase.uploadFile(`avatar/${new Date().getTime()}`, values.image)
        if (avatarUpload.data?.publicUrl) {
          imageUrl = avatarUpload.data.publicUrl
        }
      }

      const metadata = {
        content: {
          json_data: {
            content: values.content,
            images: [imageUrl],
            audience: values.audience,
            minMembershipTier: values.minMembershipTier ?? "",
          },
        },
        type: "json",
        authorship: {
          publicKey: session.sessionPublicKey.toBase58(),
          signature: signatureString,
        },
        app_id: "oops",
      }

      const uploader = await handleUpload(metadata, wallet)
      if (!uploader) {
        console.log("Error uploading post")
        return
      }
      setNewPostData({
        authorId: authSession?.user.id,
        content: values.content,
        imageUrls: [imageUrl],
        signature: signatureString,
        metadataUri: uploader.url,
        audience: values.audience,
        minMembershipTier: Number(values.minMembershipTier) ?? 0,
      })

      await createWithSession(
        uploader.url,
        userProfileAccounts[0].profilePDA,
        session.sessionPublicKey,
        new PublicKey(session.sessionToken),
        sendTransaction,
        session.sessionPublicKey
      )

      onSuccess?.()
      form.reset()
      onOpenChange?.(false)

      toast({
        variant: "success",
        title: "Post successfully!.",
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
        <AlertDialogContent className="max-h-[calc(100vh-80px)] max-w-lg overflow-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>New Post</AlertDialogTitle>
          </AlertDialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={control}
                name="content"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input as="textarea" rows={6} fullWidth placeholder="Write a quick update..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="image"
                render={({ field }) => (
                  <FormItem className="h-[225px] w-[225px]">
                    <FormLabel>Image</FormLabel>
                    <AspectRatio>
                      <Uploader
                        {...field}
                        className="h-[200px] w-[200px]"
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
                control={control}
                name="audience"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Audience</FormLabel>
                    <select
                      {...field}
                      className="w-full rounded border px-3 py-2"
                      onChange={(e) => {
                        setSelectedAudience(e.target.value)
                        field.onChange(e)
                      }}
                    >
                      {AUDIENCE_OPTIONS.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedAudience === "members" && ( // 3. Conditionally render based on local state
                <FormField
                  control={control}
                  name="minMembershipTier"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Minimum membership tier</FormLabel>
                      <select {...field} className="w-full rounded border px-3 py-2">
                        <option value="" disabled selected>
                          Select a membership tier
                        </option>
                        {tiers?.map((tier, index) => (
                          <option key={index} value={tier.price || 0}>
                            {tier.name}
                          </option>
                        ))}
                      </select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <AlertDialogFooter>
                {publicKey ? (
                  <Button loading={form.formState.isSubmitting} type="submit" fullWidth>
                    Post
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
