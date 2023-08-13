import { Cluster } from "@solana/web3.js";

export const IS_PROD = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

// apps
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL!
// solana
export const SOLANA_CLUSTER = process.env.NEXT_PUBLIC_SOLANA_CLUSTER as Cluster
export const SOLANA_PRC = process.env.NEXT_PUBLIC_SOLANA_RPC!