
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImportLCFormData } from '@/hooks/useImportLCForm';
import { searchPurchaseOrder } from '@/services/database';

interface BasicLCInformationPaneProps {
  formData: ImportLCFormData;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
}

const BasicLCInformationPane: React.FC<BasicLCInformationPaneProps> = ({
  formData,
  updateField
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const formOfDocumentaryCreditOptions = [
    'Irrevocable Documentary Credit',
    'Revocable Documentary Credit',
    'Confirmed Irrevocable Documentary Credit',
    'Unconfirmed Irrevocable Documentary Credit',
    'Standby Letter of Credit',
    'Transferable Letter of Credit'
  ];

  const applicableRulesOptions = [
    'UCP Latest Version',
    'UCP 600',
    'ISP98',
    'URDG 758',
    'Other'
  ];

  const handlePOPISearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const result = await searchPurchaseOrder(searchTerm);
      if (result) {
        updateField('popiNumber', result.po_number);
        updateField('popiType', 'PO');
        // Auto-populate description of goods from PO
        if (result.notes) {
          updateField('descriptionOfGoods', result.notes);
        }
      } else {
        alert('PO/PI not found');
      }
    } catch (error) {
      console.error('Error searching PO/PI:', error);
      alert('Error searching PO/PI');
    } finally {
      setIsSearching(false);
    }
  };

  // Auto-populate advising bank swift code when beneficiary bank swift code changes
  useEffect(() => {
    if (formData.beneficiaryBankSwiftCode) {
      updateField('advisingBankSwiftCode', formData.beneficiaryBankSwiftCode);
    }
  }, [formData.beneficiaryBankSwiftCode, updateField]);

  return (
    <ScrollArea className="h-full" style={{ scrollbarWidth: 'auto' }}>
      <div className="space-y-6 pr-4">
        <Card className="border border-gray-200 dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
              Basic LC Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Purchase Order/Proforma Invoice Number */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                Purchase Order/Pro-forma Invoice Number
              </Label>
              <div className="flex gap-2">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter PO/PI number to search"
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={handlePOPISearch}
                  disabled={isSearching || !searchTerm.trim()}
                  className="bg-corporate-teal-100 hover:bg-corporate-teal-200 text-corporate-teal-700 border-corporate-teal-300"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              {formData.popiNumber && (
                <div className="mt-2 text-sm text-green-600">
                  Selected: {formData.popiType} - {formData.popiNumber}
                </div>
              )}
            </div>

            {/* Form of Documentary Credit */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Form of Documentary Credit <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.formOfDocumentaryCredit} onValueChange={(value) => updateField('formOfDocumentaryCredit', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select form of documentary credit" />
                </SelectTrigger>
                <SelectContent>
                  {formOfDocumentaryCreditOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Corporate Reference Number */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Corporate Reference Number <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.corporateReference}
                onChange={(e) => updateField('corporateReference', e.target.value.slice(0, 16))}
                placeholder="Enter corporate reference (max 16 characters)"
                maxLength={16}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.corporateReference.length}/16 characters
              </div>
            </div>

            {/* Applicable Rules */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Applicable Rules <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.applicableRules} onValueChange={(value) => updateField('applicableRules', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {applicableRulesOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Issue Date */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Issue Date
                </Label>
                <Input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => updateField('issueDate', e.target.value)}
                />
              </div>

              {/* Expiry Date */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Expiry Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => updateField('expiryDate', e.target.value)}
                />
              </div>
            </div>

            {/* Place of Expiry */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Place of Expiry
              </Label>
              <Input
                value={formData.placeOfExpiry}
                onChange={(e) => updateField('placeOfExpiry', e.target.value)}
                placeholder="Enter place of expiry"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default BasicLCInformationPane;
