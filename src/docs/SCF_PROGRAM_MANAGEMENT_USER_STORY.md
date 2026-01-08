# EPIC: SCF Program Management

## 1. EPIC Description (for JIRA)

**EPIC Title:** SCF Program Management

**EPIC ID:** EPIC-SCF-002

### Description
The SCF Program Management module enables financial institutions to configure and manage Supply Chain Finance (SCF) programs. A program represents a specific financing arrangement between an anchor party (buyer or seller) and their counter-parties, with defined limits, tenors, disbursement rules, and fee structures. This module builds upon the Product Definition module by allowing programs to be created under defined products.

### Business Value
- Enables creation of customized financing programs tailored to specific anchor-counterparty relationships
- Provides granular control over disbursement and repayment parameters
- Supports limit management at program, anchor, and counter-party levels
- Facilitates fee configuration and appropriation sequence management
- Supports early payment discount and dynamic discounting features
- Enables factoring arrangements with configurable parameters

### Scope
- Program CRUD operations (Create, Read, Update, Delete)
- Program copying for rapid setup of similar programs
- Multi-tab form interface for comprehensive configuration
- Counter-party management within programs
- Fee catalogue configuration
- Insurance policy management
- Integration with Product Definition module

---

## 2. User Stories

| Story ID | Title | Description | Acceptance Criteria | Priority |
|----------|-------|-------------|---------------------|----------|
| US-SPM-001 | View Program List | As an SCF Administrator, I want to view all configured SCF programs so that I can manage the program catalog | - Display all programs in a sortable table<br>- Show key program attributes (ID, name, product, anchor, limits)<br>- Support search/filter functionality | High |
| US-SPM-002 | Create New Program | As an SCF Administrator, I want to create a new SCF program configuration so that I can set up financing arrangements | - Multi-tab form for comprehensive configuration<br>- Product code selection from defined products<br>- Validation of mandatory fields<br>- Success/error notifications | High |
| US-SPM-003 | Edit Program | As an SCF Administrator, I want to edit an existing program configuration so that I can update program parameters | - Pre-populate form with existing values<br>- Maintain program ID and audit trail<br>- Validate changes before save | High |
| US-SPM-004 | Delete Program | As an SCF Administrator, I want to delete a program configuration so that I can remove obsolete programs | - Confirmation dialog before deletion<br>- Cascade handling for linked invoices<br>- Audit log entry | Medium |
| US-SPM-005 | Copy Program | As an SCF Administrator, I want to copy an existing program so that I can quickly create similar programs | - Pre-populate form with copied values<br>- Auto-append "_COPY" to program ID<br>- Set status to "draft" for review | Medium |
| US-SPM-006 | Configure Counter-Parties | As an SCF Administrator, I want to add/remove counter-parties to a program so that I can define participant limits | - Add multiple counter-parties<br>- Set individual limits per counter-party<br>- Auto-populate available limit | High |
| US-SPM-007 | Configure Disbursement Rules | As an SCF Administrator, I want to configure disbursement parameters so that I can control how financing is released | - Set multiple/auto disbursement options<br>- Configure holiday treatment<br>- Set finance percentage and tenor | High |
| US-SPM-008 | Configure Repayment Rules | As an SCF Administrator, I want to configure repayment parameters so that I can control how repayments are processed | - Set repayment party<br>- Configure auto-repayment<br>- Define appropriation sequence | High |
| US-SPM-009 | Configure Fee Catalogue | As an SCF Administrator, I want to configure fees for a program so that I can define charges and commissions | - Add/remove fee items<br>- Set fee types, calculation methods, and rates<br>- Configure frequency and timing | Medium |
| US-SPM-010 | Enable Factoring | As an SCF Administrator, I want to enable and configure factoring for a program so that I can support factoring arrangements | - Toggle factoring enablement<br>- Set geography, recourse type, disclosure<br>- Configure delivery model and risk bearer | Medium |

---

## 3. UI Components and Field Specifications

