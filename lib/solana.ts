import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"
import BigNumber from "bignumber.js"

export function getTransferTransaction(from: PublicKey, to: PublicKey, amount: number) {
  return new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from,
      toPubkey: to,
      lamports: new BigNumber(amount).multipliedBy(LAMPORTS_PER_SOL).integerValue().toNumber(),
    })
  )
}
