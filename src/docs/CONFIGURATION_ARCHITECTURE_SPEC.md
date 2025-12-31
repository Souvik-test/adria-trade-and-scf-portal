# Configuration Architecture Specification

## Dynamic Form Engine & NextGen Workflow Configurator

**Version:** 2.0  
**Last Updated:** December 2024  
**Target Audience:** Developers

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Component Overview](#2-component-overview)
3. [Component Relationships](#3-component-relationships)
4. [Product Event Mapping](#4-product-event-mapping)
5. [Pane-Section Mapping](#5-pane-section-mapping)
6. [Field Repository](#6-field-repository)
7. [NextGen Workflow Configurator](#7-nextgen-workflow-configurator)
8. [Runtime Flow](#8-runtime-flow)
9. [Database Schema Reference](#9-database-schema-reference)
10. [Service Layer Reference](#10-service-layer-reference)

---

## 1. Executive Summary

This document describes the configuration architecture that enables **dynamic, workflow-driven transaction forms** without code changes. The system consists of four interconnected configuration layers that work together to define:

- **What products and events exist** (Product Event Mapping)
- **How the UI is structured** (Pane-Section Mapping)
- **What fields appear in each section** (Field Repository)
- **How transactions flow through stages** (Workflow Configurator)

### Key Principle

```
Product + Event + Trigger Type → Workflow Template → Stages → Fields → UI
```

---

## 2. Component Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CONFIGURATION LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────┐     ┌──────────────────────┐                      │
│  │  PRODUCT EVENT       │────▶│  PANE-SECTION        │                      │
│  │  MAPPING             │     │  MAPPING             │                      │
│  │                      │     │                      │                      │
│  │  • Products (ILC,ELC)│     │  • Panes             │                      │
│  │  • Events (ISS,AMD)  │     │  • Sections          │                      │
│  │  • Target Audience   │     │  • Grid Layout       │                      │
│  │  • Business Apps     │     │  • Repeatable Flags  │                      │
│  └──────────────────────┘     └──────────┬───────────┘                      │
│                                          │                                   │
│                                          ▼                                   │
│                               ┌──────────────────────┐                      │
│                               │  FIELD REPOSITORY    │                      │
│                               │                      │                      │
│                               │  • Field Definitions │                      │
│                               │  • Data Types        │                      │
│                               │  • Grid Coordinates  │                      │
│                               │  • Validation Rules  │                      │
│                               └──────────┬───────────┘                      │
│                                          │                                   │
├──────────────────────────────────────────┼──────────────────────────────────┤
│                        WORKFLOW LAYER    │                                   │
├──────────────────────────────────────────┼──────────────────────────────────┤
│                                          ▼                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    NEXTGEN WORKFLOW CONFIGURATOR                      │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐       │   │
│  │  │    WORKFLOW     │  │      STAGES     │  │   STAGE FIELDS  │       │   │
│  │  │   TEMPLATES     │──│                 │──│                 │       │   │
│  │  │                 │  │  • Stage Order  │  │  • Pane         │       │   │
│  │  │  • Product/Event│  │  • Actor Type   │  │  • Section      │       │   │
│  │  │  • Trigger Type │  │  • UI Render    │  │  • Field Code   │       │   │
│  │  │  • Status       │  │    Mode         │  │  • Editable     │       │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘       │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          RUNTIME LAYER                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    DYNAMIC TRANSACTION FORM                           │   │
│  │                                                                       │   │
│  │  • Matches workflow template based on context                         │   │
│  │  • Retrieves stage-pane-section-field hierarchy                       │   │
│  │  • Renders UI based on ui_render_mode (Static or Dynamic)             │   │
│  │  • Handles stage transitions and validation                           │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Relationships

### 3.1 Data Flow Diagram

```
┌────────────────────┐
│ product_event_     │
│ mapping            │
│                    │
│ product_code ──────┼────────────────────────────────────┐
│ event_code ────────┼───────────────────────────┐        │
└────────────────────┘                           │        │
                                                 │        │
┌────────────────────┐                           │        │
│ pane_section_      │◀──────────────────────────┼────────┤
│ mappings           │                           │        │
│                    │                           │        │
│ product_code       │                           │        │
│ event_code         │                           │        │
│ panes[] ───────────┼───────────────────────────┼────────┼───┐
└────────────────────┘                           │        │   │
                                                 │        │   │
┌────────────────────┐                           │        │   │
│ field_repository   │◀──────────────────────────┼────────┤   │
│                    │                           │        │   │
│ product_code       │                           │        │   │
│ event_type         │                           │        │   │
│ pane_code ─────────┼◀──────────────────────────┼────────┼───┤
│ section_code ──────┼◀──────────────────────────┼────────┼───┘
│ field_code ────────┼────────────────────┐      │        │
│ field_row/column   │                    │      │        │
└────────────────────┘                    │      │        │
                                          │      │        │
┌────────────────────┐                    │      │        │
│ workflow_templates │◀───────────────────┼──────┴────────┘
│                    │                    │
│ id ────────────────┼───────┐            │
│ product_code       │       │            │
│ event_code         │       │            │
│ trigger_types[]    │       │            │
└────────────────────┘       │            │
                             │            │
┌────────────────────┐       │            │
│ workflow_stages    │◀──────┘            │
│                    │                    │
│ template_id (FK)   │                    │
│ id ────────────────┼───────┐            │
│ stage_name         │       │            │
│ stage_order        │       │            │
│ ui_render_mode     │       │            │
└────────────────────┘       │            │
                             │            │
┌────────────────────┐       │            │
│ workflow_stage_    │◀──────┘            │
│ fields             │                    │
│                    │                    │
│ stage_id (FK)      │                    │
│ field_name ────────┼◀───────────────────┘
│ pane               │     (references field_code)
│ section            │
│ is_editable        │
└────────────────────┘
```

### 3.2 Relationship Summary Table

| Parent Component | Child Component | Relationship | Key Columns |
|------------------|-----------------|--------------|-------------|
| Product Event Mapping | Pane-Section Mapping | 1:Many | `product_code`, `event_code` |
| Product Event Mapping | Field Repository | 1:Many | `product_code`, `event_code` |
| Product Event Mapping | Workflow Templates | 1:Many | `product_code`, `event_code` |
| Pane-Section Mapping | Field Repository | 1:Many | `pane_code`, `section_code` |
| Workflow Templates | Workflow Stages | 1:Many | `template_id` |
| Workflow Stages | Workflow Stage Fields | 1:Many | `stage_id` |
| Field Repository | Workflow Stage Fields | 1:Many | `field_code` → `field_name` |

---

## 4. Product Event Mapping

### 4.1 Purpose

Defines **which products and events exist** in the system, with differentiation by:
- **Target Audience**: Corporate, Bank, Agent
- **Business Application**: Adria TSCF Client, Adria TSCF Bank, Adria Process Orchestrator

### 4.2 Database Schema

**Table:** `product_event_mapping`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `module_code` | TEXT | Module code (TF, SCF) |
| `module_name` | TEXT | Module display name |
| `product_code` | TEXT | Product code (ILC, ELC, IBG, etc.) |
| `product_name` | TEXT | Product display name |
| `event_code` | TEXT | Event code (ISS, AMD, CAN, etc.) |
| `event_name` | TEXT | Event display name |
| `target_audience` | TEXT[] | Target audiences array |
| `business_application` | TEXT[] | Business applications array |
| `user_id` | UUID | Owner user ID |
| `created_at` | TIMESTAMP | Created timestamp |
| `updated_at` | TIMESTAMP | Updated timestamp |

### 4.3 Complete Product-Event Mapping Data

The following table contains all constant product-event mappings in the system:

| Module | Product Code | Product Name | Event Code | Event Name | Target Audience | Business Application |
|--------|--------------|--------------|------------|------------|-----------------|---------------------|
| **Trade Finance (TF)** |
| TF | ILC | Import Letter of Credit | ISS | Request LC Issuance | Corporate | Adria TSCF Client |
| TF | ILC | Import Documentary Credit | ISS | Initiate New Import LC | Bank, Agent | Adria Process Orchestrator, Adria TSCF Bank |
| TF | ILC | Import Documentary Credit | AMD | Initiate Amendment | Bank, Agent | Adria Process Orchestrator, Adria TSCF Bank |
| TF | ILC | Import Documentary Credit | CAN | Initiate Cancellation | Bank, Agent | Adria Process Orchestrator, Adria TSCF Bank |
| TF | ELC | Export Letter of Credit | REV | Review Pre-adviced LC | Corporate | Adria TSCF Client |
| TF | ELC | Export Letter of Credit | AMD | Record Amendment Consent | Corporate | Adria TSCF Client |
| TF | ELC | Export Letter of Credit | TRF | Request Transfer | Corporate | Adria TSCF Client |
| TF | ELC | Export Letter of Credit | ASG | Request Assignment | Corporate | Adria TSCF Client |
| TF | OBG | Outward Bank Guarantee/SBLC | ISS | Request Issuance | Corporate | Adria TSCF Client |
| TF | OBG | Outward Bank Guarantee/SBLC | AMD | Request Amendment | Corporate | Adria TSCF Client |
| TF | OBG | Outward Bank Guarantee/SBLC | CAN | Request Cancellation | Corporate | Adria TSCF Client |
| TF | IBG | Inward Bank Guarantee/SBLC | CON | Record Amendment Consent | Corporate | Adria TSCF Client |
| TF | IBG | Inward Bank Guarantee/SBLC | DEM | Record Demand/Claim | Corporate | Adria TSCF Client |
| TF | ODC | Outward Documentary Collection | SUB | Submit Bill | Corporate | Adria TSCF Client |
| TF | ODC | Outward Documentary Collection | UPD | Update Bill | Corporate | Adria TSCF Client |
| TF | ODC | Outward Documentary Collection | FIN | Request Discount/Finance | Corporate | Adria TSCF Client |
| TF | IDC | Inward Documentary Collection | ACC | Accept/Refuse Bill | Corporate | Adria TSCF Client |
| TF | IDC | Inward Documentary Collection | PAY | Record Payment | Corporate | Adria TSCF Client |
| TF | IDC | Inward Documentary Collection | FIN | Request Finance | Corporate | Adria TSCF Client |
| TF | SHG | Shipping Guarantee | ISS | Create Shipping Guarantee | Corporate | Adria TSCF Client |
| TF | SHG | Shipping Guarantee | UPD | Update Shipping Guarantee | Corporate | Adria TSCF Client |
| TF | SHG | Shipping Guarantee | LNK | Link/Delink Shipping Guarantee | Corporate | Adria TSCF Client |
| TF | ILB | Import LC Bills | SUB | Submit Bill | Corporate | Adria TSCF Client |
| TF | ILB | Import LC Bills | UPD | Update Bill | Corporate | Adria TSCF Client |
| TF | ELB | Export LC Bills | SUB | Submit Bill | Corporate | Adria TSCF Client |
| TF | ELB | Export LC Bills | UPD | Update Bill | Corporate | Adria TSCF Client |
| TF | OSB | Outward Documentary Collection Bills | SUB | Submit Bill | Corporate | Adria TSCF Client |
| TF | ISB | Inward Documentary Collection Bills | SUB | Submit Bill | Corporate | Adria TSCF Client |
| TF | TRL | Trade Loan | REQ | Request Trade Loan | Corporate | Adria TSCF Client |

### 4.4 Default Fallback Mappings

When no database mappings are found, the system uses these default fallbacks:

**Default Product Names:**
```typescript
const defaultProductNames = {
  ILC: 'Import Letter of Credit',
  ELC: 'Export Letter of Credit',
  OBG: 'Outward Bank Guarantee/SBLC',
  IBG: 'Inward Bank Guarantee/SBLC',
  ODC: 'Outward Documentary Collection',
  IDC: 'Inward Documentary Collection',
  SHG: 'Shipping Guarantee',
  TRL: 'Trade Loan',
  ILB: 'Import LC Bills',
  ELB: 'Export LC Bills',
  OSB: 'Outward Documentary Collection Bills',
  ISB: 'Inward Documentary Collection Bills'
};
```

**Default Event Names:**
```typescript
const defaultEventNames = {
  ILC: { ISS: 'Request Issuance', AMD: 'Request Amendment', CAN: 'Request Cancellation' },
  ELC: { REV: 'Review Pre-adviced LC', AMD: 'Record Amendment Consent', TRF: 'Request Transfer', ASG: 'Request Assignment' },
  OBG: { ISS: 'Request Issuance', AMD: 'Request Amendment', CAN: 'Request Cancellation' },
  IBG: { CON: 'Record Amendment Consent', DEM: 'Record Demand/Claim' },
  ODC: { SUB: 'Submit Bill', UPD: 'Update Bill', FIN: 'Request Discount/Finance' },
  IDC: { ACC: 'Accept/Refuse Bill', PAY: 'Record Payment', FIN: 'Request Finance' },
  SHG: { ISS: 'Create Shipping Guarantee', UPD: 'Update Shipping Guarantee', LNK: 'Link/Delink Shipping Guarantee' },
  ILB: { SUB: 'Submit Bill', UPD: 'Update Bill' },
  ELB: { SUB: 'Submit Bill', UPD: 'Update Bill' }
};
```

### 4.5 Service Reference

**File:** `src/services/productEventMappingService.ts`

```typescript
// Fetch mappings filtered by business application
fetchProductEventMappings(businessApplication: string): Promise<ProductEventMapping[]>

// Get product name by code
getProductNameByCode(mappings, productCode): string | null

// Get event name by product and event codes
getEventNameByCode(mappings, productCode, eventCode): string | null

// Get all events for a product
getEventsByProductCode(mappings, productCode): ProductEventMapping[]

// Clear cached mappings
clearMappingsCache(): void
```

### 4.6 UI Location

**Path:** Control Centre → Product-Event Mapping

**Path:** Control Centre → Product-Event Mapping

---

## 5. Pane-Section Mapping

### 5.1 Purpose

Defines the **UI structure** for a product-event combination:
- **Panes**: Major UI containers (tabs/steps)
- **Sections**: Subdivisions within panes
- **Buttons**: Action buttons per pane (navigation, save, submit)
- **Grid Layout**: Rows and columns for field placement
- **Repeatable Sections**: For variable-length data entry

### 5.2 Database Schema

**Table:** `pane_section_mappings`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `product_code` | TEXT | Product code |
| `event_code` | TEXT | Event code |
| `business_application` | TEXT[] | Business applications array |
| `customer_segment` | TEXT[] | Customer segments array |
| `panes` | JSONB | Pane, section, and button configuration |
| `is_active` | BOOLEAN | Active status |

### 5.3 Panes JSONB Structure

```json
{
  "panes": [
    {
      "id": "pane-uuid-1",
      "name": "LC Key Info",
      "sequence": 1,
      "showSwiftPreview": true,
      "sections": [
        {
          "id": "section-uuid-1",
          "name": "Basic Details",
          "sequence": 1,
          "rows": 10,
          "columns": 3,
          "isRepeatable": false,
          "groupId": null
        },
        {
          "id": "section-uuid-2",
          "name": "Party Details",
          "sequence": 2,
          "rows": 8,
          "columns": 2,
          "isRepeatable": true,
          "groupId": "party_group"
        }
      ],
      "buttons": [
        {
          "id": "btn-back-1",
          "label": "Back",
          "position": "left",
          "variant": "outline",
          "action": "previous_pane",
          "targetPaneId": null,
          "isVisible": true,
          "order": 1
        },
        {
          "id": "btn-next-1",
          "label": "Next",
          "position": "right",
          "variant": "default",
          "action": "next_pane",
          "targetPaneId": null,
          "isVisible": true,
          "order": 2
        }
      ]
    }
  ]
}
```

### 5.4 Section Configuration

| Property | Type | Description |
|----------|------|-------------|
| `id` | STRING | Unique section identifier |
| `name` | STRING | Section display name |
| `sequence` | INTEGER | Display order within pane |
| `rows` | INTEGER | Grid rows for field placement |
| `columns` | INTEGER | Grid columns for field placement |
| `isRepeatable` | BOOLEAN | Allow adding multiple instances |
| `groupId` | STRING | Group ID for repeatable sections |

### 5.5 Button Configuration

| Property | Type | Description |
|----------|------|-------------|
| `id` | STRING | Unique button identifier |
| `label` | STRING | Button display text |
| `position` | ENUM | `'left'` or `'right'` |
| `variant` | ENUM | `'default'`, `'secondary'`, `'outline'`, `'destructive'`, `'ghost'` |
| `action` | ENUM | Button action type |
| `targetPaneId` | STRING | Target pane for navigation actions |
| `isVisible` | BOOLEAN | Visibility flag |
| `order` | INTEGER | Display order within position group |

**Button Action Types:**

| Action | Description |
|--------|-------------|
| `next_pane` | Navigate to next pane |
| `previous_pane` | Navigate to previous pane |
| `save_draft` | Save current form as draft |
| `save_template` | Save as reusable template |
| `submit` | Submit the transaction |
| `reject` | Reject the transaction (workflow) |
| `discard` | Discard changes and close |
| `close` | Close without saving |
| `custom` | Custom action handler |

**Default Buttons:** If no buttons are configured in the JSONB, the system generates default buttons:
- First pane: `Discard`, `Save Draft`, `Next`
- Middle panes: `Back`, `Discard`, `Save Draft`, `Next`
- Last pane: `Back`, `Discard`, `Save Draft`, `Submit`

### 5.6 Relationship to Other Components

```
Pane-Section Mapping provides:
├── pane.name → Used in workflow_stage_fields.pane
├── section.name → Used in workflow_stage_fields.section
├── section.rows/columns → Used for field grid placement in field_repository
├── pane.showSwiftPreview → Controls SWIFT preview visibility in DynamicTransactionForm
└── pane.buttons → Rendered as action buttons in DynamicFormButtonBar
```

### 5.7 UI Location

**Path:** Control Centre → Manage Panes and Sections

---

## 6. Field Repository

### 6.1 Purpose

Defines **individual form fields** with:
- Grid coordinates (row, column)
- Data types and UI display types
- Validation rules
- SWIFT message mappings
- Computed expressions and automatic calculations
- Field-to-field mapping for auto-population

### 6.2 Database Schema

**Table:** `field_repository`

| Column | Type | Description |
|--------|------|-------------|
| **Identity & Basic Info** |
| `id` | UUID | Primary key |
| `field_id` | TEXT | Unique field identifier |
| `field_code` | TEXT | Auto-generated UPPER_SNAKE_CASE code |
| `field_label_key` | TEXT | Display label |
| `field_tooltip_key` | TEXT | Tooltip text |
| `product_code` | TEXT | Product code (ILC, ELC, etc.) |
| `event_type` | TEXT | Event code (ISS, AMD, etc.) |
| `stage` | TEXT | Stage name |
| **Pane/Section Placement** |
| `pane_code` | TEXT | Parent pane name |
| `pane_display_sequence` | INTEGER | Pane display order |
| `section_code` | TEXT | Parent section name |
| `section_display_sequence` | INTEGER | Section display order |
| `field_display_sequence` | INTEGER | Field display order |
| **Grid Layout** |
| `field_row` | INTEGER | Grid row position (1-indexed) |
| `field_column` | INTEGER | Grid column position (1-indexed) |
| `ui_row_span` | INTEGER | Rows to span |
| `ui_column_span` | INTEGER | Columns to span |
| **Data Type & UI** |
| `data_type` | TEXT | Field data type (string, number, date, boolean, etc.) |
| `ui_display_type` | TEXT | UI component (text, dropdown, date, textarea, checkbox, etc.) |
| `lookup_code` | TEXT | Lookup table reference for dropdowns |
| `dropdown_values` | TEXT[] | Static dropdown options array |
| **Validation** |
| `length_min` | INTEGER | Minimum length |
| `length_max` | INTEGER | Maximum length |
| `decimal_places` | INTEGER | Decimal places for numbers |
| `size_standard_source` | TEXT | Size standard reference |
| `validation_rule_set_id` | TEXT | Validation rule set ID |
| `error_message_key` | TEXT | Custom error message key |
| **Mandatory Flags by Channel** |
| `is_mandatory_portal` | BOOLEAN | Required for customer portal |
| `is_mandatory_mo` | BOOLEAN | Required for middle office |
| `is_mandatory_bo` | BOOLEAN | Required for back office |
| `conditional_mandatory_expr` | TEXT | Conditional mandatory expression |
| **Access Control by Channel** |
| `channel_customer_portal_flag` | BOOLEAN | Visible in customer portal |
| `channel_middle_office_flag` | BOOLEAN | Visible in middle office |
| `channel_back_office_flag` | BOOLEAN | Visible in back office |
| `input_allowed_flag` | BOOLEAN | Input allowed |
| `edit_allowed_flag` | BOOLEAN | Edit allowed |
| `view_allowed_flag` | BOOLEAN | View allowed |
| `read_only_flag` | BOOLEAN | Read only field |
| **Default & Computed Values** |
| `default_value` | TEXT | Default field value |
| `computed_expression` | TEXT | Formula for computed fields |
| `field_actions` | JSONB | Computed fields and trigger configuration |
| **Field Mapping (Mapped From)** |
| `mapped_from_field_code` | TEXT | Source field code for auto-population |
| **Conditional Visibility** |
| `conditional_visibility_expr` | TEXT | Expression to control visibility |
| **Grouping & Repetition** |
| `group_id` | TEXT | Group ID for related fields |
| `group_repetition_flag` | BOOLEAN | Allow group repetition |
| **SWIFT Message Mapping** |
| `swift_mt_type` | TEXT | SWIFT MT type (MT700, MT760, etc.) |
| `swift_sequence` | TEXT | SWIFT sequence (A, B, C, etc.) |
| `swift_tag` | TEXT | SWIFT tag (e.g., :31D:, :32B:) |
| `swift_subfield_qualifier` | TEXT | SWIFT subfield qualifier |
| `swift_tag_required_flag` | BOOLEAN | SWIFT tag required |
| `swift_tag_display_flag` | BOOLEAN | Display SWIFT tag |
| `swift_format_pattern` | TEXT | SWIFT format pattern |
| **ISO 20022 Mapping** |
| `iso20022_element_code` | TEXT | ISO 20022 element code |
| `iso_data_format_pattern` | TEXT | ISO data format pattern |
| **Sanction & Limit Checks** |
| `sanction_check_required_flag` | BOOLEAN | Requires sanction check |
| `sanction_field_category` | TEXT | Sanction field category |
| `sanction_party_role` | TEXT | Sanction party role |
| `sanction_engine_field_map` | TEXT | Sanction engine field mapping |
| `limit_check_required_flag` | BOOLEAN | Requires limit check |
| `limit_dimension_type` | TEXT | Limit dimension type |
| **Workflow & Access** |
| `workflow_role_access` | JSONB | Role-based access configuration |
| **Help & Documentation** |
| `help_content_type` | TEXT | Help content type |
| `help_content_ref` | TEXT | Help content reference |
| **Special Flags** |
| `is_attachment_field` | BOOLEAN | File attachment field |
| `masking_flag` | BOOLEAN | Mask field value |
| `audit_track_changes_flag` | BOOLEAN | Track changes for audit |
| `is_active_flag` | BOOLEAN | Field active status |
| **AI Integration** |
| `ai_mapping_key` | TEXT | AI mapping key for document extraction |
| **Versioning & Audit** |
| `effective_from_date` | TIMESTAMP | Effective from date |
| `effective_to_date` | TIMESTAMP | Effective to date |
| `config_version` | INTEGER | Configuration version |
| `created_by` | TEXT | Created by user |
| `created_at` | TIMESTAMP | Created timestamp |
| `last_updated_by` | TEXT | Last updated by user |
| `updated_at` | TIMESTAMP | Updated timestamp |
| `user_id` | UUID | Owner user ID |

### 6.3 Field Mapping (Mapped From)

The `mapped_from_field_code` column enables automatic population of a field's value from another field.

**Use Cases:**
- Copy applicant name from one section to another
- Auto-populate currency across related fields
- Mirror address fields between parties

**Example:**
```typescript
// In field_repository, set mapped_from_field_code
{
  field_code: "BENEFICIARY_COUNTRY",
  mapped_from_field_code: "APPLICANT_COUNTRY"  // Auto-populates from APPLICANT_COUNTRY
}
```

### 6.4 Computed Fields & Automatic Calculations

Fields can be automatically calculated using `computed_expression` or `field_actions`.

**Using computed_expression (simple formulas):**
```typescript
{
  field_code: "TOTAL_AMOUNT",
  computed_expression: "PRINCIPAL_AMOUNT + INTEREST_AMOUNT",
  read_only_flag: true
}
```

**Using field_actions (complex logic):**
```json
{
  "field_actions": {
    "is_computed": true,
    "computed_formula": "PRINCIPAL_AMOUNT * (1 + INTEREST_RATE / 100)",
    "triggers": [
      {
        "when_value": ["Transferable"],
        "show_fields": ["TRANSFER_DETAILS", "SECOND_BENEFICIARY"],
        "hide_fields": []
      },
      {
        "when_value": ["USD", "EUR"],
        "filter_dropdowns": {
          "CORRESPONDENT_BANK": ["US_BANKS", "EU_BANKS"]
        }
      }
    ],
    "dropdown_filter_source": "COUNTRY"
  }
}
```

**Field Actions Structure:**

| Property | Type | Description |
|----------|------|-------------|
| `is_computed` | BOOLEAN | Field value is computed |
| `computed_formula` | TEXT | JavaScript-like formula |
| `triggers` | ARRAY | Conditional logic triggers |
| `dropdown_filter_source` | TEXT | Field that filters this dropdown |

**Trigger Structure:**

| Property | Type | Description |
|----------|------|-------------|
| `when_value` | TEXT[] | Values that activate the trigger |
| `show_fields` | TEXT[] | Field codes to show |
| `hide_fields` | TEXT[] | Field codes to hide |

### 6.5 Relationship to Workflow Stage Fields

```
Field Repository                    Workflow Stage Fields
├── field_code ──────────────────▶ field_name
├── pane_code ───────────────────▶ pane (can be overridden)
└── section_code ────────────────▶ section (can be overridden)
```

**Important:** Workflow Stage Fields can override the pane/section assignment, allowing the same field to appear in different panes at different stages.

### 6.6 UI Location

**Path:** Control Centre → Field Definition

---

## 7. NextGen Workflow Configurator

### 7.1 Purpose

Defines **complete workflow configurations** that control:
- Transaction processing stages
- Actor assignments
- Field visibility per stage
- UI render mode (Static vs Dynamic)

### 7.2 Sub-Components

#### 7.2.1 Workflow Templates

**Table:** `workflow_templates`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `template_name` | TEXT | Unique template name |
| `module_code` | TEXT | Module code (TF, SCF) |
| `product_code` | TEXT | Product code |
| `event_code` | TEXT | Event code |
| `trigger_types` | TEXT[] | Trigger types (Manual, ClientPortal) |
| `status` | TEXT | Draft, Submitted, Active, Inactive |
| `is_active` | BOOLEAN | Active flag |

**Template Matching Logic:**
```typescript
// Find template by product + event + trigger type
const template = await supabase
  .from('workflow_templates')
  .select('*')
  .eq('product_code', productCode)
  .eq('event_code', eventCode)
  .contains('trigger_types', [triggerType])
  .eq('status', 'Active')
  .maybeSingle();
```

#### 7.2.2 Workflow Stages

**Table:** `workflow_stages`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `template_id` | UUID | Parent template (FK) |
| `stage_name` | TEXT | Stage name |
| `stage_order` | INTEGER | Stage sequence (1-indexed) |
| `actor_type` | TEXT | Maker, Checker, System |
| `ui_render_mode` | TEXT | `'static'` or `'dynamic'` |
| `sla_hours` | INTEGER | SLA in hours |
| `reject_to_stage` | TEXT | Rejection target stage |

**UI Render Mode:**
- `'static'`: Use pre-built static component (e.g., `LimitDetailsPane`)
- `'dynamic'`: Use `DynamicFormContainer` with field_repository fields

#### 7.2.3 Workflow Stage Fields

**Table:** `workflow_stage_fields`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `stage_id` | UUID | Parent stage (FK) |
| `field_name` | TEXT | Field code from field_repository |
| `pane` | TEXT | Pane assignment |
| `section` | TEXT | Section assignment |
| `is_visible` | BOOLEAN | Visibility flag |
| `is_editable` | BOOLEAN | Editability flag |
| `is_mandatory` | BOOLEAN | Mandatory flag |
| `field_order` | INTEGER | Display order |

### 7.3 Stage-Pane Mapping

The system builds a navigation structure from workflow stages:

```typescript
interface StagePaneInfo {
  paneIndex: number;          // Global pane index
  paneName: string;           // Pane name
  stageId: string;            // Stage UUID
  stageName: string;          // Stage name (e.g., "Data Entry")
  stageOrder: number;         // Stage sequence
  isFirstPaneOfStage: boolean;
  isLastPaneOfStage: boolean;
  isFinalStage: boolean;
  allowedSections: string[];  // Sections visible at this stage-pane
  uiRenderMode: 'static' | 'dynamic';
}
```

### 7.4 UI Location

**Path:** Control Centre → NextGen Workflow Configurator

**Tabs:**
1. Workflow Templates
2. Stage Flow Builder
3. Stage Level Field
4. Template Level Conditions

---

## 8. Runtime Flow

### 8.1 Form Initialization Sequence

```
1. User opens transaction form
   │
2. System determines context
   ├── productCode (e.g., "ILC")
   ├── eventCode (e.g., "ISS")
   └── triggerType (e.g., "ClientPortal")
   │
3. Find matching workflow template
   └── findWorkflowTemplate(productCode, eventCode, triggerType)
   │
4. Get template stages
   └── getTemplateStages(templateId)
   │
5. Build stage-pane mapping
   └── getStagePaneMapping(templateId, accessibleStages)
   │
6. For each pane:
   ├── Check uiRenderMode
   ├── If 'static' → Load from staticPaneRegistry
   └── If 'dynamic' → Load fields from field_repository
   │
7. Render form with HybridFormContainer
```

### 8.2 UI Render Mode Decision Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    HybridFormContainer                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │   currentPane.uiRenderMode?   │
              └───────────────────────────────┘
                              │
           ┌──────────────────┴──────────────────┐
           │                                     │
           ▼                                     ▼
    ┌─────────────┐                       ┌─────────────┐
    │  'static'   │                       │  'dynamic'  │
    └─────────────┘                       └─────────────┘
           │                                     │
           ▼                                     ▼
    ┌─────────────────────┐              ┌─────────────────────┐
    │ staticPaneRegistry  │              │ DynamicFormContainer│
    │                     │              │                     │
    │ "Limit Check" →     │              │ Renders fields from │
    │   LimitDetailsPane  │              │ field_repository    │
    │ "Sanction Check" →  │              │ using grid coords   │
    │   SanctionPane      │              │                     │
    └─────────────────────┘              └─────────────────────┘
```

### 8.3 Static Pane Registry

**File:** `src/components/import-lc/staticPaneRegistry.ts`

```typescript
const staticPaneRegistry: Record<string, React.ComponentType<StaticPaneProps>> = {
  'Limit Check': LimitDetailsPane,
  'Compliance Check': SanctionDetailsPane,
  'Sanction Check': SanctionDetailsPane,
  'Accounting': AccountingEntriesPane,
  'Release Documents': ReleaseDocumentsPane,
};

export const getStaticPaneComponent = (stageName: string) => {
  return staticPaneRegistry[stageName] || null;
};
```

---

## 9. Database Schema Reference

### 9.1 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          product_event_mapping                           │
│  PK: id                                                                  │
│  product_code, event_code, target_audience[], business_application[]    │
└─────────────────────────────────────────────────────────────────────────┘
         │                                │
         │                                │
         ▼                                ▼
┌─────────────────────────┐    ┌─────────────────────────┐
│  pane_section_mappings  │    │    workflow_templates   │
│  PK: id                 │    │  PK: id                 │
│  product_code           │    │  product_code           │
│  event_code             │    │  event_code             │
│  panes (JSONB)          │    │  trigger_types[]        │
└─────────────────────────┘    │  status                 │
         │                      └─────────────────────────┘
         │                                │
         ▼                                │
┌─────────────────────────┐               │
│    field_repository     │               │
│  PK: id                 │               │
│  product_code           │               │
│  event_type             │               │
│  pane_code              │               │
│  section_code           │               │
│  field_code ────────────┼───────────┐   │
│  field_row, field_column│           │   │
└─────────────────────────┘           │   │
                                      │   │
                                      │   ▼
                                      │ ┌─────────────────────────┐
                                      │ │    workflow_stages      │
                                      │ │  PK: id                 │
                                      │ │  FK: template_id        │
                                      │ │  stage_name             │
                                      │ │  stage_order            │
                                      │ │  ui_render_mode         │
                                      │ └─────────────────────────┘
                                      │           │
                                      │           │
                                      │           ▼
                                      │ ┌─────────────────────────┐
                                      │ │  workflow_stage_fields  │
                                      │ │  PK: id                 │
                                      └─│  FK: stage_id           │
                                        │  field_name (→field_code│
                                        │  pane, section          │
                                        │  is_editable            │
                                        └─────────────────────────┘
```

---

## 10. Service Layer Reference

### 10.1 Product Event Mapping Service

**File:** `src/services/productEventMappingService.ts`

| Function | Description |
|----------|-------------|
| `fetchProductEventMappings(businessApp)` | Get all mappings for a business application |
| `getProductNameByCode(mappings, code)` | Get product display name |
| `getEventNameByCode(mappings, product, event)` | Get event display name |

### 10.2 Workflow Template Service

**File:** `src/services/workflowTemplateService.ts`

| Function | Description |
|----------|-------------|
| `findWorkflowTemplate(product, event, trigger)` | Find matching active template |
| `getTemplateStages(templateId)` | Get all stages ordered by stage_order |
| `getStageFields(stageId)` | Get fields configured for a stage |
| `getStagePaneMapping(templateId, accessibleStages)` | Build navigation structure |
| `getStagePaneMappingByStageOrder(templateId, stageOrder)` | Get mapping for specific stage |
| `getWorkflowWithRenderMode(product, event, trigger)` | Get template with UI render mode |

### 10.3 Hooks

**File:** `src/hooks/useProductEventMappings.ts`

```typescript
const {
  mappings,          // All ProductEventMapping[]
  loading,           // Loading state
  businessCentre,    // Current business application
  isClientPortal,    // Boolean: is client portal
  getProductName,    // (productCode) => string
  getEventName,      // (productCode, eventCode) => string
} = useProductEventMappings();
```

**File:** `src/hooks/useDynamicTransaction.ts`

```typescript
const {
  template,          // WorkflowTemplateRuntime
  stages,            // WorkflowStageRuntime[]
  paneNames,         // string[]
  stagePaneMapping,  // StagePaneInfo[]
  fieldsByPane,      // Map<paneName, DynamicFieldDefinition[]>
  loading,
  error,
} = useDynamicTransaction(productCode, eventCode, triggerType);
```

---

## 11. Configuration Workflow (For Administrators)

### Step-by-Step Configuration

```
1. Create Product-Event Mapping
   └── Define product/event with target audiences

2. Create Pane-Section Mapping
   └── Define UI structure (panes, sections, grid)

3. Define Fields in Field Repository
   └── Create fields with grid coordinates, data types

4. Create Workflow Template
   └── Link to product/event, define trigger types

5. Add Workflow Stages
   └── Define stage order, actors, UI render mode

6. Map Fields to Stages
   └── Assign fields from repository to each stage
   └── Configure visibility/editability per stage

7. Activate Workflow Template
   └── Submit → Activate
```

---

## 12. Troubleshooting Guide

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Form shows "No workflow configuration" | No active template matches | Check template status is "Active" and trigger_types includes current trigger |
| Fields not appearing | Fields not mapped to stage | Add fields in Stage Level Field tab |
| Wrong pane showing | Stage-pane mapping incorrect | Check workflow_stage_fields pane assignments |
| Static UI showing instead of Dynamic | ui_render_mode = 'static' | Change stage's ui_render_mode to 'dynamic' |
| SWIFT preview not showing | show_swift_preview = false | Enable in pane_section_mappings |

---

## Appendix A: Product Codes

| Code | Product Name |
|------|--------------|
| ILC | Import Letter of Credit |
| ELC | Export Letter of Credit |
| OBG | Outward Bank Guarantee/SBLC |
| IBG | Inward Bank Guarantee/SBLC |
| ODC | Outward Documentary Collection |
| IDC | Inward Documentary Collection |
| SHG | Shipping Guarantee |
| TRL | Trade Loan |

## Appendix B: Event Codes

| Product | Code | Event Name |
|---------|------|------------|
| ILC | ISS | Request Issuance |
| ILC | AMD | Request Amendment |
| ILC | CAN | Request Cancellation |
| ELC | REV | Review Pre-adviced LC |
| ELC | AMD | Record Amendment Consent |
| ELC | TRF | Request Transfer |
| OBG | ISS | Request Issuance |
| IBG | CON | Record Amendment Consent |
| IBG | DEM | Record Demand/Claim |

---

**Document End**
