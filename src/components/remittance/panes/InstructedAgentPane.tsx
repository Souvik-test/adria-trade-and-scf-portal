import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { InstructedAgent, validateBIC } from '@/types/internationalRemittance';

interface InstructedAgentPaneProps {
  data: InstructedAgent;
  onChange: (field: keyof InstructedAgent, value: string) => void;
  readOnly?: boolean;
}

const InstructedAgentPane: React.FC<InstructedAgentPaneProps> = ({
  data,
  onChange,
  readOnly = false,
}) => {
  const inputClassName = readOnly ? 'bg-muted cursor-not-allowed' : '';
  const isBicValid = data.instdAgtBic.length === 0 || validateBIC(data.instdAgtBic);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Instructed Agent</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="instdAgtName" className="text-sm">Agent Name <span className="text-destructive">*</span></Label>
            <Input id="instdAgtName" value={data.instdAgtName} onChange={(e) => onChange('instdAgtName', e.target.value.slice(0, 140))} placeholder="Enter instructed agent name" maxLength={140} disabled={readOnly} className={inputClassName} />
            <span className="text-xs text-muted-foreground">{data.instdAgtName.length}/140</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="instdAgtBic" className="text-sm">Agent BIC <span className="text-destructive">*</span></Label>
            <Input id="instdAgtBic" value={data.instdAgtBic} onChange={(e) => onChange('instdAgtBic', e.target.value.toUpperCase().slice(0, 11))} placeholder="e.g., CITIUS33XXX" maxLength={11} disabled={readOnly} className={`${inputClassName} ${!isBicValid ? 'border-destructive' : ''}`} />
            {!isBicValid ? <span className="text-xs text-destructive">Invalid BIC format</span> : <span className="text-xs text-muted-foreground">{data.instdAgtBic.length}/11</span>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="instdAgtAddr" className="text-sm">Agent Address</Label>
          <Input id="instdAgtAddr" value={data.instdAgtAddr} onChange={(e) => onChange('instdAgtAddr', e.target.value.slice(0, 70))} placeholder="Enter agent address" maxLength={70} disabled={readOnly} className={inputClassName} />
          <span className="text-xs text-muted-foreground">{data.instdAgtAddr.length}/70</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructedAgentPane;
