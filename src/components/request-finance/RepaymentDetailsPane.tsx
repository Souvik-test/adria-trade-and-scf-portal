
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RepaymentDetailsPaneProps {
  principalRepaymentAmount: string;
  interestRepaymentAmount: string;
  totalRepaymentAmount: string;
  principalRepaymentAccountNumber: string;
  setPrincipalRepaymentAccountNumber: (value: string) => void;
  interestRepaymentAccountNumber: string;
  setInterestRepaymentAccountNumber: (value: string) => void;
  // New props for auto-calculation
  financeCurrency?: string;
  financeAmountRequested?: string;
  interestCurrency?: string;
  interestAmount?: string;
}

const RepaymentDetailsPane: React.FC<RepaymentDetailsPaneProps> = ({
  principalRepaymentAmount,
  interestRepaymentAmount,
  totalRepaymentAmount,
  principalRepaymentAccountNumber,
  setPrincipalRepaymentAccountNumber,
  interestRepaymentAccountNumber,
  setInterestRepaymentAccountNumber,
  financeCurrency,
  financeAmountRequested,
  interestCurrency,
  interestAmount
}) => {
  // Calculate principal repayment amount (Finance Currency + Finance Amount Requested)
  const calculatePrincipalRepaymentAmount = () => {
    if (financeCurrency && financeAmountRequested) {
      return `${financeCurrency} ${financeAmountRequested}`;
    }
    return '';
  };

  // Calculate interest repayment amount (Interest Currency + Interest Amount)
  const calculateInterestRepaymentAmount = () => {
    if (interestCurrency && interestAmount) {
      return `${interestCurrency} ${interestAmount}`;
    }
    return '';
  };

  // Calculate total repayment amount (Principal Currency + sum of Principal and Interest amounts)
  const calculateTotalRepaymentAmount = () => {
    if (financeAmountRequested && interestAmount && financeCurrency) {
      const principalAmount = parseFloat(financeAmountRequested) || 0;
      const interestAmountValue = parseFloat(interestAmount) || 0;
      const total = (principalAmount + interestAmountValue).toFixed(2);
      return `${financeCurrency} ${total}`;
    }
    return '';
  };

  // Auto-set Interest Repayment Account Number to Principal Repayment Account Number
  useEffect(() => {
    if (principalRepaymentAccountNumber && !interestRepaymentAccountNumber) {
      setInterestRepaymentAccountNumber(principalRepaymentAccountNumber);
    }
  }, [principalRepaymentAccountNumber, interestRepaymentAccountNumber, setInterestRepaymentAccountNumber]);

  return (
    <ScrollArea className="h-full" style={{ scrollbarWidth: 'auto' }}>
      <Card className="border border-gray-200 dark:border-gray-600 h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
            Repayment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Principal Repayment Amount <span className="text-red-500">*</span>
              </Label>
              <Input
                value={calculatePrincipalRepaymentAmount()}
                readOnly
                className="bg-gray-100 dark:bg-gray-700"
                maxLength={15}
              />
              <p className="text-xs text-gray-500">Defaulted to Finance Currency and Finance Amount Requested</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Interest Repayment Amount <span className="text-red-500">*</span>
              </Label>
              <Input
                value={calculateInterestRepaymentAmount()}
                readOnly
                className="bg-gray-100 dark:bg-gray-700"
                maxLength={15}
              />
              <p className="text-xs text-gray-500">Defaulted to Interest Currency and Interest Amount</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Repayment Amount <span className="text-red-500">*</span>
              </Label>
              <Input
                value={calculateTotalRepaymentAmount()}
                readOnly
                className="bg-gray-100 dark:bg-gray-700"
                maxLength={15}
              />
              <p className="text-xs text-gray-500">Principal Currency and summation of [Principal Repayment Amount and Interest Amount]</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Principal Repayment Account Number <span className="text-red-500">*</span>
              </Label>
              <Input
                value={principalRepaymentAccountNumber}
                onChange={(e) => setPrincipalRepaymentAccountNumber(e.target.value)}
                placeholder="Enter account number"
                maxLength={35}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Interest Repayment Account Number
              </Label>
              <Input
                value={interestRepaymentAccountNumber}
                onChange={(e) => setInterestRepaymentAccountNumber(e.target.value)}
                placeholder="Enter account number"
                maxLength={35}
              />
              <p className="text-xs text-gray-500">Defaulted to Principal Repayment Account Number but editable</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  );
};

export default RepaymentDetailsPane;