### 3.1 Screen Layout - Program List

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Program Configuration                                  [Go to Product] [Add]│
│  Manage SCF program configurations and parameters                            │
│  (Filtered by Product: INV_FIN) <- shown when coming from Product Definition │
├──────────────────────────────────────────────────────────────────────────────┤
│  [🔍 Search by program name, ID, product code, or anchor...]                 │
├──────────────────────────────────────────────────────────────────────────────┤
│ Program ID | Program Name | Product | Anchor | Limit | Available | Effective │
│            |              | Code    | Name   |       | Limit     | Date      │
│ Expiry Date| Status | Actions                                                │
├──────────────────────────────────────────────────────────────────────────────┤
│ PRG-001    | Invoice Fin  | INV_FIN | Acme   | 1M    | 800K      | 2024-01-01│
│ 2025-12-31 | [Active]     | [👁] [✏] [📋] [🗑]                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Screen Layout - Program Form Dialog (Multi-Tab)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Add Program Configuration                                                    │
│  Create a new SCF program configuration                                       │
├──────────────────────────────────────────────────────────────────────────────┤
│  [General & Party Details] [Disbursement & Repayment] [Fee Catalogue]        │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ╔═══════════════════════════════════════════════════════════════════════╗   │
│  ║ PROGRAM FEATURES                                                       ║   │
│  ║  [☐] Early Payment Discount     [☐] Dynamic Discounting (Coming Soon) ║   │
│  ║  Default Discount %: [____]                                            ║   │
│  ╚═══════════════════════════════════════════════════════════════════════╝   │
│                                                                               │
│  ╔═══════════════════════════════════════════════════════════════════════╗   │
│  ║ GENERAL DETAILS                                                        ║   │
│  ║  [Program ID *] [Program Name *] [Product Code *]                      ║   │
│  ║  [Product Name] [Program Currency] [Program Limit *]                   ║   │
│  ║  [Available Limit *] [Effective Date *] [Expiry Date *]                ║   │
│  ║  [Program Description                                              ]   ║   │
│  ╚═══════════════════════════════════════════════════════════════════════╝   │
│                                                                               │
│  ╔═══════════════════════════════════════════════════════════════════════╗   │
│  ║ OVERRIDE CRITERIA                                                      ║   │
│  ║  [☐] Override Limit Restrictions                                       ║   │
│  ║  [☐] Override Tenor Calculation                                        ║   │
│  ╚═══════════════════════════════════════════════════════════════════════╝   │
│                                                                               │
│  ╔═══════════════════════════════════════════════════════════════════════╗   │
│  ║ PARTY DETAILS - ANCHOR                                                 ║   │
│  ║  [Anchor ID] [🔍] [Anchor Name *] [Anchor Account]                     ║   │
│  ║  [Anchor Limit Currency] [Anchor Limit] [Anchor Available Limit]       ║   │
│  ╚═══════════════════════════════════════════════════════════════════════╝   │
│                                                                               │
│  ╔═══════════════════════════════════════════════════════════════════════╗   │
│  ║ COUNTER-PARTY DETAILS                                    [+ Add]      ║   │
│  ║  ID | Name | Limit Ccy | Limit | Available Limit | Disbursement | Del ║   │
│  ║  CP001 | Vendor A | USD | 100,000 | 100,000 | Wire | [🗑]             ║   │
│  ╚═══════════════════════════════════════════════════════════════════════╝   │
│                                                                               │
│                                                            [Next →]          │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Tab 1: General & Party Details - Field Specifications

#### Program Features Section
| Field Name | UI Component | Data Type | Mandatory | Validation Rules | Default Value |
|------------|--------------|-----------|-----------|------------------|---------------|
| Early Payment Discount Enabled | Checkbox | boolean | No | - | false |
| Dynamic Discounting Enabled | Checkbox | boolean | No | Disabled (Coming Soon) | false |
| Default Discount Percentage | Input (Number) | number | Conditional | 0-100, shown when Early Payment enabled | 0 |

#### General Details Section
| Field Name | UI Component | Data Type | Mandatory | Max Length | Validation Rules | Default Value |
|------------|--------------|-----------|-----------|------------|------------------|---------------|
| Program ID | Input (Text) | string | Yes | 50 | Alphanumeric, unique | Empty |
| Program Name | Input (Text) | string | Yes | 255 | Non-empty | Empty |
| Product Code | Select Dropdown | string | Yes | - | Must select from active products | Empty |
| Product Name | Input (Readonly) | string | No | - | Auto-populated from Product Code | Empty |
| Program Currency | Select Dropdown | string | Yes | - | USD, EUR, GBP, INR | USD |
| Program Limit | Input (Number) | number | Yes | - | Must be positive | 0 |
| Available Limit | Input (Number) | number | Yes | - | Must be positive | 0 |
| Effective Date | Date Picker | date | Yes | - | Cannot be in past | Empty |
| Expiry Date | Date Picker | date | Yes | - | Must be after Effective Date | Empty |
| Program Description | Textarea | string | No | 1000 | - | Empty |

#### Override Criteria Section
| Field Name | UI Component | Data Type | Mandatory | Description | Default Value |
|------------|--------------|-----------|-----------|-------------|---------------|
| Override Limit Restrictions | Checkbox | boolean | No | Allow invoice creation when limits exceeded | false |
| Override Tenor Calculation | Checkbox | boolean | No | Allow invoice creation when tenor outside range | false |

#### Anchor Details Section
| Field Name | UI Component | Data Type | Mandatory | Validation Rules | Default Value |
|------------|--------------|-----------|-----------|------------------|---------------|
| Anchor ID | Input (Text) + Search | string | No | - | Empty |
| Anchor Name | Input (Text) | string | Yes | Non-empty | Empty |
| Anchor Account | Input (Text) | string | No | - | Empty |
| Anchor Limit Currency | Select Dropdown | string | No | USD, EUR, GBP, INR | USD |
| Anchor Limit | Input (Number) | number | No | Must be positive | 0 |
| Anchor Available Limit | Input (Number) | number | No | Must be positive, auto-populated | 0 |

#### Counter-Party Details Section (Repeating Group)
| Field Name | UI Component | Data Type | Mandatory | Validation Rules | Default Value |
|------------|--------------|-----------|-----------|------------------|---------------|
| Counter Party ID | Input (Text) | string | No | - | Empty |
| Counter Party Name | Input (Text) | string | No | - | Empty |
| Limit Currency | Select Dropdown | string | No | Inherits from Program Currency | USD |
| Limit Amount | Input (Number) | number | No | Must be positive | 0 |
| Available Limit Amount | Input (Number) | number | No | Auto-populated from Limit Amount | 0 |
| Disbursement Currency | Select Dropdown | string | No | Inherits from Program Currency | USD |
| Preferred Disbursement Method | Input (Text) | string | No | - | Empty |

