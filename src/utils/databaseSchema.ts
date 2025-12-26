// Database schema definitions for documentation
export interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue: string | null;
  description?: string;
}

export interface TableSchema {
  name: string;
  module: string;
  description: string;
  columns: TableColumn[];
  foreignKeys?: { column: string; references: string }[];
}

export interface ModuleInfo {
  name: string;
  description: string;
  tables: string[];
  color: string;
}

export const DATABASE_MODULES: ModuleInfo[] = [
  {
    name: "User & Authentication",
    description: "User management, authentication, and permission system",
    tables: ["custom_users", "user_profiles", "user_permissions", "user_screen_permissions"],
    color: "hsl(var(--primary))"
  },
  {
    name: "Import LC",
    description: "Import Letter of Credit requests, templates, and supporting documents",
    tables: ["import_lc_requests", "import_lc_templates", "import_lc_supporting_documents"],
    color: "hsl(210, 70%, 50%)"
  },
  {
    name: "Export LC",
    description: "Export LC bills, reviews, amendments, transfers, and assignments",
    tables: ["export_lc_bills", "export_lc_bill_documents", "export_lc_bill_line_items", "export_lc_reviews", "export_lc_amendment_responses", "lc_transfer_requests", "assignment_requests"],
    color: "hsl(150, 70%, 40%)"
  },
  {
    name: "Remittance & Payments",
    description: "Customer and interbank payment transactions",
    tables: ["remittance_transactions", "interbank_settlements"],
    color: "hsl(45, 80%, 45%)"
  },
  {
    name: "Bank Guarantee",
    description: "Outward and inward bank guarantee management",
    tables: ["outward_bg_requests", "outward_bg_supporting_documents", "inward_bg_amendment_consents"],
    color: "hsl(280, 60%, 50%)"
  },
  {
    name: "Supply Chain Finance (SCF)",
    description: "SCF programs, invoices, disbursements, and repayments",
    tables: ["scf_program_configurations", "scf_invoices", "invoice_disbursements", "invoice_repayments", "finance_disbursements", "early_payment_requests", "payment_requests"],
    color: "hsl(0, 70%, 50%)"
  },
  {
    name: "Documentary Collection",
    description: "Inward and outward documentary collection bills",
    tables: ["outward_documentary_collection_bills", "inward_dc_bill_acceptance_refusal", "inward_documentary_collection_bill_payments", "inward_dc_bill_payment_documents"],
    color: "hsl(180, 60%, 45%)"
  },
  {
    name: "Workflow & Configuration",
    description: "Workflow templates, stages, and field configurations",
    tables: ["workflow_templates", "workflow_stages", "workflow_stage_fields", "pane_section_mappings", "field_repository"],
    color: "hsl(320, 60%, 50%)"
  },
  {
    name: "Product Definitions",
    description: "Product and event mapping configurations",
    tables: ["product_event_mapping", "product_event_definitions"],
    color: "hsl(100, 60%, 45%)"
  },
  {
    name: "Master Data",
    description: "Reference data for countries, states, and cities",
    tables: ["country_master", "state_master", "city_master"],
    color: "hsl(220, 50%, 55%)"
  },
  {
    name: "Transaction & Notifications",
    description: "Transaction records and user notifications",
    tables: ["transactions", "notifications"],
    color: "hsl(30, 70%, 50%)"
  },
  {
    name: "Invoice Management",
    description: "Standard invoices and line items",
    tables: ["invoices", "invoice_line_items", "invoice_upload_batches", "invoice_upload_rejections", "invoice_scanned_documents"],
    color: "hsl(260, 50%, 55%)"
  },
  {
    name: "Purchase & Proforma",
    description: "Purchase orders and proforma invoices",
    tables: ["purchase_orders", "proforma_invoices", "popi_line_items"],
    color: "hsl(340, 60%, 50%)"
  },
  {
    name: "Discrepancy Resolution",
    description: "LC discrepancy handling",
    tables: ["discrepancy_resolutions"],
    color: "hsl(60, 60%, 45%)"
  }
];

