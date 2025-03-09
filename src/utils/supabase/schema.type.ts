export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      apps: {
        Row: {
          created_at: string
          id: string
          name: string
          platform: string
          platform_data: Json | null
          project_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          platform: string
          platform_data?: Json | null
          project_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          platform?: string
          platform_data?: Json | null
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "apps_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      deeplinks: {
        Row: {
          android_parameters: Json
          app_params: Json
          click_count: number
          created_at: string
          ios_parameters: Json
          project_id: string
          short_code: string
          slug: string
          social_meta: Json
          sub_domain: string
          updated_at: string
        }
        Insert: {
          android_parameters: Json
          app_params: Json
          click_count?: number
          created_at?: string
          ios_parameters: Json
          project_id: string
          short_code: string
          slug: string
          social_meta: Json
          sub_domain: string
          updated_at?: string
        }
        Update: {
          android_parameters?: Json
          app_params?: Json
          click_count?: number
          created_at?: string
          ios_parameters?: Json
          project_id?: string
          short_code?: string
          slug?: string
          social_meta?: Json
          sub_domain?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deeplinks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string
          created_at: string
          email: string
          id: string
          user_name: string
        }
        Insert: {
          avatar_url: string
          created_at?: string
          email: string
          id?: string
          user_name: string
        }
        Update: {
          avatar_url?: string
          created_at?: string
          email?: string
          id?: string
          user_name?: string
        }
        Relationships: []
      }
      project_memberships: {
        Row: {
          accepted_at: string
          id: string
          invitation_token: string | null
          invited_at: string
          invited_by: string
          project_id: string
          role: string
          status: string
          user_id: string
        }
        Insert: {
          accepted_at: string
          id?: string
          invitation_token?: string | null
          invited_at?: string
          invited_by: string
          project_id: string
          role: string
          status: string
          user_id: string
        }
        Update: {
          accepted_at?: string
          id?: string
          invitation_token?: string | null
          invited_at?: string
          invited_by?: string
          project_id?: string
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_memberships_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_memberships_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          api_key: string | null
          client_key: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          owner_id: string
          sub_domain: string | null
        }
        Insert: {
          api_key?: string | null
          client_key?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_id: string
          sub_domain?: string | null
        }
        Update: {
          api_key?: string | null
          client_key?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          sub_domain?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          id: string
          paddle_customer_id: string
          price_id: string
          product_id: string
          scheduled_change: string | null
          subscription_id: string
          subscription_status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          paddle_customer_id: string
          price_id: string
          product_id: string
          scheduled_change?: string | null
          subscription_id: string
          subscription_status: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          paddle_customer_id?: string
          price_id?: string
          product_id?: string
          scheduled_change?: string | null
          subscription_id?: string
          subscription_status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
