import { SOLANA_CLUSTER } from "./env"

export function getTxUrl(value: string, type: "transaction" | "address" = "transaction") {
  switch (type) {
    case "address":
      return `https://translator.shyft.to/address/${value}?cluster=${SOLANA_CLUSTER}`
    case "transaction":
      return `https://translator.shyft.to/tx/${value}?cluster=${SOLANA_CLUSTER}`
    default:
      return ""
  }
}
