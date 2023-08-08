import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { Database } from "@/types/supabase.types"

class Supabase {
  client: SupabaseClient<Database>

  constructor() {
    this.client = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
    )
  }

  async findUserByWallet(wallet: string) {
    const { data, error } = await this.client.from("tbl_users").select("*").eq("wallet", wallet).single()
    if (!data || error) throw error
    return data
  }

  async findUserUsername(username: string) {
    const { data, error } = await this.client.from("tbl_users").select("*").eq("domain_name", username).single()
    if (!data || error) throw error
    return data
  }

  async createUser(wallet: string) {
    const { data, error } = await this.client.from("tbl_users").insert({ wallet }).select("*").single()
    if (!data || error) throw error
    return data
  }

  async updateUser(wallet: string, userData: Database["public"]["Tables"]["tbl_users"]["Update"]) {
    const { data, error } = await this.client
      .from("tbl_users")
      .update(userData)
      .eq("wallet", wallet)
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
