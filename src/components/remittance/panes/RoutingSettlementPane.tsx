import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RoutingSettlement, validateBIC } from '@/types/internationalRemittance';
import CollapsiblePane from './CollapsiblePane';

interface RoutingSettlementPaneProps {
  data: RoutingSettlement;
  onChange: (field: keyof RoutingSettlement, value: string) => void;
  readOnly?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

const RoutingSettlementPane: React.FC<RoutingSettlementPaneProps> = ({
  data,
  onChange,
  readOnly = false,
  isOpen = true,
  onToggle = () => {},
}) => {
  const inputClassName = readOnly ? 'bg-muted cursor-not-allowed' : '';
  
  const isInstgBicValid = data.instgAgtBic.length === 0 || validateBIC(data.instgAgtBic);
  const isInstdBicValid = data.instdAgtBic.length === 0 || validateBIC(data.instdAgtBic);
  const isIntrmyBicValid = data.intrmyBic.length === 0 || validateBIC(data.intrmyBic);

  return (
    <CollapsiblePane title="Routing & Settlement" isOpen={isOpen} onToggle={onToggle}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Instructing Agent BIC */}
          <div className="space-y-2">
            <Label htmlFor="instgAgtBic" className="text-sm">
              Instructing Agent BIC <span className="text-destructive">*</span>
            </Label>
            <Input
              id="instgAgtBic"
              value={data.instgAgtBic}
              onChange={(e) => onChange('instgAgtBic', e.target.value.toUpperCase().slice(0, 11))}
              placeholder="e.g., HSBCGB2LXXX"
              maxLength={11}
              disabled={readOnly}
              className={`${inputClassName} ${!isInstgBicValid ? 'border-destructive' : ''}`}
            />
            {!isInstgBicValid && (
              <span className="text-xs text-destructive">Invalid BIC format</span>
            )}
          </div>

          {/* Instructed Agent BIC */}
          <div className="space-y-2">
            <Label htmlFor="instdAgtBic" className="text-sm">
              Instructed Agent BIC <span className="text-destructive">*</span>
            </Label>
            <Input
              id="instdAgtBic"
              value={data.instdAgtBic}
              onChange={(e) => onChange('instdAgtBic', e.target.value.toUpperCase().slice(0, 11))}
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
              value={data.intrmyBic}
              onChange={(e) => onChange('intrmyBic', e.target.value.toUpperCase().slice(0, 11))}
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
              value={data.intrmyName}
              onChange={(e) => onChange('intrmyName', e.target.value.slice(0, 140))}
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
              value={data.intrmyAcct}
              onChange={(e) => onChange('intrmyAcct', e.target.value.toUpperCase().slice(0, 34))}
              placeholder="Enter account number"
              maxLength={34}
              disabled={readOnly}
              className={inputClassName}
            />
          </div>
        </div>
      </div>
    </CollapsiblePane>
  );
};

export default RoutingSettlementPane;
