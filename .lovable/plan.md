
# Enhanced Interest Treatment for Interest in Advance

## Overview
This plan extends the existing "Interest Treatment" feature to provide granular control over how interest is deducted when "Interest in Advance" is selected. It includes options for deduction source (from proceeds vs. from client's account), proper calculation adjustments for repayment amounts, and enhanced accounting entries.

---

## Business Logic Summary

### When Interest in Advance is Selected:

| Deduction Method | Net Proceeds | Interest Handling | Total Repayment |
|------------------|--------------|-------------------|-----------------|
| **From Proceeds** | Finance Amount - Interest | Deducted upfront | Finance Amount only |
| **From Client's Account** | Finance Amount (full) | Separate debit entry | Finance Amount only |

### When Interest in Arrears is Selected:
- Net Proceeds = Finance Amount (no deduction)
- Total Repayment = Finance Amount + Interest Amount

---

## Database Schema Changes

### Table: `scf_program_configurations`
Add new column for interest deduction method at program level:
```sql
ALTER TABLE scf_program_configurations 
ADD COLUMN interest_deduction_method text DEFAULT 'proceeds' 
CHECK (interest_deduction_method IN ('proceeds', 'client_account'));
```

### Table: `finance_disbursements`
Add new columns for transaction-level tracking:
```sql
ALTER TABLE finance_disbursements 
ADD COLUMN interest_deduction_method text DEFAULT 'proceeds' 
CHECK (interest_deduction_method IN ('proceeds', 'client_account'));

ALTER TABLE finance_disbursements 
ADD COLUMN interest_debit_account text;
```

---

## UI Changes

### 1. Program Configuration (GeneralPartyPane.tsx)

**Location:** Finance Parameters section, after "Interest Treatment" field

Add conditional field when Interest Treatment = "advance":
- **Field Name:** "Interest Deduction Method"
- **Type:** Dropdown
- **Options:**
  - "From Proceeds" (default)
  - "From Client's Account"
- **Visibility:** Only shown when `interest_treatment === 'advance'`

```text
Finance Parameters
├── Interest Treatment: [Interest in Advance ▼]
│   └── Interest Deduction Method: [From Proceeds ▼]  ← NEW (conditional)
└── ...
```

### 2. Finance Disbursement - Finance Details Pane

**Location:** Interest Calculation section

Update layout to show:
1. Interest Treatment dropdown (existing)
2. Interest Deduction Method dropdown (NEW - conditional when advance selected)
3. Updated calculation display based on selection

**Summary Display Logic:**

**Scenario A: Interest in Advance + From Proceeds**
```
Interest Amount:                              52.94 GBP
Net Proceeds (after interest deduction):  13,274.26 GBP  ← Highlighted
─────────────────────────────────────────────────────────
Total Repayment Amount:                   13,327.20 GBP  ← Finance Amount only
```

**Scenario B: Interest in Advance + From Client's Account**
```
Interest Amount:                              52.94 GBP
Net Proceeds:                             13,327.20 GBP  ← Full finance amount
Interest Debit (from client account):        -52.94 GBP  ← NEW line
─────────────────────────────────────────────────────────
Total Repayment Amount:                   13,327.20 GBP  ← Finance Amount only
```

**Scenario C: Interest in Arrears**
```
Interest Amount:                              52.94 GBP
Net Proceeds:                             13,327.20 GBP
─────────────────────────────────────────────────────────
Total Repayment Amount:                   13,380.14 GBP  ← Finance + Interest
```

### 3. Repayment Details Pane

Update the Repayment Summary section to reflect correct amounts:

**For Interest in Advance (both methods):**
```
Total Finance Amount:        13,327.20 GBP
Interest Amount:                 52.94 GBP (Collected in Advance)
Finance Tenor:                   29 days
─────────────────────────────────────────────
Total Repayment Amount:      13,327.20 GBP  ← Only principal
```

**For Interest in Arrears:**
```
Total Finance Amount:        13,327.20 GBP
Interest Amount:                 52.94 GBP
Finance Tenor:                   29 days
─────────────────────────────────────────────
Total Repayment Amount:      13,380.14 GBP  ← Principal + Interest
```

### 4. Accounting Entries Pane

**Base Entries (always shown):**
| Type | Account | GL Code | Amount |
|------|---------|---------|--------|
| Dr | Loan Account | 1200-001 | 13,327.20 |
| Cr | Suspense Account | 2100-001 | 13,327.20 |

**Additional Entries for Interest in Advance + From Client's Account:**
| Type | Account | GL Code | Amount |
|------|---------|---------|--------|
| Dr | Client Interest Account | 1300-001 | 52.94 |
| Cr | Interest Income Account | 4100-001 | 52.94 |

**Logic:** These additional entries are added dynamically when:
- `interestTreatment === 'advance'` AND
- `interestDeductionMethod === 'client_account'`

---

## File Modifications

### 1. Database Migration
**File:** `supabase/migrations/YYYYMMDD_interest_deduction_method.sql`

```sql
-- Add interest deduction method to program configuration
ALTER TABLE scf_program_configurations 
ADD COLUMN IF NOT EXISTS interest_deduction_method text DEFAULT 'proceeds' 
CHECK (interest_deduction_method IN ('proceeds', 'client_account'));

-- Add interest deduction method to finance disbursements
ALTER TABLE finance_disbursements 
ADD COLUMN IF NOT EXISTS interest_deduction_method text DEFAULT 'proceeds' 
CHECK (interest_deduction_method IN ('proceeds', 'client_account'));

-- Add interest debit account field
ALTER TABLE finance_disbursements 
ADD COLUMN IF NOT EXISTS interest_debit_account text;
```

### 2. Program Configuration UI
**File:** `src/components/scf-program/panes/GeneralPartyPane.tsx`

**Changes:**
- Add `interest_deduction_method` FormField after `interest_treatment`
- Show conditionally when `interest_treatment === 'advance'`
- Options: "From Proceeds", "From Client's Account"

### 3. Finance Details Pane
**File:** `src/components/finance-disbursement/panes/FinanceDetailsPane.tsx`

**Changes:**
- Add `interestDeductionMethod` dropdown (conditional on advance)
- Update calculation logic:
  - If advance + proceeds: `proceedsAmount = financeAmount - interestAmount`
  - If advance + client_account: `proceedsAmount = financeAmount`
- Update `totalRepaymentAmount` calculation:
  - If advance: `totalRepaymentAmount = financeAmount` (interest already collected)
  - If arrears: `totalRepaymentAmount = financeAmount + interestAmount`
- Add display for "Interest Debit" line when using client account method

### 4. Program Selection Pane
**File:** `src/components/finance-disbursement/panes/ProgramProductSelectionPane.tsx`

**Changes:**
- Auto-populate `interestDeductionMethod` from selected program

### 5. Repayment Details Pane
**File:** `src/components/finance-disbursement/panes/RepaymentDetailsPane.tsx`

**Changes:**
- Update summary to show "(Collected in Advance)" label when applicable
- Adjust Total Repayment Amount display based on interest treatment

### 6. Accounting Entries Pane
**File:** `src/components/finance-disbursement/panes/AccountingEntriesPane.tsx`

**Changes:**
- Modify `useEffect` to generate conditional entries
- Add two additional rows when interest is collected from client account
- Ensure balance check still works correctly

### 7. Service Layer
**File:** `src/services/financeDisbursementService.ts`

**Changes:**
- Add `interestDeductionMethod` to data interface
- Include new field in database insert
- Add `interestDebitAccount` field

### 8. Modal State
**File:** `src/components/finance-disbursement/FinanceDisbursementModal.tsx`

**Changes:**
- Add `interestDeductionMethod: 'proceeds'` to initial form state
- Add `interestDebitAccount: ''` to form state

---

## Calculation Summary

### Total Repayment Amount Formula

```javascript
const totalRepaymentAmount = 
  formData.interestTreatment === 'advance'
    ? formData.financeAmount  // Interest already collected
    : formData.financeAmount + formData.interestAmount;  // Interest in arrears
```

### Proceeds Amount Formula

```javascript
const proceedsAmount = 
  formData.interestTreatment === 'advance' && formData.interestDeductionMethod === 'proceeds'
    ? formData.financeAmount - formData.interestAmount  // Deducted from proceeds
    : formData.financeAmount;  // Full amount (arrears OR advance from client account)
```

---

## Test Scenarios

| Scenario | Finance Amount | Interest | Proceeds | Repayment | Extra Entries |
|----------|----------------|----------|----------|-----------|---------------|
| Arrears | 13,327.20 | 52.94 | 13,327.20 | 13,380.14 | No |
| Advance + Proceeds | 13,327.20 | 52.94 | 13,274.26 | 13,327.20 | No |
| Advance + Client Account | 13,327.20 | 52.94 | 13,327.20 | 13,327.20 | Yes (2 rows) |
