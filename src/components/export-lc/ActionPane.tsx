
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { generateMT700 } from "./generateMT700";

type ActionChoice = "accept" | "refuse" | null;

interface ActionPaneProps {
  action: ActionChoice;
  setAction: (action: ActionChoice) => void;
  comments: string;
  setComments: (v: string) => void;
  handleSubmit: () => void;
  onSaveDraft?: () => void;
  submitting: boolean;
  commentsMandatory?: boolean;
  commentsError?: string | null;
  lcData?: any;
}

const ActionPane: React.FC<ActionPaneProps> = ({
  action,
  setAction,
  comments,
  setComments,
  handleSubmit,
  onSaveDraft,
  submitting,
  commentsMandatory = false,
  commentsError = null,
  lcData,
}) => {
  // Handle MT700 download
  const handleDownload = () => {
    if (!lcData) return;
    const mt700Text = generateMT700(lcData);
    const blob = new Blob([mt700Text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Draft-MT700-${lcData.lcReference || "Untitled"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
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
        <RadioGroup
          value={action || ""}
          onValueChange={(v) => setAction(v as ActionChoice)}
          className="flex flex-col gap-2"
        >
          <label className="flex items-center gap-2 cursor-pointer">
            <RadioGroupItem value="accept" id="accept-radio" className="border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" />
            <span className="text-green-700 dark:text-green-400 font-semibold">✔ Accept LC</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <RadioGroupItem value="refuse" id="refuse-radio" className="border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500" />
            <span className="text-red-600 dark:text-red-400 font-semibold">✖ Refuse LC</span>
          </label>
        </RadioGroup>
      </div>
      <div className="mb-4">
        <div className="font-medium text-gray-700 dark:text-gray-200 mb-1">
          Comments {commentsMandatory && <span className="text-red-500">*</span>}
        </div>
        <Textarea
          className={`w-full border rounded p-2 min-h-[72px] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-y
            ${commentsMandatory && !comments.trim() ? "border-red-500" : ""}
          `}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Add any comments or notes..."
        />
        {commentsMandatory && !comments.trim() && (
          <div className="text-xs text-red-500 mt-1">Comments are required when refusing the LC.</div>
        )}
        {commentsError && (
          <div className="text-xs text-red-500 mt-1">{commentsError}</div>
        )}
      </div>
      <Button
        className="w-full bg-corporate-blue hover:bg-corporate-blue/90 text-white font-semibold py-2 mt-2 disabled:opacity-40"
        disabled={
          !action ||
          submitting ||
          (commentsMandatory && !comments.trim())
        }
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
            onClick={handleDownload}
          >
            <span role="img" aria-label="download">⬇</span> Download Draft MT 700
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
};

export default ActionPane;
