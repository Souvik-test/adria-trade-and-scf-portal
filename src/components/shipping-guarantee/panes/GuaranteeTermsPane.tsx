import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ShippingGuaranteeFormData, ShippingGuaranteeActionType } from '@/types/shippingGuarantee';

interface GuaranteeTermsPaneProps {
  formData: ShippingGuaranteeFormData;
  onFieldChange: (field: string, value: any) => void;
  action: ShippingGuaranteeActionType;
}

const GuaranteeTermsPane: React.FC<GuaranteeTermsPaneProps> = ({
  formData,
  onFieldChange,
  action
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Guarantee Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guaranteeText">Guarantee Text *</Label>
            <Textarea
              id="guaranteeText"
              value={formData.guaranteeText || ''}
              onChange={(e) => onFieldChange('guaranteeText', e.target.value)}
              placeholder="Enter the guarantee text/wording"
              rows={6}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="termsAndConditions">Terms and Conditions</Label>
            <Textarea
              id="termsAndConditions"
              value={formData.termsAndConditions || ''}
              onChange={(e) => onFieldChange('termsAndConditions', e.target.value)}
              placeholder="Enter additional terms and conditions"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="claimsPayableAt">Claims Payable At</Label>
            <Input
              id="claimsPayableAt"
              value={formData.claimsPayableAt || ''}
              onChange={(e) => onFieldChange('claimsPayableAt', e.target.value)}
              placeholder="Enter where claims are payable"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="underlyingContract">Underlying Contract</Label>
            <Input
              id="underlyingContract"
              value={formData.underlyingContract || ''}
              onChange={(e) => onFieldChange('underlyingContract', e.target.value)}
              placeholder="Enter underlying contract reference"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="specialInstructions">Special Instructions</Label>
            <Textarea
              id="specialInstructions"
              value={formData.specialInstructions || ''}
              onChange={(e) => onFieldChange('specialInstructions', e.target.value)}
              placeholder="Enter any special instructions"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chargesDetails">Charges Details</Label>
            <Textarea
              id="chargesDetails"
              value={formData.chargesDetails || ''}
              onChange={(e) => onFieldChange('chargesDetails', e.target.value)}
              placeholder="Enter charges and fee details"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuaranteeTermsPane;