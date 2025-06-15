import React from "react";
import { LCTransferFormStep, transferStepOrder } from "@/types/exportLCTransfer";

const stepLabels: Record<LCTransferFormStep, string> = {
  "lc-and-transfer": "LC Information & Transfer Details",
  "beneficiary-docs": "New Beneficiary & Documents",
};

interface Props {
  step: LCTransferFormStep;
}

const RequestLCTransferProgressIndicator: React.FC<Props> = ({ step }) => {
  const activeIdx = transferStepOrder.indexOf(step);
  return (
    <div className="flex space-x-2 sm:space-x-6 items-center">
      {transferStepOrder.map((stepKey, idx) => (
        <div key={stepKey} className="flex items-center">
          <div
            className={`rounded-full w-7 h-7 flex items-center justify-center text-sm font-semibold
            ${idx < activeIdx ? 'bg-corporate-blue text-white'
              : idx === activeIdx ? 'border-2 border-corporate-blue bg-white text-corporate-blue'
              : 'bg-gray-100 text-gray-400'}
            `}
          >
            {idx + 1}
          </div>
          {idx < transferStepOrder.length - 1 && (
            <span className="w-6 border-t-2 border-gray-200 mx-1 sm:mx-2"></span>
          )}
        </div>
      ))}
      <span className="ml-4 text-sm font-medium text-gray-700">
        {stepLabels[step]}
      </span>
    </div>
  );
};

export default RequestLCTransferProgressIndicator;
