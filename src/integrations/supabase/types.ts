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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      compound_items: {
        Row: {
          compound_prescription_id: string
          created_at: string
          id: string
          medicine_id: string
          quantity: number
          unit: string
        }
        Insert: {
          compound_prescription_id: string
          created_at?: string
          id?: string
          medicine_id: string
          quantity?: number
          unit: string
        }
        Update: {
          compound_prescription_id?: string
          created_at?: string
          id?: string
          medicine_id?: string
          quantity?: number
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "compound_items_compound_prescription_id_fkey"
            columns: ["compound_prescription_id"]
            isOneToOne: false
            referencedRelation: "compound_prescriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compound_items_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
        ]
      }
      compound_prescriptions: {
        Row: {
          created_at: string
          dosage: string
          form: string
          id: string
          instructions: string | null
          service_fee: number
          subtotal: number
          total_amount: number
          transaction_id: string
        }
        Insert: {
          created_at?: string
          dosage: string
          form: string
          id?: string
          instructions?: string | null
          service_fee?: number
          subtotal?: number
          total_amount?: number
          transaction_id: string
        }
        Update: {
          created_at?: string
          dosage?: string
          form?: string
          id?: string
          instructions?: string | null
          service_fee?: number
          subtotal?: number
          total_amount?: number
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compound_prescriptions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          created_at: string
          hospital: string
          id: string
          name: string
          sip_number: string
          specialization: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          hospital: string
          id?: string
          name: string
          sip_number: string
          specialization: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          hospital?: string
          id?: string
          name?: string
          sip_number?: string
          specialization?: string
          updated_at?: string
        }
        Relationships: []
      }
      medicines: {
        Row: {
          category: string
          created_at: string
          generic_name: string
          id: string
          name: string
          price: number
          stock: number
          unit: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          generic_name: string
          id?: string
          name: string
          price?: number
          stock?: number
          unit: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          generic_name?: string
          id?: string
          name?: string
          price?: number
          stock?: number
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      patients: {
        Row: {
          address: string | null
          birth_date: string | null
          created_at: string
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      prescription_items: {
        Row: {
          created_at: string
          dosage: string
          id: string
          instructions: string | null
          medicine_id: string
          quantity: number
          subtotal: number
          transaction_id: string
        }
        Insert: {
          created_at?: string
          dosage: string
          id?: string
          instructions?: string | null
          medicine_id: string
          quantity?: number
          subtotal?: number
          transaction_id: string
        }
        Update: {
          created_at?: string
          dosage?: string
          id?: string
          instructions?: string | null
          medicine_id?: string
          quantity?: number
          subtotal?: number
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescription_items_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescription_items_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_opname: {
        Row: {
          actual_stock: number
          created_at: string
          difference: number
          id: string
          medicine_id: string
          notes: string | null
          opname_date: string
          system_stock: number
        }
        Insert: {
          actual_stock: number
          created_at?: string
          difference: number
          id?: string
          medicine_id: string
          notes?: string | null
          opname_date?: string
          system_stock: number
        }
        Update: {
          actual_stock?: number
          created_at?: string
          difference?: number
          id?: string
          medicine_id?: string
          notes?: string | null
          opname_date?: string
          system_stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "stock_opname_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          created_at: string
          date: string
          doctor_id: string
          id: string
          notes: string | null
          patient_id: string
          payment_status: string
          prescription_type: string
          service_fee: number
          subtotal: number
          total: number
          transaction_number: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date?: string
          doctor_id: string
          id?: string
          notes?: string | null
          patient_id: string
          payment_status?: string
          prescription_type: string
          service_fee?: number
          subtotal?: number
          total?: number
          transaction_number: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          doctor_id?: string
          id?: string
          notes?: string | null
          patient_id?: string
          payment_status?: string
          prescription_type?: string
          service_fee?: number
          subtotal?: number
          total?: number
          transaction_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
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
      is_authenticated: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "pharmacist" | "staff"
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
      app_role: ["admin", "pharmacist", "staff"],
    },
  },
} as const
