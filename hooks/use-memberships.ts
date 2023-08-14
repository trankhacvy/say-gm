import supabase from "@/lib/supabase"
import useSWR from "swr"

export function useGetMembershipsByWallet(wallet?: string) {
  return useSWR(
    wallet ? ["memberships-by-wallet", wallet] : null,
    () => {
      try {
        return supabase.findMembershipsByWallet(wallet!)
      } catch (error) {
        return null
      }
    },
    {
      shouldRetryOnError: false,
    }
  )
}

export function useGetMembershipsByCreator(creator?: string) {
  return useSWR(
    creator ? ["memberships-by-creator", creator] : null,
    () => {
      try {
        return supabase.findMembershipByCreator(creator!)
      } catch (error) {
        return null
      }
    },
    {
      shouldRetryOnError: false,
    }
  )
}