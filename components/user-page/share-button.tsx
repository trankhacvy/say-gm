"use client"

import { Database } from "@/types/supabase.types"
import { Button } from "../ui/button"
import { Share2Icon } from "lucide-react"
import { useToast } from "../ui/toast"

type ShareButtonProps = {
  user: Database["public"]["Tables"]["tbl_users"]["Row"]
}

export default function ShareButton({ user }: ShareButtonProps) {
  const { toast } = useToast()

  const handleShareWebView = () => {
    const url = `${process.env.NEXT_PUBLIC_APP_URL!}/users/${user.domain_name}`
    const text = "If you enjoy what I do, please support me on Say GM!"
    //Check for Web Share api support
    if (navigator.share) {
      //Browser supports native hare api
      navigator
        .share({
          title: "shareTitle",
          url,
          text,
        })
        .then(() => {
          console.log("success")
          toast({
            variant: "success",
            title: "Success",
          })
        })
    } else {
      window.open(`http://twitter.com/share?url=${url}&text=${text}`)
    }
  }

  return (
    <Button className="h-9 md:h-10" onClick={handleShareWebView} endDecorator={<Share2Icon />}>
      Share
    </Button>
  )
}