export const TABLE_SCHEMAS: TableSchema[] = [
  // User & Authentication Module
  {
    name: "custom_users",
    module: "User & Authentication",
    description: "Stores custom user accounts with authentication credentials and role assignments",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "text", nullable: false, defaultValue: null },
      { name: "password_hash", type: "text", nullable: false, defaultValue: null },
      { name: "full_name", type: "text", nullable: false, defaultValue: null },
      { name: "user_login_id", type: "text", nullable: false, defaultValue: null },
      { name: "corporate_id", type: "text", nullable: true, defaultValue: "'TC001'" },
      { name: "corporate_name", type: "text", nullable: true, defaultValue: null },
      { name: "client_id", type: "text", nullable: true, defaultValue: null },
      { name: "role_type", type: "user_role_type", nullable: true, defaultValue: "'Viewer'" },
      { name: "scf_role", type: "scf_user_role", nullable: true, defaultValue: null },
      { name: "product_linkage", type: "product_type[]", nullable: true, defaultValue: "ARRAY[]" },
      { name: "business_applications", type: "text[]", nullable: true, defaultValue: "'{}'" },
      { name: "is_super_user", type: "boolean", nullable: true, defaultValue: "false" },
      { name: "created_at", type: "timestamptz", nullable: true, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: true, defaultValue: "now()" }
    ]
  },
  {
    name: "user_profiles",
    module: "User & Authentication",
    description: "User profile information linked to auth.users",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: null },
      { name: "email", type: "text", nullable: true, defaultValue: null },
      { name: "full_name", type: "text", nullable: true, defaultValue: null },
      { name: "avatar_url", type: "text", nullable: true, defaultValue: null },
      { name: "role", type: "text", nullable: true, defaultValue: "'viewer'" },
      { name: "department", type: "text", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: true, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: true, defaultValue: "now()" }
    ],
    foreignKeys: [{ column: "id", references: "auth.users.id" }]
  },
  {
    name: "user_permissions",
    module: "User & Authentication",
    description: "Granular permission assignments for users by module, product, and event",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "module_code", type: "text", nullable: false, defaultValue: null },
      { name: "product_code", type: "text", nullable: false, defaultValue: null },
      { name: "event_code", type: "text", nullable: false, defaultValue: null },
      { name: "stage_name", type: "text", nullable: false, defaultValue: "'__ALL__'" },
      { name: "can_view", type: "boolean", nullable: true, defaultValue: "false" },
      { name: "can_create", type: "boolean", nullable: true, defaultValue: "false" },
      { name: "can_edit", type: "boolean", nullable: true, defaultValue: "false" },
      { name: "can_delete", type: "boolean", nullable: true, defaultValue: "false" },
      { name: "can_approve", type: "boolean", nullable: true, defaultValue: "false" },
      { name: "created_by", type: "uuid", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: true, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: true, defaultValue: "now()" }
    ],
    foreignKeys: [{ column: "user_id", references: "custom_users.id" }]
  },

  // Import LC Module
  {
    name: "import_lc_requests",
    module: "Import LC",
    description: "Import Letter of Credit issuance requests with full LC details",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "corporate_reference", type: "text", nullable: false, defaultValue: null },
      { name: "form_of_documentary_credit", type: "text", nullable: false, defaultValue: null },
      { name: "applicable_rules", type: "text", nullable: false, defaultValue: "'UCP Latest Version'" },
      { name: "lc_type", type: "text", nullable: true, defaultValue: null },
      { name: "is_transferable", type: "boolean", nullable: true, defaultValue: "false" },
      { name: "issue_date", type: "date", nullable: true, defaultValue: null },
      { name: "expiry_date", type: "date", nullable: true, defaultValue: null },
      { name: "place_of_expiry", type: "text", nullable: true, defaultValue: null },
      { name: "applicant_name", type: "text", nullable: true, defaultValue: null },
      { name: "applicant_address", type: "text", nullable: true, defaultValue: null },
      { name: "applicant_account_number", type: "text", nullable: true, defaultValue: null },
      { name: "beneficiary_name", type: "text", nullable: true, defaultValue: null },
      { name: "beneficiary_address", type: "text", nullable: true, defaultValue: null },
      { name: "beneficiary_bank_name", type: "text", nullable: true, defaultValue: null },
      { name: "beneficiary_bank_swift_code", type: "text", nullable: true, defaultValue: null },
      { name: "currency", type: "text", nullable: true, defaultValue: "'USD'" },
      { name: "lc_amount", type: "numeric", nullable: true, defaultValue: "0" },
      { name: "additional_amount", type: "numeric", nullable: true, defaultValue: "0" },
      { name: "tolerance", type: "text", nullable: true, defaultValue: null },
      { name: "available_with", type: "text", nullable: true, defaultValue: null },
      { name: "available_by", type: "text", nullable: true, defaultValue: null },
      { name: "port_of_loading", type: "text", nullable: true, defaultValue: null },
      { name: "port_of_discharge", type: "text", nullable: true, defaultValue: null },
      { name: "latest_shipment_date", type: "date", nullable: true, defaultValue: null },
      { name: "partial_shipments_allowed", type: "boolean", nullable: true, defaultValue: "false" },
      { name: "transshipment_allowed", type: "boolean", nullable: true, defaultValue: "false" },
      { name: "description_of_goods", type: "text", nullable: true, defaultValue: null },
      { name: "required_documents", type: "text[]", nullable: true, defaultValue: null },
      { name: "additional_conditions", type: "text", nullable: true, defaultValue: null },
      { name: "status", type: "text", nullable: true, defaultValue: "'draft'" },
      { name: "created_at", type: "timestamptz", nullable: true, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: true, defaultValue: "now()" }
    ],
    foreignKeys: [{ column: "user_id", references: "custom_users.id" }]
  },
  {
    name: "import_lc_templates",
    module: "Import LC",
    description: "Saved templates for Import LC requests",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "template_id", type: "text", nullable: false, defaultValue: null },
      { name: "template_name", type: "text", nullable: false, defaultValue: null },
      { name: "template_description", type: "text", nullable: true, defaultValue: null },
      { name: "product_name", type: "text", nullable: false, defaultValue: "'Import LC'" },
      { name: "template_data", type: "jsonb", nullable: false, defaultValue: null },
      { name: "source_transaction_ref", type: "text", nullable: true, defaultValue: null },
      { name: "tags", type: "text[]", nullable: true, defaultValue: null },
      { name: "is_active", type: "boolean", nullable: true, defaultValue: "true" },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ],
    foreignKeys: [{ column: "user_id", references: "custom_users.id" }]
  },
  {
    name: "import_lc_supporting_documents",
    module: "Import LC",
    description: "Supporting documents attached to Import LC requests",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "import_lc_request_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "file_name", type: "text", nullable: false, defaultValue: null },
      { name: "file_type", type: "text", nullable: true, defaultValue: null },
      { name: "file_size", type: "integer", nullable: true, defaultValue: null },
      { name: "file_path", type: "text", nullable: true, defaultValue: null },
      { name: "uploaded_at", type: "timestamptz", nullable: true, defaultValue: "now()" }
    ],
    foreignKeys: [{ column: "import_lc_request_id", references: "import_lc_requests.id" }]
  },

  // Export LC Module
  {
    name: "export_lc_bills",
    module: "Export LC",
    description: "Export LC bill submissions for document presentation",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "bill_reference", type: "text", nullable: false, defaultValue: null },
      { name: "lc_reference", type: "text", nullable: false, defaultValue: null },
      { name: "corporate_reference", type: "text", nullable: true, defaultValue: null },
      { name: "applicant_name", type: "text", nullable: true, defaultValue: null },
      { name: "issuing_bank", type: "text", nullable: true, defaultValue: null },
      { name: "lc_currency", type: "text", nullable: true, defaultValue: "'USD'" },
      { name: "lc_amount", type: "numeric", nullable: true, defaultValue: null },
      { name: "lc_expiry_date", type: "date", nullable: true, defaultValue: null },
      { name: "lc_expiry_place", type: "text", nullable: true, defaultValue: null },
      { name: "bill_currency", type: "text", nullable: true, defaultValue: "'USD'" },
      { name: "bill_amount", type: "numeric", nullable: true, defaultValue: null },
      { name: "bill_date", type: "date", nullable: true, defaultValue: null },
      { name: "bill_due_date", type: "date", nullable: true, defaultValue: null },
      { name: "tenor", type: "text", nullable: true, defaultValue: null },
      { name: "tenor_days", type: "integer", nullable: true, defaultValue: null },
      { name: "submission_type", type: "text", nullable: true, defaultValue: "'manual'" },
      { name: "status", type: "text", nullable: true, defaultValue: "'draft'" },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ]
  },
  {
    name: "export_lc_bill_documents",
    module: "Export LC",
    description: "Documents attached to Export LC bills",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "export_lc_bill_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "document_type", type: "text", nullable: false, defaultValue: null },
      { name: "document_name", type: "text", nullable: false, defaultValue: null },
      { name: "file_path", type: "text", nullable: true, defaultValue: null },
      { name: "file_size", type: "integer", nullable: true, defaultValue: null },
      { name: "uploaded_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ],
    foreignKeys: [{ column: "export_lc_bill_id", references: "export_lc_bills.id" }]
  },
  {
    name: "export_lc_bill_line_items",
    module: "Export LC",
    description: "Line items for Export LC bills",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "export_lc_bill_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "description", type: "text", nullable: false, defaultValue: null },
      { name: "quantity", type: "integer", nullable: false, defaultValue: "1" },
      { name: "unit_price", type: "numeric", nullable: false, defaultValue: null },
      { name: "line_total", type: "numeric", nullable: false, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ],
    foreignKeys: [{ column: "export_lc_bill_id", references: "export_lc_bills.id" }]
  },
  {
    name: "export_lc_reviews",
    module: "Export LC",
    description: "Export LC review responses (accept/reject)",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "lc_reference", type: "text", nullable: false, defaultValue: null },
      { name: "action", type: "text", nullable: false, defaultValue: null },
      { name: "status", type: "text", nullable: false, defaultValue: "'Submitted'" },
      { name: "issue_date", type: "date", nullable: true, defaultValue: null },
      { name: "expiry_date", type: "date", nullable: true, defaultValue: null },
      { name: "amount", type: "numeric", nullable: true, defaultValue: null },
      { name: "currency", type: "text", nullable: true, defaultValue: null },
      { name: "parties", type: "jsonb", nullable: true, defaultValue: null },
      { name: "lc_amount", type: "jsonb", nullable: true, defaultValue: null },
      { name: "shipment", type: "jsonb", nullable: true, defaultValue: null },
      { name: "documents", type: "jsonb", nullable: true, defaultValue: null },
      { name: "additional_conditions", type: "text", nullable: true, defaultValue: null },
      { name: "special_instructions", type: "text", nullable: true, defaultValue: null },
      { name: "comments", type: "text", nullable: true, defaultValue: null },
      { name: "submitted_at", type: "timestamptz", nullable: true, defaultValue: "now()" }
    ]
  },
  {
    name: "export_lc_amendment_responses",
    module: "Export LC",
    description: "Responses to Export LC amendments",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "lc_reference", type: "text", nullable: false, defaultValue: null },
      { name: "amendment_number", type: "text", nullable: false, defaultValue: null },
      { name: "action", type: "text", nullable: false, defaultValue: null },
      { name: "status", type: "text", nullable: false, defaultValue: "'Submitted'" },
      { name: "parties", type: "jsonb", nullable: true, defaultValue: null },
      { name: "lc_amount", type: "jsonb", nullable: true, defaultValue: null },
      { name: "shipment", type: "jsonb", nullable: true, defaultValue: null },
      { name: "documents", type: "jsonb", nullable: true, defaultValue: null },
      { name: "additional_conditions", type: "text", nullable: true, defaultValue: null },
      { name: "special_instructions", type: "text", nullable: true, defaultValue: null },
      { name: "comments", type: "text", nullable: true, defaultValue: null },
      { name: "submitted_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ]
  },
  {
    name: "lc_transfer_requests",
    module: "Export LC",
    description: "LC transfer requests from beneficiary to second beneficiaries",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "request_reference", type: "text", nullable: false, defaultValue: null },
      { name: "lc_reference", type: "text", nullable: false, defaultValue: null },
      { name: "current_beneficiary", type: "text", nullable: true, defaultValue: null },
      { name: "applicant", type: "text", nullable: true, defaultValue: null },
      { name: "issuing_bank", type: "text", nullable: true, defaultValue: null },
      { name: "issuance_date", type: "date", nullable: true, defaultValue: null },
      { name: "expiry_date", type: "date", nullable: true, defaultValue: null },
      { name: "currency", type: "text", nullable: true, defaultValue: null },
      { name: "amount", type: "numeric", nullable: true, defaultValue: null },
      { name: "transfer_type", type: "text", nullable: true, defaultValue: null },
      { name: "new_beneficiaries", type: "jsonb", nullable: true, defaultValue: null },
      { name: "transfer_conditions", type: "text", nullable: true, defaultValue: null },
      { name: "required_documents", type: "text[]", nullable: true, defaultValue: null },
      { name: "required_documents_checked", type: "jsonb", nullable: true, defaultValue: null },
      { name: "supporting_documents", type: "jsonb", nullable: true, defaultValue: null },
      { name: "status", type: "text", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: true, defaultValue: null },
      { name: "updated_at", type: "timestamptz", nullable: true, defaultValue: null }
    ],
    foreignKeys: [{ column: "user_id", references: "user_profiles.id" }]
  },
  {
    name: "assignment_requests",
    module: "Export LC",
    description: "LC proceeds assignment requests",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "request_reference", type: "text", nullable: false, defaultValue: null },
      { name: "lc_reference", type: "text", nullable: false, defaultValue: null },
      { name: "current_beneficiary", type: "text", nullable: true, defaultValue: null },
      { name: "applicant", type: "text", nullable: true, defaultValue: null },
      { name: "issuing_bank", type: "text", nullable: true, defaultValue: null },
      { name: "issuance_date", type: "date", nullable: true, defaultValue: null },
      { name: "expiry_date", type: "date", nullable: true, defaultValue: null },
      { name: "currency", type: "text", nullable: true, defaultValue: "'USD'" },
      { name: "amount", type: "numeric", nullable: true, defaultValue: null },
      { name: "assignment_type", type: "text", nullable: true, defaultValue: "'Assignment of Proceeds'" },
      { name: "assignee_name", type: "text", nullable: true, defaultValue: null },
      { name: "assignee_address", type: "text", nullable: true, defaultValue: null },
      { name: "assignee_country", type: "text", nullable: true, defaultValue: null },
      { name: "assignee_bank_name", type: "text", nullable: true, defaultValue: null },
      { name: "assignee_swift_code", type: "text", nullable: true, defaultValue: null },
      { name: "assignee_account_number", type: "text", nullable: true, defaultValue: null },
      { name: "assignee_bank_address", type: "text", nullable: true, defaultValue: null },
      { name: "assignment_percentage", type: "numeric", nullable: true, defaultValue: null },
      { name: "assignment_amount", type: "numeric", nullable: true, defaultValue: null },
      { name: "assignment_purpose", type: "text", nullable: true, defaultValue: null },
      { name: "assignment_conditions", type: "text", nullable: true, defaultValue: null },
      { name: "required_documents", type: "text[]", nullable: true, defaultValue: null },
      { name: "required_documents_checked", type: "jsonb", nullable: true, defaultValue: "'{}'" },
      { name: "supporting_documents", type: "jsonb", nullable: true, defaultValue: "'[]'" },
      { name: "status", type: "text", nullable: true, defaultValue: "'Submitted'" },
      { name: "created_at", type: "timestamptz", nullable: true, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: true, defaultValue: "now()" }
    ],
    foreignKeys: [{ column: "user_id", references: "user_profiles.id" }]
  },

  // Remittance & Payments Module
  {
    name: "remittance_transactions",
    module: "Remittance & Payments",
    description: "Customer credit transfer transactions (pacs.008)",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "transaction_ref", type: "text", nullable: false, defaultValue: null },
      { name: "transfer_type", type: "text", nullable: false, defaultValue: "'customer'" },
      { name: "direction", type: "text", nullable: false, defaultValue: "'outward'" },
      { name: "status", type: "text", nullable: false, defaultValue: "'draft'" },
      { name: "current_stage", type: "text", nullable: true, defaultValue: "'Data Entry'" },
      { name: "uetr", type: "text", nullable: true, defaultValue: null },
      { name: "ccy", type: "text", nullable: true, defaultValue: "'USD'" },
      { name: "inst_amt", type: "numeric", nullable: true, defaultValue: null },
      { name: "sttlm_amt", type: "numeric", nullable: true, defaultValue: null },
      { name: "cre_dt", type: "timestamptz", nullable: true, defaultValue: "now()" },
      { name: "val_dt", type: "date", nullable: true, defaultValue: null },
      { name: "ord_name", type: "text", nullable: true, defaultValue: null },
      { name: "ord_acct", type: "text", nullable: true, defaultValue: null },
      { name: "ord_addr1", type: "text", nullable: true, defaultValue: null },
      { name: "ord_country", type: "text", nullable: true, defaultValue: null },
      { name: "ben_name", type: "text", nullable: true, defaultValue: null },
      { name: "ben_acct", type: "text", nullable: true, defaultValue: null },
      { name: "ben_addr1", type: "text", nullable: true, defaultValue: null },
      { name: "ben_country", type: "text", nullable: true, defaultValue: null },
      { name: "ben_agt_bic", type: "text", nullable: true, defaultValue: null },
      { name: "ben_agt_name", type: "text", nullable: true, defaultValue: null },
      { name: "corporate_id", type: "text", nullable: true, defaultValue: "'TC001'" },
      { name: "created_by", type: "text", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: true, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: true, defaultValue: "now()" }
    ],
    foreignKeys: [{ column: "user_id", references: "custom_users.id" }]
  },
  {
    name: "interbank_settlements",
    module: "Remittance & Payments",
    description: "Financial institution credit transfers (pacs.009)",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "settlement_ref", type: "text", nullable: false, defaultValue: null },
      { name: "transfer_type", type: "text", nullable: false, defaultValue: "'fi'" },
      { name: "direction", type: "text", nullable: false, defaultValue: "'outward'" },
      { name: "status", type: "text", nullable: false, defaultValue: "'draft'" },
      { name: "current_stage", type: "text", nullable: true, defaultValue: "'Data Entry'" },
      { name: "uetr", type: "text", nullable: true, defaultValue: null },
      { name: "ccy", type: "text", nullable: true, defaultValue: "'USD'" },
      { name: "sttlm_amt", type: "numeric", nullable: true, defaultValue: null },
      { name: "sttlm_mtd", type: "text", nullable: true, defaultValue: null },
      { name: "cre_dt", type: "timestamptz", nullable: true, defaultValue: "now()" },
      { name: "val_dt", type: "date", nullable: true, defaultValue: null },
      { name: "instg_agt_name", type: "text", nullable: true, defaultValue: null },
      { name: "instg_agt_bic", type: "text", nullable: true, defaultValue: null },
      { name: "instd_agt_name", type: "text", nullable: true, defaultValue: null },
      { name: "instd_agt_bic", type: "text", nullable: true, defaultValue: null },
      { name: "linked_pacs008_ref", type: "text", nullable: true, defaultValue: null },
      { name: "linked_uetr", type: "text", nullable: true, defaultValue: null },
      { name: "parent_pacs008_id", type: "uuid", nullable: true, defaultValue: null },
      { name: "corporate_id", type: "text", nullable: true, defaultValue: "'TC001'" },
      { name: "created_by", type: "text", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: true, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: true, defaultValue: "now()" }
    ],
    foreignKeys: [
      { column: "user_id", references: "custom_users.id" },
      { column: "parent_pacs008_id", references: "remittance_transactions.id" }
    ]
  },

  // Bank Guarantee Module
  {
    name: "outward_bg_requests",
    module: "Bank Guarantee",
    description: "Outward bank guarantee issuance requests",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "request_reference", type: "text", nullable: false, defaultValue: null },
      { name: "senders_reference", type: "text", nullable: true, defaultValue: null },
      { name: "guarantee_type", type: "text", nullable: true, defaultValue: null },
      { name: "form_of_guarantee", type: "text", nullable: true, defaultValue: null },
      { name: "applicable_rules", type: "text", nullable: true, defaultValue: null },
      { name: "applicant_name", type: "text", nullable: true, defaultValue: null },
      { name: "applicant_address", type: "text", nullable: true, defaultValue: null },
      { name: "applicant_account_number", type: "text", nullable: true, defaultValue: null },
      { name: "beneficiary_name", type: "text", nullable: true, defaultValue: null },
      { name: "beneficiary_address", type: "text", nullable: true, defaultValue: null },
      { name: "beneficiary_bank_name", type: "text", nullable: true, defaultValue: null },
      { name: "beneficiary_bank_swift_code", type: "text", nullable: true, defaultValue: null },
      { name: "currency", type: "text", nullable: true, defaultValue: null },
      { name: "guarantee_amount", type: "numeric", nullable: true, defaultValue: null },
      { name: "date_of_issue", type: "date", nullable: true, defaultValue: null },
      { name: "date_of_expiry", type: "date", nullable: true, defaultValue: null },
      { name: "place_of_expiry", type: "text", nullable: true, defaultValue: null },
      { name: "guarantee_details", type: "text", nullable: true, defaultValue: null },
      { name: "underlying_contract_details", type: "text", nullable: true, defaultValue: null },
      { name: "contract_reference", type: "text", nullable: true, defaultValue: null },
      { name: "terms_and_conditions", type: "text", nullable: true, defaultValue: null },
      { name: "documents_required", type: "text", nullable: true, defaultValue: null },
      { name: "special_instructions", type: "text", nullable: true, defaultValue: null },
      { name: "supporting_documents", type: "jsonb", nullable: true, defaultValue: null },
      { name: "status", type: "text", nullable: false, defaultValue: "'draft'" },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ]
  },
  {
    name: "outward_bg_supporting_documents",
    module: "Bank Guarantee",
    description: "Supporting documents for outward BG requests",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "outward_bg_request_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "file_name", type: "text", nullable: false, defaultValue: null },
      { name: "file_type", type: "text", nullable: true, defaultValue: null },
      { name: "file_size", type: "integer", nullable: true, defaultValue: null },
      { name: "file_path", type: "text", nullable: true, defaultValue: null },
      { name: "uploaded_at", type: "timestamptz", nullable: true, defaultValue: "now()" }
    ],
    foreignKeys: [{ column: "outward_bg_request_id", references: "outward_bg_requests.id" }]
  },
  {
    name: "inward_bg_amendment_consents",
    module: "Bank Guarantee",
    description: "Consent responses to inward BG amendments",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "guarantee_reference", type: "text", nullable: false, defaultValue: null },
      { name: "amendment_number", type: "text", nullable: false, defaultValue: null },
      { name: "consent_action", type: "text", nullable: false, defaultValue: null },
      { name: "issuing_bank", type: "text", nullable: true, defaultValue: null },
      { name: "applicant_name", type: "text", nullable: true, defaultValue: null },
      { name: "beneficiary_name", type: "text", nullable: true, defaultValue: null },
      { name: "currency", type: "text", nullable: true, defaultValue: null },
      { name: "guarantee_amount", type: "text", nullable: true, defaultValue: null },
      { name: "issue_date", type: "date", nullable: true, defaultValue: null },
      { name: "expiry_date", type: "date", nullable: true, defaultValue: null },
      { name: "individual_consents", type: "jsonb", nullable: false, defaultValue: "'{}'" },
      { name: "rejection_reason", type: "text", nullable: true, defaultValue: null },
      { name: "status", type: "text", nullable: false, defaultValue: "'submitted'" },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ]
  },

  // Supply Chain Finance (SCF) Module
  {
    name: "scf_program_configurations",
    module: "Supply Chain Finance (SCF)",
    description: "SCF program configurations with financing terms",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "program_id", type: "text", nullable: false, defaultValue: null },
      { name: "program_name", type: "text", nullable: false, defaultValue: null },
      { name: "program_type", type: "text", nullable: false, defaultValue: null },
      { name: "buyer_name", type: "text", nullable: true, defaultValue: null },
      { name: "buyer_id", type: "text", nullable: true, defaultValue: null },
      { name: "supplier_name", type: "text", nullable: true, defaultValue: null },
      { name: "supplier_id", type: "text", nullable: true, defaultValue: null },
      { name: "currency", type: "text", nullable: true, defaultValue: "'USD'" },
      { name: "program_limit", type: "numeric", nullable: true, defaultValue: null },
      { name: "utilized_amount", type: "numeric", nullable: true, defaultValue: "0" },
      { name: "available_limit", type: "numeric", nullable: true, defaultValue: null },
      { name: "financing_percentage", type: "numeric", nullable: true, defaultValue: "80" },
      { name: "interest_rate", type: "numeric", nullable: true, defaultValue: null },
      { name: "tenor_days", type: "integer", nullable: true, defaultValue: "90" },
      { name: "auto_finance_enabled", type: "boolean", nullable: true, defaultValue: "false" },
      { name: "status", type: "text", nullable: true, defaultValue: "'active'" },
      { name: "start_date", type: "date", nullable: true, defaultValue: null },
      { name: "end_date", type: "date", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ]
  },
  {
    name: "scf_invoices",
    module: "Supply Chain Finance (SCF)",
    description: "Invoices submitted for SCF financing",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "program_id", type: "text", nullable: false, defaultValue: null },
      { name: "invoice_number", type: "text", nullable: false, defaultValue: null },
      { name: "invoice_date", type: "date", nullable: true, defaultValue: null },
      { name: "due_date", type: "date", nullable: true, defaultValue: null },
      { name: "buyer_name", type: "text", nullable: true, defaultValue: null },
      { name: "supplier_name", type: "text", nullable: true, defaultValue: null },
      { name: "currency", type: "text", nullable: true, defaultValue: "'USD'" },
      { name: "total_amount", type: "numeric", nullable: true, defaultValue: null },
      { name: "financed_amount", type: "numeric", nullable: true, defaultValue: null },
      { name: "outstanding_amount", type: "numeric", nullable: true, defaultValue: null },
      { name: "status", type: "text", nullable: true, defaultValue: "'pending'" },
      { name: "financing_status", type: "text", nullable: true, defaultValue: "'not_financed'" },
      { name: "approved_by_buyer", type: "boolean", nullable: true, defaultValue: "false" },
      { name: "approved_by_bank", type: "boolean", nullable: true, defaultValue: "false" },
      { name: "description", type: "text", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ]
  },
  {
    name: "invoice_disbursements",
    module: "Supply Chain Finance (SCF)",
    description: "Finance disbursement records for SCF invoices",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "scf_invoice_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "program_id", type: "text", nullable: false, defaultValue: null },
      { name: "loan_reference", type: "text", nullable: false, defaultValue: null },
      { name: "disbursed_amount", type: "numeric", nullable: false, defaultValue: null },
      { name: "finance_percentage", type: "numeric", nullable: false, defaultValue: null },
      { name: "disbursement_status", type: "text", nullable: false, defaultValue: "'pending'" },
      { name: "disbursed_at", type: "timestamptz", nullable: true, defaultValue: null },
      { name: "accounting_entry_ref", type: "text", nullable: true, defaultValue: null },
      { name: "rejection_reason", type: "text", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ],
    foreignKeys: [{ column: "scf_invoice_id", references: "scf_invoices.id" }]
  },
  {
    name: "invoice_repayments",
    module: "Supply Chain Finance (SCF)",
    description: "Repayment records for financed invoices",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "scf_invoice_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "program_id", type: "text", nullable: false, defaultValue: null },
      { name: "loan_reference", type: "text", nullable: false, defaultValue: null },
      { name: "repayment_reference", type: "text", nullable: false, defaultValue: null },
      { name: "repayment_date", type: "date", nullable: false, defaultValue: null },
      { name: "currency", type: "text", nullable: false, defaultValue: "'USD'" },
      { name: "repayment_amount", type: "numeric", nullable: false, defaultValue: null },
      { name: "principal_amount", type: "numeric", nullable: false, defaultValue: null },
      { name: "interest_amount", type: "numeric", nullable: false, defaultValue: null },
      { name: "penalty_amount", type: "numeric", nullable: true, defaultValue: "0" },
      { name: "repayment_mode", type: "text", nullable: true, defaultValue: null },
      { name: "repayment_status", type: "text", nullable: false, defaultValue: "'completed'" },
      { name: "accounting_entry_ref", type: "text", nullable: true, defaultValue: null },
      { name: "remarks", type: "text", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ],
    foreignKeys: [{ column: "scf_invoice_id", references: "scf_invoices.id" }]
  },
  {
    name: "finance_disbursements",
    module: "Supply Chain Finance (SCF)",
    description: "Bulk finance disbursement requests",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "disbursement_reference", type: "text", nullable: false, defaultValue: null },
      { name: "accounting_reference", type: "text", nullable: false, defaultValue: null },
      { name: "program_id", type: "text", nullable: false, defaultValue: null },
      { name: "program_name", type: "text", nullable: false, defaultValue: null },
      { name: "product_code", type: "text", nullable: false, defaultValue: null },
      { name: "product_name", type: "text", nullable: false, defaultValue: null },
      { name: "corporate_id", type: "text", nullable: false, defaultValue: null },
      { name: "finance_currency", type: "text", nullable: false, defaultValue: "'USD'" },
      { name: "invoice_currency", type: "text", nullable: false, defaultValue: "'USD'" },
      { name: "finance_amount", type: "numeric", nullable: false, defaultValue: null },
      { name: "interest_rate", type: "numeric", nullable: false, defaultValue: null },
      { name: "interest_rate_type", type: "text", nullable: false, defaultValue: "'manual'" },
      { name: "interest_amount", type: "numeric", nullable: false, defaultValue: null },
      { name: "total_repayment_amount", type: "numeric", nullable: false, defaultValue: null },
      { name: "finance_date", type: "date", nullable: false, defaultValue: null },
      { name: "finance_due_date", type: "date", nullable: false, defaultValue: null },
      { name: "finance_tenor_days", type: "integer", nullable: false, defaultValue: null },
      { name: "repayment_mode", type: "text", nullable: false, defaultValue: "'auto'" },
      { name: "repayment_party", type: "text", nullable: false, defaultValue: null },
      { name: "auto_repayment_enabled", type: "boolean", nullable: false, defaultValue: "false" },
      { name: "selected_invoices", type: "jsonb", nullable: false, defaultValue: "'[]'" },
      { name: "accounting_entries", type: "jsonb", nullable: false, defaultValue: "'[]'" },
      { name: "status", type: "text", nullable: false, defaultValue: "'draft'" },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ]
  },
  {
    name: "early_payment_requests",
    module: "Supply Chain Finance (SCF)",
    description: "Early payment discount requests from suppliers",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "program_id", type: "text", nullable: false, defaultValue: null },
      { name: "request_reference", type: "text", nullable: true, defaultValue: null },
      { name: "invoice_ids", type: "uuid[]", nullable: false, defaultValue: null },
      { name: "currency", type: "text", nullable: false, defaultValue: "'USD'" },
      { name: "total_original_amount", type: "numeric", nullable: false, defaultValue: null },
      { name: "discount_percentage", type: "numeric", nullable: false, defaultValue: null },
      { name: "total_discounted_amount", type: "numeric", nullable: false, defaultValue: null },
      { name: "total_savings", type: "numeric", nullable: false, defaultValue: null },
      { name: "estimated_payment_date", type: "date", nullable: true, defaultValue: null },
      { name: "status", type: "text", nullable: false, defaultValue: "'pending'" },
      { name: "remarks", type: "text", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ]
  },
  {
    name: "payment_requests",
    module: "Supply Chain Finance (SCF)",
    description: "Payment requests for approved invoices",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "program_id", type: "text", nullable: false, defaultValue: null },
      { name: "payment_reference", type: "text", nullable: true, defaultValue: null },
      { name: "invoice_ids", type: "uuid[]", nullable: false, defaultValue: null },
      { name: "currency", type: "text", nullable: false, defaultValue: "'USD'" },
      { name: "total_amount", type: "numeric", nullable: false, defaultValue: null },
      { name: "requested_payment_date", type: "date", nullable: true, defaultValue: null },
      { name: "status", type: "text", nullable: false, defaultValue: "'pending'" },
      { name: "notes", type: "text", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ]
  },

  // Documentary Collection Module
  {
    name: "outward_documentary_collection_bills",
    module: "Documentary Collection",
    description: "Outward documentary collection bill submissions",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "bill_reference", type: "text", nullable: false, defaultValue: null },
      { name: "drawer_name", type: "text", nullable: true, defaultValue: null },
      { name: "drawer_address", type: "text", nullable: true, defaultValue: null },
      { name: "drawee_payer_name", type: "text", nullable: true, defaultValue: null },
      { name: "drawee_payer_address", type: "text", nullable: true, defaultValue: null },
      { name: "collecting_bank", type: "text", nullable: true, defaultValue: null },
      { name: "collecting_bank_swift_code", type: "text", nullable: true, defaultValue: null },
      { name: "collecting_bank_address", type: "text", nullable: true, defaultValue: null },
      { name: "bill_currency", type: "text", nullable: true, defaultValue: null },
      { name: "bill_amount", type: "numeric", nullable: true, defaultValue: null },
      { name: "tenor_days", type: "integer", nullable: true, defaultValue: null },
      { name: "documents_against", type: "text", nullable: true, defaultValue: null },
      { name: "interest_charges", type: "text", nullable: true, defaultValue: null },
      { name: "protect_charges", type: "text", nullable: true, defaultValue: null },
      { name: "presentation_instructions", type: "text", nullable: true, defaultValue: null },
      { name: "special_instructions", type: "text", nullable: true, defaultValue: null },
      { name: "supporting_documents", type: "jsonb", nullable: true, defaultValue: null },
      { name: "status", type: "text", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ]
  },
  {
    name: "inward_dc_bill_acceptance_refusal",
    module: "Documentary Collection",
    description: "Inward documentary collection bill acceptance/refusal decisions",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "bill_reference", type: "text", nullable: false, defaultValue: null },
      { name: "collection_reference", type: "text", nullable: true, defaultValue: null },
      { name: "principal_name", type: "text", nullable: true, defaultValue: null },
      { name: "principal_address", type: "text", nullable: true, defaultValue: null },
      { name: "beneficiary_name", type: "text", nullable: true, defaultValue: null },
      { name: "beneficiary_address", type: "text", nullable: true, defaultValue: null },
      { name: "remitting_bank", type: "text", nullable: true, defaultValue: null },
      { name: "collecting_bank", type: "text", nullable: true, defaultValue: null },
      { name: "currency", type: "text", nullable: true, defaultValue: null },
      { name: "document_value", type: "numeric", nullable: true, defaultValue: null },
      { name: "payment_terms", type: "text", nullable: true, defaultValue: null },
      { name: "maturity_date", type: "date", nullable: true, defaultValue: null },
      { name: "decision", type: "text", nullable: true, defaultValue: null },
      { name: "discrepancies", type: "jsonb", nullable: true, defaultValue: null },
      { name: "documents", type: "jsonb", nullable: true, defaultValue: null },
      { name: "remarks", type: "text", nullable: true, defaultValue: null },
      { name: "internal_notes", type: "text", nullable: true, defaultValue: null },
      { name: "status", type: "text", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ]
  },
  {
    name: "inward_documentary_collection_bill_payments",
    module: "Documentary Collection",
    description: "Payment processing for inward documentary collection bills",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "bill_reference", type: "text", nullable: true, defaultValue: null },
      { name: "collection_reference", type: "text", nullable: true, defaultValue: null },
      { name: "transaction_reference", type: "text", nullable: true, defaultValue: null },
      { name: "related_reference", type: "text", nullable: true, defaultValue: null },
      { name: "drawer_name", type: "text", nullable: true, defaultValue: null },
      { name: "drawee_name", type: "text", nullable: true, defaultValue: null },
      { name: "beneficiary_name", type: "text", nullable: true, defaultValue: null },
      { name: "beneficiary_address", type: "text", nullable: true, defaultValue: null },
      { name: "beneficiary_account", type: "text", nullable: true, defaultValue: null },
      { name: "ordering_customer_name", type: "text", nullable: true, defaultValue: null },
      { name: "ordering_customer_address", type: "text", nullable: true, defaultValue: null },
      { name: "ordering_customer_account", type: "text", nullable: true, defaultValue: null },
      { name: "advising_bank_name", type: "text", nullable: true, defaultValue: null },
      { name: "advising_bank_swift_code", type: "text", nullable: true, defaultValue: null },
      { name: "advising_bank_address", type: "text", nullable: true, defaultValue: null },
      { name: "currency", type: "text", nullable: true, defaultValue: null },
      { name: "amount", type: "numeric", nullable: true, defaultValue: null },
      { name: "payment_date", type: "date", nullable: true, defaultValue: null },
      { name: "remittance_information", type: "text", nullable: true, defaultValue: null },
      { name: "sender_to_receiver_info", type: "text", nullable: true, defaultValue: null },
      { name: "supporting_documents", type: "jsonb", nullable: true, defaultValue: null },
      { name: "status", type: "text", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ]
  },
  {
    name: "inward_dc_bill_payment_documents",
    module: "Documentary Collection",
    description: "Documents attached to inward DC bill payments",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "payment_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "file_name", type: "text", nullable: false, defaultValue: null },
      { name: "file_type", type: "text", nullable: true, defaultValue: null },
      { name: "file_size", type: "integer", nullable: true, defaultValue: null },
      { name: "file_path", type: "text", nullable: true, defaultValue: null },
      { name: "uploaded_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ],
    foreignKeys: [{ column: "payment_id", references: "inward_documentary_collection_bill_payments.id" }]
  },

  // Workflow & Configuration Module
  {
    name: "workflow_templates",
    module: "Workflow & Configuration",
    description: "Workflow template definitions for different products",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "template_name", type: "text", nullable: false, defaultValue: null },
      { name: "product_code", type: "text", nullable: false, defaultValue: null },
      { name: "event_code", type: "text", nullable: false, defaultValue: null },
      { name: "description", type: "text", nullable: true, defaultValue: null },
      { name: "is_active", type: "boolean", nullable: true, defaultValue: "true" },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ]
  },
  {
    name: "workflow_stages",
    module: "Workflow & Configuration",
    description: "Stages within workflow templates",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "template_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "stage_name", type: "text", nullable: false, defaultValue: null },
      { name: "stage_order", type: "integer", nullable: false, defaultValue: null },
      { name: "stage_type", type: "text", nullable: true, defaultValue: null },
      { name: "is_mandatory", type: "boolean", nullable: true, defaultValue: "true" },
      { name: "approval_required", type: "boolean", nullable: true, defaultValue: "false" },
      { name: "approver_roles", type: "text[]", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ],
    foreignKeys: [{ column: "template_id", references: "workflow_templates.id" }]
  },
  {
    name: "workflow_stage_fields",
    module: "Workflow & Configuration",
    description: "Field configurations for workflow stages",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "stage_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "field_code", type: "text", nullable: false, defaultValue: null },
      { name: "field_label", type: "text", nullable: false, defaultValue: null },
      { name: "field_type", type: "text", nullable: false, defaultValue: null },
      { name: "is_required", type: "boolean", nullable: true, defaultValue: "false" },
      { name: "is_editable", type: "boolean", nullable: true, defaultValue: "true" },
      { name: "display_order", type: "integer", nullable: true, defaultValue: null },
      { name: "default_value", type: "text", nullable: true, defaultValue: null },
      { name: "validation_rules", type: "jsonb", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ],
    foreignKeys: [{ column: "stage_id", references: "workflow_stages.id" }]
  },
  {
    name: "pane_section_mappings",
    module: "Workflow & Configuration",
    description: "UI pane and section configuration for dynamic forms",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "product_code", type: "text", nullable: false, defaultValue: null },
      { name: "event_code", type: "text", nullable: false, defaultValue: null },
      { name: "business_application", type: "text[]", nullable: false, defaultValue: "'{}'" },
      { name: "customer_segment", type: "text[]", nullable: false, defaultValue: "'{}'" },
      { name: "panes", type: "jsonb", nullable: false, defaultValue: "'{}'" },
      { name: "is_active", type: "boolean", nullable: false, defaultValue: "true" },
      { name: "created_at", type: "timestamptz", nullable: true, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: true, defaultValue: "now()" }
    ]
  },
  {
    name: "field_repository",
    module: "Workflow & Configuration",
    description: "Master repository of form fields with display and validation configuration",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "field_id", type: "text", nullable: false, defaultValue: null },
      { name: "field_code", type: "text", nullable: true, defaultValue: null },
      { name: "field_label_key", type: "text", nullable: true, defaultValue: null },
      { name: "field_tooltip_key", type: "text", nullable: true, defaultValue: null },
      { name: "product_code", type: "text", nullable: false, defaultValue: null },
      { name: "event_type", type: "text", nullable: true, defaultValue: null },
      { name: "stage", type: "text", nullable: true, defaultValue: null },
      { name: "pane_code", type: "text", nullable: true, defaultValue: null },
      { name: "section_code", type: "text", nullable: true, defaultValue: null },
      { name: "ui_display_type", type: "text", nullable: true, defaultValue: null },
      { name: "data_type", type: "text", nullable: true, defaultValue: null },
      { name: "lookup_code", type: "text", nullable: true, defaultValue: null },
      { name: "dropdown_values", type: "text[]", nullable: true, defaultValue: null },
      { name: "length_min", type: "integer", nullable: true, defaultValue: null },
      { name: "length_max", type: "integer", nullable: true, defaultValue: null },
      { name: "decimal_places", type: "integer", nullable: true, defaultValue: null },
      { name: "is_mandatory_portal", type: "boolean", nullable: true, defaultValue: "false" },
      { name: "is_mandatory_mo", type: "boolean", nullable: true, defaultValue: "false" },
      { name: "is_mandatory_bo", type: "boolean", nullable: true, defaultValue: "false" },
      { name: "input_allowed_flag", type: "boolean", nullable: true, defaultValue: "true" },
      { name: "edit_allowed_flag", type: "boolean", nullable: true, defaultValue: "true" },
      { name: "view_allowed_flag", type: "boolean", nullable: true, defaultValue: "true" },
      { name: "read_only_flag", type: "boolean", nullable: true, defaultValue: "false" },
      { name: "default_value", type: "text", nullable: true, defaultValue: null },
      { name: "swift_mt_type", type: "text", nullable: true, defaultValue: null },
      { name: "swift_tag", type: "text", nullable: true, defaultValue: null },
      { name: "is_active_flag", type: "boolean", nullable: true, defaultValue: "true" },
      { name: "effective_from_date", type: "date", nullable: false, defaultValue: null },
      { name: "effective_to_date", type: "date", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: true, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: true, defaultValue: "now()" }
    ]
  },

  // Product Definitions Module
  {
    name: "product_event_mapping",
    module: "Product Definitions",
    description: "Mapping of products to events with target audience",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "module_code", type: "text", nullable: false, defaultValue: null },
      { name: "module_name", type: "text", nullable: false, defaultValue: null },
      { name: "product_code", type: "text", nullable: false, defaultValue: null },
      { name: "product_name", type: "text", nullable: false, defaultValue: null },
      { name: "event_code", type: "text", nullable: false, defaultValue: null },
      { name: "event_name", type: "text", nullable: false, defaultValue: null },
      { name: "target_audience", type: "text[]", nullable: false, defaultValue: null },
      { name: "business_application", type: "text[]", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ]
  },
  {
    name: "product_event_definitions",
    module: "Product Definitions",
    description: "Master list of product and event definitions",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "module_code", type: "text", nullable: false, defaultValue: null },
      { name: "product_code", type: "text", nullable: false, defaultValue: null },
      { name: "product_name", type: "text", nullable: false, defaultValue: null },
      { name: "event_code", type: "text", nullable: false, defaultValue: null },
      { name: "event_name", type: "text", nullable: false, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ]
  },

  // Master Data Module
  {
    name: "country_master",
    module: "Master Data",
    description: "Country reference data with ISO codes",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "country_code_iso2", type: "varchar", nullable: false, defaultValue: null },
      { name: "country_code_iso3", type: "varchar", nullable: false, defaultValue: null },
      { name: "country_name", type: "varchar", nullable: false, defaultValue: null },
      { name: "numeric_code", type: "varchar", nullable: true, defaultValue: null },
      { name: "phone_code", type: "varchar", nullable: true, defaultValue: null },
      { name: "region", type: "varchar", nullable: true, defaultValue: null },
      { name: "sub_region", type: "varchar", nullable: true, defaultValue: null },
      { name: "status", type: "boolean", nullable: false, defaultValue: "true" },
      { name: "created_by", type: "varchar", nullable: true, defaultValue: null },
      { name: "modified_by", type: "varchar", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "modified_at", type: "timestamptz", nullable: true, defaultValue: null }
    ]
  },
  {
    name: "state_master",
    module: "Master Data",
    description: "State/province reference data",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "state_code_iso", type: "varchar", nullable: false, defaultValue: null },
      { name: "state_name", type: "varchar", nullable: false, defaultValue: null },
      { name: "country_code_iso2", type: "varchar", nullable: false, defaultValue: null },
      { name: "status", type: "boolean", nullable: false, defaultValue: "true" },
      { name: "created_by", type: "varchar", nullable: true, defaultValue: null },
      { name: "modified_by", type: "varchar", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "modified_at", type: "timestamptz", nullable: true, defaultValue: null }
    ]
  },
  {
    name: "city_master",
    module: "Master Data",
    description: "City reference data with coordinates",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "city_code", type: "varchar", nullable: false, defaultValue: null },
      { name: "city_name", type: "varchar", nullable: false, defaultValue: null },
      { name: "state_code_iso", type: "varchar", nullable: false, defaultValue: null },
      { name: "country_code_iso2", type: "varchar", nullable: false, defaultValue: null },
      { name: "latitude", type: "numeric", nullable: true, defaultValue: null },
      { name: "longitude", type: "numeric", nullable: true, defaultValue: null },
      { name: "status", type: "boolean", nullable: false, defaultValue: "true" },
      { name: "created_by", type: "varchar", nullable: true, defaultValue: null },
      { name: "modified_by", type: "varchar", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "modified_at", type: "timestamptz", nullable: true, defaultValue: null }
    ]
  },

  // Transaction & Notifications Module
  {
    name: "transactions",
    module: "Transaction & Notifications",
    description: "Consolidated transaction records across all products",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "transaction_ref", type: "text", nullable: false, defaultValue: null },
      { name: "product_type", type: "text", nullable: false, defaultValue: null },
      { name: "process_type", type: "text", nullable: true, defaultValue: null },
      { name: "status", type: "text", nullable: true, defaultValue: "'draft'" },
      { name: "customer_name", type: "text", nullable: true, defaultValue: null },
      { name: "amount", type: "numeric", nullable: true, defaultValue: null },
      { name: "currency", type: "text", nullable: true, defaultValue: null },
      { name: "created_by", type: "text", nullable: true, defaultValue: null },
      { name: "initiating_channel", type: "text", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ]
  },
  {
    name: "notifications",
    module: "Transaction & Notifications",
    description: "User notifications for transaction events",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "transaction_ref", type: "text", nullable: false, defaultValue: null },
      { name: "transaction_type", type: "text", nullable: false, defaultValue: null },
      { name: "message", type: "text", nullable: false, defaultValue: null },
      { name: "is_read", type: "boolean", nullable: false, defaultValue: "false" },
      { name: "timestamp", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ]
  },

  // Invoice Management Module
  {
    name: "invoices",
    module: "Invoice Management",
    description: "Standard invoice records",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "invoice_number", type: "text", nullable: false, defaultValue: null },
      { name: "invoice_type", type: "text", nullable: false, defaultValue: null },
      { name: "invoice_date", type: "date", nullable: true, defaultValue: null },
      { name: "due_date", type: "date", nullable: true, defaultValue: null },
      { name: "customer_name", type: "text", nullable: true, defaultValue: null },
      { name: "customer_address", type: "text", nullable: true, defaultValue: null },
      { name: "customer_contact", type: "text", nullable: true, defaultValue: null },
      { name: "currency", type: "text", nullable: true, defaultValue: null },
      { name: "subtotal", type: "numeric", nullable: true, defaultValue: null },
      { name: "tax_amount", type: "numeric", nullable: true, defaultValue: null },
      { name: "discount_amount", type: "numeric", nullable: true, defaultValue: null },
      { name: "total_amount", type: "numeric", nullable: true, defaultValue: null },
      { name: "purchase_order_number", type: "text", nullable: true, defaultValue: null },
      { name: "purchase_order_date", type: "date", nullable: true, defaultValue: null },
      { name: "purchase_order_amount", type: "numeric", nullable: true, defaultValue: null },
      { name: "purchase_order_currency", type: "text", nullable: true, defaultValue: null },
      { name: "payment_terms", type: "text", nullable: true, defaultValue: null },
      { name: "notes", type: "text", nullable: true, defaultValue: null },
      { name: "status", type: "text", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: true, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: true, defaultValue: "now()" }
    ]
  },
  {
    name: "invoice_line_items",
    module: "Invoice Management",
    description: "Line items for standard invoices",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "invoice_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "description", type: "text", nullable: false, defaultValue: null },
      { name: "quantity", type: "integer", nullable: false, defaultValue: null },
      { name: "unit_price", type: "numeric", nullable: false, defaultValue: null },
      { name: "tax_rate", type: "numeric", nullable: true, defaultValue: "0" },
      { name: "line_total", type: "numeric", nullable: false, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: true, defaultValue: "now()" }
    ],
    foreignKeys: [{ column: "invoice_id", references: "invoices.id" }]
  },
  {
    name: "invoice_upload_batches",
    module: "Invoice Management",
    description: "Batch upload tracking for invoices",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "upload_type", type: "text", nullable: false, defaultValue: null },
      { name: "total_rows", type: "integer", nullable: false, defaultValue: "0" },
      { name: "successful_rows", type: "integer", nullable: false, defaultValue: "0" },
      { name: "rejected_rows", type: "integer", nullable: false, defaultValue: "0" },
      { name: "status", type: "text", nullable: false, defaultValue: "'processing'" },
      { name: "uploaded_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ]
  },
  {
    name: "invoice_upload_rejections",
    module: "Invoice Management",
    description: "Rejected rows from invoice batch uploads",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "batch_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "row_number", type: "integer", nullable: false, defaultValue: null },
      { name: "invoice_number", type: "text", nullable: true, defaultValue: null },
      { name: "rejection_reason", type: "text", nullable: false, defaultValue: null },
      { name: "raw_data", type: "jsonb", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ],
    foreignKeys: [{ column: "batch_id", references: "invoice_upload_batches.id" }]
  },
  {
    name: "invoice_scanned_documents",
    module: "Invoice Management",
    description: "Scanned document attachments for invoices",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "scf_invoice_id", type: "uuid", nullable: true, defaultValue: null },
      { name: "file_name", type: "text", nullable: false, defaultValue: null },
      { name: "file_type", type: "text", nullable: false, defaultValue: null },
      { name: "file_size", type: "integer", nullable: false, defaultValue: null },
      { name: "file_path", type: "text", nullable: false, defaultValue: null },
      { name: "uploaded_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ],
    foreignKeys: [{ column: "scf_invoice_id", references: "scf_invoices.id" }]
  },

  // Purchase & Proforma Module
  {
    name: "purchase_orders",
    module: "Purchase & Proforma",
    description: "Purchase order records",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "po_number", type: "text", nullable: false, defaultValue: null },
      { name: "po_date", type: "date", nullable: true, defaultValue: null },
      { name: "supplier_id", type: "text", nullable: true, defaultValue: null },
      { name: "supplier_name", type: "text", nullable: true, defaultValue: null },
      { name: "buyer_name", type: "text", nullable: true, defaultValue: null },
      { name: "currency", type: "text", nullable: true, defaultValue: null },
      { name: "grand_total", type: "numeric", nullable: true, defaultValue: null },
      { name: "payment_terms", type: "text", nullable: true, defaultValue: null },
      { name: "delivery_terms", type: "text", nullable: true, defaultValue: null },
      { name: "shipping_address", type: "text", nullable: true, defaultValue: null },
      { name: "billing_address", type: "text", nullable: true, defaultValue: null },
      { name: "notes", type: "text", nullable: true, defaultValue: null },
      { name: "status", type: "text", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: true, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: true, defaultValue: "now()" }
    ]
  },
  {
    name: "proforma_invoices",
    module: "Purchase & Proforma",
    description: "Proforma invoice records",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "pi_number", type: "text", nullable: false, defaultValue: null },
      { name: "pi_date", type: "date", nullable: true, defaultValue: null },
      { name: "buyer_id", type: "text", nullable: true, defaultValue: null },
      { name: "buyer_name", type: "text", nullable: true, defaultValue: null },
      { name: "currency", type: "text", nullable: true, defaultValue: null },
      { name: "grand_total", type: "numeric", nullable: true, defaultValue: null },
      { name: "shipping_cost", type: "numeric", nullable: true, defaultValue: null },
      { name: "payment_terms", type: "text", nullable: true, defaultValue: null },
      { name: "shipping_address", type: "text", nullable: true, defaultValue: null },
      { name: "billing_address", type: "text", nullable: true, defaultValue: null },
      { name: "same_as_shipping", type: "boolean", nullable: true, defaultValue: null },
      { name: "bank_details", type: "text", nullable: true, defaultValue: null },
      { name: "notes", type: "text", nullable: true, defaultValue: null },
      { name: "status", type: "text", nullable: true, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: true, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: true, defaultValue: "now()" }
    ]
  },
  {
    name: "popi_line_items",
    module: "Purchase & Proforma",
    description: "Line items for purchase orders and proforma invoices",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "purchase_order_id", type: "uuid", nullable: true, defaultValue: null },
      { name: "proforma_invoice_id", type: "uuid", nullable: true, defaultValue: null },
      { name: "description", type: "text", nullable: false, defaultValue: null },
      { name: "quantity", type: "integer", nullable: false, defaultValue: null },
      { name: "unit_price", type: "numeric", nullable: false, defaultValue: null },
      { name: "discount", type: "numeric", nullable: true, defaultValue: null },
      { name: "tax_rate", type: "numeric", nullable: true, defaultValue: null },
      { name: "line_total", type: "numeric", nullable: false, defaultValue: null },
      { name: "created_at", type: "timestamptz", nullable: true, defaultValue: "now()" }
    ],
    foreignKeys: [
      { column: "purchase_order_id", references: "purchase_orders.id" },
      { column: "proforma_invoice_id", references: "proforma_invoices.id" }
    ]
  },

  // Discrepancy Resolution Module
  {
    name: "discrepancy_resolutions",
    module: "Discrepancy Resolution",
    description: "LC discrepancy resolution records",
    columns: [
      { name: "id", type: "uuid", nullable: false, defaultValue: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", nullable: false, defaultValue: null },
      { name: "lc_reference", type: "text", nullable: false, defaultValue: null },
      { name: "bill_reference", type: "text", nullable: true, defaultValue: null },
      { name: "discrepancy_type", type: "text", nullable: true, defaultValue: null },
      { name: "discrepancy_description", type: "text", nullable: true, defaultValue: null },
      { name: "resolution_action", type: "text", nullable: true, defaultValue: null },
      { name: "resolution_comments", type: "text", nullable: true, defaultValue: null },
      { name: "resolved_by", type: "text", nullable: true, defaultValue: null },
      { name: "resolved_at", type: "timestamptz", nullable: true, defaultValue: null },
      { name: "status", type: "text", nullable: true, defaultValue: "'pending'" },
      { name: "created_at", type: "timestamptz", nullable: false, defaultValue: "now()" },
      { name: "updated_at", type: "timestamptz", nullable: false, defaultValue: "now()" }
    ]
  }
];

// Helper function to get tables by module
export const getTablesByModule = (moduleName: string): TableSchema[] => {
  return TABLE_SCHEMAS.filter(table => table.module === moduleName);
};

// Helper function to get module info
export const getModuleInfo = (moduleName: string): ModuleInfo | undefined => {
  return DATABASE_MODULES.find(m => m.name === moduleName);
};
