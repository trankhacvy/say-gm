import ShyftService from "@/lib/shyft"
import useSWR from "swr"

export function useGetNFTsByOwner(owner?: string) {
  return useSWR(["get-nft-by-owner", owner], () => ShyftService.getNFTsByOwner(owner!), {
    shouldRetryOnError: false,
  })
}
