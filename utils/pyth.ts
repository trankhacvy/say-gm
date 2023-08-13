import { getPythProgramKeyForCluster, PythHttpClient, PriceStatus } from "@pythnetwork/client"
import { Connection } from "@solana/web3.js"
import { SOLANA_CLUSTER, SOLANA_PRC } from "./env"

const SOL_USD_PYTH_SYMBOL = "Crypto.SOL/USD"
const pythConnection = new Connection(SOLANA_PRC)
const pythPublicKey = getPythProgramKeyForCluster(SOLANA_CLUSTER)

async function getSolUsdPrice() {
  // Get the current SOL/USD price from Pyth
  const pythData = await new PythHttpClient(pythConnection, pythPublicKey).getData()
  const solUsdPrice = pythData?.productPrice.get(SOL_USD_PYTH_SYMBOL)?.price
  // @ts-ignore
  const priceStatus = PriceStatus[pythData?.productPrice?.get(SOL_USD_PYTH_SYMBOL)?.status]

  return { solUsdPrice, priceStatus }
}

const Pyth = {
  getSolUsdPrice,
}

export default Pyth
