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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          checked_in: boolean
          created_at: string
          event_id: string
          id: string
          looking_for_buddy: boolean
          used_pass: boolean
          user_id: string
        }
        Insert: {
          checked_in?: boolean
          created_at?: string
          event_id: string
          id?: string
          looking_for_buddy?: boolean
          used_pass?: boolean
          user_id: string
        }
        Update: {
          checked_in?: boolean
          created_at?: string
          event_id?: string
          id?: string
          looking_for_buddy?: boolean
          used_pass?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      corporate_profiles: {
        Row: {
          company_name: string
          created_at: string
          csr_budget_quarter: number | null
          csr_spent_quarter: number | null
          industry: string | null
          is_premium: boolean
          logo_url: string | null
          user_id: string
        }
        Insert: {
          company_name?: string
          created_at?: string
          csr_budget_quarter?: number | null
          csr_spent_quarter?: number | null
          industry?: string | null
          is_premium?: boolean
          logo_url?: string | null
          user_id: string
        }
        Update: {
          company_name?: string
          created_at?: string
          csr_budget_quarter?: number | null
          csr_spent_quarter?: number | null
          industry?: string | null
          is_premium?: boolean
          logo_url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          capacity: number
          cause: string
          cover_emoji: string | null
          created_at: string
          description: string | null
          duration_min: number
          id: string
          organizer_id: string | null
          price: number
          sponsor_id: string | null
          starts_at: string
          status: Database["public"]["Enums"]["event_status"]
          tags: string[] | null
          title: string
          venue_id: string | null
        }
        Insert: {
          capacity?: number
          cause?: string
          cover_emoji?: string | null
          created_at?: string
          description?: string | null
          duration_min?: number
          id?: string
          organizer_id?: string | null
          price?: number
          sponsor_id?: string | null
          starts_at: string
          status?: Database["public"]["Enums"]["event_status"]
          tags?: string[] | null
          title: string
          venue_id?: string | null
        }
        Update: {
          capacity?: number
          cause?: string
          cover_emoji?: string | null
          created_at?: string
          description?: string | null
          duration_min?: number
          id?: string
          organizer_id?: string | null
          price?: number
          sponsor_id?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["event_status"]
          tags?: string[] | null
          title?: string
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          comment: string | null
          created_at: string
          crowd_rating: number
          event_id: string
          event_rating: number
          id: string
          organizer_rating: number
          user_id: string
          venue_rating: number
        }
        Insert: {
          comment?: string | null
          created_at?: string
          crowd_rating: number
          event_id: string
          event_rating: number
          id?: string
          organizer_rating: number
          user_id: string
          venue_rating: number
        }
        Update: {
          comment?: string | null
          created_at?: string
          crowd_rating?: number
          event_id?: string
          event_rating?: number
          id?: string
          organizer_rating?: number
          user_id?: string
          venue_rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "feedback_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      impact_log: {
        Row: {
          created_at: string
          event_id: string | null
          hours: number
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          hours?: number
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string | null
          hours?: number
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "impact_log_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      manager_profiles: {
        Row: {
          company_name: string | null
          created_at: string
          events_run: number
          is_premium: boolean
          pricing_tier: string | null
          rating: number | null
          scale: string | null
          specializations: string[] | null
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          events_run?: number
          is_premium?: boolean
          pricing_tier?: string | null
          rating?: number | null
          scale?: string | null
          specializations?: string[] | null
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          events_run?: number
          is_premium?: boolean
          pricing_tier?: string | null
          rating?: number | null
          scale?: string | null
          specializations?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      organizer_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          organizer_id: string
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          organizer_id: string
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          organizer_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: []
      }
      passes: {
        Row: {
          created_at: string
          credits_total: number
          credits_used: number
          id: string
          tier: string
          user_id: string
          valid_until: string
        }
        Insert: {
          created_at?: string
          credits_total?: number
          credits_used?: number
          id?: string
          tier?: string
          user_id: string
          valid_until?: string
        }
        Update: {
          created_at?: string
          credits_total?: number
          credits_used?: number
          id?: string
          tier?: string
          user_id?: string
          valid_until?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          buddy_mode: boolean
          city: string | null
          created_at: string
          full_name: string | null
          id: string
          interests: string[] | null
          is_aadhaar_verified: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          buddy_mode?: boolean
          city?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          interests?: string[] | null
          is_aadhaar_verified?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          buddy_mode?: boolean
          city?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          interests?: string[] | null
          is_aadhaar_verified?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      space_suggestions: {
        Row: {
          address: string
          created_at: string
          id: string
          name: string
          notes: string | null
          status: Database["public"]["Enums"]["suggestion_status"]
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          status?: Database["public"]["Enums"]["suggestion_status"]
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["suggestion_status"]
          user_id?: string
        }
        Relationships: []
      }
      sponsorships: {
        Row: {
          amount: number
          corporate_id: string
          created_at: string
          engagement_level: Database["public"]["Enums"]["engagement_level"]
          event_id: string
          id: string
        }
        Insert: {
          amount?: number
          corporate_id: string
          created_at?: string
          engagement_level?: Database["public"]["Enums"]["engagement_level"]
          event_id: string
          id?: string
        }
        Update: {
          amount?: number
          corporate_id?: string
          created_at?: string
          engagement_level?: Database["public"]["Enums"]["engagement_level"]
          event_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sponsorships_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          address: string
          capacity: number | null
          created_at: string
          id: string
          is_public_space: boolean
          name: string
          neighborhood: string | null
          suggested_by: string | null
          type: string
        }
        Insert: {
          address: string
          capacity?: number | null
          created_at?: string
          id?: string
          is_public_space?: boolean
          name: string
          neighborhood?: string | null
          suggested_by?: string | null
          type?: string
        }
        Update: {
          address?: string
          capacity?: number | null
          created_at?: string
          id?: string
          is_public_space?: boolean
          name?: string
          neighborhood?: string | null
          suggested_by?: string | null
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "individual" | "manager" | "corporate" | "admin"
      engagement_level: "data_only" | "venues_only" | "full_service"
      event_status: "draft" | "published" | "cancelled" | "completed"
      suggestion_status: "pending" | "approved" | "rejected"
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
    Enums: {
      app_role: ["individual", "manager", "corporate", "admin"],
      engagement_level: ["data_only", "venues_only", "full_service"],
      event_status: ["draft", "published", "cancelled", "completed"],
      suggestion_status: ["pending", "approved", "rejected"],
    },
  },
} as const
