import supabase from "@/lib/supabase"
import useSWR from "swr"

export function useDrops(creatorId?: string) {
    return useSWR(creatorId ? ["drops", creatorId] : null, () => supabase.findDropsByCreator(creatorId!))
  }