
import React from 'react';
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
}

const RepaymentDetailsPane: React.FC<RepaymentDetailsPaneProps> = ({
  principalRepaymentAmount,
  interestRepaymentAmount,
  totalRepaymentAmount,
  principalRepaymentAccountNumber,
  setPrincipalRepaymentAccountNumber,
  interestRepaymentAccountNumber,
  setInterestRepaymentAccountNumber
}) => {
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
                value={principalRepaymentAmount}
                readOnly
                className="bg-gray-100 dark:bg-gray-700"
                maxLength={15}
              />
              <p className="text-xs text-gray-500">Defaulted to Finance Currency and Finance Amount but not editable</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Interest Repayment Amount <span className="text-red-500">*</span>
              </Label>
              <Input
                value={interestRepaymentAmount}
                readOnly
                className="bg-gray-100 dark:bg-gray-700"
                maxLength={15}
              />
              <p className="text-xs text-gray-500">Defaulted to Finance Currency and Interest Amount but not editable</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Repayment Amount <span className="text-red-500">*</span>
              </Label>
              <Input
                value={totalRepaymentAmount}
                readOnly
                className="bg-gray-100 dark:bg-gray-700"
                maxLength={15}
              />
              <p className="text-xs text-gray-500">Defaulted to Finance Currency and summation of [Finance Amount and Interest Amount]</p>
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