### 3.4 Tab 2: Disbursement & Repayment - Field Specifications

#### Disbursement Parameters Section
| Field Name | UI Component | Data Type | Mandatory | Validation Rules | Default Value |
|------------|--------------|-----------|-----------|------------------|---------------|
| Multiple Disbursement | Switch | boolean | No | - | false |
| Max Disbursements Allowed | Input (Number) | number | Conditional | 1-100, shown when Multiple Disbursement enabled | 1 |
| Auto-Disbursement | Switch | boolean | No | - | false |
| Holiday Treatment | Select Dropdown | string | No | Next Business Day, Previous Business Day, No Change | Next Business Day |

#### Repayment Parameters Section
| Field Name | UI Component | Data Type | Mandatory | Validation Rules | Default Value |
|------------|--------------|-----------|-----------|------------------|---------------|
| Repayment By | Select Dropdown | string | No | Buyer, Supplier, Account Debit | Buyer |
| Debit Account Number | Input (Text) | string | Conditional | Shown when Repayment By = Account Debit | Empty |
| Auto-Repayment | Switch | boolean | No | - | false |
| Part Payment Allowed | Switch | boolean | No | - | false |
| Pre-Payment Allowed | Switch | boolean | No | - | false |
| Charge Penalty on Prepayment | Switch | boolean | No | - | false |

#### Tenor Parameters Section
| Field Name | UI Component | Data Type | Mandatory | Validation Rules | Default Value |
|------------|--------------|-----------|-----------|------------------|---------------|
| Min Tenor Years | Input (Number) | number | No | 0-100 | 0 |
| Min Tenor Months | Input (Number) | number | No | 0-11 | 0 |
| Min Tenor Days | Input (Number) | number | No | 0-9999 | 0 |
| Max Tenor Years | Input (Number) | number | No | 0-100 | 0 |
| Max Tenor Months | Input (Number) | number | No | 0-11 | 0 |
| Max Tenor Days | Input (Number) | number | No | 0-9999 | 0 |
| Finance Percentage | Input (Number) | number | No | 0-100 | 100 |
| Margin Percentage | Input (Number) | number | No | 0-100 | 0 |
| Grace Days | Input (Number) | number | No | Must be positive | 0 |
| Stale Period | Input (Number) | number | No | Must be positive | 0 |

#### Invoice Financing Options Section
| Field Name | UI Component | Data Type | Mandatory | Validation Rules | Default Value |
|------------|--------------|-----------|-----------|------------------|---------------|
| Assignment Enabled | Switch | boolean | No | - | false |
| Assignment Percentage | Input (Number) | number | Conditional | 0-100 | 0 |
| Unaccepted Invoice Finance Enabled | Switch | boolean | No | - | false |
| Unaccepted Invoice Percentage | Input (Number) | number | Conditional | 0-100 | 0 |
| Recourse Enabled | Switch | boolean | No | - | false |
| Recourse Percentage | Input (Number) | number | Conditional | 0-100 | 0 |

#### Appropriation Sequence Section (Drag & Drop)
| Field Name | UI Component | Data Type | Description | Options |
|------------|--------------|-----------|-------------|---------|
| Appropriation Sequence (After Due) | Sortable List | array | Order for applying payments after due date | P (Principal), I (Interest), C (Charge), N (Penalty) |
| Appropriation Sequence (Before Due) | Sortable List | array | Order for applying payments before due date | P (Principal), I (Interest), C (Charge), N (Penalty) |

#### Insurance Section
| Field Name | UI Component | Data Type | Mandatory | Default Value |
|------------|--------------|-----------|-----------|---------------|
| Insurance Required | Switch | boolean | No | false |
| Insurance Policies | Repeating Group | array | Conditional | [] |

#### Factoring Section
| Field Name | UI Component | Data Type | Mandatory | Options | Default Value |
|------------|--------------|-----------|-----------|---------|---------------|
| Factoring Enabled | Switch | boolean | No | - | false |
| Factoring Geography | Select Dropdown | string | Conditional | Domestic, Cross-Border | Empty |
| Factoring Recourse Type | Select Dropdown | string | Conditional | With Recourse, Without Recourse, Limited Recourse | Empty |
| Factoring Disclosure | Select Dropdown | string | Conditional | Disclosed, Undisclosed | Empty |
| Factoring Delivery Model | Select Dropdown | string | No | Notification, Non-Notification | Empty |
| Factoring Risk Bearer | Select Dropdown | string | No | Factor, Client, Shared | Empty |

### 3.5 Tab 3: Fee Catalogue - Field Specifications

#### Fee Catalogue Section (Repeating Group)
| Field Name | UI Component | Data Type | Mandatory | Options/Validation | Default Value |
|------------|--------------|-----------|-----------|-------------------|---------------|
| Fee Code | Input (Text) | string | Yes | Alphanumeric | Empty |
| Fee Type | Select Dropdown | string | Yes | Processing Fee, Commitment Fee, Interest, Commission, Late Payment Penalty, Early Payment Discount | Empty |
| Calculation Method | Select Dropdown | string | Yes | Flat, Percentage, Tiered | Empty |
| Rate/Amount | Input (Number) | number | Yes | Must be positive | 0 |
| Frequency | Select Dropdown | string | No | One-Time, Monthly, Quarterly, Annually | One-Time |
| Charge Timing | Select Dropdown | string | No | Upfront, Arrears, On Due Date | Upfront |
| Tax Applicable | Switch | boolean | No | - | false |
| Tax Rate | Input (Number) | number | Conditional | 0-100 | 0 |

