
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AssignmentFormData } from '@/types/exportLCAssignment';

interface AssigneeInformationPaneProps {
  form: AssignmentFormData;
  updateAssignee: (updates: Partial<AssignmentFormData['assignee']>) => void;
}

const AssigneeInformationPane: React.FC<AssigneeInformationPaneProps> = ({ form, updateAssignee }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            Assignee Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="assigneeName">Assignee Name *</Label>
              <Input
                id="assigneeName"
                value={form.assignee.name}
                onChange={(e) => updateAssignee({ name: e.target.value })}
                placeholder="Enter assignee name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assigneeCountry">Country *</Label>
              <Input
                id="assigneeCountry"
                value={form.assignee.country}
                onChange={(e) => updateAssignee({ country: e.target.value })}
                placeholder="Enter country"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigneeAddress">Assignee Address *</Label>
            <Textarea
              id="assigneeAddress"
              value={form.assignee.address}
              onChange={(e) => updateAssignee({ address: e.target.value })}
              placeholder="Enter complete address"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="assigneeBankName">Bank Name</Label>
              <Input
                id="assigneeBankName"
                value={form.assignee.bankName}
                onChange={(e) => updateAssignee({ bankName: e.target.value })}
                placeholder="Enter bank name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assigneeBankSwift">SWIFT Code</Label>
              <Input
                id="assigneeBankSwift"
                value={form.assignee.swiftCode}
                onChange={(e) => updateAssignee({ swiftCode: e.target.value })}
                placeholder="Enter SWIFT code"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigneeBankAddress">Bank Address</Label>
            <Textarea
              id="assigneeBankAddress"
              value={form.assignee.bankAddress}
              onChange={(e) => updateAssignee({ bankAddress: e.target.value })}
              placeholder="Enter bank address"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigneeAccountNumber">Account Number</Label>
            <Input
              id="assigneeAccountNumber"
              value={form.assignee.accountNumber}
              onChange={(e) => updateAssignee({ accountNumber: e.target.value })}
              placeholder="Enter account number"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssigneeInformationPane;
