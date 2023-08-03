"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Typography } from "../ui/typography"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "../ui/input"
import { siteConfig } from "@/config/site"
import { Button } from "../ui/button"
import { useToast } from "../ui/toast"

const formSchema = z.object({
  username: z.string().trim(),
  name: z.string().trim(),
  bio: z.string().trim(),
})

export default function WelcomeView() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      name: "",
      bio: "",
    },
  })

  const { control, formState } = form

  const { toast } = useToast()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      toast({
        variant: "success",
        title: false ? "NFT successfully updated" : "NFT successfully created",
      })
      //   replace(Routes.NFT_DETAIL(response.id))
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
            Welcome to {siteConfig.name}
          </Typography>
          <div className="space-y-5">
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
                    <Input as="textarea" rows={5} fullWidth placeholder="Say something about you..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" loading={formState.isSubmitting}>
                Create profile
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
