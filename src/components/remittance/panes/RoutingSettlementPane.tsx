import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RoutingSettlement, validateBIC, initialRoutingSettlement } from '@/types/internationalRemittance';

interface RoutingSettlementPaneProps {
  data?: RoutingSettlement;
  onChange?: (field: keyof RoutingSettlement, value: string) => void;
  readOnly?: boolean;
}

const RoutingSettlementPane: React.FC<RoutingSettlementPaneProps> = ({
  data,
  onChange,
  readOnly = false,
}) => {
  // Merge with defaults to ensure all fields exist
  const safeData = { ...initialRoutingSettlement, ...data };
  const inputClassName = readOnly ? 'bg-muted cursor-not-allowed' : '';
  
  const isInstgBicValid = (safeData.instgAgtBic || '').length === 0 || validateBIC(safeData.instgAgtBic || '');
  const isInstdBicValid = (safeData.instdAgtBic || '').length === 0 || validateBIC(safeData.instdAgtBic || '');
  const isIntrmyBicValid = (safeData.intrmyBic || '').length === 0 || validateBIC(safeData.intrmyBic || '');

  const handleChange = (field: keyof RoutingSettlement, value: string) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Routing & Settlement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Debtor Agent BIC (formerly Instructing Agent BIC) */}
          <div className="space-y-2">
            <Label htmlFor="instgAgtBic" className="text-sm">
              Debtor Agent BIC
            </Label>
            <Input
              id="instgAgtBic"
              value={safeData.instgAgtBic || ''}
              onChange={(e) => handleChange('instgAgtBic', e.target.value.toUpperCase().slice(0, 11))}
              placeholder="e.g., HSBCGB2LXXX"
              maxLength={11}
              disabled={readOnly}
              className={`${inputClassName} ${!isInstgBicValid ? 'border-destructive' : ''}`}
            />
            {!isInstgBicValid && (
              <span className="text-xs text-destructive">Invalid BIC format</span>
            )}
          </div>

          {/* Creditor Agent BIC (formerly Instructed Agent BIC) */}
          <div className="space-y-2">
            <Label htmlFor="instdAgtBic" className="text-sm">
              Creditor Agent BIC
            </Label>
            <Input
              id="instdAgtBic"
              value={safeData.instdAgtBic || ''}
              onChange={(e) => handleChange('instdAgtBic', e.target.value.toUpperCase().slice(0, 11))}
              placeholder="e.g., CITIUS33XXX"
              maxLength={11}
              disabled={readOnly}
              className={`${inputClassName} ${!isInstdBicValid ? 'border-destructive' : ''}`}
            />
            {!isInstdBicValid && (
              <span className="text-xs text-destructive">Invalid BIC format</span>
            )}
          </div>
        </div>

        {/* Intermediary Bank Section */}
        <div className="pt-2">
          <Label className="text-sm font-medium text-muted-foreground">Intermediary Bank (Optional)</Label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Intermediary BIC */}
          <div className="space-y-2">
            <Label htmlFor="intrmyBic" className="text-sm">
              Intermediary Bank BIC
            </Label>
            <Input
              id="intrmyBic"
              value={safeData.intrmyBic || ''}
              onChange={(e) => handleChange('intrmyBic', e.target.value.toUpperCase().slice(0, 11))}
              placeholder="e.g., CHASUS33XXX"
              maxLength={11}
              disabled={readOnly}
              className={`${inputClassName} ${!isIntrmyBicValid ? 'border-destructive' : ''}`}
            />
            {!isIntrmyBicValid && (
              <span className="text-xs text-destructive">Invalid BIC format</span>
            )}
          </div>

          {/* Intermediary Name */}
          <div className="space-y-2">
            <Label htmlFor="intrmyName" className="text-sm">
              Intermediary Bank Name
            </Label>
            <Input
              id="intrmyName"
              value={safeData.intrmyName || ''}
              onChange={(e) => handleChange('intrmyName', e.target.value.slice(0, 140))}
              placeholder="Enter intermediary bank name"
              maxLength={140}
              disabled={readOnly}
              className={inputClassName}
            />
          </div>

          {/* Intermediary Account */}
          <div className="space-y-2">
            <Label htmlFor="intrmyAcct" className="text-sm">
              Intermediary Account
            </Label>
            <Input
              id="intrmyAcct"
              value={safeData.intrmyAcct || ''}
              onChange={(e) => handleChange('intrmyAcct', e.target.value.toUpperCase().slice(0, 34))}
              placeholder="Enter account number"
              maxLength={34}
              disabled={readOnly}
              className={inputClassName}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoutingSettlementPane;
