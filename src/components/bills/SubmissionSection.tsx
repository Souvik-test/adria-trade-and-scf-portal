
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
    <Card className="border-border shadow-sm">
      <CardHeader className="bg-primary/5 border-b border-border">
        <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
            1
          </div>
          Section 1: Submission Type and Export LC Selection
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Select submission type and provide LC reference details
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="submissionType" className="text-sm font-medium text-foreground">
              Submission Type <span className="text-destructive">*</span> 
              <span className="text-muted-foreground font-normal">(M)</span>
            </Label>
            <Select value={submissionType} onValueChange={setSubmissionType}>
              <SelectTrigger className="w-full">
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
            <Label htmlFor="submissionReference" className="text-sm font-medium text-foreground">
              Submission Reference 
              <span className="text-muted-foreground font-normal">(O)</span>
            </Label>
            <Input
              id="submissionReference"
              value={submissionReference}
              onChange={(e) => setSubmissionReference(e.target.value)}
              placeholder="Enter submission reference (Max 16 chars)"
              maxLength={16}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Maximum 16 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="submissionDate" className="text-sm font-medium text-foreground">
              Submission Date <span className="text-destructive">*</span> 
              <span className="text-muted-foreground font-normal">(M) - Auto</span>
            </Label>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-muted/50",
                !submissionDate && "text-muted-foreground"
              )}
              disabled
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {submissionDate ? format(submissionDate, "dd/MM/yyyy") : "Auto-populated"}
            </Button>
            <p className="text-xs text-muted-foreground">Automatically set to current date</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lcReference" className="text-sm font-medium text-foreground">
              LC Reference Number <span className="text-destructive">*</span> 
              <span className="text-muted-foreground font-normal">(M)</span>
            </Label>
            <Input
              id="lcReference"
              value={lcReferenceNumber}
              onChange={(e) => setLcReferenceNumber(e.target.value)}
              placeholder="Enter LC reference number (Max 16 chars)"
              maxLength={16}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Maximum 16 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="corporateReference" className="text-sm font-medium text-foreground">
              Corporate Reference Number 
              <span className="text-muted-foreground font-normal">(O)</span>
            </Label>
            <Input
              id="corporateReference"
              value={corporateReference}
              onChange={(e) => setCorporateReference(e.target.value)}
              placeholder="Internal use only (Max 16 chars)"
              maxLength={16}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Internal use only - Maximum 16 characters</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionSection;
