import { GRAPHQL_ENDPOINTS, GUM_TLD_ACCOUNT, GumDecodedProfile, SDK } from "@gumhq/sdk"
import { keccak_256 } from "js-sha3"
import * as anchor from "@project-serum/anchor"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { PublicKey, clusterApiUrl } from "@solana/web3.js"
import { GraphQLClient } from "graphql-request"
import { SOLANA_CLUSTER } from "@/utils/env"

class GumService {
  sdk: SDK

  constructor() {
    const network = WalletAdapterNetwork.Devnet
    const graphqlEndpoint = GRAPHQL_ENDPOINTS[SOLANA_CLUSTER as keyof typeof GRAPHQL_ENDPOINTS]
    const gqlClient = new GraphQLClient(graphqlEndpoint)

    this.sdk = new SDK(
      null as any,
      new anchor.web3.Connection(clusterApiUrl(network), "processed"),
      { preflightCommitment: "processed" },
      network,
      gqlClient as any
    )
  }

  async findDomain(domain: string) {
    try {
      const domainHash = keccak_256(domain)
      const [domainAccount, _] = PublicKey.findProgramAddressSync(
        [Buffer.from("name_record"), Buffer.from(domainHash, "hex"), GUM_TLD_ACCOUNT.toBuffer()],
        this.sdk.nameserviceProgram.programId
      )
      return await this.sdk.nameservice.get(domainAccount)
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async findByAuthority(authority: string) {
    try {
      const domains = await this.sdk.nameservice.getNameservicesByAuthority(authority)
      return domains.find((domain) => domain.name === authority)
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async getProfile(screenName: string, authority: string): Promise<GumDecodedProfile | null> {
    try {
      return this.sdk.profile.getProfile(new PublicKey(screenName), new PublicKey(authority))
    } catch (error) {
      console.error(error)
      return null
    }
  }

  // async createProfile(domain: string, metadataUri: string) {
  //   this.sdk.nameserviceProgram.methods.createNameRecord
  // }
}

export default new GumService()
