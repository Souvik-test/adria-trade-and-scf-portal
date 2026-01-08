# EPIC: SCF Product Definition

## 1. EPIC Description (for JIRA)

**EPIC Title:** SCF Product Definition

**EPIC ID:** EPIC-SCF-001

### Description
The SCF Product Definition module enables financial institutions to define and manage Supply Chain Finance (SCF) products tailored to their business needs. This module serves as the foundation for the SCF configuration framework, allowing administrators to create custom SCF products with specific parameters such as anchor roles, counter-party roles, borrower designations, and underlying instruments.

### Business Value
- Enables rapid creation of new SCF product offerings without code changes
- Provides standardized product templates for consistent program deployment
- Supports both buyer-centric and seller-centric financing models
- Facilitates regulatory compliance through product-level authorization controls

### Scope
- Product CRUD operations (Create, Read, Update, Delete)
- Product activation/deactivation
- Support for dual authentication systems (Custom Auth + Supabase Auth)

---

## 2. User Stories

| Story ID | Title | Description | Acceptance Criteria | Priority |
|----------|-------|-------------|---------------------|----------|
| US-SPD-001 | View Product List | As an SCF Administrator, I want to view all configured SCF products so that I can manage the product catalog | - Display all products in a sortable table<br>- Show key product attributes<br>- Support active/inactive filtering | High |
| US-SPD-002 | Create New Product | As an SCF Administrator, I want to create a new SCF product definition so that I can add new financing offerings | - Form validation for mandatory fields<br>- Auto-population of Product Centric based on Anchor Role<br>- Success/error toast notifications | High |
| US-SPD-003 | Edit Product | As an SCF Administrator, I want to edit an existing product definition so that I can update product parameters | - Pre-populate form with existing values<br>- Maintain product ID and audit trail<br>- Validate changes before save | High |
| US-SPD-004 | Delete Product | As an SCF Administrator, I want to delete a product definition so that I can remove obsolete products | - Confirmation before deletion<br>- Cascade handling for linked programs<br>- Audit log entry | Medium |
| US-SPD-005 | Toggle Product Status | As an SCF Administrator, I want to activate/deactivate products so that I can control product availability | - Toggle switch in table row<br>- Visual status indicator (Active/Inactive badge)<br>- Immediate effect on linked programs | Medium |

---

## 3. UI Components and Field Specifications

### 3.1 Screen Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  [←Back]  Product Definition                        [+ Add Product]  │
│  Define SCF products tailored to your business needs                 │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ NEW PRODUCT DEFINITION / EDIT PRODUCT DEFINITION (Collapsible) │ │
│  │  ┌─────────────────┐  ┌─────────────────┐                       │ │
│  │  │ Product Code *  │  │ Product Name *  │                       │ │
│  │  └─────────────────┘  └─────────────────┘                       │ │
│  │  ┌──────────────────────────────────────────────────────────┐   │ │
│  │  │ Product Description (Optional)                           │   │ │
│  │  └──────────────────────────────────────────────────────────┘   │ │
│  │  ┌─────────────────┐  ┌─────────────────┐                       │ │
│  │  │ Anchor Role *   │  │ Product Centric │ (Auto-populated)      │ │
│  │  └─────────────────┘  └─────────────────┘                       │ │
│  │  ┌─────────────────┐  ┌─────────────────┐                       │ │
│  │  │ Counter-Party * │  │ Borrower Role   │                       │ │
│  │  └─────────────────┘  └─────────────────┘                       │ │
│  │  ┌─────────────────┐  ┌─────────────────┐                       │ │
│  │  │ Underlying Inst*│  │ Effective Date *│                       │ │
│  │  └─────────────────┘  └─────────────────┘                       │ │
│  │  ┌─────────────────┐                                            │ │
│  │  │ Expiry Date     │                                            │ │
│  │  └─────────────────┘                                            │ │
│  │  [Toggle] Active Product                                        │ │
│  │  [Checkbox] Authorization Required                              │ │
│  │  [Checkbox] Is Conventional                                     │ │
│  │  [Save] [Cancel]                                                │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ DEFINED PRODUCTS TABLE                                          │ │
│  ├─────────────────────────────────────────────────────────────────┤ │
│  │ Code | Name | Anchor | Counter-Party | Borrower | Instrument |  │ │
│  │ Effective | Status | Auth Required | Is Conventional | Actions │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