### 3.6 Auto-Population Rules

| Trigger Field | Target Field | Rule |
|---------------|--------------|------|
| Program Limit | Available Limit | Copy value (in add mode) |
| Program Currency | Anchor Limit Currency | Copy value |
| Anchor Name | Anchor Party | Copy value |
| Product Code | Product Name | Lookup from scf_product_definitions |
| Anchor Limit | Anchor Available Limit | Copy value (in add mode) |
| Counter Party Limit Amount | Counter Party Available Limit Amount | Copy value |
| Program Currency | Counter Party Limit Currency | Copy value for new counter-parties |

### 3.7 UI Components Used

| Component | Source | Purpose |
|-----------|--------|---------|
| Dialog | `@/components/ui/dialog` | Form modal container |
| Tabs | `@/components/ui/tabs` | Multi-section form navigation |
| Form | `react-hook-form` + `zod` | Form management and validation |
| Button | `@/components/ui/button` | Form actions (Save, Cancel, Next, Previous) |
| Input | `@/components/ui/input` | Text and number input fields |
| Textarea | `@/components/ui/textarea` | Program description |
| Select | `@/components/ui/select` | Dropdown selections |
| Switch | `@/components/ui/switch` | Boolean toggles |
| Checkbox | `@/components/ui/checkbox` | Feature flags |
| Table | `@/components/ui/table` | Program listing, counter-parties |
| Badge | `@/components/ui/badge` | Status indicators |
| Card | `@/components/ui/card` | Section containers |
| AlertDialog | `@/components/ui/alert-dialog` | Delete confirmation, validation errors |

---

## 4. Database Table Details

### 4.1 Table: `scf_program_configurations`

