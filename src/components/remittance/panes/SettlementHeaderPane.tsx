import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettlementHeader, SETTLEMENT_METHOD_OPTIONS } from '@/types/internationalRemittance';

interface SettlementHeaderPaneProps {
  data: SettlementHeader;
  onChange: (field: keyof SettlementHeader, value: string) => void;
  readOnly?: boolean;
}

const SettlementHeaderPane: React.FC<SettlementHeaderPaneProps> = ({
  data,
  onChange,
  readOnly = false,
}) => {
  const inputClassName = readOnly ? 'bg-muted cursor-not-allowed' : '';
  const readOnlyClassName = 'bg-muted cursor-not-allowed';

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Settlement Header</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sttlmRef" className="text-sm">Settlement Reference</Label>
            <Input id="sttlmRef" value={data.sttlmRef || '—'} readOnly disabled className={readOnlyClassName} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="uetr" className="text-sm">UETR</Label>
            <Input id="uetr" value={data.uetr || '—'} readOnly disabled className={readOnlyClassName} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="creDt" className="text-sm">Creation Date</Label>
            <Input id="creDt" value={data.creDt ? new Date(data.creDt).toLocaleString() : '—'} readOnly disabled className={readOnlyClassName} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sttlmMtd" className="text-sm">Settlement Method <span className="text-destructive">*</span></Label>
            <Select value={data.sttlmMtd} onValueChange={(value) => onChange('sttlmMtd', value)} disabled={readOnly}>
              <SelectTrigger className={inputClassName}><SelectValue placeholder="Select method" /></SelectTrigger>
              <SelectContent>
                {SETTLEMENT_METHOD_OPTIONS.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettlementHeaderPane;
