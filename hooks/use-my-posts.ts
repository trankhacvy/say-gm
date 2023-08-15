import useSWR from "swr"
import supabase from "@/lib/supabase"

export function useMyPosts(authorId?: string) {
  return useSWR(
    authorId ? ["user-my-posts", authorId] : null,
    async () => {
      try {
        return supabase.findPostsByCreator(authorId!)
      } catch (error) {
        return []
      }
    },
    {
      shouldRetryOnError: false,
    }
  )
}
