import { SOLANA_CLUSTER } from "@/utils/env"
import { ShyftSdk, Network } from "@shyft-to/js"

class ShyftService {
  shyft: ShyftSdk

  constructor() {
    this.shyft = new ShyftSdk({
      apiKey: process.env.NEXT_PUBLIC_SHYFT_API_KEY!,
      network: SOLANA_CLUSTER as Network,
    })
  }

  async getNFTsByOwner(owner: string) {
    return this.shyft.nft.getNftByOwner({
      owner,
    })
  }
}

export default new ShyftService()
