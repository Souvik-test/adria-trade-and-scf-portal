import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImportLCFormData } from '@/types/importLC';
import { CheckCircle, AlertTriangle, TrendingUp, DollarSign, Send } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';

interface LimitDetailsPaneProps {
  formData: ImportLCFormData;
}

const LimitDetailsPane: React.FC<LimitDetailsPaneProps> = ({ formData }) => {
  const [requestApproval, setRequestApproval] = useState(false);
  const [assignTo, setAssignTo] = useState<'department' | 'approver' | ''>('');
  const [email, setEmail] = useState('');
  const [demoInsufficientLimit, setDemoInsufficientLimit] = useState(false);

  // Support multiple field names for LC amount (from different UI configurations)
  const getLCAmount = (): number => {
    const possibleFields = ['lcAmount', 'LC Amount', 'LC  Amount', 'lc_amount', 
                            'Transaction Amount', 'Transaction  Amount'];
    for (const field of possibleFields) {
      const value = (formData as any)[field];
      if (value !== undefined && value !== null && value !== '') {
        return typeof value === 'number' ? value : parseFloat(value) || 100000;
      }
    }
    return 100000; // Default fallback
  };

  const getLCCurrency = (): string => {
    const possibleFields = ['currency', 'LC Currency', 'LC  Currency', 'lc_currency',
                            'Transaction Currency', 'Transaction  Currency'];
    for (const field of possibleFields) {
      const value = (formData as any)[field];
      if (value) return value;
    }
    return 'USD'; // Default fallback
  };

  // Mock limit data - in production, this would come from an external limit system
  const lcValue = getLCAmount();
  const baseLimitDetails = {
    limitType: 'LC Issuance Limit',
    totalLimit: 5000000,
    utilizedAmount: 1500000,
    availableLimit: 3500000,
    lcValue: lcValue,
    currency: getLCCurrency()
  };

  // For demo mode, simulate insufficient limit - set available limit to 50% of LC value
  const insufficientAvailableLimit = Math.max(lcValue * 0.5, 500);
  const limitDetails = demoInsufficientLimit 
    ? { ...baseLimitDetails, availableLimit: insufficientAvailableLimit, utilizedAmount: baseLimitDetails.totalLimit - insufficientAvailableLimit }
    : baseLimitDetails;

  const isWithinLimit = limitDetails.lcValue <= limitDetails.availableLimit;
  const utilizationPercentage = ((limitDetails.utilizedAmount + limitDetails.lcValue) / limitDetails.totalLimit) * 100;

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-foreground">Limit Details</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDemoInsufficientLimit(!demoInsufficientLimit);
              setRequestApproval(false);
              setAssignTo('');
              setEmail('');
            }}
            className="text-xs h-7 gap-1"
          >
            <AlertTriangle className="h-3 w-3" />
            {demoInsufficientLimit ? 'Show Sufficient' : 'Demo Insufficient'}
          </Button>
        </div>
        <Badge variant={isWithinLimit ? 'default' : 'destructive'} className="gap-1">
          {isWithinLimit ? (
            <>
              <CheckCircle className="h-3 w-3" />
              Within Limit
            </>
          ) : (
            <>
              <AlertTriangle className="h-3 w-3" />
              Exceeds Limit
            </>
          )}
        </Badge>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {limitDetails.limitType}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Limit Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total Limit</p>
              <p className="text-lg font-semibold text-foreground">
                {formatAmount(limitDetails.totalLimit, limitDetails.currency)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Utilized Amount</p>
              <p className="text-lg font-semibold text-amber-600">
                {formatAmount(limitDetails.utilizedAmount, limitDetails.currency)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Available Limit</p>
              <p className="text-lg font-semibold text-green-600">
                {formatAmount(limitDetails.availableLimit, limitDetails.currency)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">LC Value</p>
              <p className={`text-lg font-semibold ${isWithinLimit ? 'text-foreground' : 'text-red-600'}`}>
                {formatAmount(limitDetails.lcValue, limitDetails.currency)}
              </p>
            </div>
          </div>

          {/* Utilization Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Limit Utilization (after this LC)</span>
              <span>{utilizationPercentage.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${utilizationPercentage > 100 ? 'bg-red-500' : utilizationPercentage > 80 ? 'bg-amber-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Limit Check Result */}
          <div className={`p-4 rounded-lg border ${isWithinLimit ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
            <div className="flex items-start gap-3">
              {isWithinLimit ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div>
                <p className={`font-medium ${isWithinLimit ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  {isWithinLimit ? 'Limit Check Passed' : 'Limit Check Failed'}
                </p>
                <p className={`text-sm ${isWithinLimit ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                  {isWithinLimit 
                    ? `LC value of ${formatAmount(limitDetails.lcValue, limitDetails.currency)} is within the available limit of ${formatAmount(limitDetails.availableLimit, limitDetails.currency)}.`
                    : `LC value of ${formatAmount(limitDetails.lcValue, limitDetails.currency)} exceeds the available limit of ${formatAmount(limitDetails.availableLimit, limitDetails.currency)}.`
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request Approval Option - only shown when limit is exceeded */}
      {!isWithinLimit && (
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400 flex items-center gap-2">
              <Send className="h-4 w-4" />
              Approval Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="request-approval" 
                checked={requestApproval}
                onCheckedChange={(checked) => {
                  setRequestApproval(checked === true);
                  if (!checked) {
                    setAssignTo('');
                    setEmail('');
                  }
                }}
              />
              <Label htmlFor="request-approval" className="text-sm font-medium cursor-pointer">
                Request Approval for Limit Override
              </Label>
            </div>

            {requestApproval && (
              <div className="pl-6 space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm text-muted-foreground">Assign to</Label>
                  <RadioGroup 
                    value={assignTo} 
                    onValueChange={(value) => {
                      setAssignTo(value as 'department' | 'approver');
                      setEmail('');
                    }}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="department" id="department" />
                      <Label htmlFor="department" className="cursor-pointer">Department</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="approver" id="approver" />
                      <Label htmlFor="approver" className="cursor-pointer">Approver</Label>
                    </div>
                  </RadioGroup>
                </div>

                {assignTo && (
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm text-muted-foreground">
                      {assignTo === 'department' ? 'Department Email' : 'Approver Email'}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={`Enter ${assignTo} email address`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="max-w-md"
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LimitDetailsPane;
