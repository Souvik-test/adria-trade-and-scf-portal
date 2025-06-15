
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
  children?: React.ReactNode;
  onBack: () => void;
}

const RequestLCTransferLayout: React.FC<Props> = ({
  stepIdx,
  requestId = "TRF-2025-00123",
  children,
  onBack,
}) => (
  <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
    {/* Header */}
    <div className="flex items-center justify-between px-8 py-6 bg-white border-b shadow-sm relative">
      <div className="flex items-center gap-4">
        <div className="bg-corporate-blue text-white rounded-full p-3">
          <ArrowRight className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Request LC Transfer</h1>
          <div className="text-sm text-gray-600">Transfer Letter of Credit to new beneficiary</div>
        </div>
      </div>
      <div>
        <span className="text-xs text-gray-500 font-medium">Request ID:</span>
        <span className="ml-2 text-base text-gray-800 font-bold">{requestId}</span>
      </div>
      <button aria-label="Back" onClick={onBack}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 rounded-full p-2">
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#475569" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>

    {/* Step Progress Bar */}
    <div className="flex justify-center mt-5 mb-8">
      <ol className="flex w-full max-w-3xl mx-auto justify-between items-center">
        {stepLabels.map((label, idx) => {
          const Icon = stepIcons[idx];
          const isActive = idx === stepIdx;
          const isDone = idx < stepIdx;
          return (
            <li key={label} className="flex flex-col items-center relative">
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-full border-4 text-lg transition-colors",
                  isDone ? "bg-corporate-blue border-corporate-blue text-white" :
                  isActive ? "bg-white border-corporate-blue text-corporate-blue animate-glow" :
                  "bg-gray-100 border-gray-200 text-gray-400"
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span className={cn(
                "mt-2 text-xs font-medium text-center w-24",
                isActive ? "text-corporate-blue" : "text-gray-400"
              )}>
                {label}
              </span>
              {/* Connectors */}
              {idx < stepLabels.length - 1 && (
                <span className={cn(
                  "absolute top-6 left-full h-1 w-12",
                  isDone ? "bg-corporate-blue" : "bg-gray-200"
                )}></span>
              )}
            </li>
          );
        })}
      </ol>
    </div>

    {/* Step Content */}
    <main className="flex-1 flex flex-col items-center px-2 pb-8">
      {children}
    </main>
  </div>
);

export default RequestLCTransferLayout;