| Column Name | Data Type | Nullable | Default | Constraints | Description |
|-------------|-----------|----------|---------|-------------|-------------|
| `id` | UUID | NO | gen_random_uuid() | PRIMARY KEY | Auto-generated unique identifier |
| `user_id` | UUID | NO | - | NOT NULL | Creator of the program record |
| `program_id` | TEXT | NO | - | NOT NULL | Unique program identifier code |
| `program_name` | TEXT | NO | - | NOT NULL | Display name of the program |
| `product_code` | TEXT | NO | - | NOT NULL | Reference to product definition |
| `product_name` | TEXT | YES | NULL | - | Product name (denormalized) |
| `program_description` | TEXT | YES | NULL | - | Optional detailed description |
| `program_currency` | TEXT | NO | 'USD' | NOT NULL | Base currency for the program |
| `program_limit` | NUMERIC | NO | - | NOT NULL | Total program limit amount |
| `available_limit` | NUMERIC | NO | - | NOT NULL | Current available limit |
| `effective_date` | DATE | NO | - | NOT NULL | Program start date |
| `expiry_date` | DATE | NO | - | NOT NULL | Program end date |
| `status` | TEXT | NO | 'active' | NOT NULL | Program status (active, inactive, draft) |
| `anchor_id` | TEXT | YES | NULL | - | Anchor party identifier |
| `anchor_name` | TEXT | NO | - | NOT NULL | Anchor party name |
| `anchor_account` | TEXT | YES | NULL | - | Anchor account number |
| `anchor_limit` | NUMERIC | YES | NULL | - | Anchor-specific limit |
| `anchor_available_limit` | NUMERIC | YES | NULL | - | Anchor available limit |
| `anchor_limit_currency` | TEXT | YES | 'USD' | - | Anchor limit currency |
| `anchor_party` | TEXT | YES | NULL | - | Anchor party reference |
| `counter_parties` | JSONB | YES | '[]' | - | Array of counter-party objects |
| `borrower_selection` | TEXT | YES | 'Anchor Party' | - | Who is the borrower |
| `finance_tenor` | INTEGER | YES | NULL | - | Finance tenor value |
| `finance_tenor_unit` | TEXT | YES | 'days' | - | Tenor unit (days, months, years) |
| `min_tenor` | INTEGER | YES | NULL | - | Minimum tenor in days |
| `max_tenor` | INTEGER | YES | NULL | - | Maximum tenor in days |
| `min_tenor_years` | INTEGER | YES | 0 | - | Min tenor years component |
| `min_tenor_months` | INTEGER | YES | 0 | - | Min tenor months component |
| `min_tenor_days` | INTEGER | YES | 0 | - | Min tenor days component |
| `max_tenor_years` | INTEGER | YES | 0 | - | Max tenor years component |
| `max_tenor_months` | INTEGER | YES | 0 | - | Max tenor months component |
| `max_tenor_days` | INTEGER | YES | 0 | - | Max tenor days component |
| `min_tenor_total_days` | INTEGER | YES | NULL | - | Calculated min tenor total days |
| `max_tenor_total_days` | INTEGER | YES | NULL | - | Calculated max tenor total days |
| `margin_percentage` | NUMERIC | YES | 0 | - | Margin percentage |
| `finance_percentage` | NUMERIC | YES | 100 | - | Maximum finance percentage |
| `grace_days` | INTEGER | YES | 0 | - | Grace period in days |
| `stale_period` | INTEGER | YES | 0 | - | Stale period in days |
| `multiple_disbursement` | BOOLEAN | YES | false | - | Allow multiple disbursements |
| `max_disbursements_allowed` | INTEGER | YES | 1 | - | Maximum disbursement count |
| `auto_disbursement` | BOOLEAN | YES | false | - | Enable auto-disbursement |
| `holiday_treatment` | TEXT | YES | 'Next Business Day' | - | Holiday treatment method |
| `repayment_by` | TEXT | YES | 'Buyer' | - | Who makes repayments |
| `debit_account_number` | TEXT | YES | NULL | - | Account for auto-debit |
| `auto_repayment` | BOOLEAN | YES | false | - | Enable auto-repayment |
| `part_payment_allowed` | BOOLEAN | YES | false | - | Allow partial payments |
| `pre_payment_allowed` | BOOLEAN | YES | false | - | Allow prepayments |
| `charge_penalty_on_prepayment` | BOOLEAN | YES | false | - | Charge penalty on prepayment |
| `assignment_enabled` | BOOLEAN | YES | false | - | Enable assignment |
| `assignment_percentage` | NUMERIC | YES | 0 | - | Assignment percentage |
| `unaccepted_invoice_finance_enabled` | BOOLEAN | YES | false | - | Finance unaccepted invoices |
| `unaccepted_invoice_percentage` | NUMERIC | YES | 0 | - | Unaccepted invoice percentage |
| `recourse_enabled` | BOOLEAN | YES | false | - | Enable recourse |
| `recourse_percentage` | NUMERIC | YES | 0 | - | Recourse percentage |
| `appropriation_sequence` | JSONB | YES | NULL | - | Combined appropriation sequence |
| `appropriation_sequence_after_due` | JSONB | YES | '[]' | - | Sequence after due date |
| `appropriation_sequence_before_due` | JSONB | YES | '[]' | - | Sequence before due date |
| `insurance_required` | BOOLEAN | YES | false | - | Insurance requirement flag |
| `insurance_policies` | JSONB | YES | '[]' | - | Array of insurance policy objects |
| `fee_catalogue` | JSONB | YES | '[]' | - | Array of fee configuration objects |
| `flat_fee_config` | JSONB | YES | '{}' | - | Flat fee configuration |
| `early_payment_discount_enabled` | BOOLEAN | YES | false | - | Enable early payment discount |
| `dynamic_discounting_enabled` | BOOLEAN | YES | false | - | Enable dynamic discounting |
| `default_discount_percentage` | NUMERIC | YES | 0 | - | Default discount percentage |
| `factoring_enabled` | BOOLEAN | YES | false | - | Enable factoring |
| `factoring_geography` | TEXT | YES | NULL | - | Domestic or Cross-Border |
| `factoring_recourse_type` | TEXT | YES | NULL | - | With/Without/Limited Recourse |
| `factoring_disclosure` | TEXT | YES | NULL | - | Disclosed or Undisclosed |
| `factoring_delivery_model` | TEXT | YES | NULL | - | Notification model |
| `factoring_risk_bearer` | TEXT | YES | NULL | - | Who bears the risk |
| `override_limit_restrictions` | BOOLEAN | YES | false | - | Override limit checks |
| `override_tenor_calculation` | BOOLEAN | YES | false | - | Override tenor checks |
| `disbursement_mode` | TEXT | YES | NULL | - | Disbursement mode |
| `disbursement_account` | TEXT | YES | NULL | - | Disbursement account |
| `disbursement_conditions` | TEXT | YES | NULL | - | Disbursement conditions |
| `repayment_mode` | TEXT | YES | NULL | - | Repayment mode |
| `repayment_account` | TEXT | YES | NULL | - | Repayment account |
| `created_at` | TIMESTAMP WITH TIME ZONE | NO | now() | NOT NULL | Record creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NO | now() | NOT NULL | Last update timestamp |

### 4.2 JSONB Column Structures

#### counter_parties
```json
[
  {
    "id": "unique-id",
    "counter_party_id": "CP001",
    "counter_party_name": "Vendor A",
    "limit_currency": "USD",
    "limit_amount": 100000,
    "available_limit_currency": "USD",
    "available_limit_amount": 100000,
    "disbursement_currency": "USD",
    "preferred_disbursement_method": "Wire Transfer"
  }
]
```

#### appropriation_sequence
```json
{
  "after_due": ["P", "I", "C", "N"],
  "before_due": ["I", "P", "C", "N"]
}
```

#### insurance_policies
```json
[
  {
    "id": "unique-id",
    "policyNumber": "POL-001",
    "provider": "Insurance Co",
    "coverage": "Credit Risk",
    "premium": "5000"
  }
]
```

#### fee_catalogue
```json
[
  {
    "id": "unique-id",
    "fee_code": "PF001",
    "fee_type": "Processing Fee",
    "calculation_method": "Flat",
    "rate_amount": 500,
    "frequency": "One-Time",
    "charge_timing": "Upfront",
    "tax_applicable": false,
    "tax_rate": 0
  }
]
```

