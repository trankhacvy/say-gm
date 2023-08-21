import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DemoAnchor } from "../target/types/demo_anchor";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
  getConcurrentMerkleTreeAccountSize,
} from "@solana/spl-account-compression";

describe("Membership", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.DemoAnchor as Program<DemoAnchor>;

  const username = "khacvy";
  const uri = "https://google.com";
  const merkleTreeKp = Keypair.generate();

  before(async () => {
    const listener = program.addEventListener(
      "MembershipCreated",
      (event, slot) => {
        console.log("[EVENT]", event, slot);
      }
    );

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

  it("Create Membership", async () => {
    const membership_id = "123";
    const membership_name = "Gold";
    const metadata_uri = "https://google.com";
    const price = LAMPORTS_PER_SOL / 10;

    const [profilePda, _] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("profile"),
        provider.publicKey.toBuffer(),
        anchor.utils.bytes.utf8.encode(username),
      ],
      program.programId
    );

    try {
      const tx = await program.methods
        .createMembership(membership_id, membership_name, metadata_uri, price)
        .accounts({
          authority: provider.publicKey,
          merkleTree: merkleTreeKp.publicKey,
          profile: profilePda,
          collectionAddress: Keypair.generate().publicKey,
          compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
          logWrapperProgram: SPL_NOOP_PROGRAM_ID,
        })
        .rpc();

      console.log("Your transaction signature", tx);
    } catch (error) {
      console.error(error);
    }
  });
});
