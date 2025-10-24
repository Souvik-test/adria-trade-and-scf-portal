import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import ProgramProductSelectionPane from './panes/ProgramProductSelectionPane';
import InvoiceSelectionPane from './panes/InvoiceSelectionPane';
import FinanceDetailsPane from './panes/FinanceDetailsPane';
import RepaymentDetailsPane from './panes/RepaymentDetailsPane';
import AccountingEntriesPane from './panes/AccountingEntriesPane';
import ReviewSubmitPane from './panes/ReviewSubmitPane';
import { createFinanceDisbursement } from '@/services/financeDisbursementService';
import { supabase } from '@/integrations/supabase/client';

interface FinanceDisbursementModalProps {
  isOpen: boolean;
  onClose: () => void;
  productCode?: string;
  productName?: string;
}

const FinanceDisbursementModal: React.FC<FinanceDisbursementModalProps> = ({
  isOpen,
  onClose,
  productCode,
  productName
}) => {
  const [customUser, setCustomUser] = useState<{ user_id: string; corporate_id: string } | null>(null);
  const [currentPane, setCurrentPane] = useState(0);

  useEffect(() => {
    const fetchCustomUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('custom_users')
          .select('user_id, corporate_id')
          .eq('id', user.id)
          .single();
        if (data) {
          setCustomUser(data);
        }
      }
    };
    if (isOpen) {
      fetchCustomUser();
    }
  }, [isOpen]);

  const [formData, setFormData] = useState<any>({
    // Program & Product
    programId: '',
    programName: '',
    productCode: productCode || '',
    productName: productName || '',
    
    // Invoice Selection
    selectedInvoices: [],
    invoiceCurrency: 'USD',
    
    // Finance Details
    financeDate: new Date(),
    financeCurrency: 'USD',
    exchangeRate: undefined,
    financeAmount: 0,
    financeTenorDays: 0,
    financeDueDate: new Date(),
    interestRateType: 'manual',
    interestRate: 0,
    referenceRateCode: '',
    referenceRateMargin: 0,
    interestAmount: 0,
    totalRepaymentAmount: 0,
    
    // Repayment Details
    autoRepaymentEnabled: false,
    repaymentMode: 'auto',
    repaymentParty: '',
    repaymentAccount: '',
    
    // Accounting
    accountingEntries: [],
    accountingReference: ''
  });

  const panes = [
    { title: 'Program & Product Selection', component: ProgramProductSelectionPane },
    { title: 'Invoice Selection', component: InvoiceSelectionPane },
    { title: 'Finance Details', component: FinanceDetailsPane },
    { title: 'Repayment Details', component: RepaymentDetailsPane },
    { title: 'Accounting Entries', component: AccountingEntriesPane },
    { title: 'Review & Submit', component: ReviewSubmitPane }
  ];

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentPane < panes.length - 1) {
      setCurrentPane(currentPane + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPane > 0) {
      setCurrentPane(currentPane - 1);
    }
  };

  const handleSubmit = async (action: 'draft' | 'approval' | 'disburse') => {
    if (!customUser) {
      toast.error('User not authenticated');
      return;
    }

    const result = await createFinanceDisbursement(
      formData,
      customUser.user_id,
      customUser.corporate_id
    );

    if (result.success) {
      toast.success(`Finance disbursement ${action === 'draft' ? 'saved as draft' : 'submitted'} successfully!`);
      onClose();
    } else {
      toast.error(result.error || 'Failed to create disbursement');
    }
  };

  const CurrentPaneComponent = panes[currentPane].component;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b pb-4">
            <h2 className="text-2xl font-semibold text-foreground">Finance Disbursement</h2>
            <p className="text-sm text-muted-foreground mt-1">{panes[currentPane].title}</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between">
            {panes.map((pane, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index === currentPane
                      ? 'bg-primary text-primary-foreground'
                      : index < currentPane
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index + 1}
                </div>
                {index < panes.length - 1 && (
                  <div className={`w-12 h-0.5 ${index < currentPane ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Pane Content */}
          <div className="min-h-[400px]">
            <CurrentPaneComponent formData={formData} onFieldChange={handleFieldChange} />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t pt-4">
            <Button variant="outline" onClick={handlePrevious} disabled={currentPane === 0}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {currentPane === panes.length - 1 ? (
                <>
                  <Button variant="outline" onClick={() => handleSubmit('draft')}>
                    Save as Draft
                  </Button>
                  <Button onClick={() => handleSubmit('approval')}>
                    Submit for Approval
                  </Button>
                </>
              ) : (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FinanceDisbursementModal;