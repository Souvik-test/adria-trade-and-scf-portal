
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImportLCFormData } from '@/hooks/useImportLCForm';

interface BeneficiaryInformationPaneProps {
  formData: ImportLCFormData;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
}

const BeneficiaryInformationPane: React.FC<BeneficiaryInformationPaneProps> = ({
  formData,
  updateField
}) => {
  // Auto-populate advising bank swift code when beneficiary bank swift code changes
  useEffect(() => {
    if (formData.beneficiaryBankSwiftCode && !formData.advisingBankSwiftCode) {
      updateField('advisingBankSwiftCode', formData.beneficiaryBankSwiftCode);
    }
  }, [formData.beneficiaryBankSwiftCode]);

  return (
    <ScrollArea className="h-full" style={{ scrollbarWidth: 'auto' }}>
      <div className="space-y-6 pr-4">
        <Card className="border border-gray-200 dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
              Beneficiary Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Beneficiary Name */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Beneficiary Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.beneficiaryName}
                onChange={(e) => updateField('beneficiaryName', e.target.value)}
                placeholder="Enter beneficiary name"
              />
            </div>

            {/* Beneficiary Address */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Beneficiary Address <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={formData.beneficiaryAddress}
                onChange={(e) => updateField('beneficiaryAddress', e.target.value)}
                placeholder="Enter complete beneficiary address"
                rows={4}
              />
            </div>

            {/* Beneficiary Bank Name */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Beneficiary Bank Name
              </Label>
              <Input
                value={formData.beneficiaryBankName}
                onChange={(e) => updateField('beneficiaryBankName', e.target.value)}
                placeholder="Enter beneficiary bank name"
              />
            </div>

            {/* Beneficiary Bank Address */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Beneficiary Bank Address
              </Label>
              <Textarea
                value={formData.beneficiaryBankAddress}
                onChange={(e) => updateField('beneficiaryBankAddress', e.target.value)}
                placeholder="Enter beneficiary bank address"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Beneficiary Bank Swift Code */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Beneficiary Bank Swift Code
                </Label>
                <Input
                  value={formData.beneficiaryBankSwiftCode}
                  onChange={(e) => updateField('beneficiaryBankSwiftCode', e.target.value.toUpperCase())}
                  placeholder="Enter SWIFT code"
                  maxLength={11}
                />
              </div>

              {/* Advising Bank Swift Code */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Advising Bank Swift Code
                </Label>
                <Input
                  value={formData.advisingBankSwiftCode}
                  onChange={(e) => updateField('advisingBankSwiftCode', e.target.value.toUpperCase())}
                  placeholder="Enter advising bank SWIFT code"
                  maxLength={11}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Auto-populated from beneficiary bank, can be edited
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default BeneficiaryInformationPane;
