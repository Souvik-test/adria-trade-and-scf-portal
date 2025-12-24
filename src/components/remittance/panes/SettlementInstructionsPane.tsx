import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettlementInstructions, INSTRUCTION_CODE_OPTIONS } from '@/types/internationalRemittance';

interface SettlementInstructionsPaneProps {
  data: SettlementInstructions;
  onChange: (field: keyof SettlementInstructions, value: string) => void;
  readOnly?: boolean;
}

const SettlementInstructionsPane: React.FC<SettlementInstructionsPaneProps> = ({
  data,
  onChange,
  readOnly = false,
}) => {
  const inputClassName = readOnly ? 'bg-muted cursor-not-allowed' : '';

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Settlement Instructions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="instrCd" className="text-sm">Instruction Code</Label>
            <Select value={data.instrCd} onValueChange={(value) => onChange('instrCd', value)} disabled={readOnly}>
              <SelectTrigger className={inputClassName}><SelectValue placeholder="Select instruction code" /></SelectTrigger>
              <SelectContent>{INSTRUCTION_CODE_OPTIONS.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="addtlInfo" className="text-sm">Additional Information</Label>
          <Textarea id="addtlInfo" value={data.addtlInfo} onChange={(e) => onChange('addtlInfo', e.target.value.slice(0, 140))} placeholder="Enter additional settlement instructions" maxLength={140} rows={3} disabled={readOnly} className={inputClassName} />
          <span className="text-xs text-muted-foreground">{data.addtlInfo.length}/140</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettlementInstructionsPane;
