import supabase from "@/lib/supabase"
import useSWR from "swr"

export function useDonations(creatorId?: string) {
  return useSWR(creatorId ? ["donations", creatorId] : null, () => supabase.findDonationByCreator(creatorId!))
}

export function useGrouppedDonations(creatorId?: string) {
  return useSWR(creatorId ? ["group-donations", creatorId] : null, () => supabase.getSupportersByCreator(creatorId!))
}
