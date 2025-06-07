
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SubmissionSectionProps {
  submissionType: string;
  setSubmissionType: (value: string) => void;
  submissionReference: string;
  setSubmissionReference: (value: string) => void;
  submissionDate: Date | null;
  lcReferenceNumber: string;
  setLcReferenceNumber: (value: string) => void;
  corporateReference: string;
  setCorporateReference: (value: string) => void;
}

const SubmissionSection: React.FC<SubmissionSectionProps> = ({
  submissionType,
  setSubmissionType,
  submissionReference,
  setSubmissionReference,
  submissionDate,
  lcReferenceNumber,
  setLcReferenceNumber,
  corporateReference,
  setCorporateReference
}) => {
  const submissionTypes = ['Pre-Check', 'Final'];

  return (
    <Card className="border-border">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-lg text-primary">
          Section 1: Submission Type and Export LC Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="submissionType">Submission Type * (M)</Label>
            <Select value={submissionType} onValueChange={setSubmissionType}>
              <SelectTrigger>
                <SelectValue placeholder="Select submission type" />
              </SelectTrigger>
              <SelectContent>
                {submissionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="submissionReference">Submission Reference (O)</Label>
            <Input
              id="submissionReference"
              value={submissionReference}
              onChange={(e) => setSubmissionReference(e.target.value)}
              placeholder="Enter submission reference (Max 16 chars)"
              maxLength={16}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="submissionDate">Submission Date * (M) - Auto</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !submissionDate && "text-muted-foreground"
                  )}
                  disabled
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {submissionDate ? format(submissionDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lcReference">LC Reference Number * (M)</Label>
            <Input
              id="lcReference"
              value={lcReferenceNumber}
              onChange={(e) => setLcReferenceNumber(e.target.value)}
              placeholder="Enter LC reference number (Max 16 chars)"
              maxLength={16}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="corporateReference">Corporate Reference Number (O)</Label>
            <Input
              id="corporateReference"
              value={corporateReference}
              onChange={(e) => setCorporateReference(e.target.value)}
              placeholder="Internal use only (Max 16 chars)"
              maxLength={16}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionSection;
