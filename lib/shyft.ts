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

  async createNFT(params: Parameters<ShyftSdk["nft"]["createV2"]>[0]) {
    return this.shyft.nft.createV2(params)
  }

  async uploadMetadata(params: Parameters<ShyftSdk["storage"]["createMetadata"]>[0]) {
    return this.shyft.storage.createMetadata(params)
  }
}

export default new ShyftService()
