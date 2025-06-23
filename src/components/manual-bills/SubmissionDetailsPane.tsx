
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from 'lucide-react';

interface SubmissionDetailsPaneProps {
  submissionType: string;
  setSubmissionType: (value: string) => void;
  submissionDate: string;
  setSubmissionDate: (value: string) => void;
  submissionReference: string;
  setSubmissionReference: (value: string) => void;
}

const SubmissionDetailsPane: React.FC<SubmissionDetailsPaneProps> = ({
  submissionType,
  setSubmissionType,
  submissionDate,
  setSubmissionDate,
  submissionReference,
  setSubmissionReference
}) => {
  return (
    <ScrollArea className="h-full" style={{ scrollbarWidth: 'auto' }}>
      <Card className="border border-gray-200 dark:border-gray-600 h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
            Submission Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Submission Type</Label>
              <Select value={submissionType} onValueChange={setSubmissionType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select submission type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="pre-check">Pre-Check</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Submission Date</Label>
              <div className="relative mt-1">
                <Input 
                  type="date"
                  value={submissionDate}
                  onChange={(e) => setSubmissionDate(e.target.value)}
                  className="pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Bill Reference Number
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input 
                placeholder="Enter bill reference number" 
                className="mt-1" 
                value={submissionReference}
                onChange={(e) => setSubmissionReference(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  );
};

export default SubmissionDetailsPane;
