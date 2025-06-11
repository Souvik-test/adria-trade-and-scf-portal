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
      invoice_line_items: {
        Row: {
          created_at: string | null
          description: string
          id: string
          invoice_id: string | null
          line_total: number
          quantity: number
          tax_rate: number | null
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          invoice_id?: string | null
          line_total: number
          quantity: number
          tax_rate?: number | null
          unit_price: number
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          invoice_id?: string | null
          line_total?: number
          quantity?: number
          tax_rate?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_line_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string | null
          currency: string | null
          customer_address: string | null
          customer_contact: string | null
          customer_name: string | null
          discount_amount: number | null
          due_date: string | null
          id: string
          invoice_date: string | null
          invoice_number: string
          invoice_type: string
          notes: string | null
          payment_terms: string | null
          purchase_order_amount: number | null
          purchase_order_currency: string | null
          purchase_order_date: string | null
          purchase_order_number: string | null
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          total_amount: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          customer_address?: string | null
          customer_contact?: string | null
          customer_name?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number: string
          invoice_type: string
          notes?: string | null
          payment_terms?: string | null
          purchase_order_amount?: number | null
          purchase_order_currency?: string | null
          purchase_order_date?: string | null
          purchase_order_number?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          customer_address?: string | null
          customer_contact?: string | null
          customer_name?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string
          invoice_type?: string
          notes?: string | null
          payment_terms?: string | null
          purchase_order_amount?: number | null
          purchase_order_currency?: string | null
          purchase_order_date?: string | null
          purchase_order_number?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      popi_line_items: {
        Row: {
          created_at: string | null
          description: string
          discount: number | null
          id: string
          line_total: number
          proforma_invoice_id: string | null
          purchase_order_id: string | null
          quantity: number
          tax_rate: number | null
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          description: string
          discount?: number | null
          id?: string
          line_total: number
          proforma_invoice_id?: string | null
          purchase_order_id?: string | null
          quantity: number
          tax_rate?: number | null
          unit_price: number
        }
        Update: {
          created_at?: string | null
          description?: string
          discount?: number | null
          id?: string
          line_total?: number
          proforma_invoice_id?: string | null
          purchase_order_id?: string | null
          quantity?: number
          tax_rate?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "popi_line_items_proforma_invoice_id_fkey"
            columns: ["proforma_invoice_id"]
            isOneToOne: false
            referencedRelation: "proforma_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "popi_line_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      proforma_invoices: {
        Row: {
          bank_details: string | null
          billing_address: string | null
          buyer_id: string | null
          buyer_name: string | null
          created_at: string | null
          currency: string | null
          grand_total: number | null
          id: string
          notes: string | null
          payment_terms: string | null
          pi_date: string | null
          pi_number: string
          same_as_shipping: boolean | null
          shipping_address: string | null
          shipping_cost: number | null
          status: string | null
          subtotal: number | null
          terms_of_sale: string | null
          total_tax: number | null
          updated_at: string | null
          user_id: string | null
          valid_until_date: string | null
        }
        Insert: {
          bank_details?: string | null
          billing_address?: string | null
          buyer_id?: string | null
          buyer_name?: string | null
          created_at?: string | null
          currency?: string | null
          grand_total?: number | null
          id?: string
          notes?: string | null
          payment_terms?: string | null
          pi_date?: string | null
          pi_number: string
          same_as_shipping?: boolean | null
          shipping_address?: string | null
          shipping_cost?: number | null
          status?: string | null
          subtotal?: number | null
          terms_of_sale?: string | null
          total_tax?: number | null
          updated_at?: string | null
          user_id?: string | null
          valid_until_date?: string | null
        }
        Update: {
          bank_details?: string | null
          billing_address?: string | null
          buyer_id?: string | null
          buyer_name?: string | null
          created_at?: string | null
          currency?: string | null
          grand_total?: number | null
          id?: string
          notes?: string | null
          payment_terms?: string | null
          pi_date?: string | null
          pi_number?: string
          same_as_shipping?: boolean | null
          shipping_address?: string | null
          shipping_cost?: number | null
          status?: string | null
          subtotal?: number | null
          terms_of_sale?: string | null
          total_tax?: number | null
          updated_at?: string | null
          user_id?: string | null
          valid_until_date?: string | null
        }
        Relationships: []
      }
      purchase_orders: {
        Row: {
          bank_details: string | null
          billing_address: string | null
          created_at: string | null
          currency: string | null
          expected_delivery_date: string | null
          grand_total: number | null
          id: string
          notes: string | null
          payment_terms: string | null
          po_date: string | null
          po_number: string
          same_as_shipping: boolean | null
          shipping_address: string | null
          shipping_cost: number | null
          status: string | null
          subtotal: number | null
          terms_of_sale: string | null
          total_tax: number | null
          updated_at: string | null
          user_id: string | null
          vendor_supplier: string | null
        }
        Insert: {
          bank_details?: string | null
          billing_address?: string | null
          created_at?: string | null
          currency?: string | null
          expected_delivery_date?: string | null
          grand_total?: number | null
          id?: string
          notes?: string | null
          payment_terms?: string | null
          po_date?: string | null
          po_number: string
          same_as_shipping?: boolean | null
          shipping_address?: string | null
          shipping_cost?: number | null
          status?: string | null
          subtotal?: number | null
          terms_of_sale?: string | null
          total_tax?: number | null
          updated_at?: string | null
          user_id?: string | null
          vendor_supplier?: string | null
        }
        Update: {
          bank_details?: string | null
          billing_address?: string | null
          created_at?: string | null
          currency?: string | null
          expected_delivery_date?: string | null
          grand_total?: number | null
          id?: string
          notes?: string | null
          payment_terms?: string | null
          po_date?: string | null
          po_number?: string
          same_as_shipping?: boolean | null
          shipping_address?: string | null
          shipping_cost?: number | null
          status?: string | null
          subtotal?: number | null
          terms_of_sale?: string | null
          total_tax?: number | null
          updated_at?: string | null
          user_id?: string | null
          vendor_supplier?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          corporate_id: string | null
          created_at: string
          department: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          product_linkage: Database["public"]["Enums"]["product_type"][] | null
          role: string
          role_type: Database["public"]["Enums"]["user_role_type"] | null
          user_login_id: string | null
        }
        Insert: {
          corporate_id?: string | null
          created_at?: string
          department?: string | null
          email: string
          full_name: string
          id: string
          phone?: string | null
          product_linkage?: Database["public"]["Enums"]["product_type"][] | null
          role: string
          role_type?: Database["public"]["Enums"]["user_role_type"] | null
          user_login_id?: string | null
        }
        Update: {
          corporate_id?: string | null
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          product_linkage?: Database["public"]["Enums"]["product_type"][] | null
          role?: string
          role_type?: Database["public"]["Enums"]["user_role_type"] | null
          user_login_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      product_type:
        | "Import LC"
        | "Export LC"
        | "Import Bills"
        | "Export Bills"
        | "Outward BG/SBLC"
        | "Inward BG/SBLC"
        | "Shipping Guarantee"
        | "Import Loan"
        | "Export Loan"
      user_role_type: "Maker" | "Checker" | "Viewer" | "All"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      product_type: [
        "Import LC",
        "Export LC",
        "Import Bills",
        "Export Bills",
        "Outward BG/SBLC",
        "Inward BG/SBLC",
        "Shipping Guarantee",
        "Import Loan",
        "Export Loan",
      ],
      user_role_type: ["Maker", "Checker", "Viewer", "All"],
    },
  },
} as const
