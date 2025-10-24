export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      apps: {
        Row: {
          created_at: string
          id: string
          name: string
          platform: string
          platform_data: Json | null
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          platform: string
          platform_data?: Json | null
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          platform?: string
          platform_data?: Json | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "apps_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
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
          short_code: string
          slug: string
          social_meta: Json
          source: string | null
          updated_at: string
          workspace_id: string
        }
        Insert: {
          android_parameters: Json
          app_params: Json
          click_count?: number
          created_at?: string
          ios_parameters: Json
          short_code: string
          slug: string
          social_meta: Json
          source?: string | null
          updated_at?: string
          workspace_id: string
        }
        Update: {
          android_parameters?: Json
          app_params?: Json
          click_count?: number
          created_at?: string
          ios_parameters?: Json
          short_code?: string
          slug?: string
          social_meta?: Json
          source?: string | null
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deeplinks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
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
          user_id: string | null
          workspace_id: string | null
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
          user_id?: string | null
          workspace_id?: string | null
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
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_memberships: {
        Row: {
          accepted_at: string
          id: string
          invitation_token: string | null
          invited_at: string
          invited_by: string
          role: string
          status: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          accepted_at: string
          id?: string
          invitation_token?: string | null
          invited_at?: string
          invited_by: string
          role: string
          status: string
          user_id: string
          workspace_id: string
        }
        Update: {
          accepted_at?: string
          id?: string
          invitation_token?: string | null
          invited_at?: string
          invited_by?: string
          role?: string
          status?: string
          user_id?: string
          workspace_id?: string
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
            foreignKeyName: "project_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_memberships_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          active_subscription_id: string | null
          api_key: string | null
          client_key: string | null
          created_at: string
          current_monthly_click_count: number
          current_monthly_create_count: number
          description: string | null
          id: string
          name: string
          next_quota_update_at: string | null
          next_subscription_update_at: string | null
          owner_id: string
          sub_domain: string
          subscription_status: string | null
          subscription_tier: string | null
        }
        Insert: {
          active_subscription_id?: string | null
          api_key?: string | null
          client_key?: string | null
          created_at?: string
          current_monthly_click_count?: number
          current_monthly_create_count?: number
          description?: string | null
          id?: string
          name: string
          next_quota_update_at?: string | null
          next_subscription_update_at?: string | null
          owner_id: string
          sub_domain: string
          subscription_status?: string | null
          subscription_tier?: string | null
        }
        Update: {
          active_subscription_id?: string | null
          api_key?: string | null
          client_key?: string | null
          created_at?: string
          current_monthly_click_count?: number
          current_monthly_create_count?: number
          description?: string | null
          id?: string
          name?: string
          next_quota_update_at?: string | null
          next_subscription_update_at?: string | null
          owner_id?: string
          sub_domain?: string
          subscription_status?: string | null
          subscription_tier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_active_subscription_id_fkey"
            columns: ["active_subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspaces_owner_id_fkey"
            columns: ["owner_id"]
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
      increment_click_count: {
        Args: { p_short_code: string; p_workspace_id: string }
        Returns: undefined
      }
      increment_workspace_click: {
        Args: { p_workspace_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
