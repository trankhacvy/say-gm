import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DemoAnchor } from "../target/types/demo_anchor";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
  getConcurrentMerkleTreeAccountSize,
} from "@solana/spl-account-compression";

describe("Profile", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.DemoAnchor as Program<DemoAnchor>;

  it("Is initialized!", async () => {
    const username = "vy";
    const uri = "https://google.com";

    const [profilePda, _] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("profile"),
        provider.publicKey.toBuffer(),
        anchor.utils.bytes.utf8.encode(username),
      ],
      program.programId
    );

    // merkle tree
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
      fromPubkey: provider.publicKey,
      newAccountPubkey: merkleTree,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(
        space
      ),
      space: space,
      programId: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
    });

    const [treeConfig] = PublicKey.findProgramAddressSync(
      [merkleTree.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .createProfile(username, uri)
      .accounts({
        authority: provider.publicKey,
        payer: provider.publicKey,
        profile: profilePda,
        merkleTree,
        treeConfig,
        compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
        logWrapper: SPL_NOOP_PROGRAM_ID,
      })
      .preInstructions([allocTreeIx])
      .signers([merkleTreeKp])
      .rpc();

    console.log("Your transaction signature", tx);
    console.log("profile: ", await program.account.profile.fetch(profilePda));
    console.log(
      "merkle tree config: ",
      await program.account.treeConfig.fetch(treeConfig)
    );
  });
});
