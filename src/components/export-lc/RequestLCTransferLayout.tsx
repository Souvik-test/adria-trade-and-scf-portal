import React from "react";
import { File, PersonStanding, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// 2 step only: LC Information + Transfer Details, then New Beneficiary + Documents
const stepIcons = [
  File,
  PersonStanding,
];

const stepLabels = [
  "LC Information & Transfer Details",
  "New Beneficiary & Documents"
];

interface Props {
  stepIdx: number;
  requestId?: string;
  setRequestId?: (id: string) => void;
  children?: React.ReactNode;
}

const RequestLCTransferLayout: React.FC<Props> = ({
  stepIdx,
  requestId = "",
  setRequestId,
  children,
}) => (
  <div className="min-h-screen flex flex-col bg-background transition-colors">
    {/* Header */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 md:px-6 py-4 md:py-3 bg-card border-b border-border shadow-sm relative transition-colors">
      <div className="flex items-center gap-4 mb-2 sm:mb-0">
        <div className="bg-corporate-blue text-white rounded-full p-3">
          <File className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Request LC Transfer
          </h1>
          <div className="text-sm text-muted-foreground">Transfer Letter of Credit to new beneficiary</div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 w-full md:w-auto">
        <span className="text-xs text-muted-foreground font-medium">Request ID:</span>
        <input
          type="text"
          value={requestId}
          onChange={e => setRequestId?.(e.target.value)}
          className="border border-border rounded-md px-2 py-1 text-sm max-w-xs bg-muted shadow-sm focus:border-corporate-blue focus:ring-1 focus:ring-corporate-blue text-foreground"
          aria-label="Edit Request ID"
        />
      </div>
    </div>

    {/* Step Progress Bar */}
    <div className="flex justify-center mt-3 mb-6 px-1">
      <ol className="flex w-full max-w-4xl mx-auto justify-between items-center">
        {stepLabels.map((label, idx) => {
          const Icon = stepIcons[idx];
          const isActive = idx === stepIdx;
          const isDone = idx < stepIdx;
          return (
            <li key={label} className="flex flex-col items-center relative w-full">
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-full border-2 text-base transition-colors",
                  isDone
                    ? "bg-corporate-blue border-corporate-blue text-white"
                    : isActive
                    ? "bg-background border-corporate-blue text-corporate-blue"
                    : "bg-muted border-border text-muted-foreground"
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span className={
                [
                  "mt-2 text-sm font-bold text-center max-w-[124px]",
                  isActive ? "text-corporate-blue" : "text-muted-foreground"
                ].join(" ")
              }>
                {label}
              </span>
              {idx < stepLabels.length - 1 && (
                <span className={cn(
                  "absolute top-7 left-full h-1 w-12 md:w-28",
                  isDone ? "bg-corporate-blue" : "bg-border"
                )}></span>
              )}
            </li>
          );
        })}
      </ol>
    </div>

    {/* Step Content */}
    <main className="flex-1 flex flex-col items-center px-0 md:px-3 pb-8 overflow-y-auto w-full min-h-0 h-full">
      <div className="w-full max-w-5xl flex-1 flex flex-col justify-start">
        {children}
      </div>
    </main>
  </div>
);

export default RequestLCTransferLayout;
