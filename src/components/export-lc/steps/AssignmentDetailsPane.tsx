
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AssignmentFormData } from '@/types/exportLCAssignment';

interface AssignmentDetailsPaneProps {
  form: AssignmentFormData;
  updateField: (updates: Partial<AssignmentFormData>) => void;
}

const AssignmentDetailsPane: React.FC<AssignmentDetailsPaneProps> = ({ form, updateField }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            Assignment Details - Article 39 UCP 600
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="assignmentType">Assignment Type *</Label>
              <Select 
                value={form.assignmentType} 
                onValueChange={(value: 'Proceeds' | 'Rights') => updateField({ assignmentType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Proceeds">Assignment of Proceeds</SelectItem>
                  <SelectItem value="Rights">Assignment of Rights</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignmentAmount">Assignment Amount</Label>
              <Input
                id="assignmentAmount"
                value={form.assignmentAmount}
                onChange={(e) => updateField({ assignmentAmount: e.target.value })}
                placeholder="Enter assignment amount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignmentPercentage">Assignment Percentage (%)</Label>
              <Input
                id="assignmentPercentage"
                value={form.assignmentPercentage}
                onChange={(e) => updateField({ assignmentPercentage: e.target.value })}
                placeholder="Enter percentage (e.g., 50)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignmentPurpose">Purpose of Assignment</Label>
              <Input
                id="assignmentPurpose"
                value={form.assignmentPurpose}
                onChange={(e) => updateField({ assignmentPurpose: e.target.value })}
                placeholder="Enter purpose"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignmentConditions">Assignment Conditions</Label>
            <Textarea
              id="assignmentConditions"
              value={form.assignmentConditions}
              onChange={(e) => updateField({ assignmentConditions: e.target.value })}
              placeholder="Enter any special conditions for the assignment"
              rows={4}
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Article 39 - Assignment of Proceeds
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              The fact that a credit is not stated to be transferable shall not affect the beneficiary's right to assign any proceeds to which it may be, or may become, entitled under such credit, in accordance with the provisions of the applicable law.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignmentDetailsPane;
