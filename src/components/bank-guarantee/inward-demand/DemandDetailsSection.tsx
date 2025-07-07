
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, AlertCircle } from 'lucide-react';

interface DemandDetailsSectionProps {
  demandData: any;
  guaranteeData: any;
  onDemandDataChange: (field: string, value: any) => void;
}

const DemandDetailsSection: React.FC<DemandDetailsSectionProps> = ({
  demandData,
  guaranteeData,
  onDemandDataChange
}) => {
  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    onDemandDataChange('demandAmount', numericValue);
  };

  const isAmountExceeded = () => {
    if (!demandData.demandAmount || !guaranteeData.guaranteeAmount) return false;
    const demandAmount = parseFloat(demandData.demandAmount);
    const guaranteeAmount = parseFloat(guaranteeData.guaranteeAmount.replace(/,/g, ''));
    return demandAmount > guaranteeAmount;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Demand Details (MT 765 SWIFT Message)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Demand Reference */}
          <div>
            <Label htmlFor="demandReference" className="text-sm font-medium">
              Demand Reference (Tag: 20) *
            </Label>
            <Input
              id="demandReference"
              value={demandData.demandReference}
              onChange={(e) => onDemandDataChange('demandReference', e.target.value)}
              placeholder="Enter demand reference number"
              className="mt-1"
            />
          </div>

          {/* Demand Type */}
          <div>
            <Label htmlFor="demandType" className="text-sm font-medium">
              Demand Type (Tag: 22G) *
            </Label>
            <Select
              value={demandData.demandType}
              onValueChange={(value) => onDemandDataChange('demandType', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select demand type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PAY">Pay Only</SelectItem>
                <SelectItem value="PAYEXT">Pay or Extend</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Demand Amount */}
          <div>
            <Label htmlFor="demandAmount" className="text-sm font-medium">
              Amount Claimed (Tag: 32B) *
            </Label>
            <div className="mt-1 relative">
              <Input
                id="demandAmount"
                value={demandData.demandAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className={`pr-16 ${isAmountExceeded() ? 'border-red-500' : ''}`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                {demandData.demandCurrency}
              </div>
            </div>
            {isAmountExceeded() && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                Amount cannot exceed guarantee amount ({guaranteeData.currency} {guaranteeData.guaranteeAmount})
              </div>
            )}
          </div>

          {/* Demand Currency */}
          <div>
            <Label htmlFor="demandCurrency" className="text-sm font-medium">
              Demand Currency (Tag: 32B)
            </Label>
            <Input
              id="demandCurrency"
              value={demandData.demandCurrency}
              readOnly
              className="mt-1 bg-gray-50"
              placeholder="Currency will be set automatically"
            />
            <p className="text-xs text-gray-500 mt-1">
              Currency is defaulted to guarantee currency
            </p>
          </div>
        </div>

        {/* Extension Request */}
        {demandData.demandType === 'PAYEXT' && (
          <div className="border-t pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="requestExtension"
                checked={demandData.requestExtension}
                onCheckedChange={(checked) => onDemandDataChange('requestExtension', checked)}
              />
              <Label htmlFor="requestExtension" className="text-sm font-medium">
                Request Guarantee Expiry Extension (Tag: 31D)
              </Label>
            </div>
            
            {demandData.requestExtension && (
              <div className="ml-6">
                <Label htmlFor="extensionDate" className="text-sm font-medium">
                  Requested Extension Date *
                </Label>
                <Input
                  id="extensionDate"
                  type="date"
                  value={demandData.extensionDate}
                  onChange={(e) => onDemandDataChange('extensionDate', e.target.value)}
                  className="mt-1 max-w-xs"
                  min={guaranteeData.expiryDate}
                />
              </div>
            )}
          </div>
        )}

        {/* Demand Reason */}
        <div>
          <Label htmlFor="demandReason" className="text-sm font-medium">
            Reason for Demand (Tag: 77C) *
          </Label>
          <Textarea
            id="demandReason"
            value={demandData.demandReason}
            onChange={(e) => onDemandDataChange('demandReason', e.target.value)}
            placeholder="Provide detailed reason for the demand..."
            rows={4}
            className="mt-1"
          />
        </div>

        {/* Claim Details */}
        <div>
          <Label htmlFor="claimDetails" className="text-sm font-medium">
            Additional Claim Details (Tag: 77A)
          </Label>
          <Textarea
            id="claimDetails"
            value={demandData.claimDetails}
            onChange={(e) => onDemandDataChange('claimDetails', e.target.value)}
            placeholder="Additional details about the claim (optional)..."
            rows={3}
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DemandDetailsSection;
