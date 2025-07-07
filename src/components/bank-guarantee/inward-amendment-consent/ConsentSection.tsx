
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle } from 'lucide-react';

interface ConsentSectionProps {
  consentAction: 'accept' | 'refuse' | null;
  setConsentAction: (action: 'accept' | 'refuse' | null) => void;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  totalChanges: number;
  consentedChanges: number;
  allChangesConsented: boolean;
  someChangesNotConsented: boolean;
  noChangesConsented: boolean;
}

const ConsentSection: React.FC<ConsentSectionProps> = ({
  consentAction,
  setConsentAction,
  rejectionReason,
  setRejectionReason,
  totalChanges,
  consentedChanges,
  allChangesConsented,
  someChangesNotConsented,
  noChangesConsented
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Beneficiary's Response on Amendment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-900 dark:text-white mb-3 block">
            Amendment Consent Status
          </Label>
          
          {/* Consent Summary */}
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span className="font-medium">
                Individual Consent Status: {consentedChanges}/{totalChanges} changes consented
              </span>
            </div>
            {allChangesConsented && (
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                All changes have been consented - Amendment will be accepted
              </p>
            )}
            {someChangesNotConsented && (
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                Some changes not consented - Amendment will be refused
              </p>
            )}
            {noChangesConsented && (
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                No changes consented - Only refusal option available
              </p>
            )}
          </div>

          <RadioGroup
            value={consentAction || ''}
            onValueChange={(value) => setConsentAction(value as 'accept' | 'refuse')}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="accept" 
                id="accept" 
                disabled={!allChangesConsented}
              />
              <Label 
                htmlFor="accept" 
                className={`font-medium ${
                  allChangesConsented 
                    ? "text-green-700 dark:text-green-300" 
                    : "text-gray-400 dark:text-gray-600"
                }`}
              >
                Accept Amendment
                {allChangesConsented && (
                  <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                    (Auto-selected)
                  </span>
                )}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="refuse" 
                id="refuse" 
                disabled={noChangesConsented && totalChanges > 0 ? false : allChangesConsented}
              />
              <Label 
                htmlFor="refuse" 
                className={`font-medium ${
                  !allChangesConsented 
                    ? "text-red-700 dark:text-red-300" 
                    : "text-gray-400 dark:text-gray-600"
                }`}
              >
                Refuse Amendment
                {(someChangesNotConsented || noChangesConsented) && (
                  <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                    {someChangesNotConsented ? "(Auto-selected)" : "(Available)"}
                  </span>
                )}
              </Label>
            </div>
          </RadioGroup>
        </div>

        {consentAction === 'refuse' && (
          <div>
            <Label htmlFor="rejectionReason" className="text-sm font-medium text-gray-900 dark:text-white">
              Rejection Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide detailed reason for refusing the amendment..."
              className="mt-2 min-h-[100px]"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsentSection;
