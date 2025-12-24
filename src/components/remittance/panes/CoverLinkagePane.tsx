import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CoverLinkage } from '@/types/internationalRemittance';

interface CoverLinkagePaneProps {
  data: CoverLinkage;
}

const CoverLinkagePane: React.FC<CoverLinkagePaneProps> = ({ data }) => {
  const readOnlyClassName = 'bg-muted cursor-not-allowed';

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Cover / Linkage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedPacs008Ref" className="text-sm">Linked PACS.008 Reference</Label>
            <Input id="linkedPacs008Ref" value={data.linkedPacs008Ref || '—'} readOnly disabled className={readOnlyClassName} />
            <span className="text-xs text-muted-foreground">Read-only (auto-populated)</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedUetr" className="text-sm">Linked UETR</Label>
            <Input id="linkedUetr" value={data.linkedUetr || '—'} readOnly disabled className={readOnlyClassName} />
            <span className="text-xs text-muted-foreground">Read-only (auto-populated)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoverLinkagePane;