### 3.2 Form Field Specifications

| Field Name | UI Component | Data Type | Mandatory | Max Length | Validation Rules | Default Value |
|------------|--------------|-----------|-----------|------------|------------------|---------------|
| Product Code | Input (Text) | string | Yes | 50 | Alphanumeric, unique | Empty |
| Product Name | Input (Text) | string | Yes | 255 | Non-empty | Empty |
| Product Description | Textarea | string | No | 1000 | - | Empty |
| Anchor Role | Select Dropdown | string | Yes | - | Must select from list, Anchor and Counter Party Role cannot be same | Empty |
| Product Centric | Input (Readonly) | string | No | - | Auto-populated based on Anchor Role | Empty |
| Counter-Party Role | Select Dropdown | string | Yes | - | Must select from list, Anchor and Counter Party Role cannot be same | Empty |
| Borrower Role | Select Dropdown | string | No | - | Optional selection | Empty |
| Underlying Instrument | Select Dropdown | string | Yes | - | Must select from list | Empty |
| Effective Date | Date Picker | date | Yes | - | Cannot be in past (for new records) | Current Date |
| Expiry Date | Date Picker | date | No | - | Must be after Effective Date | Empty |
| Is Active | Switch/Toggle | boolean | Yes | - | - | true |
| Authorization Required | Checkbox | boolean | Yes | - | - | false |
| Is Conventional | Checkbox | boolean | Yes | - | - | false |

### 3.3 Dropdown Options

| Field | Options |
|-------|---------|
| Anchor Role | Seller/Supplier, Buyer, Manufacturer, Distributor |
| Counter-Party Role | Buyer, Supplier, Vendor, Dealer |
| Borrower Role | Seller/Supplier, Buyer, Manufacturer, Distributor, Both |
| Underlying Instrument | Invoice, Purchase Order, Bill of Lading, Warehouse Receipt |

### 3.4 Auto-Population Rules

| Trigger Field | Target Field | Rule |
|---------------|--------------|------|
| Anchor Role = "Seller/Supplier" or contains "Seller" | Product Centric | "Seller Centric" |
| Anchor Role = "Buyer" | Product Centric | "Buyer Centric" |
| Anchor Role = "Manufacturer" | Product Centric | "Seller Centric" |
| Anchor Role = "Distributor" | Product Centric | "Buyer Centric" |

### 3.5 UI Components Used

| Component | Source | Purpose |
|-----------|--------|---------|
| Button | `@/components/ui/button` | Form actions (Save, Cancel, Add, Delete) |
| Input | `@/components/ui/input` | Text input fields |
| Textarea | `@/components/ui/textarea` | Product description |
| Select | `@/components/ui/select` | Dropdown selections |
| Switch | `@/components/ui/switch` | Active status toggle |
| Checkbox | `@/components/ui/checkbox` | Authorization required flag, Is Conventional flag |
| Table | `@/components/ui/table` | Product listing |
| Badge | `@/components/ui/badge` | Status indicators |
| Card | `@/components/ui/card` | Form container |
| Label | `@/components/ui/label` | Field labels |

---

## 4. Database Table Details

### 4.1 Table: `scf_product_definitions`