### 4.3 Indexes

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| scf_program_configurations_pkey | id | PRIMARY | Primary key lookup |
| idx_scf_programs_program_id | program_id | BTREE | Fast lookup by program ID |
| idx_scf_programs_product_code | product_code | BTREE | Filter by product |
| idx_scf_programs_anchor_name | anchor_name | BTREE | Filter by anchor |
| idx_scf_programs_status | status | BTREE | Filter by status |
| idx_scf_programs_user | user_id | BTREE | Filter by creator |
| idx_scf_programs_effective | effective_date | BTREE | Date range queries |
| idx_scf_programs_created | created_at DESC | BTREE | Ordering by creation date |

### 4.4 Row Level Security (RLS) Policies

| Policy Name | Operation | Using Clause | With Check | Description |
|-------------|-----------|--------------|------------|-------------|
| scf_programs_select_policy | SELECT | true | - | All authenticated users can view programs |
| scf_programs_insert_policy | INSERT | - | user_id IS NOT NULL | Users with valid user_id can create |
| scf_programs_update_policy | UPDATE | true | - | Authenticated users can update |
| scf_programs_delete_policy | DELETE | true | - | Authenticated users can delete |

> **Note:** Policies are permissive (using `true`) to support the custom authentication system (`customAuth`) which does not use Supabase's `auth.uid()`.

### 4.5 DDL Script

```sql
-- Create table
CREATE TABLE IF NOT EXISTS public.scf_program_configurations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    program_id TEXT NOT NULL,
    program_name TEXT NOT NULL,
    product_code TEXT NOT NULL,
    product_name TEXT,
    program_description TEXT,
    program_currency TEXT NOT NULL DEFAULT 'USD',
    program_limit NUMERIC NOT NULL,
    available_limit NUMERIC NOT NULL,
    effective_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    anchor_id TEXT,
    anchor_name TEXT NOT NULL,
    anchor_account TEXT,
    anchor_limit NUMERIC,
    anchor_available_limit NUMERIC,
    anchor_limit_currency TEXT DEFAULT 'USD',
    anchor_party TEXT,
    counter_parties JSONB DEFAULT '[]'::jsonb,
    borrower_selection TEXT DEFAULT 'Anchor Party',
    finance_tenor INTEGER,
    finance_tenor_unit TEXT DEFAULT 'days',
    min_tenor INTEGER,
    max_tenor INTEGER,
    min_tenor_years INTEGER DEFAULT 0,
    min_tenor_months INTEGER DEFAULT 0,
    min_tenor_days INTEGER DEFAULT 0,
    max_tenor_years INTEGER DEFAULT 0,
    max_tenor_months INTEGER DEFAULT 0,
    max_tenor_days INTEGER DEFAULT 0,
    min_tenor_total_days INTEGER,
    max_tenor_total_days INTEGER,
    margin_percentage NUMERIC DEFAULT 0,
    finance_percentage NUMERIC DEFAULT 100,
    grace_days INTEGER DEFAULT 0,
    stale_period INTEGER DEFAULT 0,
    multiple_disbursement BOOLEAN DEFAULT false,
    max_disbursements_allowed INTEGER DEFAULT 1,
    auto_disbursement BOOLEAN DEFAULT false,
    holiday_treatment TEXT DEFAULT 'Next Business Day',
    repayment_by TEXT DEFAULT 'Buyer',
    debit_account_number TEXT,
    auto_repayment BOOLEAN DEFAULT false,
    part_payment_allowed BOOLEAN DEFAULT false,
    pre_payment_allowed BOOLEAN DEFAULT false,
    charge_penalty_on_prepayment BOOLEAN DEFAULT false,
    assignment_enabled BOOLEAN DEFAULT false,
    assignment_percentage NUMERIC DEFAULT 0,
    unaccepted_invoice_finance_enabled BOOLEAN DEFAULT false,
    unaccepted_invoice_percentage NUMERIC DEFAULT 0,
    recourse_enabled BOOLEAN DEFAULT false,
    recourse_percentage NUMERIC DEFAULT 0,
    appropriation_sequence JSONB,
    appropriation_sequence_after_due JSONB DEFAULT '[]'::jsonb,
    appropriation_sequence_before_due JSONB DEFAULT '[]'::jsonb,
    insurance_required BOOLEAN DEFAULT false,
    insurance_policies JSONB DEFAULT '[]'::jsonb,
    fee_catalogue JSONB DEFAULT '[]'::jsonb,
    flat_fee_config JSONB DEFAULT '{}'::jsonb,
    early_payment_discount_enabled BOOLEAN DEFAULT false,
    dynamic_discounting_enabled BOOLEAN DEFAULT false,
    default_discount_percentage NUMERIC DEFAULT 0,
    factoring_enabled BOOLEAN DEFAULT false,
    factoring_geography TEXT,
    factoring_recourse_type TEXT,
    factoring_disclosure TEXT,
    factoring_delivery_model TEXT,
    factoring_risk_bearer TEXT,
    override_limit_restrictions BOOLEAN DEFAULT false,
    override_tenor_calculation BOOLEAN DEFAULT false,
    disbursement_mode TEXT,
    disbursement_account TEXT,
    disbursement_conditions TEXT,
    repayment_mode TEXT,
    repayment_account TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scf_program_configurations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "scf_programs_select_policy" ON public.scf_program_configurations
    FOR SELECT USING (true);

CREATE POLICY "scf_programs_insert_policy" ON public.scf_program_configurations
    FOR INSERT WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "scf_programs_update_policy" ON public.scf_program_configurations
    FOR UPDATE USING (true);

CREATE POLICY "scf_programs_delete_policy" ON public.scf_program_configurations
    FOR DELETE USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_scf_programs_program_id ON public.scf_program_configurations(program_id);
CREATE INDEX IF NOT EXISTS idx_scf_programs_product_code ON public.scf_program_configurations(product_code);
CREATE INDEX IF NOT EXISTS idx_scf_programs_anchor_name ON public.scf_program_configurations(anchor_name);
CREATE INDEX IF NOT EXISTS idx_scf_programs_status ON public.scf_program_configurations(status);
CREATE INDEX IF NOT EXISTS idx_scf_programs_user ON public.scf_program_configurations(user_id);
CREATE INDEX IF NOT EXISTS idx_scf_programs_effective ON public.scf_program_configurations(effective_date);
CREATE INDEX IF NOT EXISTS idx_scf_programs_created ON public.scf_program_configurations(created_at DESC);

-- Create trigger for updated_at
CREATE TRIGGER update_scf_program_configurations_updated_at
    BEFORE UPDATE ON public.scf_program_configurations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
```

