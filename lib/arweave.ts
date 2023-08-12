import { WebBundlr } from "@bundlr-network/client"
import BigNumber from "bignumber.js"
import { LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js"
import { SOLANA_CLUSTER } from "@/utils/env"
import { WalletContextState } from "@solana/wallet-adapter-react"

const BUNDLR_URL = SOLANA_CLUSTER === "devnet" ? "https://devnet.bundlr.network" : "https://node2.bundlr.network"

class ArweaveStorage {
  constructor() {}

  async initializeBundlr(wallet: WalletContextState) {
    const newBundlr = new WebBundlr(BUNDLR_URL, "solana", wallet, {
      providerUrl: clusterApiUrl(SOLANA_CLUSTER),
    })
    await newBundlr.ready()
    return newBundlr
  }

  async upload(data: any, wallet: WalletContextState) {
    const bundlr = await this.initializeBundlr(wallet)
    if (!bundlr) {
      throw new Error("Bundlr not initialized")
    }

    const publicKey = wallet?.publicKey

    if (!publicKey) {
      throw new Error("Public key not found")
    }

    if (typeof data === "object") {
      data = JSON.stringify(data)
    }

    const transaction = bundlr.createTransaction(data)
    try {
      const price = await bundlr.getPrice(data.length)
      const minimumFunds = price.multipliedBy(1)
      const balance = await bundlr.getBalance(publicKey.toBase58())
      if (balance.isLessThan(minimumFunds)) {
        console.log("fund")
        await bundlr.fund(minimumFunds)
      }

      await transaction.sign()
      await transaction.upload()
    } catch (e: any) {
      if (e.message.includes("Not enough funds to send data")) {
        const price = await bundlr.getPrice(data.length)
        const minimumFunds = price.multipliedBy(1)
        const balance = await bundlr.getBalance(publicKey.toBase58())

        if (balance.isLessThan(minimumFunds)) {
          await bundlr.fund(minimumFunds)
        }

        // Retry signing and uploading after funding
        await transaction.sign()
        await transaction.upload()
      } else {
        throw e
      }
    }

    const id = transaction.id

    if (!id) {
      throw new Error("Transaction ID not found")
    }

    const url = `https://arweave.net/${id}`
    const signature = transaction.signature
    return { url, signature, error: null }
  }
}

export default new ArweaveStorage()