| Column Name | Data Type | Nullable | Default | Constraints | Description |
|-------------|-----------|----------|---------|-------------|-------------|
| `id` | UUID | NO | gen_random_uuid() | PRIMARY KEY | Auto-generated unique identifier |
| `user_id` | UUID | NO | - | NOT NULL | Creator of the product record |
| `product_code` | TEXT | NO | - | NOT NULL | Unique product identifier code |
| `product_name` | TEXT | NO | - | NOT NULL | Display name of the product |
| `product_description` | TEXT | YES | NULL | - | Optional detailed description |
| `anchor_role` | TEXT | YES | NULL | - | Primary role (Seller/Supplier, Buyer, etc.) |
| `product_centric` | TEXT | YES | NULL | - | Seller Centric or Buyer Centric |
| `counter_party_role` | TEXT | YES | NULL | - | Secondary role in the relationship |
| `borrower_role` | TEXT | YES | NULL | - | Who borrows in this product |
| `underlying_instrument` | TEXT | YES | NULL | - | Base instrument type |
| `effective_date` | DATE | NO | CURRENT_DATE | NOT NULL | When product becomes active |
| `expiry_date` | DATE | YES | NULL | - | When product expires (optional) |
| `is_active` | BOOLEAN | YES | true | - | Product status flag |
| `authorization_required` | BOOLEAN | YES | false | - | Whether approval is needed |
| `is_conventional` | BOOLEAN | YES | false | - | Whether product follows conventional financing |
| `created_at` | TIMESTAMP WITH TIME ZONE | NO | now() | NOT NULL | Record creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NO | now() | NOT NULL | Last update timestamp |

### 4.2 Indexes

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| scf_product_definitions_pkey | id | PRIMARY | Primary key lookup |
| idx_scf_products_code | product_code | BTREE | Fast lookup by product code |
| idx_scf_products_active | is_active | BTREE | Filter active products |
| idx_scf_products_user | user_id | BTREE | Filter by creator |
| idx_scf_products_created | created_at DESC | BTREE | Ordering by creation date |

### 4.3 Row Level Security (RLS) Policies

| Policy Name | Operation | Using Clause | With Check | Description |
|-------------|-----------|--------------|------------|-------------|
| scf_products_select_policy | SELECT | true | - | All authenticated users can view products |
| scf_products_insert_policy | INSERT | - | user_id IS NOT NULL | Users with valid user_id can create |
| scf_products_update_policy | UPDATE | true | - | Authenticated users can update |
| scf_products_delete_policy | DELETE | true | - | Authenticated users can delete |

> **Note:** Policies are permissive (using `true`) to support the custom authentication system (`customAuth`) which does not use Supabase's `auth.uid()`.

### 4.4 DDL Script

```sql
-- Create table
CREATE TABLE IF NOT EXISTS public.scf_product_definitions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    product_code TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_description TEXT,
    anchor_role TEXT,
    product_centric TEXT,
    counter_party_role TEXT,
    borrower_role TEXT,
    underlying_instrument TEXT,
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE,
    is_active BOOLEAN DEFAULT true,
    authorization_required BOOLEAN DEFAULT false,
    is_conventional BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scf_product_definitions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "scf_products_select_policy" ON public.scf_product_definitions
    FOR SELECT USING (true);

CREATE POLICY "scf_products_insert_policy" ON public.scf_product_definitions
    FOR INSERT WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "scf_products_update_policy" ON public.scf_product_definitions
    FOR UPDATE USING (true);

CREATE POLICY "scf_products_delete_policy" ON public.scf_product_definitions
    FOR DELETE USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_scf_products_code ON public.scf_product_definitions(product_code);
CREATE INDEX IF NOT EXISTS idx_scf_products_active ON public.scf_product_definitions(is_active);
CREATE INDEX IF NOT EXISTS idx_scf_products_user ON public.scf_product_definitions(user_id);
```

---

## 5. Product Event Definitions Table

### 5.1 Table: `product_event_definitions`

This table stores the high-level SCF product categories with their associated events. It serves as the master reference for SCF product types (SAP - Supplier/Seller Anchored Product and BAP - Buyer Anchored Product).

| Column Name | Data Type | Nullable | Default | Constraints | Description |
|-------------|-----------|----------|---------|-------------|-------------|
| `id` | UUID | NO | gen_random_uuid() | PRIMARY KEY | Auto-generated unique identifier |
| `module_code` | TEXT | NO | - | NOT NULL | Module identifier (e.g., SCF) |
| `product_code` | TEXT | NO | - | NOT NULL | Product code (SAP, BAP) |
| `product_name` | TEXT | NO | - | NOT NULL | Full product name |
| `event_code` | TEXT | NO | - | NOT NULL | Event code (DIS, REP) |
| `event_name` | TEXT | NO | - | NOT NULL | Event display name |
| `created_at` | TIMESTAMP WITH TIME ZONE | NO | now() | NOT NULL | Record creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NO | now() | NOT NULL | Last update timestamp |

