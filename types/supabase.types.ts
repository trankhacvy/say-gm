export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      dev_tbl_donations: {
        Row: {
          amount: number | null
          created_at: string
          creator_id: number | null
          donator: string | null
          id: string
          message: string | null
          name: string | null
          num_of_gm: number | null
          signature: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          creator_id?: number | null
          donator?: string | null
          id?: string
          message?: string | null
          name?: string | null
          num_of_gm?: number | null
          signature?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          creator_id?: number | null
          donator?: string | null
          id?: string
          message?: string | null
          name?: string | null
          num_of_gm?: number | null
          signature?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dev_tbl_donations_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "dev_tbl_users"
            referencedColumns: ["id"]
          }
        ]
      }
      dev_tbl_memberships: {
        Row: {
          created_at: string
          id: string
          member: string | null
          mint_address: string | null
          signature: string | null
          tier_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          member?: string | null
          mint_address?: string | null
          signature?: string | null
          tier_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          member?: string | null
          mint_address?: string | null
          signature?: string | null
          tier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dev_tbl_memberships_tier_id_fkey"
            columns: ["tier_id"]
            referencedRelation: "dev_tbl_memberships_tiers"
            referencedColumns: ["id"]
          }
        ]
      }
      dev_tbl_memberships_tiers: {
        Row: {
          benefit: string | null
          created_at: string
          creator_id: number | null
          description: string | null
          id: string
          image: string | null
          mint_address: string | null
          name: string | null
          price: number | null
          signature: string | null
        }
        Insert: {
          benefit?: string | null
          created_at?: string
          creator_id?: number | null
          description?: string | null
          id?: string
          image?: string | null
          mint_address?: string | null
          name?: string | null
          price?: number | null
          signature?: string | null
        }
        Update: {
          benefit?: string | null
          created_at?: string
          creator_id?: number | null
          description?: string | null
          id?: string
          image?: string | null
          mint_address?: string | null
          name?: string | null
          price?: number | null
          signature?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dev_tbl_memberships_tiers_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "dev_tbl_users"
            referencedColumns: ["id"]
          }
        ]
      }
      dev_tbl_posts: {
        Row: {
          audience: string
          author_id: number
          content: string
          created_at: string
          id: number
          image_urls: string[] | null
          min_membership_tier: number | null
          post_address: string
          post_metadata_uri: string
          signature: string
          total_reactions: number
          updated_at: string
        }
        Insert: {
          audience: string
          author_id: number
          content?: string
          created_at?: string
          id?: number
          image_urls?: string[] | null
          min_membership_tier?: number | null
          post_address?: string
          post_metadata_uri: string
          signature?: string
          total_reactions?: number
          updated_at?: string
        }
        Update: {
          audience?: string
          author_id?: number
          content?: string
          created_at?: string
          id?: number
          image_urls?: string[] | null
          min_membership_tier?: number | null
          post_address?: string
          post_metadata_uri?: string
          signature?: string
          total_reactions?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dev_tbl_posts_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "dev_tbl_users"
            referencedColumns: ["id"]
          }
        ]
      }
      dev_tbl_users: {
        Row: {
          created_at: string | null
          domain_address: string | null
          domain_name: string | null
          id: number
          profile_address: string | null
          profile_metadata: Json | null
          profile_metadata_uri: string | null
          profile_screen_name: string | null
          wallet: string | null
        }
        Insert: {
          created_at?: string | null
          domain_address?: string | null
          domain_name?: string | null
          id?: number
          profile_address?: string | null
          profile_metadata?: Json | null
          profile_metadata_uri?: string | null
          profile_screen_name?: string | null
          wallet?: string | null
        }
        Update: {
          created_at?: string | null
          domain_address?: string | null
          domain_name?: string | null
          id?: number
          profile_address?: string | null
          profile_metadata?: Json | null
          profile_metadata_uri?: string | null
          profile_screen_name?: string | null
          wallet?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          expires: string
          id: string
          sessionToken: string
          userId: string | null
        }
        Insert: {
          expires: string
          id?: string
          sessionToken: string
          userId?: string | null
        }
        Update: {
          expires?: string
          id?: string
          sessionToken?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tbl_donations: {
        Row: {
          amount: number | null
          created_at: string
          creator_id: number | null
          donator: string | null
          id: string
          message: string | null
          name: string | null
          num_of_gm: number | null
          signature: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          creator_id?: number | null
          donator?: string | null
          id?: string
          message?: string | null
          name?: string | null
          num_of_gm?: number | null
          signature?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          creator_id?: number | null
          donator?: string | null
          id?: string
          message?: string | null
          name?: string | null
          num_of_gm?: number | null
          signature?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_donations_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "tbl_users"
            referencedColumns: ["id"]
          }
        ]
      }
      tbl_memberships: {
        Row: {
          created_at: string
          id: string
          member: string | null
          mint_address: string | null
          signature: string | null
          tier_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          member?: string | null
          mint_address?: string | null
          signature?: string | null
          tier_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          member?: string | null
          mint_address?: string | null
          signature?: string | null
          tier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_memberships_tier_id_fkey"
            columns: ["tier_id"]
            referencedRelation: "tbl_memberships_tiers"
            referencedColumns: ["id"]
          }
        ]
      }
      tbl_memberships_tiers: {
        Row: {
          benefit: string | null
          created_at: string
          creator_id: number | null
          description: string | null
          id: string
          image: string | null
          mint_address: string | null
          name: string | null
          price: number | null
          signature: string | null
        }
        Insert: {
          benefit?: string | null
          created_at?: string
          creator_id?: number | null
          description?: string | null
          id?: string
          image?: string | null
          mint_address?: string | null
          name?: string | null
          price?: number | null
          signature?: string | null
        }
        Update: {
          benefit?: string | null
          created_at?: string
          creator_id?: number | null
          description?: string | null
          id?: string
          image?: string | null
          mint_address?: string | null
          name?: string | null
          price?: number | null
          signature?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_memberships_tiers_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "tbl_users"
            referencedColumns: ["id"]
          }
        ]
      }
      tbl_posts: {
        Row: {
          audience: string
          author_id: number
          content: string
          created_at: string
          id: number
          image_urls: string[] | null
          min_membership_tier: number | null
          post_address: string
          post_metadata_uri: string
          signature: string
          total_reactions: number
          updated_at: string
        }
        Insert: {
          audience: string
          author_id: number
          content?: string
          created_at?: string
          id?: number
          image_urls?: string[] | null
          min_membership_tier?: number | null
          post_address?: string
          post_metadata_uri: string
          signature?: string
          total_reactions?: number
          updated_at?: string
        }
        Update: {
          audience?: string
          author_id?: number
          content?: string
          created_at?: string
          id?: number
          image_urls?: string[] | null
          min_membership_tier?: number | null
          post_address?: string
          post_metadata_uri?: string
          signature?: string
          total_reactions?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tbl_posts_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "tbl_users"
            referencedColumns: ["id"]
          }
        ]
      }
      tbl_users: {
        Row: {
          created_at: string | null
          domain_address: string | null
          domain_name: string | null
          id: number
          profile_address: string | null
          profile_metadata: Json | null
          profile_metadata_uri: string | null
          profile_screen_name: string | null
          wallet: string | null
        }
        Insert: {
          created_at?: string | null
          domain_address?: string | null
          domain_name?: string | null
          id?: number
          profile_address?: string | null
          profile_metadata?: Json | null
          profile_metadata_uri?: string | null
          profile_screen_name?: string | null
          wallet?: string | null
        }
        Update: {
          created_at?: string | null
          domain_address?: string | null
          domain_name?: string | null
          id?: number
          profile_address?: string | null
          profile_metadata?: Json | null
          profile_metadata_uri?: string | null
          profile_screen_name?: string | null
          wallet?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          email: string | null
          emailVerified: string | null
          id: string
          image: string | null
          name: string | null
        }
        Insert: {
          email?: string | null
          emailVerified?: string | null
          id?: string
          image?: string | null
          name?: string | null
        }
        Update: {
          email?: string | null
          emailVerified?: string | null
          id?: string
          image?: string | null
          name?: string | null
        }
        Relationships: []
      }
      verification_tokens: {
        Row: {
          expires: string
          identifier: string | null
          token: string
        }
        Insert: {
          expires: string
          identifier?: string | null
          token: string
        }
        Update: {
          expires?: string
          identifier?: string | null
          token?: string
        }
        Relationships: []
      }
    }
    Views: {
      dev_top_donations: {
        Row: {
          count_donation: number | null
          creator_id: number | null
          donator: string | null
          donator_avatar: string | null
          donator_username: string | null
          donator_wallet: string | null
          total_amount: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dev_tbl_donations_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "dev_tbl_users"
            referencedColumns: ["id"]
          }
        ]
      }
      dev_user_feeds: {
        Row: {
          amount: number | null
          created_at: string | null
          creator_id: number | null
          donator: string | null
          donator_avatar: string | null
          donator_username: string | null
          donator_wallet: string | null
          id: string | null
          message: string | null
          name: string | null
          num_of_gm: number | null
          signature: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dev_tbl_donations_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "dev_tbl_users"
            referencedColumns: ["id"]
          }
        ]
      }
      tbl_statistic_donate: {
        Row: {
          count_donation: number | null
          creator_id: number | null
          donator: string | null
          total_amount: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_donations_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "tbl_users"
            referencedColumns: ["id"]
          }
        ]
      }
      top_donations: {
        Row: {
          count_donation: number | null
          creator_id: number | null
          donator: string | null
          donator_avatar: string | null
          donator_username: string | null
          donator_wallet: string | null
          total_amount: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_donations_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "tbl_users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_feeds: {
        Row: {
          amount: number | null
          created_at: string | null
          creator_id: number | null
          donator: string | null
          donator_avatar: string | null
          donator_username: string | null
          donator_wallet: string | null
          id: string | null
          message: string | null
          name: string | null
          num_of_gm: number | null
          signature: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_donations_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "tbl_users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      get_donations_by_creator: {
        Args: {
          creator: number
        }
        Returns: {
          amount: number | null
          created_at: string
          creator_id: number | null
          donator: string | null
          id: string
          message: string | null
          name: string | null
          num_of_gm: number | null
          signature: string | null
        }[]
      }
      uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      product_status: "Draft" | "Active" | "Inactive"
      sale_status: "SUCCESS" | "FAILED" | "PROCESSING"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
