
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
          Demand Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Related Reference */}
          <div>
            <Label htmlFor="relatedReference" className="text-sm font-medium">
              Related Reference (Tag: 21) *
            </Label>
            <Input
              id="relatedReference"
              value={demandData.relatedReference}
              onChange={(e) => onDemandDataChange('relatedReference', e.target.value)}
              placeholder="Enter related reference"
              className="mt-1"
            />
          </div>

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

        {/* Demand Statement */}
        <div>
          <Label htmlFor="demandStatement" className="text-sm font-medium">
            Demand Statement (Tag: 49A)
          </Label>
          <div className="space-y-3 mt-1">
            <Select
              value={demandData.demandStatementType}
              onValueChange={(value) => onDemandDataChange('demandStatementType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select demand statement type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COMPLETE">Complete Demand</SelectItem>
                <SelectItem value="INCOMPLETE">Incomplete Demand</SelectItem>
              </SelectContent>
            </Select>
            
            <Textarea
              id="demandStatement"
              value={demandData.demandStatementNarration}
              onChange={(e) => onDemandDataChange('demandStatementNarration', e.target.value)}
              placeholder="Enter demand statement narration..."
              rows={4}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemandDetailsSection;
