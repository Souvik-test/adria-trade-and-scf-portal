
import React from "react";
import { File, ArrowRight, PersonStanding, Upload, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const stepIcons = [
  File,
  ArrowRight,
  PersonStanding,
  Upload,
  Check,
];

const stepLabels = [
  "LC Information",
  "Transfer Details",
  "New Beneficiary",
  "Documents",
  "Review & Submit"
];

interface Props {
  stepIdx: number;
  requestId?: string;
  setRequestId?: (id: string) => void;
  children?: React.ReactNode;
  // onBack removed, no arrow/back icon on top
}

const RequestLCTransferLayout: React.FC<Props> = ({
  stepIdx,
  requestId = "",
  setRequestId,
  children,
}) => (
  <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
    {/* Header */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 md:px-6 py-4 md:py-3 bg-white border-b shadow-sm relative">
      <div className="flex items-center gap-4 mb-2 sm:mb-0">
        <div className="bg-corporate-blue text-white rounded-full p-3">
          <ArrowRight className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Request LC Transfer</h1>
          <div className="text-sm text-gray-600">Transfer Letter of Credit to new beneficiary</div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 w-full md:w-auto">
        <span className="text-xs text-gray-500 font-medium">Request ID:</span>
        <input
          type="text"
          value={requestId}
          onChange={e => setRequestId?.(e.target.value)}
          className="border rounded-md px-2 py-1 text-sm max-w-xs bg-gray-50 shadow-sm focus:border-corporate-blue focus:ring-1 focus:ring-corporate-blue"
          aria-label="Edit Request ID"
        />
      </div>
    </div>

    {/* Step Progress Bar */}
    <div className="flex justify-center mt-3 mb-6 px-1">
      <ol className="flex w-full max-w-5xl mx-auto justify-between items-center">
        {stepLabels.map((label, idx) => {
          const Icon = stepIcons[idx];
          const isActive = idx === stepIdx;
          const isDone = idx < stepIdx;
          return (
            <li key={label} className="flex flex-col items-center relative w-full">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 text-base transition-colors",
                  isDone ? "bg-corporate-blue border-corporate-blue text-white" :
                  isActive ? "bg-white border-corporate-blue text-corporate-blue animate-glow" :
                  "bg-gray-100 border-gray-200 text-gray-400"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "mt-1 text-xs font-medium text-center max-w-[70px]",
                isActive ? "text-corporate-blue" : "text-gray-400"
              )}>
                {label}
              </span>
              {/* Connectors */}
              {idx < stepLabels.length - 1 && (
                <span className={cn(
                  "absolute top-5 left-full h-1 w-8 md:w-16",
                  isDone ? "bg-corporate-blue" : "bg-gray-200"
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
