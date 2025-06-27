
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ConditionsClausesPaneProps {
  formData: any;
  onFieldChange: (field: string, value: any) => void;
}

const ConditionsClausesPane: React.FC<ConditionsClausesPaneProps> = ({
  formData,
  onFieldChange
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Terms and Conditions (MT 760 Tag: 47A)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="additionalConditions">Additional Conditions *</Label>
            <Textarea
              id="additionalConditions"
              value={formData.additionalConditions || ''}
              onChange={(e) => onFieldChange('additionalConditions', e.target.value)}
              placeholder="Enter additional conditions and clauses"
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Charges Details (MT 760 Tag: 71D)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="chargesDetails">Charges Details</Label>
            <Textarea
              id="chargesDetails"
              value={formData.chargesDetails || 'ALL CHARGES OUTSIDE SINGAPORE FOR BENEFICIARY ACCOUNT'}
              onChange={(e) => onFieldChange('chargesDetails', e.target.value)}
              placeholder="Enter charges details"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConditionsClausesPane;
