import useSWR from "swr"
import supabase from "@/lib/supabase"

export function useCreatorPosts(authorId?: string) {
  return useSWR(
    authorId ? ["user-creator-posts", authorId] : null,
    async () => {
      try {
        return supabase.findPostsByCreator(authorId!)
      } catch (error) {
        return null
      }
    },
    {
      shouldRetryOnError: false,
    }
  )
}
