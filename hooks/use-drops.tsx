import supabase from "@/lib/supabase"
import useSWR from "swr"

export function useDrops(creatorId?: string) {
  return useSWR(creatorId ? ["drops", creatorId] : null, () => supabase.findDropsByCreator(creatorId!))
}

export function useCheckClaim(dropId?: string, wallet?: string) {
  return useSWR(dropId && wallet ? ["check-claim", dropId, wallet] : null, () =>
    supabase.findClaimByWallet(dropId!, wallet!)
  )
}
