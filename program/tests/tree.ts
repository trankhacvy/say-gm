import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DemoAnchor } from "../target/types/demo_anchor";
import { airdrop } from "./utils";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import {
  MerkleTree,
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
  getConcurrentMerkleTreeAccountSize,
} from "@solana/spl-account-compression";

describe("demo-anchor", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.DemoAnchor as Program<DemoAnchor>;

  before(async () => {
    // await airdrop(provider.connection, provider.publicKey);
  });

  it("Is initialized!", async () => {
    const payer = provider.publicKey;

    const depthSizePair = {
      maxDepth: 3,
      maxBufferSize: 8,
    };

    const merkleTreeKp = Keypair.generate();
    const merkleTree = merkleTreeKp.publicKey;
    const space = getConcurrentMerkleTreeAccountSize(
      depthSizePair.maxDepth,
      depthSizePair.maxBufferSize
    );

    const allocTreeIx = SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: merkleTree,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(
        space
      ),
      space: space,
      programId: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
    });

    const [treeConfig, _] = PublicKey.findProgramAddressSync(
      [merkleTree.toBuffer()],
      program.programId
    );

    const result = await program.methods
      .createTree(depthSizePair.maxDepth, depthSizePair.maxBufferSize)
      .accounts({
        authority: payer,
        payer: payer,
        merkleTree: merkleTree,
        treeConfig,
        logWrapper: SPL_NOOP_PROGRAM_ID,
        compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      })
      .preInstructions([allocTreeIx])
      .signers([merkleTreeKp])
      .rpc();

    console.log("sign", result);

    const leaves = Array(2 ** depthSizePair.maxDepth).fill(Buffer.alloc(32));

    const offChainTree = new MerkleTree(leaves);

    console.log("merkleTree", merkleTree.toBase58());
    console.log("treeConfig", treeConfig.toBase58());
    console.log("offChainTree", offChainTree.depth);
  });

  it.skip("Append leaf", async () => {
    const payer = provider.publicKey;
    const merkleTree = new PublicKey(
      "3HSYngBbD89vv8LsJMtrXJa4eYHCZebugyHgdwSStAUu"
    );

    const [treeConfig, _] = PublicKey.findProgramAddressSync(
      [merkleTree.toBuffer()],
      program.programId
    );

    const result = await program.methods
      .createPost("hello world")
      .accounts({
        authority: payer,
        merkleTree: merkleTree,
        treeConfig,
        logWrapperProgram: SPL_NOOP_PROGRAM_ID,
        compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      })
      .rpc();

    console.log("sign", result);

    // console.log("merkleTree", merkleTree.toBase58());
    // console.log("treeConfig", treeConfig.toBase58());
    // console.log("offChainTree", offChainTree.depth);
  });
});