---

## 5. API Details

### 5.1 Service Module

**Location:** `src/hooks/useProgramForm.ts`

### 5.2 Data Transfer Objects (DTOs)

#### ProgramFormData (UI Layer)
```typescript
interface ProgramFormData {
  program_id: string;
  program_name: string;
  product_code: string;
  product_name?: string;
  program_description?: string;
  program_limit: number;
  available_limit: number;
  effective_date: string;
  expiry_date: string;
  program_currency: string;
  anchor_id?: string;
  anchor_name: string;
  anchor_account?: string;
  anchor_limit?: number;
  anchor_available_limit?: number;
  anchor_limit_currency: string;
  anchor_party?: string;
  counter_parties: CounterParty[];
  borrower_selection: string;
  finance_tenor?: number;
  finance_tenor_unit: string;
  min_tenor_years?: number;
  min_tenor_months?: number;
  min_tenor_days?: number;
  max_tenor_years?: number;
  max_tenor_months?: number;
  max_tenor_days?: number;
  margin_percentage: number;
  finance_percentage: number;
  grace_days: number;
  stale_period: number;
  assignment_enabled: boolean;
  assignment_percentage: number;
  unaccepted_invoice_finance_enabled: boolean;
  unaccepted_invoice_percentage: number;
  recourse_enabled: boolean;
  recourse_percentage: number;
  multiple_disbursement: boolean;
  max_disbursements_allowed: number;
  auto_disbursement: boolean;
  holiday_treatment: string;
  repayment_by: string;
  debit_account_number?: string;
  auto_repayment: boolean;
  part_payment_allowed: boolean;
  pre_payment_allowed: boolean;
  charge_penalty_on_prepayment: boolean;
  appropriation_sequence_after_due: string[];
  appropriation_sequence_before_due: string[];
  insurance_required: boolean;
  insurance_policies: InsurancePolicy[];
  fee_catalogue: FeeItem[];
  flat_fee_config: object;
  status: string;
  override_limit_restrictions: boolean;
  override_tenor_calculation: boolean;
  early_payment_discount_enabled: boolean;
  default_discount_percentage?: number;
  dynamic_discounting_enabled: boolean;
  factoring_enabled: boolean;
  factoring_geography?: string;
  factoring_recourse_type?: string;
  factoring_disclosure?: string;
  factoring_delivery_model?: string;
  factoring_risk_bearer?: string;
}

interface CounterParty {
  id: string;
  counter_party_id: string;
  counter_party_name: string;
  limit_currency: string;
  limit_amount: number;
  available_limit_currency: string;
  available_limit_amount: number;
  disbursement_currency: string;
  preferred_disbursement_method: string;
}

interface InsurancePolicy {
  id: string;
  policyNumber: string;
  provider: string;
  coverage: string;
  premium: string;
}

interface FeeItem {
  id: string;
  fee_code: string;
  fee_type: string;
  calculation_method: string;
  rate_amount: number;
  frequency: string;
  charge_timing: string;
  tax_applicable: boolean;
  tax_rate: number;
}
```

### 5.3 API Operations

| Operation | Method | Endpoint | Request Body | Response |
|-----------|--------|----------|--------------|----------|
| List Programs | GET | Supabase Query | - | ProgramConfig[] |
| Get Program | GET | Supabase Query | id | ProgramConfig |
| Create Program | POST | Supabase Insert | ProgramFormData | ProgramConfig |
| Update Program | PUT | Supabase Update | ProgramFormData | ProgramConfig |
| Delete Program | DELETE | Supabase Delete | id | void |

### 5.4 Validation Schema (Zod)