### 5.2 SCF Product Event Data

| Module Code | Product Code | Product Name | Event Code | Event Name |
|-------------|--------------|--------------|------------|------------|
| SCF | SAP | Supplier/Seller Anchored Product | DIS | Disbursement |
| SCF | SAP | Supplier/Seller Anchored Product | REP | Repayment |
| SCF | BAP | Buyer Anchored Product | DIS | Disbursement |
| SCF | BAP | Buyer Anchored Product | REP | Repayment |

### 5.3 DDL Script

```sql
-- Create table
CREATE TABLE IF NOT EXISTS public.product_event_definitions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    module_code TEXT NOT NULL,
    product_code TEXT NOT NULL,
    product_name TEXT NOT NULL,
    event_code TEXT NOT NULL,
    event_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_event_definitions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "product_event_definitions_select_policy" ON public.product_event_definitions
    FOR SELECT USING (true);

CREATE POLICY "product_event_definitions_insert_policy" ON public.product_event_definitions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "product_event_definitions_update_policy" ON public.product_event_definitions
    FOR UPDATE USING (true);

CREATE POLICY "product_event_definitions_delete_policy" ON public.product_event_definitions
    FOR DELETE USING (true);

-- Insert SCF product events
INSERT INTO public.product_event_definitions (module_code, product_code, product_name, event_code, event_name)
VALUES 
    ('SCF', 'SAP', 'Supplier/Seller Anchored Product', 'DIS', 'Disbursement'),
    ('SCF', 'SAP', 'Supplier/Seller Anchored Product', 'REP', 'Repayment'),
    ('SCF', 'BAP', 'Buyer Anchored Product', 'DIS', 'Disbursement'),
    ('SCF', 'BAP', 'Buyer Anchored Product', 'REP', 'Repayment');
```

---

## 6. API Details

### 6.1 Service Module

**Location:** `src/services/scfProductService.ts`

### 6.2 Data Transfer Objects (DTOs)

#### ProductFormData (UI Layer)
```typescript
interface ProductFormData {
  id?: string;
  productCode: string;
  productName: string;
  productDescription?: string;
  anchorRole: string;
  productCentric?: string;
  counterPartyRole: string;
  borrowerRole?: string;
  underlyingInstrument: string;
  effectiveDate: string;
  expiryDate?: string;
  isActive: boolean;
  authorizationRequired: boolean;
  isConventional: boolean;
}
```

#### ProductDefinition (Database Layer)
```typescript
interface ProductDefinition {
  id: string;
  user_id: string;
  product_code: string;
  product_name: string;
  product_description: string | null;
  anchor_role: string | null;
  product_centric: string | null;
  counter_party_role: string | null;
  borrower_role: string | null;
  underlying_instrument: string | null;
  effective_date: string;
  expiry_date: string | null;
  is_active: boolean | null;
  authorization_required: boolean | null;
  is_conventional: boolean | null;
  created_at: string;
  updated_at: string;
}
```

### 6.3 API Functions

| Function | HTTP Method | Description | Parameters | Returns | Error Handling |
|----------|-------------|-------------|------------|---------|----------------|
| `fetchProducts` | GET | Retrieve all products | `userId: string` | `ProductFormData[]` | Throws Error on failure |
| `createProduct` | POST | Create new product | `formData: ProductFormData, userId: string` | `ProductFormData` | Throws Error on failure |
| `updateProduct` | PUT | Update existing product | `id: string, formData: ProductFormData, userId: string` | `ProductFormData` | Throws Error on failure |
| `deleteProduct` | DELETE | Remove product | `id: string, userId: string` | `void` | Throws Error on failure |
| `toggleProductActive` | PATCH | Toggle active status | `id: string, isActive: boolean, userId: string` | `ProductFormData` | Throws Error on failure |

### 6.4 Helper Functions

#### toDbFormat
Converts UI form data (camelCase) to database format (snake_case).

