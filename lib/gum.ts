import { GRAPHQL_ENDPOINTS, SDK } from "@gumhq/sdk"
import * as anchor from "@project-serum/anchor"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { clusterApiUrl } from "@solana/web3.js"
import { GraphQLClient } from "graphql-request"

class GumService {
  sdk: SDK

  constructor() {
    // anchor.setProvider(anchor.AnchorProvider.env())
    // const userWallet = (anchor.getProvider() as any).wallet
    const network = WalletAdapterNetwork.Devnet
    const graphqlEndpoint = GRAPHQL_ENDPOINTS["devnet"]
    const gqlClient = new GraphQLClient(graphqlEndpoint)

    this.sdk = new SDK(
      null as any,
      new anchor.web3.Connection(clusterApiUrl(network), "processed"),
      { preflightCommitment: "processed" },
      network,
      gqlClient as any
    )
  }
}

export default new GumService()