```typescript
const programSchema = z.object({
  program_id: z.string().min(1, "Program ID is required"),
  program_name: z.string().min(1, "Program name is required"),
  product_code: z.string().min(1, "Product code is required"),
  product_name: z.string().optional(),
  program_description: z.string().optional(),
  program_limit: z.number().min(0, "Program limit must be positive"),
  available_limit: z.number().min(0, "Available limit must be positive"),
  effective_date: z.string().min(1, "Effective date is required"),
  expiry_date: z.string().min(1, "Expiry date is required"),
  program_currency: z.string().default("USD"),
  anchor_id: z.string().optional(),
  anchor_name: z.string().min(1, "Anchor name is required"),
  anchor_account: z.string().optional(),
  anchor_limit: z.number().min(0).optional(),
  anchor_available_limit: z.number().min(0).optional(),
  anchor_limit_currency: z.string().default("USD"),
  anchor_party: z.string().optional(),
  counter_parties: z.array(z.any()).default([]),
  borrower_selection: z.string().default("Anchor Party"),
  finance_tenor: z.number().optional(),
  finance_tenor_unit: z.string().default("days"),
  min_tenor_years: z.coerce.number().min(0).max(100).optional(),
  min_tenor_months: z.coerce.number().min(0).max(11).optional(),
  min_tenor_days: z.coerce.number().min(0).max(9999).optional(),
  max_tenor_years: z.coerce.number().min(0).max(100).optional(),
  max_tenor_months: z.coerce.number().min(0).max(11).optional(),
  max_tenor_days: z.coerce.number().min(0).max(9999).optional(),
  margin_percentage: z.number().default(0),
  finance_percentage: z.number().min(0).max(100).default(100),
  grace_days: z.number().min(0).default(0),
  stale_period: z.number().min(0).default(0),
  assignment_enabled: z.boolean().default(false),
  assignment_percentage: z.number().min(0).max(100).default(0),
  unaccepted_invoice_finance_enabled: z.boolean().default(false),
  unaccepted_invoice_percentage: z.number().min(0).max(100).default(0),
  recourse_enabled: z.boolean().default(false),
  recourse_percentage: z.number().min(0).max(100).default(0),
  multiple_disbursement: z.boolean().default(false),
  max_disbursements_allowed: z.number().min(1).max(100).default(1),
  auto_disbursement: z.boolean().default(false),
  holiday_treatment: z.string().default("Next Business Day"),
  repayment_by: z.string().default("Buyer"),
  debit_account_number: z.string().optional(),
  auto_repayment: z.boolean().default(false),
  part_payment_allowed: z.boolean().default(false),
  pre_payment_allowed: z.boolean().default(false),
  charge_penalty_on_prepayment: z.boolean().default(false),
  appropriation_sequence_after_due: z.array(z.any()).default([]),
  appropriation_sequence_before_due: z.array(z.any()).default([]),
  insurance_required: z.boolean().default(false),
  insurance_policies: z.array(z.any()).default([]),
  fee_catalogue: z.array(z.any()).default([]),
  flat_fee_config: z.any().default({}),
  status: z.string().default("active"),
  override_limit_restrictions: z.boolean().default(false),
  override_tenor_calculation: z.boolean().default(false),
  early_payment_discount_enabled: z.boolean().default(false),
  default_discount_percentage: z.number().min(0).max(100).optional(),
  dynamic_discounting_enabled: z.boolean().default(false),
  factoring_enabled: z.boolean().default(false),
  factoring_geography: z.string().optional(),
  factoring_recourse_type: z.string().optional(),
  factoring_disclosure: z.string().optional(),
  factoring_delivery_model: z.string().optional(),
  factoring_risk_bearer: z.string().optional(),
});
```

### 5.5 Custom Validations

1. **Tenor Range Validation**: Maximum tenor must be greater than or equal to minimum tenor
2. **Both Tenor Required**: If one tenor (min/max) is specified, both must be specified
3. **Factoring Fields Validation**: When factoring is enabled, geography, recourse type, and disclosure are required
4. **Date Validation**: Expiry date must be after effective date

---

## 6. Component Architecture

### 6.1 File Structure

```
src/
├── components/
│   └── scf-program/
│       ├── SCFProgramConfiguration.tsx    # Main list/management component
│       ├── ProgramFormDialog.tsx          # Form dialog with tabs
│       └── panes/
│           ├── GeneralPartyPane.tsx       # Tab 1: General & Party Details
│           ├── DisbursementRepaymentPane.tsx  # Tab 2: Disbursement & Repayment
│           └── FeeCataloguePane.tsx       # Tab 3: Fee Catalogue
├── hooks/
│   └── useProgramForm.ts                  # Form logic and submission
```

### 6.2 Component Relationships

```
SCFMasterSetup
    └── SCFProgramConfiguration
            ├── ProgramFormDialog
            │       ├── GeneralPartyPane
            │       ├── DisbursementRepaymentPane
            │       └── FeeCataloguePane
            └── AlertDialog (Delete Confirmation)
```

---

## 7. Integration Points

### 7.1 Product Definition Integration

- Programs reference products via `product_code`
- Product code dropdown fetches from `scf_product_definitions` table
- Navigation from Product Definition passes `selectedProductCode` to pre-filter programs

### 7.2 Invoice Integration

- Programs are used to validate invoice creation/upload
- `override_limit_restrictions` controls limit validation behavior
- `override_tenor_calculation` controls tenor validation behavior

### 7.3 Disbursement Integration

- Program parameters control disbursement rules
- `finance_percentage` limits maximum financing amount
- `multiple_disbursement` and `max_disbursements_allowed` control disbursement count

### 7.4 Repayment Integration

- `repayment_by` determines payment source
- `appropriation_sequence` controls payment application order
- `auto_repayment` enables automatic repayment processing

---

## 8. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-08 | System | Initial document creation |
