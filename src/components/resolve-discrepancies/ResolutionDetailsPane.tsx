
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ResolutionDetailsPaneProps {
  resolutionStatus: string;
  setResolutionStatus: (value: string) => void;
  documentReuploadRequired: string;
  setDocumentReuploadRequired: (value: string) => void;
  resolutionRemarks: string;
  setResolutionRemarks: (value: string) => void;
}

export const ResolutionDetailsPane: React.FC<ResolutionDetailsPaneProps> = ({
  resolutionStatus,
  setResolutionStatus,
  documentReuploadRequired,
  setDocumentReuploadRequired,
  resolutionRemarks,
  setResolutionRemarks
}) => {
  return (
    <Card className="border border-gray-200 dark:border-gray-600 h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-orange-500 dark:text-orange-400">
          Resolution Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status of Resolution</Label>
          <RadioGroup className="mt-2" value={resolutionStatus} onValueChange={setResolutionStatus}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="resolved" id="resolved" />
              <Label htmlFor="resolved">Resolved</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="not-resolved" id="not-resolved" />
              <Label htmlFor="not-resolved">Not Resolved</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="in-progress" id="in-progress" />
              <Label htmlFor="in-progress">In Progress</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Document Re-upload Required</Label>
          <RadioGroup className="mt-2" value={documentReuploadRequired} onValueChange={setDocumentReuploadRequired}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="reupload-yes" />
              <Label htmlFor="reupload-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="reupload-no" />
              <Label htmlFor="reupload-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Resolution Remarks {resolutionStatus === 'resolved' && <span className="text-red-500">*</span>}
          </Label>
          <Textarea 
            className="mt-1" 
            rows={4}
            placeholder="Enter resolution remarks (max 500 characters)"
            maxLength={500}
            value={resolutionRemarks}
            onChange={(e) => setResolutionRemarks(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
