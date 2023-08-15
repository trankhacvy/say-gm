import { createClient, SupabaseClient } from "@supabase/supabase-js"
import dayjs from "dayjs"
import { Database } from "@/types/supabase.types"
import { IS_PROD } from "@/utils/env"
import { AUDIENCE_OPTIONS_ENUM } from "../utils/constants"

export const USERS_TABLE = IS_PROD ? "tbl_users" : "dev_tbl_users"
export const DONATIONS_TABLE = IS_PROD ? "tbl_donations" : "dev_tbl_donations"
export const MEMBERSHIP_TIERS_TABLE = IS_PROD ? "tbl_memberships_tiers" : "dev_tbl_memberships_tiers"
export const MEMBERSHIP_TABLE = IS_PROD ? "tbl_memberships" : "dev_tbl_memberships"
export const DROPS_TABLE = IS_PROD ? "dev_tbl_drops" : "dev_tbl_drops"
// views
const USER_FEED_VIEW = IS_PROD ? "user_feeds" : "dev_user_feeds"
const TOP_DONATIONS_VIEW = IS_PROD ? "top_donations" : "dev_top_donations"
export const POST_TABLE = IS_PROD ? "tbl_posts" : "dev_tbl_posts"
export const REACTION_TABLE = IS_PROD ? "tbl_reactions" : "dev_tbl_reactions"

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

  async findMyMembership(creatorId: string, address: string) : Promise<any> {
    const { data, error } = await this.client
      .from(MEMBERSHIP_TIERS_TABLE)
      .select(`
        id,
        name,
        price,
        ${MEMBERSHIP_TABLE} (member)
      `)
      .eq("creator_id", creatorId)
      .eq(`${MEMBERSHIP_TABLE}.member`, "5AHKzmDcjeAAnafTivi5u7dWYw3jUQh2VBRDzSd9ztVr")
      .limit(1)
      .single();
    
    console.log('myMembership data', data);

    if (!data || error) return null

    return data;
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

  //reaction
  async createReaction(params: { reacter: string, postId: number }) {
    const { data, error } = await this.client.from(REACTION_TABLE).insert({
      reacter: params.reacter,
      post_id: params.postId,
    }).select("*").single()

    if (!data || error) throw error

    await this.client.rpc('incrementreactions', { x: 1, row_id: params.postId })
  }

  async removeReaction(params: { reacter: string, postId: number }) {
    await this.client.from(REACTION_TABLE)
      .delete()
      .eq("reacter", params.reacter)
      .eq("post_id", params.postId);

    await this.client.rpc('incrementreactions', { x: -1, row_id: params.postId })
  }

  async getLikedPostsByUser(user: string) {
    const { data, error } = await this.client.from(REACTION_TABLE)
      .select("*")
      .eq("reacter", user).order("created_at", { ascending: false });

    if (!data || error) throw error
    return data
  }

  // drops
  async createDrop(body: Database["public"]["Tables"]["dev_tbl_drops"]["Insert"]) {
    const { data, error } = await this.client.from(DROPS_TABLE).insert(body).select("*").single()
    if (!data || error) throw error
    return data
  }

  async findDropsByCreator(creator: string) {
    const { data, error } = await this.client
      .from(DROPS_TABLE)
      .select(`*,${MEMBERSHIP_TIERS_TABLE}(*)`)
      .eq("creator_id", creator)
      .order("created_at", { ascending: false })
    if (!data || error) throw error
    return data
  }

  async findPosts(creator: string, audiences = [AUDIENCE_OPTIONS_ENUM.public], userTier = 0) {
    const queryBuilder = this.client.from(POST_TABLE).select("*").eq("author_id", creator);
    if (audiences.includes(AUDIENCE_OPTIONS_ENUM.members)) {
      queryBuilder.or(`audience.in.(${[AUDIENCE_OPTIONS_ENUM.supporters,AUDIENCE_OPTIONS_ENUM.public]}),audience.eq.${AUDIENCE_OPTIONS_ENUM.members}&minimum_tier.lte.${userTier}`);
    } else {
      queryBuilder.in("audience", audiences);
    }

    const { data, error } = await queryBuilder.order("created_at", { ascending: false });

    if (!data || error) throw error
    return data
  }

  async getDonationInLastMonth(address: string) {
    const { data, error } = await this.client
      .from(DONATIONS_TABLE)
      .select("*")
      .eq("donator", address)
      .gte("created_at", dayjs().subtract(1, "month").toISOString())
      .order("created_at", { ascending: false })
      .limit(1).single();
    if (!data || error) return null

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
