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
      city_master: {
        Row: {
          city_code: string
          city_name: string
          country_code_iso2: string
          created_at: string
          created_by: string | null
          id: string
          latitude: number | null
          longitude: number | null
          modified_at: string | null
          modified_by: string | null
          state_code_iso: string
          status: boolean
          user_id: string
        }
        Insert: {
          city_code: string
          city_name: string
          country_code_iso2: string
          created_at?: string
          created_by?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          modified_at?: string | null
          modified_by?: string | null
          state_code_iso: string
          status?: boolean
          user_id: string
        }
        Update: {
          city_code?: string
          city_name?: string
          country_code_iso2?: string
          created_at?: string
          created_by?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          modified_at?: string | null
          modified_by?: string | null
          state_code_iso?: string
          status?: boolean
          user_id?: string
        }
        Relationships: []
      }
      country_master: {
        Row: {
          country_code_iso2: string
          country_code_iso3: string
          country_name: string
          created_at: string
          created_by: string | null
          id: string
          modified_at: string | null
          modified_by: string | null
          numeric_code: string | null
          phone_code: string | null
          region: string | null
          status: boolean
          sub_region: string | null
          user_id: string
        }
        Insert: {
          country_code_iso2: string
          country_code_iso3: string
          country_name: string
          created_at?: string
          created_by?: string | null
          id?: string
          modified_at?: string | null
          modified_by?: string | null
          numeric_code?: string | null
          phone_code?: string | null
          region?: string | null
          status?: boolean
          sub_region?: string | null
          user_id: string
        }
        Update: {
          country_code_iso2?: string
          country_code_iso3?: string
          country_name?: string
          created_at?: string
          created_by?: string | null
          id?: string
          modified_at?: string | null
          modified_by?: string | null
          numeric_code?: string | null
          phone_code?: string | null
          region?: string | null
          status?: boolean
          sub_region?: string | null
          user_id?: string
        }
        Relationships: []
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
          scf_role: Database["public"]["Enums"]["scf_user_role"] | null
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
          scf_role?: Database["public"]["Enums"]["scf_user_role"] | null
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
          scf_role?: Database["public"]["Enums"]["scf_user_role"] | null
          updated_at?: string | null
          user_id?: string
          user_login_id?: string
        }
        Relationships: []
      }
      early_payment_requests: {
        Row: {
          created_at: string
          currency: string
          discount_percentage: number
          estimated_payment_date: string | null
          id: string
          invoice_ids: string[]
          program_id: string
          remarks: string | null
          request_reference: string | null
          status: string
          total_discounted_amount: number
          total_original_amount: number
          total_savings: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          discount_percentage: number
          estimated_payment_date?: string | null
          id?: string
          invoice_ids: string[]
          program_id: string
          remarks?: string | null
          request_reference?: string | null
          status?: string
          total_discounted_amount: number
          total_original_amount: number
          total_savings: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          discount_percentage?: number
          estimated_payment_date?: string | null
          id?: string
          invoice_ids?: string[]
          program_id?: string
          remarks?: string | null
          request_reference?: string | null
          status?: string
          total_discounted_amount?: number
          total_original_amount?: number
          total_savings?: number
          updated_at?: string
          user_id?: string
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
      field_repository: {
        Row: {
          ai_mapping_key: string | null
          audit_track_changes_flag: boolean | null
          channel_back_office_flag: boolean | null
          channel_customer_portal_flag: boolean | null
          channel_middle_office_flag: boolean | null
          computed_expression: string | null
          conditional_mandatory_expr: string | null
          conditional_visibility_expr: string | null
          config_version: number | null
          created_at: string | null
          created_by: string | null
          data_type: string | null
          decimal_places: number | null
          default_value: string | null
          dropdown_values: string[] | null
          edit_allowed_flag: boolean | null
          effective_from_date: string
          effective_to_date: string | null
          error_message_key: string | null
          event_type: string | null
          field_code: string | null
          field_column: number | null
          field_display_sequence: number | null
          field_id: string
          field_label_key: string | null
          field_row: number | null
          field_tooltip_key: string | null
          group_id: string | null
          group_repetition_flag: boolean | null
          help_content_ref: string | null
          help_content_type: string | null
          id: string
          input_allowed_flag: boolean | null
          is_active_flag: boolean | null
          is_attachment_field: boolean | null
          is_mandatory_bo: boolean | null
          is_mandatory_mo: boolean | null
          is_mandatory_portal: boolean | null
          iso_data_format_pattern: string | null
          iso20022_element_code: string | null
          last_updated_by: string | null
          length_max: number | null
          length_min: number | null
          limit_check_required_flag: boolean | null
          limit_dimension_type: string | null
          lookup_code: string | null
          masking_flag: boolean | null
          pane_code: string | null
          pane_display_sequence: number | null
          product_code: string
          read_only_flag: boolean | null
          sanction_check_required_flag: boolean | null
          sanction_engine_field_map: string | null
          sanction_field_category: string | null
          sanction_party_role: string | null
          section_code: string | null
          section_display_sequence: number | null
          size_standard_source: string | null
          stage: string | null
          swift_format_pattern: string | null
          swift_mt_type: string | null
          swift_sequence: string | null
          swift_subfield_qualifier: string | null
          swift_tag: string | null
          swift_tag_display_flag: boolean | null
          swift_tag_required_flag: boolean | null
          ui_column_span: number | null
          ui_display_type: string | null
          ui_row_span: number | null
          updated_at: string | null
          user_id: string
          validation_rule_set_id: string | null
          view_allowed_flag: boolean | null
          workflow_role_access: Json | null
        }
        Insert: {
          ai_mapping_key?: string | null
          audit_track_changes_flag?: boolean | null
          channel_back_office_flag?: boolean | null
          channel_customer_portal_flag?: boolean | null
          channel_middle_office_flag?: boolean | null
          computed_expression?: string | null
          conditional_mandatory_expr?: string | null
          conditional_visibility_expr?: string | null
          config_version?: number | null
          created_at?: string | null
          created_by?: string | null
          data_type?: string | null
          decimal_places?: number | null
          default_value?: string | null
          dropdown_values?: string[] | null
          edit_allowed_flag?: boolean | null
          effective_from_date: string
          effective_to_date?: string | null
          error_message_key?: string | null
          event_type?: string | null
          field_code?: string | null
          field_column?: number | null
          field_display_sequence?: number | null
          field_id: string
          field_label_key?: string | null
          field_row?: number | null
          field_tooltip_key?: string | null
          group_id?: string | null
          group_repetition_flag?: boolean | null
          help_content_ref?: string | null
          help_content_type?: string | null
          id?: string
          input_allowed_flag?: boolean | null
          is_active_flag?: boolean | null
          is_attachment_field?: boolean | null
          is_mandatory_bo?: boolean | null
          is_mandatory_mo?: boolean | null
          is_mandatory_portal?: boolean | null
          iso_data_format_pattern?: string | null
          iso20022_element_code?: string | null
          last_updated_by?: string | null
          length_max?: number | null
          length_min?: number | null
          limit_check_required_flag?: boolean | null
          limit_dimension_type?: string | null
          lookup_code?: string | null
          masking_flag?: boolean | null
          pane_code?: string | null
          pane_display_sequence?: number | null
          product_code: string
          read_only_flag?: boolean | null
          sanction_check_required_flag?: boolean | null
          sanction_engine_field_map?: string | null
          sanction_field_category?: string | null
          sanction_party_role?: string | null
          section_code?: string | null
          section_display_sequence?: number | null
          size_standard_source?: string | null
          stage?: string | null
          swift_format_pattern?: string | null
          swift_mt_type?: string | null
          swift_sequence?: string | null
          swift_subfield_qualifier?: string | null
          swift_tag?: string | null
          swift_tag_display_flag?: boolean | null
          swift_tag_required_flag?: boolean | null
          ui_column_span?: number | null
          ui_display_type?: string | null
          ui_row_span?: number | null
          updated_at?: string | null
          user_id: string
          validation_rule_set_id?: string | null
          view_allowed_flag?: boolean | null
          workflow_role_access?: Json | null
        }
        Update: {
          ai_mapping_key?: string | null
          audit_track_changes_flag?: boolean | null
          channel_back_office_flag?: boolean | null
          channel_customer_portal_flag?: boolean | null
          channel_middle_office_flag?: boolean | null
          computed_expression?: string | null
          conditional_mandatory_expr?: string | null
          conditional_visibility_expr?: string | null
          config_version?: number | null
          created_at?: string | null
          created_by?: string | null
          data_type?: string | null
          decimal_places?: number | null
          default_value?: string | null
          dropdown_values?: string[] | null
          edit_allowed_flag?: boolean | null
          effective_from_date?: string
          effective_to_date?: string | null
          error_message_key?: string | null
          event_type?: string | null
          field_code?: string | null
          field_column?: number | null
          field_display_sequence?: number | null
          field_id?: string
          field_label_key?: string | null
          field_row?: number | null
          field_tooltip_key?: string | null
          group_id?: string | null
          group_repetition_flag?: boolean | null
          help_content_ref?: string | null
          help_content_type?: string | null
          id?: string
          input_allowed_flag?: boolean | null
          is_active_flag?: boolean | null
          is_attachment_field?: boolean | null
          is_mandatory_bo?: boolean | null
          is_mandatory_mo?: boolean | null
          is_mandatory_portal?: boolean | null
          iso_data_format_pattern?: string | null
          iso20022_element_code?: string | null
          last_updated_by?: string | null
          length_max?: number | null
          length_min?: number | null
          limit_check_required_flag?: boolean | null
          limit_dimension_type?: string | null
          lookup_code?: string | null
          masking_flag?: boolean | null
          pane_code?: string | null
          pane_display_sequence?: number | null
          product_code?: string
          read_only_flag?: boolean | null
          sanction_check_required_flag?: boolean | null
          sanction_engine_field_map?: string | null
          sanction_field_category?: string | null
          sanction_party_role?: string | null
          section_code?: string | null
          section_display_sequence?: number | null
          size_standard_source?: string | null
          stage?: string | null
          swift_format_pattern?: string | null
          swift_mt_type?: string | null
          swift_sequence?: string | null
          swift_subfield_qualifier?: string | null
          swift_tag?: string | null
          swift_tag_display_flag?: boolean | null
          swift_tag_required_flag?: boolean | null
          ui_column_span?: number | null
          ui_display_type?: string | null
          ui_row_span?: number | null
          updated_at?: string | null
          user_id?: string
          validation_rule_set_id?: string | null
          view_allowed_flag?: boolean | null
          workflow_role_access?: Json | null
        }
        Relationships: []
      }
      finance_disbursements: {
        Row: {
          accounting_entries: Json
          accounting_reference: string
          auto_repayment_enabled: boolean
          corporate_id: string
          created_at: string
          disbursement_reference: string
          exchange_rate: number | null
          finance_amount: number
          finance_currency: string
          finance_date: string
          finance_due_date: string
          finance_tenor_days: number
          id: string
          interest_amount: number
          interest_rate: number
          interest_rate_type: string
          invoice_currency: string
          product_code: string
          product_name: string
          program_id: string
          program_name: string
          reference_rate_code: string | null
          reference_rate_margin: number | null
          repayment_account: string | null
          repayment_mode: string
          repayment_party: string
          selected_invoices: Json
          status: string
          total_repayment_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          accounting_entries?: Json
          accounting_reference: string
          auto_repayment_enabled?: boolean
          corporate_id: string
          created_at?: string
          disbursement_reference: string
          exchange_rate?: number | null
          finance_amount: number
          finance_currency?: string
          finance_date: string
          finance_due_date: string
          finance_tenor_days: number
          id?: string
          interest_amount: number
          interest_rate: number
          interest_rate_type?: string
          invoice_currency?: string
          product_code: string
          product_name: string
          program_id: string
          program_name: string
          reference_rate_code?: string | null
          reference_rate_margin?: number | null
          repayment_account?: string | null
          repayment_mode?: string
          repayment_party: string
          selected_invoices?: Json
          status?: string
          total_repayment_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          accounting_entries?: Json
          accounting_reference?: string
          auto_repayment_enabled?: boolean
          corporate_id?: string
          created_at?: string
          disbursement_reference?: string
          exchange_rate?: number | null
          finance_amount?: number
          finance_currency?: string
          finance_date?: string
          finance_due_date?: string
          finance_tenor_days?: number
          id?: string
          interest_amount?: number
          interest_rate?: number
          interest_rate_type?: string
          invoice_currency?: string
          product_code?: string
          product_name?: string
          program_id?: string
          program_name?: string
          reference_rate_code?: string | null
          reference_rate_margin?: number | null
          repayment_account?: string | null
          repayment_mode?: string
          repayment_party?: string
          selected_invoices?: Json
          status?: string
          total_repayment_amount?: number
          updated_at?: string
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
      import_lc_templates: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          product_name: string
          source_transaction_ref: string | null
          tags: string[] | null
          template_data: Json
          template_description: string | null
          template_id: string
          template_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          product_name?: string
          source_transaction_ref?: string | null
          tags?: string[] | null
          template_data: Json
          template_description?: string | null
          template_id: string
          template_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          product_name?: string
          source_transaction_ref?: string | null
          tags?: string[] | null
          template_data?: Json
          template_description?: string | null
          template_id?: string
          template_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      invoice_disbursements: {
        Row: {
          accounting_entry_ref: string | null
          created_at: string
          disbursed_amount: number
          disbursed_at: string | null
          disbursement_status: string
          finance_percentage: number
          id: string
          loan_reference: string
          program_id: string
          rejection_reason: string | null
          scf_invoice_id: string
        }
        Insert: {
          accounting_entry_ref?: string | null
          created_at?: string
          disbursed_amount: number
          disbursed_at?: string | null
          disbursement_status?: string
          finance_percentage: number
          id?: string
          loan_reference: string
          program_id: string
          rejection_reason?: string | null
          scf_invoice_id: string
        }
        Update: {
          accounting_entry_ref?: string | null
          created_at?: string
          disbursed_amount?: number
          disbursed_at?: string | null
          disbursement_status?: string
          finance_percentage?: number
          id?: string
          loan_reference?: string
          program_id?: string
          rejection_reason?: string | null
          scf_invoice_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_disbursements_scf_invoice_id_fkey"
            columns: ["scf_invoice_id"]
            isOneToOne: false
            referencedRelation: "scf_invoices"
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
      invoice_repayments: {
        Row: {
          accounting_entry_ref: string | null
          created_at: string
          currency: string
          id: string
          interest_amount: number
          loan_reference: string
          penalty_amount: number | null
          principal_amount: number
          program_id: string
          remarks: string | null
          repayment_amount: number
          repayment_date: string
          repayment_mode: string | null
          repayment_reference: string
          repayment_status: string
          scf_invoice_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accounting_entry_ref?: string | null
          created_at?: string
          currency?: string
          id?: string
          interest_amount: number
          loan_reference: string
          penalty_amount?: number | null
          principal_amount: number
          program_id: string
          remarks?: string | null
          repayment_amount: number
          repayment_date: string
          repayment_mode?: string | null
          repayment_reference: string
          repayment_status?: string
          scf_invoice_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          accounting_entry_ref?: string | null
          created_at?: string
          currency?: string
          id?: string
          interest_amount?: number
          loan_reference?: string
          penalty_amount?: number | null
          principal_amount?: number
          program_id?: string
          remarks?: string | null
          repayment_amount?: number
          repayment_date?: string
          repayment_mode?: string | null
          repayment_reference?: string
          repayment_status?: string
          scf_invoice_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_repayments_scf_invoice_id_fkey"
            columns: ["scf_invoice_id"]
            isOneToOne: false
            referencedRelation: "scf_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_scanned_documents: {
        Row: {
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          scf_invoice_id: string | null
          uploaded_at: string
        }
        Insert: {
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          scf_invoice_id?: string | null
          uploaded_at?: string
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          scf_invoice_id?: string | null
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_scanned_documents_scf_invoice_id_fkey"
            columns: ["scf_invoice_id"]
            isOneToOne: false
            referencedRelation: "scf_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_upload_batches: {
        Row: {
          id: string
          rejected_rows: number
          status: string
          successful_rows: number
          total_rows: number
          upload_type: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          id?: string
          rejected_rows?: number
          status?: string
          successful_rows?: number
          total_rows?: number
          upload_type: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          id?: string
          rejected_rows?: number
          status?: string
          successful_rows?: number
          total_rows?: number
          upload_type?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      invoice_upload_rejections: {
        Row: {
          batch_id: string
          created_at: string
          id: string
          invoice_number: string | null
          raw_data: Json | null
          rejection_reason: string
          row_number: number
        }
        Insert: {
          batch_id: string
          created_at?: string
          id?: string
          invoice_number?: string | null
          raw_data?: Json | null
          rejection_reason: string
          row_number: number
        }
        Update: {
          batch_id?: string
          created_at?: string
          id?: string
          invoice_number?: string | null
          raw_data?: Json | null
          rejection_reason?: string
          row_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_upload_rejections_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "invoice_upload_batches"
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
      pane_section_mappings: {
        Row: {
          business_application: string[]
          created_at: string | null
          customer_segment: string[]
          event_code: string
          id: string
          is_active: boolean
          panes: Json
          product_code: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_application?: string[]
          created_at?: string | null
          customer_segment?: string[]
          event_code: string
          id?: string
          is_active?: boolean
          panes?: Json
          product_code: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_application?: string[]
          created_at?: string | null
          customer_segment?: string[]
          event_code?: string
          id?: string
          is_active?: boolean
          panes?: Json
          product_code?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payment_requests: {
        Row: {
          created_at: string
          currency: string
          id: string
          invoice_ids: string[]
          notes: string | null
          payment_reference: string | null
          program_id: string
          requested_payment_date: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          invoice_ids: string[]
          notes?: string | null
          payment_reference?: string | null
          program_id: string
          requested_payment_date?: string | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          invoice_ids?: string[]
          notes?: string | null
          payment_reference?: string | null
          program_id?: string
          requested_payment_date?: string | null
          status?: string
          total_amount?: number
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
      product_event_definitions: {
        Row: {
          created_at: string
          event_code: string
          event_name: string
          id: string
          module_code: string
          product_code: string
          product_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_code: string
          event_name: string
          id?: string
          module_code: string
          product_code: string
          product_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_code?: string
          event_name?: string
          id?: string
          module_code?: string
          product_code?: string
          product_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_event_mapping: {
        Row: {
          business_application: string[] | null
          created_at: string
          event_code: string
          event_name: string
          id: string
          module_code: string
          module_name: string
          product_code: string
          product_name: string
          target_audience: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          business_application?: string[] | null
          created_at?: string
          event_code: string
          event_name: string
          id?: string
          module_code: string
          module_name: string
          product_code: string
          product_name: string
          target_audience: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          business_application?: string[] | null
          created_at?: string
          event_code?: string
          event_name?: string
          id?: string
          module_code?: string
          module_name?: string
          product_code?: string
          product_name?: string
          target_audience?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          buyers_acceptance_required: boolean | null
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
          buyers_acceptance_required?: boolean | null
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
          buyers_acceptance_required?: boolean | null
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
          anchor_role: string | null
          authorization_required: boolean | null
          borrower_role: string | null
          counter_party_role: string | null
          created_at: string
          effective_date: string
          expiry_date: string | null
          id: string
          is_active: boolean | null
          product_centric: string | null
          product_code: string
          product_description: string | null
          product_name: string
          underlying_instrument: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          anchor_role?: string | null
          authorization_required?: boolean | null
          borrower_role?: string | null
          counter_party_role?: string | null
          created_at?: string
          effective_date?: string
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          product_centric?: string | null
          product_code: string
          product_description?: string | null
          product_name: string
          underlying_instrument?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          anchor_role?: string | null
          authorization_required?: boolean | null
          borrower_role?: string | null
          counter_party_role?: string | null
          created_at?: string
          effective_date?: string
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          product_centric?: string | null
          product_code?: string
          product_description?: string | null
          product_name?: string
          underlying_instrument?: string | null
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
          default_discount_percentage: number | null
          disbursement_account: string | null
          disbursement_conditions: string | null
          disbursement_mode: string | null
          dynamic_discounting_enabled: boolean | null
          early_payment_discount_enabled: boolean | null
          effective_date: string
          expiry_date: string
          factoring_delivery_model: string | null
          factoring_disclosure: string | null
          factoring_enabled: boolean | null
          factoring_geography: string | null
          factoring_recourse_type: string | null
          factoring_risk_bearer: string | null
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
          max_tenor_total_days: number | null
          max_tenor_unit: string | null
          max_tenor_years: number | null
          min_tenor: number | null
          min_tenor_days: number | null
          min_tenor_months: number | null
          min_tenor_total_days: number | null
          min_tenor_unit: string | null
          min_tenor_years: number | null
          multiple_disbursement: boolean | null
          override_limit_restrictions: boolean | null
          override_tenor_calculation: boolean | null
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
          default_discount_percentage?: number | null
          disbursement_account?: string | null
          disbursement_conditions?: string | null
          disbursement_mode?: string | null
          dynamic_discounting_enabled?: boolean | null
          early_payment_discount_enabled?: boolean | null
          effective_date: string
          expiry_date: string
          factoring_delivery_model?: string | null
          factoring_disclosure?: string | null
          factoring_enabled?: boolean | null
          factoring_geography?: string | null
          factoring_recourse_type?: string | null
          factoring_risk_bearer?: string | null
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
          max_tenor_total_days?: number | null
          max_tenor_unit?: string | null
          max_tenor_years?: number | null
          min_tenor?: number | null
          min_tenor_days?: number | null
          min_tenor_months?: number | null
          min_tenor_total_days?: number | null
          min_tenor_unit?: string | null
          min_tenor_years?: number | null
          multiple_disbursement?: boolean | null
          override_limit_restrictions?: boolean | null
          override_tenor_calculation?: boolean | null
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
          default_discount_percentage?: number | null
          disbursement_account?: string | null
          disbursement_conditions?: string | null
          disbursement_mode?: string | null
          dynamic_discounting_enabled?: boolean | null
          early_payment_discount_enabled?: boolean | null
          effective_date?: string
          expiry_date?: string
          factoring_delivery_model?: string | null
          factoring_disclosure?: string | null
          factoring_enabled?: boolean | null
          factoring_geography?: string | null
          factoring_recourse_type?: string | null
          factoring_risk_bearer?: string | null
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
          max_tenor_total_days?: number | null
          max_tenor_unit?: string | null
          max_tenor_years?: number | null
          min_tenor?: number | null
          min_tenor_days?: number | null
          min_tenor_months?: number | null
          min_tenor_total_days?: number | null
          min_tenor_unit?: string | null
          min_tenor_years?: number | null
          multiple_disbursement?: boolean | null
          override_limit_restrictions?: boolean | null
          override_tenor_calculation?: boolean | null
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
      state_master: {
        Row: {
          country_code_iso2: string
          created_at: string
          created_by: string | null
          id: string
          modified_at: string | null
          modified_by: string | null
          state_code_iso: string
          state_name: string
          status: boolean
          user_id: string
        }
        Insert: {
          country_code_iso2: string
          created_at?: string
          created_by?: string | null
          id?: string
          modified_at?: string | null
          modified_by?: string | null
          state_code_iso: string
          state_name: string
          status?: boolean
          user_id: string
        }
        Update: {
          country_code_iso2?: string
          created_at?: string
          created_by?: string | null
          id?: string
          modified_at?: string | null
          modified_by?: string | null
          state_code_iso?: string
          state_name?: string
          status?: boolean
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
      workflow_conditions: {
        Row: {
          compare_field: string | null
          compare_type: string
          compare_value: string | null
          condition_order: number | null
          created_at: string
          field_name: string
          group_name: string
          group_operator: string
          id: string
          operator: string
          stage_id: string | null
          template_id: string
        }
        Insert: {
          compare_field?: string | null
          compare_type?: string
          compare_value?: string | null
          condition_order?: number | null
          created_at?: string
          field_name: string
          group_name?: string
          group_operator?: string
          id?: string
          operator?: string
          stage_id?: string | null
          template_id: string
        }
        Update: {
          compare_field?: string | null
          compare_type?: string
          compare_value?: string | null
          condition_order?: number | null
          created_at?: string
          field_name?: string
          group_name?: string
          group_operator?: string
          id?: string
          operator?: string
          stage_id?: string | null
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_conditions_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_conditions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "workflow_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_stage_fields: {
        Row: {
          created_at: string
          field_id: string
          field_name: string
          field_order: number | null
          id: string
          is_editable: boolean | null
          is_mandatory: boolean | null
          is_visible: boolean | null
          pane: string | null
          section: string | null
          stage_id: string
          ui_display_type: string | null
          ui_label: string | null
        }
        Insert: {
          created_at?: string
          field_id: string
          field_name: string
          field_order?: number | null
          id?: string
          is_editable?: boolean | null
          is_mandatory?: boolean | null
          is_visible?: boolean | null
          pane?: string | null
          section?: string | null
          stage_id: string
          ui_display_type?: string | null
          ui_label?: string | null
        }
        Update: {
          created_at?: string
          field_id?: string
          field_name?: string
          field_order?: number | null
          id?: string
          is_editable?: boolean | null
          is_mandatory?: boolean | null
          is_visible?: boolean | null
          pane?: string | null
          section?: string | null
          stage_id?: string
          ui_display_type?: string | null
          ui_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_stage_fields_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_stages: {
        Row: {
          actor_type: string
          created_at: string
          id: string
          is_rejectable: boolean | null
          reject_to_stage_id: string | null
          sla_hours: number | null
          stage_name: string
          stage_order: number
          stage_type: string
          template_id: string
          updated_at: string
        }
        Insert: {
          actor_type?: string
          created_at?: string
          id?: string
          is_rejectable?: boolean | null
          reject_to_stage_id?: string | null
          sla_hours?: number | null
          stage_name: string
          stage_order: number
          stage_type?: string
          template_id: string
          updated_at?: string
        }
        Update: {
          actor_type?: string
          created_at?: string
          id?: string
          is_rejectable?: boolean | null
          reject_to_stage_id?: string | null
          sla_hours?: number | null
          stage_name?: string
          stage_order?: number
          stage_type?: string
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_stages_reject_to_stage_id_fkey"
            columns: ["reject_to_stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_stages_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "workflow_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_templates: {
        Row: {
          created_at: string
          event_code: string
          event_name: string
          id: string
          module_code: string
          module_name: string
          product_code: string
          product_name: string
          status: string
          template_name: string
          trigger_types: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_code: string
          event_name: string
          id?: string
          module_code: string
          module_name: string
          product_code: string
          product_name: string
          status?: string
          template_name: string
          trigger_types?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_code?: string
          event_name?: string
          id?: string
          module_code?: string
          module_name?: string
          product_code?: string
          product_name?: string
          status?: string
          template_name?: string
          trigger_types?: string[]
          updated_at?: string
          user_id?: string
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
      copy_field_repository: {
        Args: { p_field_id: string; p_user_id: string }
        Returns: Json
      }
      delete_field_repository: {
        Args: { p_field_id: string; p_user_id: string }
        Returns: boolean
      }
      delete_fields_by_config: {
        Args: {
          p_event_type: string
          p_pane_code: string
          p_product_code: string
          p_section_code: string
          p_user_id: string
        }
        Returns: number
      }
      delete_fields_by_product_event: {
        Args: {
          p_event_type: string
          p_product_code: string
          p_user_id: string
        }
        Returns: number
      }
      generate_assignment_ref: { Args: never; Returns: string }
      generate_documentary_collection_bill_ref: { Args: never; Returns: string }
      generate_export_bill_ref: { Args: never; Returns: string }
      generate_lc_transfer_ref: { Args: never; Returns: string }
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
      get_fields_by_config: {
        Args: {
          p_event_type: string
          p_pane_code: string
          p_product_code: string
          p_section_code: string
          p_user_id: string
        }
        Returns: {
          ai_mapping_key: string | null
          audit_track_changes_flag: boolean | null
          channel_back_office_flag: boolean | null
          channel_customer_portal_flag: boolean | null
          channel_middle_office_flag: boolean | null
          computed_expression: string | null
          conditional_mandatory_expr: string | null
          conditional_visibility_expr: string | null
          config_version: number | null
          created_at: string | null
          created_by: string | null
          data_type: string | null
          decimal_places: number | null
          default_value: string | null
          dropdown_values: string[] | null
          edit_allowed_flag: boolean | null
          effective_from_date: string
          effective_to_date: string | null
          error_message_key: string | null
          event_type: string | null
          field_code: string | null
          field_column: number | null
          field_display_sequence: number | null
          field_id: string
          field_label_key: string | null
          field_row: number | null
          field_tooltip_key: string | null
          group_id: string | null
          group_repetition_flag: boolean | null
          help_content_ref: string | null
          help_content_type: string | null
          id: string
          input_allowed_flag: boolean | null
          is_active_flag: boolean | null
          is_attachment_field: boolean | null
          is_mandatory_bo: boolean | null
          is_mandatory_mo: boolean | null
          is_mandatory_portal: boolean | null
          iso_data_format_pattern: string | null
          iso20022_element_code: string | null
          last_updated_by: string | null
          length_max: number | null
          length_min: number | null
          limit_check_required_flag: boolean | null
          limit_dimension_type: string | null
          lookup_code: string | null
          masking_flag: boolean | null
          pane_code: string | null
          pane_display_sequence: number | null
          product_code: string
          read_only_flag: boolean | null
          sanction_check_required_flag: boolean | null
          sanction_engine_field_map: string | null
          sanction_field_category: string | null
          sanction_party_role: string | null
          section_code: string | null
          section_display_sequence: number | null
          size_standard_source: string | null
          stage: string | null
          swift_format_pattern: string | null
          swift_mt_type: string | null
          swift_sequence: string | null
          swift_subfield_qualifier: string | null
          swift_tag: string | null
          swift_tag_display_flag: boolean | null
          swift_tag_required_flag: boolean | null
          ui_column_span: number | null
          ui_display_type: string | null
          ui_row_span: number | null
          updated_at: string | null
          user_id: string
          validation_rule_set_id: string | null
          view_allowed_flag: boolean | null
          workflow_role_access: Json | null
        }[]
        SetofOptions: {
          from: "*"
          to: "field_repository"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_fields_for_workflow: {
        Args: { p_event_type: string; p_product_code: string }
        Returns: {
          field_code: string
          field_id: string
          field_label_key: string
          pane_code: string
          section_code: string
          ui_display_type: string
        }[]
      }
      get_pane_section_mappings: {
        Args: { p_user_id: string }
        Returns: {
          business_application: string[]
          created_at: string | null
          customer_segment: string[]
          event_code: string
          id: string
          is_active: boolean
          panes: Json
          product_code: string
          updated_at: string | null
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "pane_section_mappings"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_user_fields: {
        Args: { p_user_id: string }
        Returns: {
          ai_mapping_key: string | null
          audit_track_changes_flag: boolean | null
          channel_back_office_flag: boolean | null
          channel_customer_portal_flag: boolean | null
          channel_middle_office_flag: boolean | null
          computed_expression: string | null
          conditional_mandatory_expr: string | null
          conditional_visibility_expr: string | null
          config_version: number | null
          created_at: string | null
          created_by: string | null
          data_type: string | null
          decimal_places: number | null
          default_value: string | null
          dropdown_values: string[] | null
          edit_allowed_flag: boolean | null
          effective_from_date: string
          effective_to_date: string | null
          error_message_key: string | null
          event_type: string | null
          field_code: string | null
          field_column: number | null
          field_display_sequence: number | null
          field_id: string
          field_label_key: string | null
          field_row: number | null
          field_tooltip_key: string | null
          group_id: string | null
          group_repetition_flag: boolean | null
          help_content_ref: string | null
          help_content_type: string | null
          id: string
          input_allowed_flag: boolean | null
          is_active_flag: boolean | null
          is_attachment_field: boolean | null
          is_mandatory_bo: boolean | null
          is_mandatory_mo: boolean | null
          is_mandatory_portal: boolean | null
          iso_data_format_pattern: string | null
          iso20022_element_code: string | null
          last_updated_by: string | null
          length_max: number | null
          length_min: number | null
          limit_check_required_flag: boolean | null
          limit_dimension_type: string | null
          lookup_code: string | null
          masking_flag: boolean | null
          pane_code: string | null
          pane_display_sequence: number | null
          product_code: string
          read_only_flag: boolean | null
          sanction_check_required_flag: boolean | null
          sanction_engine_field_map: string | null
          sanction_field_category: string | null
          sanction_party_role: string | null
          section_code: string | null
          section_display_sequence: number | null
          size_standard_source: string | null
          stage: string | null
          swift_format_pattern: string | null
          swift_mt_type: string | null
          swift_sequence: string | null
          swift_subfield_qualifier: string | null
          swift_tag: string | null
          swift_tag_display_flag: boolean | null
          swift_tag_required_flag: boolean | null
          ui_column_span: number | null
          ui_display_type: string | null
          ui_row_span: number | null
          updated_at: string | null
          user_id: string
          validation_rule_set_id: string | null
          view_allowed_flag: boolean | null
          workflow_role_access: Json | null
        }[]
        SetofOptions: {
          from: "*"
          to: "field_repository"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      insert_field_repository: {
        Args: { p_fields: Json; p_user_id: string }
        Returns: Json
      }
      notify_scf_users_by_role: {
        Args: {
          p_exclude_user_id?: string
          p_message: string
          p_notify_roles: Database["public"]["Enums"]["scf_user_role"][]
          p_transaction_ref: string
          p_transaction_type: string
        }
        Returns: undefined
      }
      toggle_field_active: {
        Args: { p_field_id: string; p_is_active: boolean; p_user_id: string }
        Returns: boolean
      }
      toggle_pane_section_active: {
        Args: { p_config_id: string; p_is_active: boolean }
        Returns: boolean
      }
      update_field_repository: {
        Args: { p_field_data: Json; p_field_id: string; p_user_id: string }
        Returns: Json
      }
      update_user_password: {
        Args: { new_password: string; old_password: string }
        Returns: boolean
      }
      upsert_pane_section_mapping: {
        Args: {
          p_business_application: string[]
          p_customer_segment: string[]
          p_event_code: string
          p_is_active?: boolean
          p_panes: Json
          p_product_code: string
          p_user_id: string
        }
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
      scf_user_role: "Supplier" | "Buyer" | "Bank" | "Admin"
      target_audience_type: "Corporate" | "Bank" | "Agent"
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
      scf_user_role: ["Supplier", "Buyer", "Bank", "Admin"],
      target_audience_type: ["Corporate", "Bank", "Agent"],
      user_role_type: ["Maker", "Checker", "Viewer", "All"],
    },
  },
} as const
