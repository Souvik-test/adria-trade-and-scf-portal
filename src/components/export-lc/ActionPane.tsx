
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle } from "lucide-react";

interface ActionPaneProps {
  action: "accept" | "refuse" | null;
  setAction: (action: "accept" | "refuse" | null) => void;
  comments: string;
  setComments: (comments: string) => void;
  handleSubmit: () => void;
  onSaveDraft?: () => void;
  submitting: boolean;
  commentsMandatory: boolean;
  commentsError: string | null;
  lcData: any;
}

const ActionPane: React.FC<ActionPaneProps> = ({
  action,
  setAction,
  comments,
  setComments,
  handleSubmit,
  onSaveDraft,
  submitting,
  commentsMandatory,
  commentsError,
  lcData,
}) => {
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">
          Review Action
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Action Selection */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-foreground">
            Select Action <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={action || ""}
            onValueChange={(value) => setAction(value as "accept" | "refuse")}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
              <RadioGroupItem 
                value="accept" 
                id="accept"
                className="border-green-500 text-green-600"
              />
              <Label 
                htmlFor="accept" 
                className="flex items-center gap-2 cursor-pointer text-sm font-medium"
              >
                <CheckCircle className="w-4 h-4 text-green-600" />
                Accept LC
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <RadioGroupItem 
                value="refuse" 
                id="refuse"
                className="border-red-500 text-red-600"
              />
              <Label 
                htmlFor="refuse" 
                className="flex items-center gap-2 cursor-pointer text-sm font-medium"
              >
                <XCircle className="w-4 h-4 text-red-600" />
                Refuse LC
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Comments Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">
            Comments {commentsMandatory && <span className="text-red-500">*</span>}
          </Label>
          <Textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder={
              action === "refuse"
                ? "Please provide reasons for refusing the LC..."
                : "Add any additional comments or instructions..."
            }
            className="min-h-[100px] resize-none"
          />
        </div>

        {/* Error Message */}
        {commentsError && (
          <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
            {commentsError}
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={submitting || !action}
          className="w-full bg-professional-orange hover:bg-professional-orange-dark text-white font-semibold py-3 h-auto shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : `${action === "accept" ? "Accept" : action === "refuse" ? "Refuse" : "Submit"} LC Review`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ActionPane;
