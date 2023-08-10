import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { Database } from "@/types/supabase.types"
import { IS_PROD } from "@/utils/env"

const USERS_TABLE = IS_PROD ? "tbl_users" : "dev_tbl_users"
const DONATIONS_TABLE = IS_PROD ? "tbl_donation" : "dev_tbl_donations"
const MEMBERSHIPS_TABLE = IS_PROD ? "tbl_memberships" : "dev_tbl_memberships"

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
      .from(DONATIONS_TABLE)
      .select("*")
      .eq("creator_id", creator)
      .order("created_at", { ascending: false })
    if (!data || error) throw error
    return data
  }

  // memberships
  async findMembershipTierByCreator(creator: string) {
    const { data, error } = await this.client
      .from(MEMBERSHIPS_TABLE)
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
    image: string
  ) {
    const { data, error } = await this.client
      .from(MEMBERSHIPS_TABLE)
      .insert({
        creator_id: creatorId,
        name,
        description,
        benefit,
        price,
        image,
      })
      .select("*")
      .single()
    if (!data || error) throw error
    return data
  }

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
