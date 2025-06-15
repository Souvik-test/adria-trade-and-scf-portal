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
      custom_users: {
        Row: {
          corporate_id: string | null
          created_at: string | null
          full_name: string
          id: string
          password_hash: string
          product_linkage: Database["public"]["Enums"]["product_type"][] | null
          role_type: Database["public"]["Enums"]["user_role_type"] | null
          updated_at: string | null
          user_id: string
          user_login_id: string
        }
        Insert: {
          corporate_id?: string | null
          created_at?: string | null
          full_name: string
          id?: string
          password_hash: string
          product_linkage?: Database["public"]["Enums"]["product_type"][] | null
          role_type?: Database["public"]["Enums"]["user_role_type"] | null
          updated_at?: string | null
          user_id: string
          user_login_id: string
        }
        Update: {
          corporate_id?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          password_hash?: string
          product_linkage?: Database["public"]["Enums"]["product_type"][] | null
          role_type?: Database["public"]["Enums"]["user_role_type"] | null
          updated_at?: string | null
          user_id?: string
          user_login_id?: string
        }
        Relationships: []
      }
      export_lc_amendment_responses: {
        Row: {
          action: string
          additional_conditions: string | null
          amendment_number: string
          comments: string | null
          documents: Json | null
          id: string
          lc_amount: Json | null
          lc_reference: string
          parties: Json | null
          shipment: Json | null
          special_instructions: string | null
          status: string
          submitted_at: string
          user_id: string
        }
        Insert: {
          action: string
          additional_conditions?: string | null
          amendment_number: string
          comments?: string | null
          documents?: Json | null
          id?: string
          lc_amount?: Json | null
          lc_reference: string
          parties?: Json | null
          shipment?: Json | null
          special_instructions?: string | null
          status?: string
          submitted_at?: string
          user_id: string
        }
        Update: {
          action?: string
          additional_conditions?: string | null
          amendment_number?: string
          comments?: string | null
          documents?: Json | null
          id?: string
          lc_amount?: Json | null
          lc_reference?: string
          parties?: Json | null
          shipment?: Json | null
          special_instructions?: string | null
          status?: string
          submitted_at?: string
          user_id?: string
        }
        Relationships: []
      }
      export_lc_reviews: {
        Row: {
          action: string
          additional_conditions: string | null
          amount: number | null
          comments: string | null
          currency: string | null
          documents: Json | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          lc_amount: Json | null
          lc_reference: string
          parties: Json | null
          shipment: Json | null
          special_instructions: string | null
          status: string
          submitted_at: string | null
          user_id: string
        }
        Insert: {
          action: string
          additional_conditions?: string | null
          amount?: number | null
          comments?: string | null
          currency?: string | null
          documents?: Json | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          lc_amount?: Json | null
          lc_reference: string
          parties?: Json | null
          shipment?: Json | null
          special_instructions?: string | null
          status?: string
          submitted_at?: string | null
          user_id: string
        }
        Update: {
          action?: string
          additional_conditions?: string | null
          amount?: number | null
          comments?: string | null
          currency?: string | null
          documents?: Json | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          lc_amount?: Json | null
          lc_reference?: string
          parties?: Json | null
          shipment?: Json | null
          special_instructions?: string | null
          status?: string
          submitted_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      import_lc_requests: {
        Row: {
          additional_amount: number | null
          additional_conditions: string | null
          advising_bank_swift_code: string | null
          applicable_rules: string
          applicant_account_number: string | null
          applicant_address: string | null
          applicant_name: string | null
          available_by: string | null
          available_with: string | null
          beneficiary_address: string | null
          beneficiary_bank_address: string | null
          beneficiary_bank_name: string | null
          beneficiary_bank_swift_code: string | null
          beneficiary_name: string | null
          corporate_reference: string
          created_at: string | null
          currency: string | null
          description_of_goods: string | null
          expiry_date: string | null
          form_of_documentary_credit: string
          id: string
          is_transferable: boolean | null
          issue_date: string | null
          latest_shipment_date: string | null
          lc_amount: number | null
          lc_type: string | null
          partial_shipments_allowed: boolean | null
          place_of_expiry: string | null
          popi_number: string | null
          popi_type: string | null
          port_of_discharge: string | null
          port_of_loading: string | null
          presentation_period: string | null
          required_documents: string[] | null
          status: string | null
          tolerance: string | null
          transshipment_allowed: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          additional_amount?: number | null
          additional_conditions?: string | null
          advising_bank_swift_code?: string | null
          applicable_rules?: string
          applicant_account_number?: string | null
          applicant_address?: string | null
          applicant_name?: string | null
          available_by?: string | null
          available_with?: string | null
          beneficiary_address?: string | null
          beneficiary_bank_address?: string | null
          beneficiary_bank_name?: string | null
          beneficiary_bank_swift_code?: string | null
          beneficiary_name?: string | null
          corporate_reference: string
          created_at?: string | null
          currency?: string | null
          description_of_goods?: string | null
          expiry_date?: string | null
          form_of_documentary_credit: string
          id?: string
          is_transferable?: boolean | null
          issue_date?: string | null
          latest_shipment_date?: string | null
          lc_amount?: number | null
          lc_type?: string | null
          partial_shipments_allowed?: boolean | null
          place_of_expiry?: string | null
          popi_number?: string | null
          popi_type?: string | null
          port_of_discharge?: string | null
          port_of_loading?: string | null
          presentation_period?: string | null
          required_documents?: string[] | null
          status?: string | null
          tolerance?: string | null
          transshipment_allowed?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          additional_amount?: number | null
          additional_conditions?: string | null
          advising_bank_swift_code?: string | null
          applicable_rules?: string
          applicant_account_number?: string | null
          applicant_address?: string | null
          applicant_name?: string | null
          available_by?: string | null
          available_with?: string | null
          beneficiary_address?: string | null
          beneficiary_bank_address?: string | null
          beneficiary_bank_name?: string | null
          beneficiary_bank_swift_code?: string | null
          beneficiary_name?: string | null
          corporate_reference?: string
          created_at?: string | null
          currency?: string | null
          description_of_goods?: string | null
          expiry_date?: string | null
          form_of_documentary_credit?: string
          id?: string
          is_transferable?: boolean | null
          issue_date?: string | null
          latest_shipment_date?: string | null
          lc_amount?: number | null
          lc_type?: string | null
          partial_shipments_allowed?: boolean | null
          place_of_expiry?: string | null
          popi_number?: string | null
          popi_type?: string | null
          port_of_discharge?: string | null
          port_of_loading?: string | null
          presentation_period?: string | null
          required_documents?: string[] | null
          status?: string | null
          tolerance?: string | null
          transshipment_allowed?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      import_lc_supporting_documents: {
        Row: {
          file_name: string
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          import_lc_request_id: string
          uploaded_at: string | null
        }
        Insert: {
          file_name: string
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          import_lc_request_id: string
          uploaded_at?: string | null
        }
        Update: {
          file_name?: string
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          import_lc_request_id?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "import_lc_supporting_documents_import_lc_request_id_fkey"
            columns: ["import_lc_request_id"]
            isOneToOne: false
            referencedRelation: "import_lc_requests"
            referencedColumns: ["id"]
          },
        ]
      }
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
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          timestamp: string
          transaction_ref: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          timestamp?: string
          transaction_ref: string
          transaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          timestamp?: string
          transaction_ref?: string
          transaction_type?: string
          user_id?: string
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
      transactions: {
        Row: {
          amount: number | null
          bank_ref: string | null
          created_at: string
          created_by: string
          created_date: string
          currency: string | null
          customer_name: string | null
          customer_ref: string | null
          id: string
          initiating_channel: string | null
          operations: string | null
          party_form: string | null
          process_type: string | null
          product_type: string
          status: string
          transaction_ref: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          bank_ref?: string | null
          created_at?: string
          created_by: string
          created_date?: string
          currency?: string | null
          customer_name?: string | null
          customer_ref?: string | null
          id?: string
          initiating_channel?: string | null
          operations?: string | null
          party_form?: string | null
          process_type?: string | null
          product_type: string
          status?: string
          transaction_ref: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number | null
          bank_ref?: string | null
          created_at?: string
          created_by?: string
          created_date?: string
          currency?: string | null
          customer_name?: string | null
          customer_ref?: string | null
          id?: string
          initiating_channel?: string | null
          operations?: string | null
          party_form?: string | null
          process_type?: string | null
          product_type?: string
          status?: string
          transaction_ref?: string
          updated_at?: string
          user_id?: string
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
      generate_transaction_ref: {
        Args: { product_type: string }
        Returns: string
      }
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