```typescript
const toDbFormat = (formData: ProductFormData, userId: string) => ({
  user_id: userId,
  product_code: formData.productCode,
  product_name: formData.productName,
  product_description: formData.productDescription || null,
  anchor_role: formData.anchorRole || null,
  product_centric: formData.productCentric || null,
  counter_party_role: formData.counterPartyRole || null,
  borrower_role: formData.borrowerRole || null,
  underlying_instrument: formData.underlyingInstrument || null,
  effective_date: formData.effectiveDate,
  expiry_date: formData.expiryDate || null,
  is_active: formData.isActive,
  authorization_required: formData.authorizationRequired,
  is_conventional: formData.isConventional,
});
```

#### toUiFormat
Converts database format (snake_case) to UI format (camelCase).

```typescript
const toUiFormat = (data: ProductDefinition): ProductFormData => ({
  id: data.id,
  productCode: data.product_code,
  productName: data.product_name,
  productDescription: data.product_description || '',
  anchorRole: data.anchor_role || '',
  productCentric: data.product_centric || '',
  counterPartyRole: data.counter_party_role || '',
  borrowerRole: data.borrower_role || '',
  underlyingInstrument: data.underlying_instrument || '',
  effectiveDate: data.effective_date,
  expiryDate: data.expiry_date || '',
  isActive: data.is_active ?? true,
  authorizationRequired: data.authorization_required ?? false,
  isConventional: data.is_conventional ?? false,
});
```

### 6.5 Supabase Query Examples

#### Fetch All Products
```typescript
const { data, error } = await supabase
  .from('scf_product_definitions')
  .select('*')
  .order('created_at', { ascending: false });
```

#### Create Product
```typescript
const { data, error } = await supabase
  .from('scf_product_definitions')
  .insert(toDbFormat(formData, userId))
  .select()
  .single();
```

#### Update Product
```typescript
const { data, error } = await supabase
  .from('scf_product_definitions')
  .update(toDbFormat(formData, userId))
  .eq('id', id)
  .select()
  .single();
```

#### Delete Product
```typescript
const { error } = await supabase
  .from('scf_product_definitions')
  .delete()
  .eq('id', id);
```

#### Toggle Active Status
```typescript
const { data, error } = await supabase
  .from('scf_product_definitions')
  .update({ is_active: isActive, updated_at: new Date().toISOString() })
  .eq('id', id)
  .select()
  .single();
```

---

## 7. Authentication Support

### 7.1 Dual Authentication System

The module supports two authentication systems:

1. **Custom Auth (Primary):** Uses `customAuth` context from `@/contexts/CustomAuthContext`
2. **Supabase Auth (Secondary):** Falls back to Supabase's built-in auth

### 7.2 User ID Resolution

```typescript
const getUserId = (): string => {
  // Priority 1: Custom Auth
  if (customUser?.id) return customUser.id;
  
  // Priority 2: Supabase Auth
  if (supabaseUser?.id) return supabaseUser.id;
  
  throw new Error('No authenticated user found');
};
```

---

## 8. Related Components/Modules

### 8.1 Components

| Component | Path | Description |
|-----------|------|-------------|
| SCFProductDefinition | `src/components/supply-chain-finance/SCFProductDefinition.tsx` | Main product definition UI |
| scfProductService | `src/services/scfProductService.ts` | API service for CRUD operations |

---

## 9. Non-Functional Requirements

| Category | Requirement | Target |
|----------|-------------|--------|
| Performance | Page load time | < 2 seconds |
| Performance | Form submission | < 1 second |
| Scalability | Concurrent users | 100+ |
| Security | RLS enabled | All operations |
| Accessibility | WCAG compliance | Level AA |
| Responsiveness | Mobile support | Yes |
| Error Handling | User-friendly messages | All errors |
| Auditing | Timestamp tracking | All records |

---

## 10. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-01-08 | System | Initial documentation |
| 1.1 | 2026-01-08 | System | Added `is_conventional` column to scf_product_definitions |
| 1.2 | 2026-01-08 | System | Added `product_event_definitions` table with SAP and BAP entries |
