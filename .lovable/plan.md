
# Fix: Program & Product Code Auto-Population in Finance Disbursement

## Problem Summary

When initiating "Request Finance" from Transaction Inquiry (either via row action menu or bulk selection), the Program & Product Selection pane shows:
- **Program dropdown**: Empty (despite having `programId` passed in)
- **Program Name**: Correctly shows "Savy Test"  
- **Product Code**: Empty (shows placeholder "Pre-filled from product selection")
- **Product Name**: Empty (shows placeholder "Pre-filled from product selection")
- **Note**: Shows "Program auto-populated from 1 selected invoice(s)" incorrectly

The root cause is a timing/dependency issue in the auto-population logic.

---

## Root Cause Analysis

### Issue 1: Program ID Format Mismatch
The `programId` passed from Transaction Inquiry (`getSelectedInvoices()[0]?.programId`) may not match what the Select component expects as its `value`. The Select component uses `program.program_id` from the fetched programs list.

### Issue 2: Programs Query Not Ready When Effect Runs
The `useEffect` in `ProgramProductSelectionPane.tsx` (lines 59-89) that auto-populates program data depends on:
- `formData.programId` - set immediately when modal opens
- `programs` - loaded asynchronously via `useQuery`
- `formData.programDataLoaded` - guard flag

The effect runs before programs are fetched, finds no matching program (`programs.find()` returns undefined), and does nothing.

### Issue 3: Select Value Binding
The Select component (line 132) uses `value={formData.programId}`, but if the programs haven't loaded yet or the ID doesn't match any program's `program_id`, the Select shows empty.

---

## Solution Design

### Fix 1: Wait for Programs to Load Before Auto-Populating
Modify the dependency array and condition in the auto-population `useEffect` to ensure programs are fully loaded before attempting to find and apply program configuration.

### Fix 2: Add Proper Loading State Handling
Ensure the Select component reflects the pre-selected program ID correctly even during the loading state.

### Fix 3: Verify Program ID Matching
Add defensive checks and logging to ensure the `programId` from Transaction Inquiry exactly matches a `program_id` in the fetched programs list.

---

## Technical Implementation

### File: `src/components/finance-disbursement/panes/ProgramProductSelectionPane.tsx`

#### Change 1: Fix the auto-population useEffect condition

**Current Code (lines 59-89):**
```typescript
useEffect(() => {
  if (formData.programId && programs && programs.length > 0 && !formData.programDataLoaded) {
    const program = programs.find((p: any) => p.program_id === formData.programId);
    if (program) {
      // Auto-apply program configuration...
    }
  }
}, [formData.programId, programs, formData.programDataLoaded, formData.totalInvoiceAmount]);
```

**Problem:** The condition `programs && programs.length > 0` doesn't guarantee `isLoading` is false - the query might still be in initial/loading state.

**Solution:** Add `!isLoading` to the condition and use a proper check for query completion.

#### Change 2: Log for debugging and ensure match

Add console logging to trace the matching process:
```typescript
useEffect(() => {
  // Only attempt auto-population when query has completed and we have a programId
  if (formData.programId && !isLoading && programs && !formData.programDataLoaded) {
    const program = programs.find((p: any) => p.program_id === formData.programId);
    
    if (program) {
      // Apply all program configuration fields
      onFieldChange('productCode', program.product_code || '');
      onFieldChange('productName', program.product_name || '');
      // ... rest of fields
      onFieldChange('programDataLoaded', true);
    } else {
      // Program ID exists but not found in filtered list - could be anchor type mismatch
      console.warn('Program not found in list:', formData.programId);
    }
  }
}, [formData.programId, isLoading, programs, formData.programDataLoaded, formData.totalInvoiceAmount]);
```

#### Change 3: Handle anchor type filtering issue

The programs query filters by anchor type (seller/buyer), but the invoice might belong to a program with a different anchor role. Need to either:
- Option A: Remove anchor type filter when programId is pre-selected (preferred)
- Option B: Pass correct anchor type from invoice data

**Implementation (Option A):**
```typescript
const { data: programs, isLoading } = useQuery({
  queryKey: ['finance-programs', anchorType, formData.programId],
  queryFn: async () => {
    const { data } = await supabase
      .from('scf_program_configurations')
      .select('*')
      .eq('status', 'active');
    
    // If we have a pre-selected programId, include that program regardless of anchor type
    const hasPreSelectedProgram = !!formData.programId;
    
    return (data || []).filter((p: any) => {
      // Always include the pre-selected program
      if (hasPreSelectedProgram && p.program_id === formData.programId) {
        return true;
      }
      // Otherwise filter by anchor type
      const anchorRole = p.anchor_party?.toUpperCase().replace(/\s+/g, '').replace(/\//g, '') || '';
      if (anchorType === 'seller') {
        return anchorRole.includes('SELLER') || anchorRole.includes('SUPPLIER');
      } else {
        return anchorRole.includes('BUYER');
      }
    });
  }
});
```

---

### File: `src/components/finance-disbursement/FinanceDisbursementModal.tsx`

#### Change 4: Pass anchor type from invoice data

The Transaction Inquiry already has program data including `anchor_party`. Pass this to the modal so it can determine the correct anchor type.

**Current props passed (lines 468-470):**
```typescript
preSelectedInvoices={getSelectedInvoices()}
preSelectedProgramId={getSelectedInvoices()[0]?.programId}
preSelectedProgramName={getSelectedInvoices()[0]?.programName}
```

**Add anchor type from rawData:**
```typescript
preSelectedInvoices={getSelectedInvoices()}
preSelectedProgramId={getSelectedInvoices()[0]?.programId}
preSelectedProgramName={getSelectedInvoices()[0]?.programName}
anchorType={getSelectedInvoices()[0]?.rawData?.anchor_party?.includes('SELLER') ? 'seller' : 'buyer'}
```

---

## Validation Flow After Fix

1. User selects invoice `TESTINV27` in Transaction Inquiry
2. User clicks "Request Finance" from row action or bulk action
3. `FinanceDisbursementModal` opens with:
   - `preSelectedProgramId` = "TESTPROG1" 
   - `preSelectedProgramName` = "Savy Test" (or actual program name)
4. `ProgramProductSelectionPane` renders:
   - Programs query starts loading
   - Select shows loading or programId value
5. Programs query completes:
   - Effect runs because `!isLoading && programs exists && programId exists`
   - `programs.find()` locates the matching program
   - All fields auto-populate:
     - Program dropdown shows selected program
     - Program Name: "Savy Test"
     - Product Code: "RCVFN001" (from program)
     - Product Name: "Receivable Finance" (from program)
6. User proceeds with correctly populated form

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/finance-disbursement/panes/ProgramProductSelectionPane.tsx` | Fix useEffect condition, add isLoading check, fix anchor type filter for pre-selected programs |
| `src/components/SCFTransactionInquiryTable.tsx` | Pass anchor type to modal based on invoice/program data |

---

## Additional Considerations

### Finance Amount Calculation
The fix will also resolve the related issue where `maxFinanceAmount` shows 0.00 because:
- Without program data, `financePercentage` defaults to 100% but `totalInvoiceAmount` is 0
- The auto-population effect sets `totalInvoiceAmount` correctly when program loads
- This triggers recalculation of `maxFinanceAmount = totalInvoiceAmount * (financePercentage / 100)`

### Invoice Selection Pre-Population
The Invoice Selection pane will also work correctly because:
- `preSelectedInvoicesData` is already being passed from the modal
- The `mergedInvoices` logic correctly includes pre-selected invoices
- The auto-select effect triggers when `mergedInvoices.length > 0`

