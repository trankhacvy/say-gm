import supabase from "@/lib/supabase"
import useSWR from "swr"

export function useMembershipTiers(creatorId?: string) {
  return useSWR(
    creatorId ? ["membership-tiers", creatorId] : null,
    () => {
      try {
        return supabase.findMembershipTierByCreator(creatorId!)
      } catch (error) {
        return null
      }
    },
    {
      shouldRetryOnError: false,
    }
  )
}
