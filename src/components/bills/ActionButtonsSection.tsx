
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ActionButtonsSectionProps {
  onBack: () => void;
  onSubmit: () => void;
  submissionType: string;
  submissionDate: Date | null;
  lcReferenceNumber: string;
  declaration: boolean;
  documentsCount: number;
}

const ActionButtonsSection: React.FC<ActionButtonsSectionProps> = ({
  onBack,
  onSubmit,
  submissionType,
  submissionDate,
  lcReferenceNumber,
  declaration,
  documentsCount
}) => {
  return (
    <Card className="border-border">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-lg text-primary">
          Section 6: Action Buttons
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="px-8"
          >
            Save as Draft
          </Button>
          <Button
            variant="outline"
            className="px-8"
          >
            Save as Template
          </Button>
          <Button 
            onClick={onSubmit}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            disabled={!submissionType || !submissionDate || !lcReferenceNumber || !declaration || documentsCount === 0}
          >
            Submit for Pre-check
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionButtonsSection;
