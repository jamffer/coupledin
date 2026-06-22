export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      cards: {
        Row: {
          card_type: string;
          closing_day: number;
          color: string | null;
          couple_id: string | null;
          created_at: string;
          due_day: number;
          id: string;
          last_four: string | null;
          limit_amount: number;
          name: string;
          owner_id: string;
          updated_at: string;
        };
        Insert: {
          card_type: string;
          closing_day: number;
          color?: string | null;
          couple_id?: string | null;
          created_at?: string;
          due_day: number;
          id?: string;
          last_four?: string | null;
          limit_amount?: number;
          name: string;
          owner_id: string;
          updated_at?: string;
        };
        Update: {
          card_type?: string;
          closing_day?: number;
          color?: string | null;
          couple_id?: string | null;
          created_at?: string;
          due_day?: number;
          id?: string;
          last_four?: string | null;
          limit_amount?: number;
          name?: string;
          owner_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cards_couple_id_fkey";
            columns: ["couple_id"];
            isOneToOne: false;
            referencedRelation: "couples";
            referencedColumns: ["id"];
          },
        ];
      };
      budgets: {
        Row: {
          category: string;
          couple_id: string;
          created_at: string;
          id: string;
          monthly_limit: number;
          updated_at: string;
        };
        Insert: {
          category: string;
          couple_id: string;
          created_at?: string;
          id?: string;
          monthly_limit: number;
          updated_at?: string;
        };
        Update: {
          category?: string;
          couple_id?: string;
          created_at?: string;
          id?: string;
          monthly_limit?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      card_payments: {
        Row: {
          amount: number;
          billing_month: string;
          card_id: string;
          couple_id: string;
          id: string;
          paid_at: string;
          paid_by: string;
        };
        Insert: {
          amount: number;
          billing_month: string;
          card_id: string;
          couple_id: string;
          id?: string;
          paid_at?: string;
          paid_by?: string;
        };
        Update: {
          amount?: number;
          billing_month?: string;
          card_id?: string;
          couple_id?: string;
          id?: string;
          paid_at?: string;
          paid_by?: string;
        };
        Relationships: [];
      };
      couples: {
        Row: {
          created_at: string;
          id: string;
          invite_code: string;
          name: string | null;
          settings: Json | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          invite_code?: string;
          name?: string | null;
          settings?: Json | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          invite_code?: string;
          name?: string | null;
          settings?: Json | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      goals: {
        Row: {
          couple_id: string;
          created_at: string;
          deadline: string | null;
          id: string;
          image_url: string | null;
          saved_amount: number | null;
          target_amount: number;
          title: string;
        };
        Insert: {
          couple_id: string;
          created_at?: string;
          deadline?: string | null;
          id?: string;
          image_url?: string | null;
          saved_amount?: number | null;
          target_amount: number;
          title: string;
        };
        Update: {
          couple_id?: string;
          created_at?: string;
          deadline?: string | null;
          id?: string;
          image_url?: string | null;
          saved_amount?: number | null;
          target_amount?: number;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "goals_couple_id_fkey";
            columns: ["couple_id"];
            isOneToOne: false;
            referencedRelation: "couples";
            referencedColumns: ["id"];
          },
        ];
      };
      goal_investments: {
        Row: {
          couple_id: string;
          created_at: string;
          goal_id: string;
          id: string;
          investment_id: string;
        };
        Insert: {
          couple_id: string;
          created_at?: string;
          goal_id: string;
          id?: string;
          investment_id: string;
        };
        Update: {
          couple_id?: string;
          created_at?: string;
          goal_id?: string;
          id?: string;
          investment_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "goal_investments_couple_id_fkey";
            columns: ["couple_id"];
            isOneToOne: false;
            referencedRelation: "couples";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "goal_investments_goal_id_fkey";
            columns: ["goal_id"];
            isOneToOne: false;
            referencedRelation: "goals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "goal_investments_investment_id_fkey";
            columns: ["investment_id"];
            isOneToOne: false;
            referencedRelation: "investments";
            referencedColumns: ["id"];
          },
        ];
      };
      investments: {
        Row: {
          asset_type: Database["public"]["Enums"]["asset_type"];
          average_price: number;
          couple_id: string;
          created_at: string;
          custom_rate: number | null;
          id: string;
          investment_behavior: Database["public"]["Enums"]["investment_behavior"];
          purchase_date: string;
          quantity: number;
          ticker: string;
          updated_at: string;
        };
        Insert: {
          asset_type: Database["public"]["Enums"]["asset_type"];
          average_price: number;
          couple_id: string;
          created_at?: string;
          custom_rate?: number | null;
          id?: string;
          investment_behavior?: Database["public"]["Enums"]["investment_behavior"];
          purchase_date?: string;
          quantity: number;
          ticker: string;
          updated_at?: string;
        };
        Update: {
          asset_type?: Database["public"]["Enums"]["asset_type"];
          average_price?: number;
          couple_id?: string;
          created_at?: string;
          custom_rate?: number | null;
          id?: string;
          investment_behavior?: Database["public"]["Enums"]["investment_behavior"];
          purchase_date?: string;
          quantity?: number;
          ticker?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "investments_couple_id_fkey";
            columns: ["couple_id"];
            isOneToOne: false;
            referencedRelation: "couples";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          couple_id: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          couple_id?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          couple_id?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_couple_id_fkey";
            columns: ["couple_id"];
            isOneToOne: false;
            referencedRelation: "couples";
            referencedColumns: ["id"];
          },
        ];
      };
      settlements: {
        Row: {
          amount: number;
          couple_id: string;
          created_by: string;
          id: string;
          month: string;
          payer_id: string;
          receiver_id: string;
          settled_at: string;
        };
        Insert: {
          amount: number;
          couple_id: string;
          created_by?: string;
          id?: string;
          month: string;
          payer_id: string;
          receiver_id: string;
          settled_at?: string;
        };
        Update: {
          amount?: number;
          couple_id?: string;
          created_by?: string;
          id?: string;
          month?: string;
          payer_id?: string;
          receiver_id?: string;
          settled_at?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          amount: number;
          billing_date: string | null;
          card_id: string | null;
          category: string;
          couple_id: string;
          created_at: string;
          date: string;
          description: string;
          division: string;
          goal_id: string | null;
          id: string;
          is_recurring: boolean;
          generated_for_month: string | null;
          notes: string | null;
          recurrence_day: number | null;
          recurrence_parent_id: string | null;
          recurrence_rule: string | null;
          recurrence_status: string;
          responsible: string;
          responsible_id: string | null;
          type: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          billing_date?: string | null;
          card_id?: string | null;
          category: string;
          couple_id: string;
          created_at?: string;
          date?: string;
          description: string;
          division: string;
          goal_id?: string | null;
          id?: string;
          is_recurring?: boolean;
          generated_for_month?: string | null;
          notes?: string | null;
          recurrence_day?: number | null;
          recurrence_parent_id?: string | null;
          recurrence_rule?: string | null;
          recurrence_status?: string;
          responsible: string;
          responsible_id?: string | null;
          type: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          billing_date?: string | null;
          card_id?: string | null;
          category?: string;
          couple_id?: string;
          created_at?: string;
          date?: string;
          description?: string;
          division?: string;
          goal_id?: string | null;
          id?: string;
          is_recurring?: boolean;
          generated_for_month?: string | null;
          notes?: string | null;
          recurrence_day?: number | null;
          recurrence_parent_id?: string | null;
          recurrence_rule?: string | null;
          recurrence_status?: string;
          responsible?: string;
          responsible_id?: string | null;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_card_id_fkey";
            columns: ["card_id"];
            isOneToOne: false;
            referencedRelation: "cards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_couple_id_fkey";
            columns: ["couple_id"];
            isOneToOne: false;
            referencedRelation: "couples";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_goal_id_fkey";
            columns: ["goal_id"];
            isOneToOne: false;
            referencedRelation: "goals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_couple: { Args: { _name: string }; Returns: string };
      get_active_transaction_months: {
        Args: { _couple_id: string };
        Returns: {
          month: number;
          year: number;
        }[];
      };
      get_my_couple_id: { Args: never; Returns: string };
      get_my_invite_code: { Args: never; Returns: string };
      join_couple_with_invite: {
        Args: { _invite_code: string };
        Returns: string;
      };
    };
    Enums: {
      asset_type: "STOCK" | "FII" | "CRYPTO" | "FIXED_INCOME";
      investment_behavior:
        | "DISTRIBUTES_INCOME"
        | "ACCUMULATES_VALUE"
        | "REINVESTS_AUTOMATICALLY"
        | "FIXED_INCOME_MATURITY"
        | "CRYPTOASSET"
        | "OTHER";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      asset_type: ["STOCK", "FII", "CRYPTO", "FIXED_INCOME"],
      investment_behavior: [
        "DISTRIBUTES_INCOME",
        "ACCUMULATES_VALUE",
        "REINVESTS_AUTOMATICALLY",
        "FIXED_INCOME_MATURITY",
        "CRYPTOASSET",
        "OTHER",
      ],
    },
  },
} as const;
