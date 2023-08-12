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
            referencedRelation: "tbl_users"
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
            referencedRelation: "tbl_users"
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
      tbl_donation: {
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
            foreignKeyName: "tbl_donation_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "tbl_users"
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
          name: string | null
          price: number | null
        }
        Insert: {
          benefit?: string | null
          created_at?: string
          creator_id?: number | null
          description?: string | null
          id?: string
          image?: string | null
          name?: string | null
          price?: number | null
        }
        Update: {
          benefit?: string | null
          created_at?: string
          creator_id?: number | null
          description?: string | null
          id?: string
          image?: string | null
          name?: string | null
          price?: number | null
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
      dev_tbl_statistic_donate: {
        Row: {
          count_donation: number | null
          creator_id: number | null
          donator: string | null
          total_amount: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dev_tbl_donations_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "tbl_users"
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
            foreignKeyName: "tbl_donation_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "tbl_users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
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
