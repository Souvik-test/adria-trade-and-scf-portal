import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CoverLinkage } from '@/types/internationalRemittance';
import CollapsiblePane from './CollapsiblePane';

interface CoverLinkagePaneProps {
  data: CoverLinkage;
  isOpen: boolean;
  onToggle: () => void;
}

const CoverLinkagePane: React.FC<CoverLinkagePaneProps> = ({
  data,
  isOpen,
  onToggle,
}) => {
  const readOnlyClassName = 'bg-muted cursor-not-allowed';

  return (
    <CollapsiblePane title="Cover / Linkage" isOpen={isOpen} onToggle={onToggle}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Linked PACS.008 Reference - Read-only */}
        <div className="space-y-2">
          <Label htmlFor="linkedPacs008Ref" className="text-sm">
            Linked PACS.008 Reference
          </Label>
          <Input
            id="linkedPacs008Ref"
            value={data.linkedPacs008Ref || '—'}
            readOnly
            disabled
            className={readOnlyClassName}
          />
          <span className="text-xs text-muted-foreground">Read-only (auto-populated from parent)</span>
        </div>

        {/* Linked UETR - Read-only */}
        <div className="space-y-2">
          <Label htmlFor="linkedUetr" className="text-sm">
            Linked UETR
          </Label>
          <Input
            id="linkedUetr"
            value={data.linkedUetr || '—'}
            readOnly
            disabled
            className={readOnlyClassName}
          />
          <span className="text-xs text-muted-foreground">Read-only (auto-populated from parent)</span>
        </div>
      </div>
    </CollapsiblePane>
  );
};

export default CoverLinkagePane;
