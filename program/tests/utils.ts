import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export async function airdrop(connection: Connection, key: PublicKey) {
  const airdropSig = await connection.requestAirdrop(key, 1 * LAMPORTS_PER_SOL);
  return connection.confirmTransaction(airdropSig);
}
