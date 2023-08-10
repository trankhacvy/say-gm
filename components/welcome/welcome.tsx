"use client"

import { GUM_TLD_ACCOUNT, SDK, useCreateProfile, useGumContext, useUploaderContext } from "@gumhq/react-sdk"
import { zodResolver } from "@hookform/resolvers/zod"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { keccak_256 } from "js-sha3"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Supabase from "@/lib/supabase"
import ConnectWalletButton from "../connect-wallet-button"
import { AspectRatio } from "../ui/aspect-ratio"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useToast } from "../ui/toast"
import { Typography } from "../ui/typography"
import { Uploader } from "../ui/uploader"
import { Routes } from "@/config/routes"

export default function WelcomeView() {
  return <ProfileForm />
}

const profileFormSchema = z.object({
  avatar: z.any().refine((file) => !!file, "Image is required."),
  username: z.string().trim(),
  name: z.string().trim(),
  bio: z.string().trim(),
})

function ProfileForm() {
  const router = useRouter()
  const wallet = useWallet()
  const { publicKey } = wallet
  const { handleUpload } = useUploaderContext()
  const { sdk } = useGumContext()
  const { createProfileWithDomain } = useCreateProfile(sdk)
  const { update } = useSession()

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      name: "",
      bio: "",
    },
  })

  const { control, formState, setError } = form

  const { toast } = useToast()

  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    try {
      if (!publicKey) return

      const domain = await findDomain(sdk, values.username)

      if (domain && domain.authority.toBase58() !== publicKey.toBase58()) {
        throw new Error("Username already exist")
      }

      const avatarUpload = await Supabase.uploadFile(`${new Date().getTime()}`, values.avatar)

      if (!avatarUpload.data?.publicUrl) throw new Error("Error uploading avatar")

      const profileMetadata = {
        name: values.name,
        bio: values.bio,
        avatar: avatarUpload?.data?.publicUrl,
      }

      const uploadRes = await handleUpload(profileMetadata, wallet)
      if (!uploadRes) {
        throw new Error("Error uploading profile metadata")
      }

      const profilePda = await createProfileWithDomain(uploadRes.url, values.username, publicKey)
      if (!profilePda) {
        throw new Error("Error creating profile")
      }

      await sdk.profile.getProfilesByProfileAccount(profilePda)

      const domainAccount = await getDomainAccount(sdk, values.username)

      const updatedUser = await Supabase.updateUser(publicKey.toBase58(), {
        domain_name: values.username,
        domain_address: domainAccount.toBase58(),
        profile_address: profilePda.toBase58(),
        profile_screen_name: domainAccount.toBase58(),
        profile_metadata: profileMetadata,
        profile_metadata_uri: uploadRes.url,
      })
      await update(updatedUser)
      router.replace(Routes.DASHBOARD)
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-lg">
        <div className="w-full rounded-2xl bg-white p-6 shadow-card">
          <Typography as="h2" level="h6" className="mb-10 font-bold">
            Create profile
          </Typography>
          <div className="space-y-5">
            <FormField
              control={control}
              name="avatar"
              render={({ field }) => (
                <FormItem className="w-full max-w-[240px]">
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
                      onExceedFileSize={() => setError("avatar", { message: "Max file size is 5MB" })}
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
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input fullWidth placeholder="Enter your username" {...field} />
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input fullWidth placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="bio"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input as="textarea" rows={6} fullWidth placeholder="Tell something about you..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              {publicKey ? (
                <Button type="submit" loading={formState.isSubmitting}>
                  Create
                </Button>
              ) : (
                <ConnectWalletButton />
              )}
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}

async function findDomain(sdk: SDK, domain: string) {
  try {
    const domainHash = keccak_256(domain)
    const [domainAccount, _] = PublicKey.findProgramAddressSync(
      [Buffer.from("name_record"), Buffer.from(domainHash, "hex"), GUM_TLD_ACCOUNT.toBuffer()],
      sdk.nameserviceProgram.programId
    )
    return await sdk.nameservice.get(domainAccount)
  } catch (error) {
    console.error(error)
    return null
  }
}

function getDomainAccount(sdk: SDK, domain: string) {
  const domainHash = keccak_256(domain)
  const [domainAccount, _] = PublicKey.findProgramAddressSync(
    [Buffer.from("name_record"), Buffer.from(domainHash, "hex"), GUM_TLD_ACCOUNT.toBuffer()],
    sdk.nameserviceProgram.programId
  )
  return domainAccount
}
