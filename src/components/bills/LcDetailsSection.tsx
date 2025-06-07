
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface LcDetailsSectionProps {
  applicantName: string;
  setApplicantName: (value: string) => void;
  issuingBank: string;
  setIssuingBank: (value: string) => void;
  lcCurrency: string;
  setLcCurrency: (value: string) => void;
  lcAmount: string;
  setLcAmount: (value: string) => void;
  lcIssueDate: Date | null;
  setLcIssueDate: (value: Date | null) => void;
  lcExpiryDate: Date | null;
  setLcExpiryDate: (value: Date | null) => void;
}

const LcDetailsSection: React.FC<LcDetailsSectionProps> = ({
  applicantName,
  setApplicantName,
  issuingBank,
  setIssuingBank,
  lcCurrency,
  setLcCurrency,
  lcAmount,
  setLcAmount,
  lcIssueDate,
  setLcIssueDate,
  lcExpiryDate,
  setLcExpiryDate
}) => {
  return (
    <Card className="border-border">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-lg text-primary">
          Section 2: LC & Applicant Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="applicantName">Applicant Name (CM) - Auto</Label>
            <Input
              id="applicantName"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              placeholder="Auto-filled from LC (140 chars max)"
              disabled
              maxLength={140}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuingBank">Issuing Bank (CM) - Auto</Label>
            <Input
              id="issuingBank"
              value={issuingBank}
              onChange={(e) => setIssuingBank(e.target.value)}
              placeholder="BIC or Full Name/Address (140 chars max)"
              disabled
              maxLength={140}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lcCurrency">LC Currency (CM) - Auto-fetched</Label>
            <Input
              id="lcCurrency"
              value={lcCurrency}
              onChange={(e) => setLcCurrency(e.target.value)}
              placeholder="ISO String (3 chars)"
              maxLength={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lcAmount">LC Amount (CM)</Label>
            <Input
              id="lcAmount"
              value={lcAmount}
              onChange={(e) => setLcAmount(e.target.value)}
              placeholder="Format: 99999999999.99"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lcIssueDate">LC Issue Date (CM) - Auto</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !lcIssueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {lcIssueDate ? format(lcIssueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={lcIssueDate}
                  onSelect={setLcIssueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lcExpiryDate">LC Expiry Date & Place (CM)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !lcExpiryDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {lcExpiryDate ? format(lcExpiryDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={lcExpiryDate}
                  onSelect={setLcExpiryDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LcDetailsSection;
