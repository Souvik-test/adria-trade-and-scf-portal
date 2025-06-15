
import React from "react";
import { Button } from "@/components/ui/button";

type ActionChoice = "accept" | "refuse" | null;

interface ActionPaneProps {
  action: ActionChoice;
  setAction: (action: ActionChoice) => void;
  comments: string;
  setComments: (v: string) => void;
  handleSubmit: () => void;
  onSaveDraft?: () => void;
  submitting: boolean;
}

const ActionPane: React.FC<ActionPaneProps> = ({
  action,
  setAction,
  comments,
  setComments,
  handleSubmit,
  onSaveDraft,
  submitting,
}) => (
  <div className="rounded-2xl border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 px-6 py-6">
    <div className="font-semibold text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2">
      <span role="img" aria-label="msg">💬</span> Action Required
    </div>
    <div className="mb-4">
      <div className="text-xs font-medium text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 rounded p-2">
        Review Status<br />
        <span className="font-normal">Please review the LC details and select your response</span>
      </div>
    </div>
    <div className="mb-4">
      <div className="font-medium text-gray-700 dark:text-gray-200 mb-2">Select Action:</div>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            className="form-radio text-green-600 accent-green-600"
            checked={action === "accept"}
            onChange={() => setAction("accept")}
          />
          <span className="text-green-700 dark:text-green-400 font-semibold">✔ Accept LC</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            className="form-radio text-red-500 accent-red-500"
            checked={action === "refuse"}
            onChange={() => setAction("refuse")}
          />
          <span className="text-red-600 dark:text-red-400 font-semibold">✖ Refuse LC</span>
        </label>
      </div>
    </div>
    <div className="mb-4">
      <div className="font-medium text-gray-700 dark:text-gray-200 mb-1">Comments</div>
      <textarea
        className="w-full border rounded p-2 min-h-[72px] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-y"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        placeholder="Add any comments or notes..."
      />
    </div>
    <Button
      className="w-full bg-corporate-blue hover:bg-corporate-blue/90 text-white font-semibold py-2 mt-2 disabled:opacity-40"
      disabled={!action || submitting}
      onClick={handleSubmit}
    >
      Select Action
    </Button>
    <div className="mt-6">
      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Quick Actions</div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => { /* fake download */ }}
        >
          <span role="img" aria-label="download">⬇</span> Download PDF
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => { /* fake email */ }}
        >
          <span role="img" aria-label="mail">✉️</span> Email Copy
        </Button>
      </div>
    </div>
  </div>
);

export default ActionPane;
