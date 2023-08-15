import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { Database } from "@/types/supabase.types"
import { IS_PROD } from "@/utils/env"

export const USERS_TABLE = IS_PROD ? "tbl_users" : "dev_tbl_users"
export const DONATIONS_TABLE = IS_PROD ? "tbl_donations" : "dev_user_feeds"
export const MEMBERSHIP_TIERS_TABLE = IS_PROD ? "tbl_memberships_tiers" : "dev_tbl_memberships_tiers"
export const MEMBERSHIP_TABLE = IS_PROD ? "tbl_memberships" : "dev_tbl_memberships"
// views
const USER_FEED_VIEW = IS_PROD ? "user_feeds" : "dev_user_feeds"
const TOP_DONATIONS_VIEW = IS_PROD ? "top_donations" : "dev_top_donations"
export const POST_TABLE = IS_PROD ? "tbl_posts" : "dev_tbl_posts"

export type PostModel = {
  authorId: number | undefined
  content: string
  imageUrls: string[]
  postAddress?: string
  signature: string
  metadataUri: string
  audience: string
  minMembershipTier?: number
}

class Supabase {
  client: SupabaseClient<Database>

  constructor() {
    this.client = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
    )
  }

  // users
  async findUserByWallet(wallet: string) {
    const { data, error } = await this.client.from(USERS_TABLE).select("*").eq("wallet", wallet).single()
    if (!data || error) throw error
    return data
  }

  async findUserUsername(username: string) {
    const { data, error } = await this.client.from(USERS_TABLE).select("*").eq("domain_name", username).single()
    if (!data || error) return null
    return data
  }

  async findAllUser() {
    const { data, error } = await this.client
      .from(USERS_TABLE)
      .select("*")
      .not("domain_name", "is", null)
      .order("domain_name", { ascending: true })
    if (!data || error) throw error
    return data
  }

  async createUser(wallet: string) {
    const { data, error } = await this.client.from(USERS_TABLE).insert({ wallet }).select("*").single()
    if (!data || error) throw error
    return data
  }

  async updateUser(wallet: string, userData: Database["public"]["Tables"]["tbl_users"]["Update"]) {
    const { data, error } = await this.client
      .from(USERS_TABLE)
      .update(userData)
      .eq("wallet", wallet)
      .select("*")
      .single()
    if (!data || error) throw error
    return data
  }

  // donations

  async donate(
    donator: string,
    creatorId: number,
    name: string,
    message: string,
    numOfGm: number,
    amount: number,
    signature: string
  ) {
    const { data, error } = await this.client
      .from(DONATIONS_TABLE)
      .insert({
        creator_id: creatorId,
        donator,
        amount,
        signature,
        name,
        message,
        num_of_gm: numOfGm,
      })
      .select("*")
      .single()
    if (!data || error) throw error
    return data
  }

  async findDonationByCreator(creator: string) {
    const { data, error } = await this.client
      .from(USER_FEED_VIEW)
      .select("*")
      .eq("creator_id", creator)
      .order("created_at", { ascending: false })
    if (!data || error) throw error
    return data
  }

  async getSupportersByCreator(creator: string) {
    const { data, error } = await this.client.from(TOP_DONATIONS_VIEW).select("*").eq("creator_id", creator)
    if (!data || error) throw error
    return data
  }

  // membership tiers
  async findMembershipTierByCreator(creator: string) {
    const { data, error } = await this.client
      .from(MEMBERSHIP_TIERS_TABLE)
      .select("*")
      .eq("creator_id", creator)
      .order("created_at", { ascending: false })
    if (!data || error) throw error
    return data
  }

  async createMembershipTier(
    creatorId: number,
    name: string,
    description: string,
    benefit: string,
    price: number,
    image: string,
    address: string,
    signature: string
  ) {
    const { data, error } = await this.client
      .from(MEMBERSHIP_TIERS_TABLE)
      .insert({
        creator_id: creatorId,
        name,
        description,
        benefit,
        price,
        image,
        mint_address: address,
        signature,
      })
      .select("*")
      .single()
    if (!data || error) throw error
    return data
  }

  // memberships
  async createMembership(tierId: string, member: string, address: string, signature: string) {
    const { data, error } = await this.client
      .from(MEMBERSHIP_TABLE)
      .insert({
        tier_id: tierId,
        member,
        mint_address: address,
        signature,
      })
      .select("*")
      .single()
    if (!data || error) throw error
    return data
  }

  async findMembershipsByWallet(wallet: string) {
    const { data, error } = await this.client.from(MEMBERSHIP_TABLE).select("*").eq("member", wallet)
    if (!data || error) throw error
    return data
  }

  async findMembershipByCreator(creator: string) {
    const { data, error } = await this.client
      .from(MEMBERSHIP_TABLE)
      .select("*,dev_tbl_memberships_tiers(*)")
      .eq("dev_tbl_memberships_tiers.creator_id", creator)
    if (!data || error) throw error
    return data
  }

  //posts
  async createPost(params: PostModel) {
    const { authorId, content, imageUrls, postAddress, signature, metadataUri, audience, minMembershipTier } = params
    if (!authorId) throw new Error("Invalid author")
    const { data, error } = await this.client.from(POST_TABLE).insert({
      author_id: authorId,
      content,
      image_urls: imageUrls,
      post_address: postAddress,
      signature,
      post_metadata_uri: metadataUri,
      audience,
      min_membership_tier: minMembershipTier,
    })
    if (!data || error) throw error
    return data
  }

  async findPostsByCreator(creator: string) {
    const { data, error } = await this.client
      .from(POST_TABLE)
      .select("*")
      .eq("author_id", creator)
      .order("created_at", { ascending: false })
    if (!data || error) throw error
    return data
  }

  // misc
  uploadFile = async (filename: string, file: File) => {
    const { data, error } = await this.client.storage.from("minions").upload(filename, file, {
      upsert: true,
    })
    if (!data || error) {
      return { data, error }
    }
    return this.client.storage.from("minions").getPublicUrl(filename)
  }
}

export default new Supabase()
