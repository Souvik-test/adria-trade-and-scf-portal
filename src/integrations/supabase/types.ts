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
      assignment_requests: {
        Row: {
          amount: number | null
          applicant: string | null
          assignee_account_number: string | null
          assignee_address: string | null
          assignee_bank_address: string | null
          assignee_bank_name: string | null
          assignee_country: string | null
          assignee_name: string | null
          assignee_swift_code: string | null
          assignment_amount: number | null
          assignment_conditions: string | null
          assignment_percentage: number | null
          assignment_purpose: string | null
          assignment_type: string | null
          created_at: string | null
          currency: string | null
          current_beneficiary: string | null
          expiry_date: string | null
          id: string
          issuance_date: string | null
          issuing_bank: string | null
          lc_reference: string
          request_reference: string
          required_documents: string[] | null
          required_documents_checked: Json | null
          status: string | null
          supporting_documents: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          applicant?: string | null
          assignee_account_number?: string | null
          assignee_address?: string | null
          assignee_bank_address?: string | null
          assignee_bank_name?: string | null
          assignee_country?: string | null
          assignee_name?: string | null
          assignee_swift_code?: string | null
          assignment_amount?: number | null
          assignment_conditions?: string | null
          assignment_percentage?: number | null
          assignment_purpose?: string | null
          assignment_type?: string | null
          created_at?: string | null
          currency?: string | null
          current_beneficiary?: string | null
          expiry_date?: string | null
          id?: string
          issuance_date?: string | null
          issuing_bank?: string | null
          lc_reference: string
          request_reference: string
          required_documents?: string[] | null
          required_documents_checked?: Json | null
          status?: string | null
          supporting_documents?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          applicant?: string | null
          assignee_account_number?: string | null
          assignee_address?: string | null
          assignee_bank_address?: string | null
          assignee_bank_name?: string | null
          assignee_country?: string | null
          assignee_name?: string | null
          assignee_swift_code?: string | null
          assignment_amount?: number | null
          assignment_conditions?: string | null
          assignment_percentage?: number | null
          assignment_purpose?: string | null
          assignment_type?: string | null
          created_at?: string | null
          currency?: string | null
          current_beneficiary?: string | null
          expiry_date?: string | null
          id?: string
          issuance_date?: string | null
          issuing_bank?: string | null
          lc_reference?: string
          request_reference?: string
          required_documents?: string[] | null
          required_documents_checked?: Json | null
          status?: string | null
          supporting_documents?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
      export_lc_bill_documents: {
        Row: {
          document_name: string
          document_type: string
          export_lc_bill_id: string
          file_path: string | null
          file_size: number | null
          id: string
          uploaded_at: string
        }
        Insert: {
          document_name: string
          document_type: string
          export_lc_bill_id: string
          file_path?: string | null
          file_size?: number | null
          id?: string
          uploaded_at?: string
        }
        Update: {
          document_name?: string
          document_type?: string
          export_lc_bill_id?: string
          file_path?: string | null
          file_size?: number | null
          id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "export_lc_bill_documents_export_lc_bill_id_fkey"
            columns: ["export_lc_bill_id"]
            isOneToOne: false
            referencedRelation: "export_lc_bills"
            referencedColumns: ["id"]
          },
        ]
      }
      export_lc_bill_line_items: {
        Row: {
          created_at: string
          description: string
          export_lc_bill_id: string
          id: string
          line_total: number
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          export_lc_bill_id: string
          id?: string
          line_total: number
          quantity?: number
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string
          export_lc_bill_id?: string
          id?: string
          line_total?: number
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "export_lc_bill_line_items_export_lc_bill_id_fkey"
            columns: ["export_lc_bill_id"]
            isOneToOne: false
            referencedRelation: "export_lc_bills"
            referencedColumns: ["id"]
          },
        ]
      }
      export_lc_bills: {
        Row: {
          applicant_name: string | null
          bill_amount: number | null
          bill_currency: string | null
          bill_date: string | null
          bill_due_date: string | null
          bill_reference: string
          corporate_reference: string | null
          created_at: string
          id: string
          issuing_bank: string | null
          lc_amount: number | null
          lc_currency: string | null
          lc_expiry_date: string | null
          lc_expiry_place: string | null
          lc_reference: string
          status: string | null
          submission_type: string | null
          tenor: string | null
          tenor_days: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          applicant_name?: string | null
          bill_amount?: number | null
          bill_currency?: string | null
          bill_date?: string | null
          bill_due_date?: string | null
          bill_reference: string
          corporate_reference?: string | null
          created_at?: string
          id?: string
          issuing_bank?: string | null
          lc_amount?: number | null
          lc_currency?: string | null
          lc_expiry_date?: string | null
          lc_expiry_place?: string | null
          lc_reference: string
          status?: string | null
          submission_type?: string | null
          tenor?: string | null
          tenor_days?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          applicant_name?: string | null
          bill_amount?: number | null
          bill_currency?: string | null
          bill_date?: string | null
          bill_due_date?: string | null
          bill_reference?: string
          corporate_reference?: string | null
          created_at?: string
          id?: string
          issuing_bank?: string | null
          lc_amount?: number | null
          lc_currency?: string | null
          lc_expiry_date?: string | null
          lc_expiry_place?: string | null
          lc_reference?: string
          status?: string | null
          submission_type?: string | null
          tenor?: string | null
          tenor_days?: number | null
          updated_at?: string
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
          issuing_bank: string | null
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
          issuing_bank?: string | null
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
          issuing_bank?: string | null
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
          invoice_id: string
          line_total: number
          quantity: number
          tax_rate: number | null
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          invoice_id: string
          line_total: number
          quantity: number
          tax_rate?: number | null
          unit_price: number
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          invoice_id?: string
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
          user_id: string
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
          user_id: string
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
          user_id?: string
        }
        Relationships: []
      }
      inward_bg_amendment_consents: {
        Row: {
          amendment_number: string
          applicant_name: string | null
          beneficiary_name: string | null
          consent_action: string
          created_at: string
          currency: string | null
          expiry_date: string | null
          guarantee_amount: string | null
          guarantee_reference: string
          id: string
          individual_consents: Json
          issue_date: string | null
          issuing_bank: string | null
          rejection_reason: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amendment_number: string
          applicant_name?: string | null
          beneficiary_name?: string | null
          consent_action: string
          created_at?: string
          currency?: string | null
          expiry_date?: string | null
          guarantee_amount?: string | null
          guarantee_reference: string
          id?: string
          individual_consents?: Json
          issue_date?: string | null
          issuing_bank?: string | null
          rejection_reason?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amendment_number?: string
          applicant_name?: string | null
          beneficiary_name?: string | null
          consent_action?: string
          created_at?: string
          currency?: string | null
          expiry_date?: string | null
          guarantee_amount?: string | null
          guarantee_reference?: string
          id?: string
          individual_consents?: Json
          issue_date?: string | null
          issuing_bank?: string | null
          rejection_reason?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      inward_dc_bill_acceptance_refusal: {
        Row: {
          beneficiary_address: string | null
          beneficiary_name: string | null
          bill_reference: string
          collecting_bank: string | null
          collection_reference: string | null
          created_at: string
          currency: string | null
          decision: string | null
          discrepancies: Json | null
          document_value: number | null
          documents: Json | null
          id: string
          internal_notes: string | null
          maturity_date: string | null
          payment_terms: string | null
          principal_address: string | null
          principal_name: string | null
          remarks: string | null
          remitting_bank: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          beneficiary_address?: string | null
          beneficiary_name?: string | null
          bill_reference: string
          collecting_bank?: string | null
          collection_reference?: string | null
          created_at?: string
          currency?: string | null
          decision?: string | null
          discrepancies?: Json | null
          document_value?: number | null
          documents?: Json | null
          id?: string
          internal_notes?: string | null
          maturity_date?: string | null
          payment_terms?: string | null
          principal_address?: string | null
          principal_name?: string | null
          remarks?: string | null
          remitting_bank?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          beneficiary_address?: string | null
          beneficiary_name?: string | null
          bill_reference?: string
          collecting_bank?: string | null
          collection_reference?: string | null
          created_at?: string
          currency?: string | null
          decision?: string | null
          discrepancies?: Json | null
          document_value?: number | null
          documents?: Json | null
          id?: string
          internal_notes?: string | null
          maturity_date?: string | null
          payment_terms?: string | null
          principal_address?: string | null
          principal_name?: string | null
          remarks?: string | null
          remitting_bank?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      inward_dc_bill_payment_documents: {
        Row: {
          file_name: string
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          payment_id: string
          uploaded_at: string
        }
        Insert: {
          file_name: string
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          payment_id: string
          uploaded_at?: string
        }
        Update: {
          file_name?: string
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          payment_id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inward_dc_bill_payment_documents_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "inward_documentary_collection_bill_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      inward_documentary_collection_bill_payments: {
        Row: {
          advising_bank_address: string | null
          advising_bank_name: string | null
          advising_bank_swift_code: string | null
          amount: number | null
          beneficiary_account: string | null
          beneficiary_address: string | null
          beneficiary_name: string | null
          bill_reference: string | null
          collection_reference: string | null
          created_at: string
          currency: string | null
          drawee_name: string | null
          drawer_name: string | null
          id: string
          ordering_customer_account: string | null
          ordering_customer_address: string | null
          ordering_customer_name: string | null
          payment_date: string | null
          related_reference: string | null
          remittance_information: string | null
          sender_to_receiver_info: string | null
          status: string | null
          supporting_documents: Json | null
          transaction_reference: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          advising_bank_address?: string | null
          advising_bank_name?: string | null
          advising_bank_swift_code?: string | null
          amount?: number | null
          beneficiary_account?: string | null
          beneficiary_address?: string | null
          beneficiary_name?: string | null
          bill_reference?: string | null
          collection_reference?: string | null
          created_at?: string
          currency?: string | null
          drawee_name?: string | null
          drawer_name?: string | null
          id?: string
          ordering_customer_account?: string | null
          ordering_customer_address?: string | null
          ordering_customer_name?: string | null
          payment_date?: string | null
          related_reference?: string | null
          remittance_information?: string | null
          sender_to_receiver_info?: string | null
          status?: string | null
          supporting_documents?: Json | null
          transaction_reference?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          advising_bank_address?: string | null
          advising_bank_name?: string | null
          advising_bank_swift_code?: string | null
          amount?: number | null
          beneficiary_account?: string | null
          beneficiary_address?: string | null
          beneficiary_name?: string | null
          bill_reference?: string | null
          collection_reference?: string | null
          created_at?: string
          currency?: string | null
          drawee_name?: string | null
          drawer_name?: string | null
          id?: string
          ordering_customer_account?: string | null
          ordering_customer_address?: string | null
          ordering_customer_name?: string | null
          payment_date?: string | null
          related_reference?: string | null
          remittance_information?: string | null
          sender_to_receiver_info?: string | null
          status?: string | null
          supporting_documents?: Json | null
          transaction_reference?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lc_transfer_requests: {
        Row: {
          amount: number | null
          applicant: string | null
          created_at: string | null
          currency: string | null
          current_beneficiary: string | null
          expiry_date: string | null
          id: string
          issuance_date: string | null
          issuing_bank: string | null
          lc_reference: string
          new_beneficiaries: Json | null
          request_reference: string
          required_documents: string[] | null
          required_documents_checked: Json | null
          status: string | null
          supporting_documents: Json | null
          transfer_conditions: string | null
          transfer_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          applicant?: string | null
          created_at?: string | null
          currency?: string | null
          current_beneficiary?: string | null
          expiry_date?: string | null
          id?: string
          issuance_date?: string | null
          issuing_bank?: string | null
          lc_reference: string
          new_beneficiaries?: Json | null
          request_reference: string
          required_documents?: string[] | null
          required_documents_checked?: Json | null
          status?: string | null
          supporting_documents?: Json | null
          transfer_conditions?: string | null
          transfer_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          applicant?: string | null
          created_at?: string | null
          currency?: string | null
          current_beneficiary?: string | null
          expiry_date?: string | null
          id?: string
          issuance_date?: string | null
          issuing_bank?: string | null
          lc_reference?: string
          new_beneficiaries?: Json | null
          request_reference?: string
          required_documents?: string[] | null
          required_documents_checked?: Json | null
          status?: string | null
          supporting_documents?: Json | null
          transfer_conditions?: string | null
          transfer_type?: string | null
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
      outward_bg_requests: {
        Row: {
          applicable_rules: string | null
          applicant_account_number: string | null
          applicant_address: string | null
          applicant_name: string | null
          bank_operation_code: string | null
          beneficiary_address: string | null
          beneficiary_bank_address: string | null
          beneficiary_bank_name: string | null
          beneficiary_bank_swift_code: string | null
          beneficiary_name: string | null
          contract_reference: string | null
          created_at: string
          currency: string | null
          date_of_expiry: string | null
          date_of_issue: string | null
          documents_required: string | null
          form_of_guarantee: string | null
          guarantee_amount: number | null
          guarantee_details: string | null
          guarantee_type: string | null
          id: string
          place_of_expiry: string | null
          request_reference: string
          senders_reference: string | null
          special_instructions: string | null
          status: string
          supporting_documents: Json | null
          terms_and_conditions: string | null
          underlying_contract_details: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          applicable_rules?: string | null
          applicant_account_number?: string | null
          applicant_address?: string | null
          applicant_name?: string | null
          bank_operation_code?: string | null
          beneficiary_address?: string | null
          beneficiary_bank_address?: string | null
          beneficiary_bank_name?: string | null
          beneficiary_bank_swift_code?: string | null
          beneficiary_name?: string | null
          contract_reference?: string | null
          created_at?: string
          currency?: string | null
          date_of_expiry?: string | null
          date_of_issue?: string | null
          documents_required?: string | null
          form_of_guarantee?: string | null
          guarantee_amount?: number | null
          guarantee_details?: string | null
          guarantee_type?: string | null
          id?: string
          place_of_expiry?: string | null
          request_reference?: string
          senders_reference?: string | null
          special_instructions?: string | null
          status?: string
          supporting_documents?: Json | null
          terms_and_conditions?: string | null
          underlying_contract_details?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          applicable_rules?: string | null
          applicant_account_number?: string | null
          applicant_address?: string | null
          applicant_name?: string | null
          bank_operation_code?: string | null
          beneficiary_address?: string | null
          beneficiary_bank_address?: string | null
          beneficiary_bank_name?: string | null
          beneficiary_bank_swift_code?: string | null
          beneficiary_name?: string | null
          contract_reference?: string | null
          created_at?: string
          currency?: string | null
          date_of_expiry?: string | null
          date_of_issue?: string | null
          documents_required?: string | null
          form_of_guarantee?: string | null
          guarantee_amount?: number | null
          guarantee_details?: string | null
          guarantee_type?: string | null
          id?: string
          place_of_expiry?: string | null
          request_reference?: string
          senders_reference?: string | null
          special_instructions?: string | null
          status?: string
          supporting_documents?: Json | null
          terms_and_conditions?: string | null
          underlying_contract_details?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      outward_bg_supporting_documents: {
        Row: {
          file_name: string
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          outward_bg_request_id: string
          uploaded_at: string | null
        }
        Insert: {
          file_name: string
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          outward_bg_request_id: string
          uploaded_at?: string | null
        }
        Update: {
          file_name?: string
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          outward_bg_request_id?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outward_bg_supporting_documents_outward_bg_request_id_fkey"
            columns: ["outward_bg_request_id"]
            isOneToOne: false
            referencedRelation: "outward_bg_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      outward_documentary_collection_bills: {
        Row: {
          bill_amount: number | null
          bill_currency: string | null
          bill_reference: string
          collecting_bank: string | null
          collecting_bank_address: string | null
          collecting_bank_swift_code: string | null
          created_at: string
          documents_against: string | null
          drawee_payer_address: string | null
          drawee_payer_name: string | null
          drawer_address: string | null
          drawer_name: string | null
          id: string
          interest_charges: string | null
          presentation_instructions: string | null
          protect_charges: string | null
          special_instructions: string | null
          status: string | null
          supporting_documents: Json | null
          tenor_days: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bill_amount?: number | null
          bill_currency?: string | null
          bill_reference: string
          collecting_bank?: string | null
          collecting_bank_address?: string | null
          collecting_bank_swift_code?: string | null
          created_at?: string
          documents_against?: string | null
          drawee_payer_address?: string | null
          drawee_payer_name?: string | null
          drawer_address?: string | null
          drawer_name?: string | null
          id?: string
          interest_charges?: string | null
          presentation_instructions?: string | null
          protect_charges?: string | null
          special_instructions?: string | null
          status?: string | null
          supporting_documents?: Json | null
          tenor_days?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bill_amount?: number | null
          bill_currency?: string | null
          bill_reference?: string
          collecting_bank?: string | null
          collecting_bank_address?: string | null
          collecting_bank_swift_code?: string | null
          created_at?: string
          documents_against?: string | null
          drawee_payer_address?: string | null
          drawee_payer_name?: string | null
          drawer_address?: string | null
          drawer_name?: string | null
          id?: string
          interest_charges?: string | null
          presentation_instructions?: string | null
          protect_charges?: string | null
          special_instructions?: string | null
          status?: string | null
          supporting_documents?: Json | null
          tenor_days?: number | null
          updated_at?: string
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
          user_id: string
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
          user_id: string
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
          user_id?: string
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
          user_id: string
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
          user_id: string
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
          user_id?: string
          vendor_supplier?: string | null
        }
        Relationships: []
      }
      resolve_discrepancies: {
        Row: {
          applicant_name: string | null
          bill_reference: string
          corporate_reference: string | null
          created_at: string
          discrepancy_description: string | null
          discrepancy_notification_date: string | null
          discrepancy_type: string | null
          document_reupload_required: string | null
          document_type: string | null
          id: string
          issuing_bank: string | null
          lc_reference: string | null
          resolution_remarks: string | null
          resolution_status: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          applicant_name?: string | null
          bill_reference: string
          corporate_reference?: string | null
          created_at?: string
          discrepancy_description?: string | null
          discrepancy_notification_date?: string | null
          discrepancy_type?: string | null
          document_reupload_required?: string | null
          document_type?: string | null
          id?: string
          issuing_bank?: string | null
          lc_reference?: string | null
          resolution_remarks?: string | null
          resolution_status?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          applicant_name?: string | null
          bill_reference?: string
          corporate_reference?: string | null
          created_at?: string
          discrepancy_description?: string | null
          discrepancy_notification_date?: string | null
          discrepancy_type?: string | null
          document_reupload_required?: string | null
          document_type?: string | null
          id?: string
          issuing_bank?: string | null
          lc_reference?: string | null
          resolution_remarks?: string | null
          resolution_status?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scf_invoice_line_items: {
        Row: {
          created_at: string
          description: string
          id: string
          line_total: number
          quantity: number
          scf_invoice_id: string
          tax_rate: number | null
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          line_total: number
          quantity?: number
          scf_invoice_id: string
          tax_rate?: number | null
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          line_total?: number
          quantity?: number
          scf_invoice_id?: string
          tax_rate?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "scf_invoice_line_items_scf_invoice_id_fkey"
            columns: ["scf_invoice_id"]
            isOneToOne: false
            referencedRelation: "scf_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      scf_invoices: {
        Row: {
          buyer_id: string
          buyer_name: string
          created_at: string
          currency: string | null
          discount_amount: number | null
          due_date: string | null
          id: string
          invoice_date: string | null
          invoice_number: string
          invoice_type: string
          notes: string | null
          payment_terms: string | null
          program_id: string
          program_name: string
          purchase_order_amount: number | null
          purchase_order_currency: string | null
          purchase_order_date: string | null
          purchase_order_number: string | null
          seller_id: string
          seller_name: string
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          total_amount: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          buyer_id: string
          buyer_name: string
          created_at?: string
          currency?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number: string
          invoice_type: string
          notes?: string | null
          payment_terms?: string | null
          program_id: string
          program_name: string
          purchase_order_amount?: number | null
          purchase_order_currency?: string | null
          purchase_order_date?: string | null
          purchase_order_number?: string | null
          seller_id: string
          seller_name: string
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          buyer_id?: string
          buyer_name?: string
          created_at?: string
          currency?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string
          invoice_type?: string
          notes?: string | null
          payment_terms?: string | null
          program_id?: string
          program_name?: string
          purchase_order_amount?: number | null
          purchase_order_currency?: string | null
          purchase_order_date?: string | null
          purchase_order_number?: string | null
          seller_id?: string
          seller_name?: string
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scf_product_definitions: {
        Row: {
          allowed_currencies: string[] | null
          approval_workflow: string | null
          base_currency: string | null
          base_interest_rate: number | null
          created_at: string
          documents_required: string[] | null
          eligibility_criteria: Json | null
          fee_structure: Json | null
          finance_percentage_max: number | null
          finance_percentage_min: number | null
          grace_period_days: number | null
          id: string
          insurance_percentage: number | null
          interest_calculation_method: string | null
          interest_rate_type: string | null
          is_active: boolean | null
          margin_percentage_max: number | null
          margin_percentage_min: number | null
          max_transaction_amount: number | null
          min_transaction_amount: number | null
          partial_payment_allowed: boolean | null
          penalty_rate: number | null
          prepayment_allowed: boolean | null
          prepayment_penalty_percentage: number | null
          product_code: string
          product_description: string | null
          product_name: string
          product_type: string
          recourse_type: string | null
          requires_insurance: boolean | null
          spread_rate: number | null
          tenor_max_days: number | null
          tenor_min_days: number | null
          terms_and_conditions: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          allowed_currencies?: string[] | null
          approval_workflow?: string | null
          base_currency?: string | null
          base_interest_rate?: number | null
          created_at?: string
          documents_required?: string[] | null
          eligibility_criteria?: Json | null
          fee_structure?: Json | null
          finance_percentage_max?: number | null
          finance_percentage_min?: number | null
          grace_period_days?: number | null
          id?: string
          insurance_percentage?: number | null
          interest_calculation_method?: string | null
          interest_rate_type?: string | null
          is_active?: boolean | null
          margin_percentage_max?: number | null
          margin_percentage_min?: number | null
          max_transaction_amount?: number | null
          min_transaction_amount?: number | null
          partial_payment_allowed?: boolean | null
          penalty_rate?: number | null
          prepayment_allowed?: boolean | null
          prepayment_penalty_percentage?: number | null
          product_code: string
          product_description?: string | null
          product_name: string
          product_type: string
          recourse_type?: string | null
          requires_insurance?: boolean | null
          spread_rate?: number | null
          tenor_max_days?: number | null
          tenor_min_days?: number | null
          terms_and_conditions?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          allowed_currencies?: string[] | null
          approval_workflow?: string | null
          base_currency?: string | null
          base_interest_rate?: number | null
          created_at?: string
          documents_required?: string[] | null
          eligibility_criteria?: Json | null
          fee_structure?: Json | null
          finance_percentage_max?: number | null
          finance_percentage_min?: number | null
          grace_period_days?: number | null
          id?: string
          insurance_percentage?: number | null
          interest_calculation_method?: string | null
          interest_rate_type?: string | null
          is_active?: boolean | null
          margin_percentage_max?: number | null
          margin_percentage_min?: number | null
          max_transaction_amount?: number | null
          min_transaction_amount?: number | null
          partial_payment_allowed?: boolean | null
          penalty_rate?: number | null
          prepayment_allowed?: boolean | null
          prepayment_penalty_percentage?: number | null
          product_code?: string
          product_description?: string | null
          product_name?: string
          product_type?: string
          recourse_type?: string | null
          requires_insurance?: boolean | null
          spread_rate?: number | null
          tenor_max_days?: number | null
          tenor_min_days?: number | null
          terms_and_conditions?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scf_program_configurations: {
        Row: {
          anchor_account: string | null
          anchor_available_limit: number | null
          anchor_id: string | null
          anchor_limit: number | null
          anchor_limit_currency: string | null
          anchor_name: string
          anchor_party: string | null
          appropriation_sequence: Json | null
          appropriation_sequence_after_due: Json | null
          appropriation_sequence_before_due: Json | null
          assignment_enabled: boolean | null
          assignment_percentage: number | null
          auto_disbursement: boolean | null
          auto_repayment: boolean | null
          available_limit: number
          borrower_selection: string | null
          charge_penalty_on_prepayment: boolean | null
          counter_parties: Json | null
          created_at: string
          debit_account_number: string | null
          disbursement_account: string | null
          disbursement_conditions: string | null
          disbursement_mode: string | null
          effective_date: string
          expiry_date: string
          fee_catalogue: Json | null
          finance_percentage: number | null
          finance_tenor: number | null
          finance_tenor_unit: string | null
          flat_fee_config: Json | null
          grace_days: number | null
          holiday_treatment: string | null
          id: string
          insurance_policies: Json | null
          insurance_required: boolean | null
          margin_percentage: number | null
          max_disbursements_allowed: number | null
          max_tenor: number | null
          max_tenor_days: number | null
          max_tenor_months: number | null
          max_tenor_unit: string | null
          max_tenor_years: number | null
          min_tenor: number | null
          min_tenor_days: number | null
          min_tenor_months: number | null
          min_tenor_unit: string | null
          min_tenor_years: number | null
          multiple_disbursement: boolean | null
          part_payment_allowed: boolean | null
          pre_payment_allowed: boolean | null
          product_code: string
          product_name: string | null
          program_currency: string
          program_description: string | null
          program_id: string
          program_limit: number
          program_name: string
          recourse_enabled: boolean | null
          recourse_percentage: number | null
          repayment_account: string | null
          repayment_by: string | null
          repayment_mode: string | null
          stale_period: number | null
          status: string
          unaccepted_invoice_finance_enabled: boolean | null
          unaccepted_invoice_percentage: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          anchor_account?: string | null
          anchor_available_limit?: number | null
          anchor_id?: string | null
          anchor_limit?: number | null
          anchor_limit_currency?: string | null
          anchor_name: string
          anchor_party?: string | null
          appropriation_sequence?: Json | null
          appropriation_sequence_after_due?: Json | null
          appropriation_sequence_before_due?: Json | null
          assignment_enabled?: boolean | null
          assignment_percentage?: number | null
          auto_disbursement?: boolean | null
          auto_repayment?: boolean | null
          available_limit: number
          borrower_selection?: string | null
          charge_penalty_on_prepayment?: boolean | null
          counter_parties?: Json | null
          created_at?: string
          debit_account_number?: string | null
          disbursement_account?: string | null
          disbursement_conditions?: string | null
          disbursement_mode?: string | null
          effective_date: string
          expiry_date: string
          fee_catalogue?: Json | null
          finance_percentage?: number | null
          finance_tenor?: number | null
          finance_tenor_unit?: string | null
          flat_fee_config?: Json | null
          grace_days?: number | null
          holiday_treatment?: string | null
          id?: string
          insurance_policies?: Json | null
          insurance_required?: boolean | null
          margin_percentage?: number | null
          max_disbursements_allowed?: number | null
          max_tenor?: number | null
          max_tenor_days?: number | null
          max_tenor_months?: number | null
          max_tenor_unit?: string | null
          max_tenor_years?: number | null
          min_tenor?: number | null
          min_tenor_days?: number | null
          min_tenor_months?: number | null
          min_tenor_unit?: string | null
          min_tenor_years?: number | null
          multiple_disbursement?: boolean | null
          part_payment_allowed?: boolean | null
          pre_payment_allowed?: boolean | null
          product_code: string
          product_name?: string | null
          program_currency?: string
          program_description?: string | null
          program_id: string
          program_limit: number
          program_name: string
          recourse_enabled?: boolean | null
          recourse_percentage?: number | null
          repayment_account?: string | null
          repayment_by?: string | null
          repayment_mode?: string | null
          stale_period?: number | null
          status?: string
          unaccepted_invoice_finance_enabled?: boolean | null
          unaccepted_invoice_percentage?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          anchor_account?: string | null
          anchor_available_limit?: number | null
          anchor_id?: string | null
          anchor_limit?: number | null
          anchor_limit_currency?: string | null
          anchor_name?: string
          anchor_party?: string | null
          appropriation_sequence?: Json | null
          appropriation_sequence_after_due?: Json | null
          appropriation_sequence_before_due?: Json | null
          assignment_enabled?: boolean | null
          assignment_percentage?: number | null
          auto_disbursement?: boolean | null
          auto_repayment?: boolean | null
          available_limit?: number
          borrower_selection?: string | null
          charge_penalty_on_prepayment?: boolean | null
          counter_parties?: Json | null
          created_at?: string
          debit_account_number?: string | null
          disbursement_account?: string | null
          disbursement_conditions?: string | null
          disbursement_mode?: string | null
          effective_date?: string
          expiry_date?: string
          fee_catalogue?: Json | null
          finance_percentage?: number | null
          finance_tenor?: number | null
          finance_tenor_unit?: string | null
          flat_fee_config?: Json | null
          grace_days?: number | null
          holiday_treatment?: string | null
          id?: string
          insurance_policies?: Json | null
          insurance_required?: boolean | null
          margin_percentage?: number | null
          max_disbursements_allowed?: number | null
          max_tenor?: number | null
          max_tenor_days?: number | null
          max_tenor_months?: number | null
          max_tenor_unit?: string | null
          max_tenor_years?: number | null
          min_tenor?: number | null
          min_tenor_days?: number | null
          min_tenor_months?: number | null
          min_tenor_unit?: string | null
          min_tenor_years?: number | null
          multiple_disbursement?: boolean | null
          part_payment_allowed?: boolean | null
          pre_payment_allowed?: boolean | null
          product_code?: string
          product_name?: string | null
          program_currency?: string
          program_description?: string | null
          program_id?: string
          program_limit?: number
          program_name?: string
          recourse_enabled?: boolean | null
          recourse_percentage?: number | null
          repayment_account?: string | null
          repayment_by?: string | null
          repayment_mode?: string | null
          stale_period?: number | null
          status?: string
          unaccepted_invoice_finance_enabled?: boolean | null
          unaccepted_invoice_percentage?: number | null
          updated_at?: string
          user_id?: string
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
      authenticate_custom_user: {
        Args: { input_user_id: string }
        Returns: {
          corporate_id: string
          created_at: string
          full_name: string
          id: string
          password_hash: string
          product_linkage: Database["public"]["Enums"]["product_type"][]
          role_type: Database["public"]["Enums"]["user_role_type"]
          updated_at: string
          user_id: string
          user_login_id: string
        }[]
      }
      generate_assignment_ref: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_documentary_collection_bill_ref: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_export_bill_ref: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_lc_transfer_ref: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_transaction_ref: {
        Args: { product_type: string }
        Returns: string
      }
      get_custom_user_profile: {
        Args: { input_user_id: string }
        Returns: {
          corporate_id: string
          created_at: string
          full_name: string
          id: string
          product_linkage: Database["public"]["Enums"]["product_type"][]
          role_type: Database["public"]["Enums"]["user_role_type"]
          updated_at: string
          user_id: string
          user_login_id: string
        }[]
      }
      update_user_password: {
        Args: { new_password: string; old_password: string }
        Returns: boolean
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
