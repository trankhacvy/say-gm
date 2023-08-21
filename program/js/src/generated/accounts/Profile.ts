/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js'
import * as beetSolana from '@metaplex-foundation/beet-solana'
import * as beet from '@metaplex-foundation/beet'

/**
 * Arguments used to create {@link Profile}
 * @category Accounts
 * @category generated
 */
export type ProfileArgs = {
  authority: web3.PublicKey
  metadataUri: string
  username: string
  merkleTree: web3.PublicKey
  bump: number
}

export const profileDiscriminator = [184, 101, 165, 188, 95, 63, 127, 188]
/**
 * Holds the data for the {@link Profile} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class Profile implements ProfileArgs {
  private constructor(
    readonly authority: web3.PublicKey,
    readonly metadataUri: string,
    readonly username: string,
    readonly merkleTree: web3.PublicKey,
    readonly bump: number
  ) {}

  /**
   * Creates a {@link Profile} instance from the provided args.
   */
  static fromArgs(args: ProfileArgs) {
    return new Profile(
      args.authority,
      args.metadataUri,
      args.username,
      args.merkleTree,
      args.bump
    )
  }

  /**
   * Deserializes the {@link Profile} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0
  ): [Profile, number] {
    return Profile.deserialize(accountInfo.data, offset)
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link Profile} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig
  ): Promise<Profile> {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    )
    if (accountInfo == null) {
      throw new Error(`Unable to find Profile account at ${address}`)
    }
    return Profile.fromAccountInfo(accountInfo, 0)[0]
  }

  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(
    programId: web3.PublicKey = new web3.PublicKey('undefined')
  ) {
    return beetSolana.GpaBuilder.fromStruct(programId, profileBeet)
  }

  /**
   * Deserializes the {@link Profile} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [Profile, number] {
    return profileBeet.deserialize(buf, offset)
  }

  /**
   * Serializes the {@link Profile} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return profileBeet.serialize({
      accountDiscriminator: profileDiscriminator,
      ...this,
    })
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link Profile} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args: ProfileArgs) {
    const instance = Profile.fromArgs(args)
    return profileBeet.toFixedFromValue({
      accountDiscriminator: profileDiscriminator,
      ...instance,
    }).byteSize
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link Profile} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    args: ProfileArgs,
    connection: web3.Connection,
    commitment?: web3.Commitment
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      Profile.byteSize(args),
      commitment
    )
  }

  /**
   * Returns a readable version of {@link Profile} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      authority: this.authority.toBase58(),
      metadataUri: this.metadataUri,
      username: this.username,
      merkleTree: this.merkleTree.toBase58(),
      bump: this.bump,
    }
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const profileBeet = new beet.FixableBeetStruct<
  Profile,
  ProfileArgs & {
    accountDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['authority', beetSolana.publicKey],
    ['metadataUri', beet.utf8String],
    ['username', beet.utf8String],
    ['merkleTree', beetSolana.publicKey],
    ['bump', beet.u8],
  ],
  Profile.fromArgs,
  'Profile'
)
