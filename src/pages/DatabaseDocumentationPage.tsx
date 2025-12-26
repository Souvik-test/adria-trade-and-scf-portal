import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, FileText, Database, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TABLE_SCHEMAS, DATABASE_MODULES } from "@/utils/databaseSchema";
import { generateDatabaseDocx, generateDatabaseJSON } from "@/utils/generateDatabaseDoc";
import { toast } from "sonner";

const DatabaseDocumentationPage = () => {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadDocx = async () => {
    setIsDownloading(true);
    try {
      await generateDatabaseDocx();
      toast.success("Documentation downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate documentation");
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadJSON = () => {
    try {
      generateDatabaseJSON();
      toast.success("JSON schema downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate JSON schema");
      console.error(error);
    }
  };

  const erdDiagram = `erDiagram
    %% ========== USER & AUTHENTICATION MODULE ==========
    custom_users {
        uuid id PK
        text user_id
        text password_hash
        text full_name
        text user_login_id
        text corporate_id
        user_role_type role_type
        scf_user_role scf_role
        boolean is_super_user
    }
    
    user_profiles {
        uuid id PK
        text email
        text full_name
        text role
    }
    
    user_permissions {
        uuid id PK
        uuid user_id FK
        text module_code
        text product_code
        text event_code
        boolean can_view
        boolean can_create
        boolean can_edit
        boolean can_approve
    }
    
    custom_users ||--o{ user_permissions : "has"
    
    %% ========== IMPORT LC MODULE ==========
    import_lc_requests {
        uuid id PK
        uuid user_id FK
        text corporate_reference
        text form_of_documentary_credit
        text applicant_name
        text beneficiary_name
        text currency
        numeric lc_amount
        date expiry_date
        text status
    }
    
    import_lc_templates {
        uuid id PK
        uuid user_id FK
        text template_id
        text template_name
        jsonb template_data
    }
    
    import_lc_supporting_documents {
        uuid id PK
        uuid import_lc_request_id FK
        text file_name
        text file_type
    }
    
    custom_users ||--o{ import_lc_requests : "creates"
    custom_users ||--o{ import_lc_templates : "saves"
    import_lc_requests ||--o{ import_lc_supporting_documents : "has"
    
    %% ========== EXPORT LC MODULE ==========
    export_lc_bills {
        uuid id PK
        uuid user_id FK
        text bill_reference
        text lc_reference
        text applicant_name
        numeric bill_amount
        text status
    }
    
    export_lc_bill_documents {
        uuid id PK
        uuid export_lc_bill_id FK
        text document_type
        text document_name
    }
    
    export_lc_bill_line_items {
        uuid id PK
        uuid export_lc_bill_id FK
        text description
        integer quantity
        numeric unit_price
        numeric line_total
    }
    
    export_lc_reviews {
        uuid id PK
        uuid user_id FK
        text lc_reference
        text action
        text status
    }
    
    export_lc_amendment_responses {
        uuid id PK
        uuid user_id FK
        text lc_reference
        text amendment_number
        text action
    }
    
    lc_transfer_requests {
        uuid id PK
        uuid user_id FK
        text request_reference
        text lc_reference
        text current_beneficiary
        numeric amount
    }
    
    assignment_requests {
        uuid id PK
        uuid user_id FK
        text request_reference
        text lc_reference
        text assignee_name
        numeric assignment_amount
    }
    
    export_lc_bills ||--o{ export_lc_bill_documents : "has"
    export_lc_bills ||--o{ export_lc_bill_line_items : "contains"
    
    %% ========== REMITTANCE & PAYMENTS MODULE ==========
    remittance_transactions {
        uuid id PK
        uuid user_id FK
        text transaction_ref
        text transfer_type
        text direction
        text status
        text ccy
        numeric inst_amt
        text ord_name
        text ben_name
    }
    
    interbank_settlements {
        uuid id PK
        uuid user_id FK
        text settlement_ref
        text transfer_type
        text status
        text ccy
        numeric sttlm_amt
        uuid parent_pacs008_id FK
    }
    
    custom_users ||--o{ remittance_transactions : "initiates"
    custom_users ||--o{ interbank_settlements : "creates"
    remittance_transactions ||--o{ interbank_settlements : "settles"
    
    %% ========== BANK GUARANTEE MODULE ==========
    outward_bg_requests {
        uuid id PK
        uuid user_id FK
        text request_reference
        text guarantee_type
        text applicant_name
        text beneficiary_name
        text currency
        numeric guarantee_amount
        text status
    }
    
    outward_bg_supporting_documents {
        uuid id PK
        uuid outward_bg_request_id FK
        text file_name
        text file_type
    }
    
    inward_bg_amendment_consents {
        uuid id PK
        uuid user_id FK
        text guarantee_reference
        text amendment_number
        text consent_action
    }
    
    outward_bg_requests ||--o{ outward_bg_supporting_documents : "has"
    
    %% ========== SUPPLY CHAIN FINANCE (SCF) MODULE ==========
    scf_program_configurations {
        uuid id PK
        uuid user_id FK
        text program_id
        text program_name
        text program_type
        text buyer_name
        text supplier_name
        numeric program_limit
        numeric financing_percentage
    }
    
    scf_invoices {
        uuid id PK
        uuid user_id FK
        text program_id FK
        text invoice_number
        date invoice_date
        date due_date
        text currency
        numeric total_amount
        text financing_status
    }
    
    invoice_disbursements {
        uuid id PK
        uuid scf_invoice_id FK
        text program_id
        text loan_reference
        numeric disbursed_amount
        text disbursement_status
    }
    
    invoice_repayments {
        uuid id PK
        uuid user_id FK
        uuid scf_invoice_id FK
        text loan_reference
        text repayment_reference
        numeric repayment_amount
        numeric principal_amount
        numeric interest_amount
    }
    
    finance_disbursements {
        uuid id PK
        uuid user_id FK
        text disbursement_reference
        text program_id
        numeric finance_amount
        numeric interest_rate
        text status
    }
    
    early_payment_requests {
        uuid id PK
        uuid user_id FK
        text program_id
        uuid[] invoice_ids
        numeric discount_percentage
        numeric total_discounted_amount
    }
    
    payment_requests {
        uuid id PK
        uuid user_id FK
        text program_id
        uuid[] invoice_ids
        numeric total_amount
        text status
    }
    
    scf_program_configurations ||--o{ scf_invoices : "finances"
    scf_invoices ||--o{ invoice_disbursements : "receives"
    scf_invoices ||--o{ invoice_repayments : "has"
    
    %% ========== DOCUMENTARY COLLECTION MODULE ==========
    outward_documentary_collection_bills {
        uuid id PK
        uuid user_id FK
        text bill_reference
        text drawer_name
        text drawee_payer_name
        text collecting_bank
        numeric bill_amount
    }
    
    inward_dc_bill_acceptance_refusal {
        uuid id PK
        uuid user_id FK
        text bill_reference
        text principal_name
        text beneficiary_name
        text decision
    }
    
    inward_documentary_collection_bill_payments {
        uuid id PK
        uuid user_id FK
        text bill_reference
        text transaction_reference
        numeric amount
        date payment_date
    }
    
    inward_dc_bill_payment_documents {
        uuid id PK
        uuid payment_id FK
        text file_name
        text file_type
    }
    
    inward_documentary_collection_bill_payments ||--o{ inward_dc_bill_payment_documents : "has"
    
    %% ========== WORKFLOW & CONFIGURATION MODULE ==========
    workflow_templates {
        uuid id PK
        uuid user_id FK
        text template_name
        text product_code
        text event_code
        boolean is_active
    }
    
    workflow_stages {
        uuid id PK
        uuid template_id FK
        text stage_name
        integer stage_order
        boolean approval_required
    }
    
    workflow_stage_fields {
        uuid id PK
        uuid stage_id FK
        text field_code
        text field_label
        text field_type
        boolean is_required
    }
    
    pane_section_mappings {
        uuid id PK
        uuid user_id FK
        text product_code
        text event_code
        jsonb panes
        boolean is_active
    }
    
    field_repository {
        uuid id PK
        uuid user_id FK
        text field_id
        text product_code
        text pane_code
        text section_code
        text ui_display_type
        text data_type
    }
    
    workflow_templates ||--o{ workflow_stages : "has"
    workflow_stages ||--o{ workflow_stage_fields : "contains"
    
    %% ========== PRODUCT DEFINITIONS MODULE ==========
    product_event_mapping {
        uuid id PK
        uuid user_id FK
        text module_code
        text product_code
        text event_code
        text[] target_audience
    }
    
    product_event_definitions {
        uuid id PK
        text module_code
        text product_code
        text event_code
        text event_name
    }
    
    %% ========== MASTER DATA MODULE ==========
    country_master {
        uuid id PK
        text country_code_iso2
        text country_code_iso3
        text country_name
        text region
    }
    
    state_master {
        uuid id PK
        text state_code_iso
        text state_name
        text country_code_iso2 FK
    }
    
    city_master {
        uuid id PK
        text city_code
        text city_name
        text state_code_iso FK
        text country_code_iso2 FK
    }
    
    country_master ||--o{ state_master : "contains"
    state_master ||--o{ city_master : "contains"
    
    %% ========== TRANSACTION & NOTIFICATIONS MODULE ==========
    transactions {
        uuid id PK
        uuid user_id FK
        text transaction_ref
        text product_type
        text process_type
        text status
        numeric amount
        text currency
    }
    
    notifications {
        uuid id PK
        uuid user_id FK
        text transaction_ref
        text transaction_type
        text message
        boolean is_read
    }
    
    custom_users ||--o{ transactions : "creates"
    custom_users ||--o{ notifications : "receives"
    
    %% ========== INVOICE MANAGEMENT MODULE ==========
    invoices {
        uuid id PK
        uuid user_id FK
        text invoice_number
        text invoice_type
        text customer_name
        numeric total_amount
        text status
    }
    
    invoice_line_items {
        uuid id PK
        uuid invoice_id FK
        text description
        integer quantity
        numeric unit_price
        numeric line_total
    }
    
    invoice_upload_batches {
        uuid id PK
        uuid user_id FK
        text upload_type
        integer total_rows
        integer successful_rows
        integer rejected_rows
    }
    
    invoice_upload_rejections {
        uuid id PK
        uuid batch_id FK
        integer row_number
        text rejection_reason
    }
    
    invoice_scanned_documents {
        uuid id PK
        uuid scf_invoice_id FK
        text file_name
        text file_type
    }
    
    invoices ||--o{ invoice_line_items : "contains"
    invoice_upload_batches ||--o{ invoice_upload_rejections : "has"
    scf_invoices ||--o{ invoice_scanned_documents : "has"
    
    %% ========== PURCHASE & PROFORMA MODULE ==========
    purchase_orders {
        uuid id PK
        uuid user_id FK
        text po_number
        text supplier_name
        text buyer_name
        numeric grand_total
        text status
    }
    
    proforma_invoices {
        uuid id PK
        uuid user_id FK
        text pi_number
        text buyer_name
        numeric grand_total
        text status
    }
    
    popi_line_items {
        uuid id PK
        uuid purchase_order_id FK
        uuid proforma_invoice_id FK
        text description
        integer quantity
        numeric unit_price
        numeric line_total
    }
    
    purchase_orders ||--o{ popi_line_items : "contains"
    proforma_invoices ||--o{ popi_line_items : "contains"
    
    %% ========== DISCREPANCY RESOLUTION MODULE ==========
    discrepancy_resolutions {
        uuid id PK
        uuid user_id FK
        text lc_reference
        text bill_reference
        text discrepancy_type
        text resolution_action
        text status
    }`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Database className="h-6 w-6 text-primary" />
                  Database ERD
                </h1>
                <p className="text-muted-foreground text-sm">
                  Entity Relationship Diagram - {TABLE_SCHEMAS.length} tables across {DATABASE_MODULES.length} modules
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownloadJSON}>
                <FileText className="h-4 w-4 mr-2" />
                Download JSON
              </Button>
              <Button onClick={handleDownloadDocx} disabled={isDownloading}>
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? "Generating..." : "Download DOCX"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ERD Content */}
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Complete Entity Relationship Diagram</CardTitle>
            <CardDescription>
              Full database schema showing all {TABLE_SCHEMAS.length} tables with their columns and relationships
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="bg-muted/30 rounded-lg p-6">
                <pre className="text-xs font-mono whitespace-pre overflow-x-auto leading-relaxed">
                  {erdDiagram}
                </pre>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DatabaseDocumentationPage;
