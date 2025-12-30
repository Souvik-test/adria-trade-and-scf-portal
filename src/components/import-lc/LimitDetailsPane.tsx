import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImportLCFormData } from '@/types/importLC';
import { CheckCircle, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

interface LimitDetailsPaneProps {
  formData: ImportLCFormData;
}

const LimitDetailsPane: React.FC<LimitDetailsPaneProps> = ({ formData }) => {
  // Mock limit data - in production, this would come from an external limit system
  const limitDetails = {
    limitType: 'LC Issuance Limit',
    totalLimit: 5000000,
    utilizedAmount: 1500000,
    availableLimit: 3500000,
    lcValue: formData.lcAmount || 0,
    currency: formData.currency || 'USD'
  };

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
        <h3 className="text-lg font-semibold text-foreground">Limit Details</h3>
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
                    : `LC value of ${formatAmount(limitDetails.lcValue, limitDetails.currency)} exceeds the available limit of ${formatAmount(limitDetails.availableLimit, limitDetails.currency)}. Please request limit enhancement.`
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LimitDetailsPane;
