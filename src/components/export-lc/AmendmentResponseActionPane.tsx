import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AmendmentResponseActionPaneProps {
  action: "accept" | "refuse" | null;
  setAction: (a: "accept" | "refuse" | null) => void;
  comments: string;
  setComments: (s: string) => void;
  submitting: boolean;
  handleSubmit: () => void;
  commentsMandatory: boolean;
  commentsError?: string | null;
}

const AmendmentResponseActionPane: React.FC<AmendmentResponseActionPaneProps> = ({
  action,
  setAction,
  comments,
  setComments,
  submitting,
  handleSubmit,
  commentsMandatory,
  commentsError,
}) => {
  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
      <div>
        <div className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Your Action</div>
        <div className="flex gap-2 mb-4">
          <Button
            variant={action === "accept" ? "default" : "outline"}
            onClick={() => setAction("accept")}
            disabled={submitting}
          >Accept Amendment</Button>
          <Button
            variant={action === "refuse" ? "default" : "outline"}
            onClick={() => setAction("refuse")}
            disabled={submitting}
          >Refuse</Button>
        </div>
      </div>
      <div className="my-2">
        <Textarea
          placeholder="Add comments (required if refusing)"
          value={comments}
          onChange={e => setComments(e.target.value)}
        />
        {commentsMandatory && commentsError &&
          <div className="text-red-600 text-xs mt-1">{commentsError}</div>
        }
      </div>
      <Button
        size="lg"
        className="w-full mt-4"
        onClick={handleSubmit}
        disabled={submitting}
      >
        Submit Response
      </Button>
      {/* Quick Actions */}
      <div className="mt-6 flex flex-col gap-3">
        <Button variant="secondary" className="w-full">Draft MT 707</Button>
        <Button variant="outline" className="w-full">Email Copy</Button>
      </div>
    </div>
  );
};

export default AmendmentResponseActionPane;
