
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface DocumentsRequiredPaneProps {
  formData: any;
  onFieldChange: (field: string, value: any) => void;
}

const DocumentsRequiredPane: React.FC<DocumentsRequiredPaneProps> = ({
  formData,
  onFieldChange
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Documents Required (MT 760 Tag: 46A)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="documentsRequired">Documents Required *</Label>
            <Textarea
              id="documentsRequired"
              value={formData.documentsRequired || ''}
              onChange={(e) => onFieldChange('documentsRequired', e.target.value)}
              placeholder="Enter details of documents required"
              rows={6}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsRequiredPane;
