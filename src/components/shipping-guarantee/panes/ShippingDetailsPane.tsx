import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ShippingGuaranteeFormData, ShippingGuaranteeActionType } from '@/types/shippingGuarantee';

interface ShippingDetailsPaneProps {
  formData: ShippingGuaranteeFormData;
  onFieldChange: (field: string, value: any) => void;
  action: ShippingGuaranteeActionType;
}

const ShippingDetailsPane: React.FC<ShippingDetailsPaneProps> = ({
  formData,
  onFieldChange,
  action
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vessel & Voyage Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vesselName">Vessel Name *</Label>
              <Input
                id="vesselName"
                value={formData.vesselName || ''}
                onChange={(e) => onFieldChange('vesselName', e.target.value)}
                placeholder="Enter vessel name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="voyageNumber">Voyage Number</Label>
              <Input
                id="voyageNumber"
                value={formData.voyageNumber || ''}
                onChange={(e) => onFieldChange('voyageNumber', e.target.value)}
                placeholder="Enter voyage number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="billOfLadingNumber">Bill of Lading Number *</Label>
            <Input
              id="billOfLadingNumber"
              value={formData.billOfLadingNumber || ''}
              onChange={(e) => onFieldChange('billOfLadingNumber', e.target.value)}
              placeholder="Enter B/L number"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Port & Cargo Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="portOfLoading">Port of Loading *</Label>
              <Input
                id="portOfLoading"
                value={formData.portOfLoading || ''}
                onChange={(e) => onFieldChange('portOfLoading', e.target.value)}
                placeholder="Enter port of loading"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="portOfDischarge">Port of Discharge *</Label>
              <Input
                id="portOfDischarge"
                value={formData.portOfDischarge || ''}
                onChange={(e) => onFieldChange('portOfDischarge', e.target.value)}
                placeholder="Enter port of discharge"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargoDescription">Cargo Description *</Label>
            <Textarea
              id="cargoDescription"
              value={formData.cargoDescription || ''}
              onChange={(e) => onFieldChange('cargoDescription', e.target.value)}
              placeholder="Describe the cargo being shipped"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingDetailsPane;