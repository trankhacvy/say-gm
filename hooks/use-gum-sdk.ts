import { AnchorWallet, useAnchorWallet } from "@solana/wallet-adapter-react"
import { GRAPHQL_ENDPOINTS, useGum } from "@gumhq/react-sdk"
import { useConnection } from "@solana/wallet-adapter-react"
import { useMemo } from "react"
import { GraphQLClient } from "graphql-request"
import { SOLANA_CLUSTER } from "@/utils/env"

export const useGumSDK = () => {
  const { connection } = useConnection()
  const anchorWallet = useAnchorWallet() as AnchorWallet

  // GraphQL endpoint is chosen based on the network
  const graphqlEndpoint = GRAPHQL_ENDPOINTS[SOLANA_CLUSTER as "devnet" | "mainnet-beta"]

  const gqlClient = useMemo(() => new GraphQLClient(graphqlEndpoint), [graphqlEndpoint])

  const sdk = useGum(anchorWallet, connection, { preflightCommitment: "confirmed" }, SOLANA_CLUSTER, gqlClient)

  return sdk
}
