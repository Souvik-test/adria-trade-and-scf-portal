
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImportLCFormData } from '@/types/importLC';
import AmendmentFieldWrapper from './AmendmentFieldWrapper';
import ImportLCSearchDropdown from '../export-lc/ImportLCSearchDropdown';
import SwiftTagLabel from './SwiftTagLabel';

interface ImportLCAmendmentBasicPaneProps {
  formData: ImportLCFormData;
  originalData: ImportLCFormData;
  changes: Record<string, { original: any; current: any }>;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
  populateFromLC: (lcData: any) => void;
}

const ImportLCAmendmentBasicPane: React.FC<ImportLCAmendmentBasicPaneProps> = ({
  formData,
  originalData,
  changes,
  updateField,
  populateFromLC
}) => {
  const handleLCSelect = (lc: any) => {
    console.log('Selected LC for amendment:', lc);
    // Map all the required fields from the selected LC
    const mappedData = {
      corporate_reference: lc.corporate_reference || '',
      form_of_documentary_credit: lc.form_of_documentary_credit || '',
      applicable_rules: lc.applicable_rules || '',
      lc_type: lc.lc_type || '',
      place_of_expiry: lc.place_of_expiry || '',
      issue_date: lc.issue_date || '',
      expiry_date: lc.expiry_date || '',
      issuing_bank: lc.issuing_bank || '',
      applicant_name: lc.applicant_name || '',
      beneficiary_name: lc.beneficiary_name || '',
      lc_amount: lc.lc_amount || 0,
      currency: lc.currency || '',
      applicant_address: lc.applicant_address || '',
      applicant_account_number: lc.applicant_account_number || '',
      beneficiary_address: lc.beneficiary_address || '',
      beneficiary_bank_name: lc.beneficiary_bank_name || '',
      beneficiary_bank_address: lc.beneficiary_bank_address || '',
      beneficiary_bank_swift_code: lc.beneficiary_bank_swift_code || '',
      advising_bank_swift_code: lc.advising_bank_swift_code || '',
      tolerance: lc.tolerance || '',
      available_with: lc.available_with || '',
      available_by: lc.available_by || '',
      partial_shipments_allowed: lc.partial_shipments_allowed || false,
      transshipment_allowed: lc.transshipment_allowed || false,
      is_transferable: lc.is_transferable || false,
      description_of_goods: lc.description_of_goods || '',
      port_of_loading: lc.port_of_loading || '',
      port_of_discharge: lc.port_of_discharge || '',
      latest_shipment_date: lc.latest_shipment_date || '',
      presentation_period: lc.presentation_period || '',
      required_documents: lc.required_documents || [],
      additional_conditions: lc.additional_conditions || ''
    };
    populateFromLC(mappedData);
  };

  // Generate amendment number (in real app, this would come from API based on selected LC)
  const amendmentNumber = formData.corporateReference ? '01' : '';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            Basic LC Information - Amendment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <SwiftTagLabel tag=":20:" label="Corporate Reference (Search)" required />
              <ImportLCSearchDropdown
                value={formData.corporateReference || ""}
                onSelect={handleLCSelect}
                placeholder="Search and select LC Reference..."
              />
            </div>

            <div className="space-y-3">
              <SwiftTagLabel tag=":26E:" label="Amendment Number" />
              <Input
                value={amendmentNumber}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
                placeholder="Auto-generated after LC selection"
              />
            </div>

            <AmendmentFieldWrapper
              fieldName="formOfDocumentaryCredit"
              label="Form of Documentary Credit"
              hasChanged={!!changes.formOfDocumentaryCredit}
              originalValue={originalData.formOfDocumentaryCredit}
            >
              <SwiftTagLabel tag=":40A:" label="Form of Documentary Credit" required />
              <Select 
                value={formData.formOfDocumentaryCredit} 
                onValueChange={(value) => updateField('formOfDocumentaryCredit', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select form" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IRREVOCABLE">Irrevocable</SelectItem>
                  <SelectItem value="IRREVOCABLE TRANSFERABLE">Irrevocable Transferable</SelectItem>
                </SelectContent>
              </Select>
            </AmendmentFieldWrapper>

            <AmendmentFieldWrapper
              fieldName="applicableRules"
              label="Applicable Rules"
              hasChanged={!!changes.applicableRules}
              originalValue={originalData.applicableRules}
            >
              <SwiftTagLabel tag=":40E:" label="Applicable Rules" required />
              <Select 
                value={formData.applicableRules} 
                onValueChange={(value) => updateField('applicableRules', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select applicable rules" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UCP Latest Version">UCP Latest Version</SelectItem>
                  <SelectItem value="UCP 600">UCP 600</SelectItem>
                  <SelectItem value="ISBP">ISBP</SelectItem>
                  <SelectItem value="eUCP">eUCP</SelectItem>
                </SelectContent>
              </Select>
            </AmendmentFieldWrapper>

            <AmendmentFieldWrapper
              fieldName="lcType"
              label="LC Type"
              hasChanged={!!changes.lcType}
              originalValue={originalData.lcType}
            >
              <SwiftTagLabel tag=":40A:" label="LC Type" />
              <Select 
                value={formData.lcType} 
                onValueChange={(value) => updateField('lcType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select LC type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="At Sight">At Sight</SelectItem>
                  <SelectItem value="Usance">Usance</SelectItem>
                  <SelectItem value="Deferred Payment">Deferred Payment</SelectItem>
                  <SelectItem value="Acceptance">Acceptance</SelectItem>
                </SelectContent>
              </Select>
            </AmendmentFieldWrapper>

            <AmendmentFieldWrapper
              fieldName="issueDate"
              label="Issue Date"
              hasChanged={!!changes.issueDate}
              originalValue={originalData.issueDate}
            >
              <SwiftTagLabel tag=":31C:" label="Issue Date" />
              <Input
                type="date"
                value={formData.issueDate}
                onChange={(e) => updateField('issueDate', e.target.value)}
              />
            </AmendmentFieldWrapper>

            <AmendmentFieldWrapper
              fieldName="expiryDate"
              label="Expiry Date"
              hasChanged={!!changes.expiryDate}
              originalValue={originalData.expiryDate}
            >
              <SwiftTagLabel tag=":31D:" label="Expiry Date" required />
              <Input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => updateField('expiryDate', e.target.value)}
              />
            </AmendmentFieldWrapper>

            <AmendmentFieldWrapper
              fieldName="placeOfExpiry"
              label="Place of Expiry"
              hasChanged={!!changes.placeOfExpiry}
              originalValue={originalData.placeOfExpiry}
            >
              <SwiftTagLabel tag=":31D:" label="Place of Expiry" required />
              <Input
                value={formData.placeOfExpiry}
                onChange={(e) => updateField('placeOfExpiry', e.target.value)}
                placeholder="Enter place of expiry"
              />
            </AmendmentFieldWrapper>

            <AmendmentFieldWrapper
              fieldName="issuingBank"
              label="Issuing Bank"
              hasChanged={!!changes.issuingBank}
              originalValue={originalData.issuingBank}
            >
              <SwiftTagLabel tag=":52A:" label="Issuing Bank" />
              <Input
                value={formData.issuingBank || ''}
                onChange={(e) => updateField('issuingBank', e.target.value)}
                placeholder="Enter issuing bank name"
              />
            </AmendmentFieldWrapper>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportLCAmendmentBasicPane;
