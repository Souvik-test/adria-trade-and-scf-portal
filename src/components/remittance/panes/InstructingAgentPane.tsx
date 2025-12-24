import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { InstructingAgent, validateBIC } from '@/types/internationalRemittance';

interface InstructingAgentPaneProps {
  data: InstructingAgent;
  onChange: (field: keyof InstructingAgent, value: string) => void;
  readOnly?: boolean;
}

const InstructingAgentPane: React.FC<InstructingAgentPaneProps> = ({
  data,
  onChange,
  readOnly = false,
}) => {
  const inputClassName = readOnly ? 'bg-muted cursor-not-allowed' : '';
  const isBicValid = data.instgAgtBic.length === 0 || validateBIC(data.instgAgtBic);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Instructing Agent</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="instgAgtName" className="text-sm">Agent Name <span className="text-destructive">*</span></Label>
            <Input id="instgAgtName" value={data.instgAgtName} onChange={(e) => onChange('instgAgtName', e.target.value.slice(0, 140))} placeholder="Enter instructing agent name" maxLength={140} disabled={readOnly} className={inputClassName} />
            <span className="text-xs text-muted-foreground">{data.instgAgtName.length}/140</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="instgAgtBic" className="text-sm">Agent BIC <span className="text-destructive">*</span></Label>
            <Input id="instgAgtBic" value={data.instgAgtBic} onChange={(e) => onChange('instgAgtBic', e.target.value.toUpperCase().slice(0, 11))} placeholder="e.g., HSBCGB2LXXX" maxLength={11} disabled={readOnly} className={`${inputClassName} ${!isBicValid ? 'border-destructive' : ''}`} />
            {!isBicValid ? <span className="text-xs text-destructive">Invalid BIC format</span> : <span className="text-xs text-muted-foreground">{data.instgAgtBic.length}/11</span>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="instgAgtAddr" className="text-sm">Agent Address</Label>
          <Input id="instgAgtAddr" value={data.instgAgtAddr} onChange={(e) => onChange('instgAgtAddr', e.target.value.slice(0, 70))} placeholder="Enter agent address" maxLength={70} disabled={readOnly} className={inputClassName} />
          <span className="text-xs text-muted-foreground">{data.instgAgtAddr.length}/70</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructingAgentPane;
