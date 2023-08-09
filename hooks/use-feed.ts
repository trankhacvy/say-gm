import supabase from "@/lib/supabase"
import useSWR from "swr"

export function useFeed(creatorId: string) {
  return useSWR(["feed", creatorId], () => supabase.findDonationByCreator(creatorId))
}
