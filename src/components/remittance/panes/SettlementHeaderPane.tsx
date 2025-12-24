import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettlementHeader, SETTLEMENT_METHOD_OPTIONS } from '@/types/internationalRemittance';
import CollapsiblePane from './CollapsiblePane';

interface SettlementHeaderPaneProps {
  data: SettlementHeader;
  onChange: (field: keyof SettlementHeader, value: string) => void;
  readOnly?: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

const SettlementHeaderPane: React.FC<SettlementHeaderPaneProps> = ({
  data,
  onChange,
  readOnly = false,
  isOpen,
  onToggle,
}) => {
  const inputClassName = readOnly ? 'bg-muted cursor-not-allowed' : '';
  const readOnlyClassName = 'bg-muted cursor-not-allowed';

  return (
    <CollapsiblePane title="Settlement Header" isOpen={isOpen} onToggle={onToggle}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Settlement Reference - Read-only */}
          <div className="space-y-2">
            <Label htmlFor="sttlmRef" className="text-sm">
              Settlement Reference
            </Label>
            <Input
              id="sttlmRef"
              value={data.sttlmRef || '—'}
              readOnly
              disabled
              className={readOnlyClassName}
            />
            <span className="text-xs text-muted-foreground">Read-only</span>
          </div>

          {/* UETR - Read-only */}
          <div className="space-y-2">
            <Label htmlFor="uetr" className="text-sm">
              UETR
            </Label>
            <Input
              id="uetr"
              value={data.uetr || '—'}
              readOnly
              disabled
              className={readOnlyClassName}
            />
            <span className="text-xs text-muted-foreground">Read-only</span>
          </div>

          {/* Creation Date - Read-only */}
          <div className="space-y-2">
            <Label htmlFor="creDt" className="text-sm">
              Creation Date
            </Label>
            <Input
              id="creDt"
              value={data.creDt ? new Date(data.creDt).toLocaleString() : '—'}
              readOnly
              disabled
              className={readOnlyClassName}
            />
            <span className="text-xs text-muted-foreground">Read-only</span>
          </div>

          {/* Settlement Method */}
          <div className="space-y-2">
            <Label htmlFor="sttlmMtd" className="text-sm">
              Settlement Method <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.sttlmMtd}
              onValueChange={(value) => onChange('sttlmMtd', value)}
              disabled={readOnly}
            >
              <SelectTrigger className={inputClassName}>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                {SETTLEMENT_METHOD_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </CollapsiblePane>
  );
};

export default SettlementHeaderPane;
