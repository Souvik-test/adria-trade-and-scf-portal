
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle } from 'lucide-react';

interface AmendmentDetailsProps {
  guaranteeData: any;
  amendmentConsents: Record<string, boolean>;
  onAmendmentConsentChange: (changeId: string, consented: boolean) => void;
  totalChanges: number;
  consentedChanges: number;
}

const AmendmentDetailsCard: React.FC<AmendmentDetailsProps> = ({
  guaranteeData,
  amendmentConsents,
  onAmendmentConsentChange,
  totalChanges,
  consentedChanges
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Amendment Details</span>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
              Pending Consent
            </Badge>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {consentedChanges}/{totalChanges} changes consented
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {guaranteeData.amendments.map((amendment: any, index: number) => (
          <div key={index} className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div>
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Amendment Number
                </Label>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {amendment.amendmentNumber}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Amendment Date
                </Label>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {amendment.amendmentDate}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900 dark:text-white mb-3 block">
                Changes Summary
              </Label>
              <div className="space-y-3">
                {amendment.changes.map((change: any, changeIndex: number) => (
                  <div key={changeIndex} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {change.field}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`consent-${change.id}`}
                          checked={amendmentConsents[change.id] || false}
                          onCheckedChange={(checked) => 
                            onAmendmentConsentChange(change.id, checked as boolean)
                          }
                        />
                        <Label 
                          htmlFor={`consent-${change.id}`} 
                          className="text-xs font-medium cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Consent
                        </Label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Previous Value
                        </Label>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {change.previous}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Updated Value
                        </Label>
                        <p className="text-green-700 dark:text-green-300 font-medium">
                          {change.updated}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AmendmentDetailsCard;
