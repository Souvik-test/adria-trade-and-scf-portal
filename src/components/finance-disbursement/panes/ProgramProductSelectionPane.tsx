import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ProgramProductSelectionPaneProps {
  formData: any;
  onFieldChange: (field: string, value: any) => void;
  anchorType?: 'seller' | 'buyer';
}

const ProgramProductSelectionPane: React.FC<ProgramProductSelectionPaneProps> = ({
  formData,
  onFieldChange,
  anchorType = 'seller'
}) => {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('custom_users')
          .select('user_id')
          .eq('id', user.id)
          .single();
        if (data) {
          setUserId(data.user_id);
        }
      }
    };
    fetchUserId();
  }, []);

  // Store pre-selected programId to include it regardless of anchor type filter
  const preSelectedProgramId = formData.programId;

  const { data: programs, isLoading } = useQuery({
    queryKey: ['finance-programs', anchorType, preSelectedProgramId],
    queryFn: async () => {
      const { data } = await supabase
        .from('scf_program_configurations')
        .select('*')
        .eq('status', 'active');
      
      // Filter by anchor type, but always include pre-selected program
      return (data || []).filter((p: any) => {
        // Always include the pre-selected program regardless of anchor type
        if (preSelectedProgramId && p.program_id === preSelectedProgramId) {
          return true;
        }
        
        const anchorRole = p.anchor_party?.toUpperCase().replace(/\s+/g, '').replace(/\//g, '') || '';
        if (anchorType === 'seller') {
          return anchorRole.includes('SELLER') || anchorRole.includes('SUPPLIER');
        } else {
          return anchorRole.includes('BUYER');
        }
      });
    }
  });

  // Auto-populate program data when preSelectedInvoices are present and programs are loaded
  useEffect(() => {
    // Only attempt auto-population when query has completed (not loading) and we have a programId
    if (formData.programId && !isLoading && programs && programs.length > 0 && !formData.programDataLoaded) {
      const program = programs.find((p: any) => p.program_id === formData.programId);
      
      if (program) {
        // Auto-apply program configuration
        onFieldChange('productCode', program.product_code || '');
        onFieldChange('productName', program.product_name || '');
        onFieldChange('financeCurrency', program.program_currency || formData.invoiceCurrency || 'USD');
        onFieldChange('autoRepaymentEnabled', program.auto_repayment || false);
        onFieldChange('repaymentMode', program.repayment_mode || 'auto');
        onFieldChange('repaymentParty', program.repayment_by || '');
        onFieldChange('financePercentage', program.finance_percentage || 100);
        onFieldChange('graceDays', program.grace_days || 0);
        onFieldChange('holidayTreatment', program.holiday_treatment || 'No Change');
        onFieldChange('repaymentBy', program.repayment_by || '');
        onFieldChange('multipleDisbursement', program.multiple_disbursement || false);
        onFieldChange('maxDisbursementsAllowed', program.max_disbursements_allowed || 1);
        onFieldChange('interestTreatment', program.interest_treatment || 'arrears');
        
        // Recalculate max finance amount with program's finance percentage
        const financePercentage = program.finance_percentage || 100;
        const totalInvoiceAmount = formData.totalInvoiceAmount || 0;
        const maxFinanceAmount = totalInvoiceAmount * (financePercentage / 100);
        onFieldChange('maxFinanceAmount', maxFinanceAmount);
        onFieldChange('financeAmount', maxFinanceAmount);
        
        // Mark that program data has been loaded
        onFieldChange('programDataLoaded', true);
        
        console.log('Program auto-populated:', {
          programId: program.program_id,
          productCode: program.product_code,
          productName: program.product_name,
          financePercentage,
          totalInvoiceAmount,
          maxFinanceAmount
        });
      } else {
        // Program ID exists but not found in the list - log for debugging
        console.warn('Program not found in list:', formData.programId, 'Available programs:', programs.map((p: any) => p.program_id));
      }
    }
  }, [formData.programId, isLoading, programs, formData.programDataLoaded, formData.totalInvoiceAmount]);

  const handleProgramSelect = (programId: string) => {
    const program = programs?.find((p: any) => p.program_id === programId);
    if (program) {
      onFieldChange('programId', program.program_id);
      onFieldChange('programName', program.program_name);
      onFieldChange('productCode', program.product_code || '');
      onFieldChange('productName', program.product_name || '');
      onFieldChange('financeCurrency', program.program_currency || 'USD');
      onFieldChange('autoRepaymentEnabled', program.auto_repayment || false);
      onFieldChange('repaymentMode', program.repayment_mode || 'auto');
      onFieldChange('repaymentParty', program.repayment_by || '');
      
      // Pass program parameters for validation
      onFieldChange('financePercentage', program.finance_percentage || 100);
      onFieldChange('graceDays', program.grace_days || 0);
      onFieldChange('holidayTreatment', program.holiday_treatment || 'No Change');
      onFieldChange('repaymentBy', program.repayment_by || '');
      onFieldChange('multipleDisbursement', program.multiple_disbursement || false);
      onFieldChange('maxDisbursementsAllowed', program.max_disbursements_allowed || 1);
      onFieldChange('interestTreatment', program.interest_treatment || 'arrears');
      onFieldChange('programDataLoaded', true);
      
      // Recalculate max finance amount
      const financePercentage = program.finance_percentage || 100;
      const totalInvoiceAmount = formData.totalInvoiceAmount || 0;
      const maxFinanceAmount = totalInvoiceAmount * (financePercentage / 100);
      onFieldChange('maxFinanceAmount', maxFinanceAmount);
      onFieldChange('financeAmount', maxFinanceAmount);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Program & Product Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="program">
            Program <span className="text-destructive">*</span>
          </Label>
          <Select 
            value={formData.programId} 
            onValueChange={handleProgramSelect}
            disabled={!!formData.programId && !!formData.preSelectedInvoiceIds?.length}
          >
            <SelectTrigger id="program">
              <SelectValue placeholder="Search and select program" />
            </SelectTrigger>
            <SelectContent>
              {programs?.length === 0 && (
                <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                  No active {anchorType === 'seller' ? 'Seller/Supplier' : 'Buyer'} programs found
                </div>
              )}
              {programs?.map((program: any) => (
                <SelectItem key={program.program_id} value={program.program_id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{program.program_id}</span>
                    <span className="text-xs text-muted-foreground">{program.program_name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.programId && formData.preSelectedInvoiceIds?.length > 0 && (
            <div className="text-sm bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-100 p-3 rounded-md border border-blue-200 dark:border-blue-800">
              <strong>Note:</strong> Program auto-populated from {formData.preSelectedInvoiceIds.length} selected invoice(s).
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="programName">Program Name</Label>
          <Input
            id="programName"
            value={formData.programName}
            readOnly
            className="bg-muted cursor-not-allowed"
            placeholder="Auto-populated from program selection"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="productCode">
            Product Code <span className="text-destructive">*</span>
          </Label>
          <Input
            id="productCode"
            value={formData.productCode}
            readOnly
            className="bg-muted cursor-not-allowed"
            placeholder="Pre-filled from product selection"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="productName">
            Product Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="productName"
            value={formData.productName}
            readOnly
            className="bg-muted cursor-not-allowed"
            placeholder="Pre-filled from product selection"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramProductSelectionPane;