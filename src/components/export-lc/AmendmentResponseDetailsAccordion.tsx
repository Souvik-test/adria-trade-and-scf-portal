
import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";

// Util: highlight if modified
function Field({
  label,
  value,
  previous,
  modified,
}: { label: string, value: string, previous?: string, modified?: boolean }) {
  return (
    <div className={`flex flex-col gap-1 relative rounded-lg px-2 py-1 ${modified ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700" : ""}`}>
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
        {modified &&
          <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 text-[10px] font-bold uppercase">Modified</span>
        }
      </div>
      {previous && modified &&
        <div className="text-xs text-gray-400 dark:text-gray-500 line-through">{previous}</div>
      }
      <div className={`text-base font-semibold ${modified ? "text-yellow-900 dark:text-yellow-200" : "text-gray-900 dark:text-white"}`}>
        {value}
      </div>
    </div>
  );
}

const AmendmentResponseDetailsAccordion = ({
  lcReference,
  onLcReferenceChange,
  amendmentNumber,
  amendmentDate,
  changes,
  parties,
  lcAmount,
  shipment,
  documents,
  additionalConditions,
  specialInstructions
}: {
  lcReference: string,
  onLcReferenceChange: (v: string) => void,
  amendmentNumber: string,
  amendmentDate: string,
  changes: any[], // simplified for now
  parties: { role: string, name: string, address: string }[],
  lcAmount: any,
  shipment: any,
  documents: string[],
  additionalConditions: string,
  specialInstructions: string
}) => {
  // Instead of real change logic, use the mock change data to show highlight
  const changeMap: { [field: string]: { previous: string, updated: string } } = {};
  (changes ?? []).forEach((c: any) => { changeMap[c.field] = c; });

  return (
    <Accordion type="multiple" defaultValue={["amendment", "parties"]} className="w-full space-y-3">
      {/* Amendment Details */}
      <AccordionItem value="amendment">
        <AccordionTrigger>
          <span className="flex items-center gap-2 font-semibold text-base">📝 Amendment Details</span>
        </AccordionTrigger>
        <AccordionContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                LC Reference No.
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-2 flex items-center pointer-events-none text-gray-400">
                  <svg width="18" height="18" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M11 19a8 8 0 100-16 8 8 0 000 16zm6-2l4 4"/></svg>
                </span>
                <Input
                  className="pl-8 font-semibold"
                  value={lcReference}
                  onChange={e => onLcReferenceChange(e.target.value)}
                  spellCheck={false}
                />
              </div>
            </div>
            <Field label="Amendment Number" value={amendmentNumber} modified={!!changeMap["Amendment Number"]} previous={changeMap["Amendment Number"]?.previous} />
            <Field label="Amendment Date" value={amendmentDate} modified={!!changeMap["Amendment Date"]} previous={changeMap["Amendment Date"]?.previous} />
            {/* Add other amendment details as needed */}
          </div>
        </AccordionContent>
      </AccordionItem>
      {/* Parties */}
      <AccordionItem value="parties">
        <AccordionTrigger>
          <span className="flex items-center gap-2 font-semibold text-base">🧾 Parties Information</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parties.map(p =>
              <div key={p.role} className="rounded-lg p-3 border bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-800">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">{p.role}</div>
                <div className="font-semibold text-gray-900 dark:text-white text-base">{p.name}</div>
                <div className="text-gray-700 dark:text-gray-400 whitespace-pre-line text-xs">{p.address}</div>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
      {/* LC Amount */}
      <AccordionItem value="lcamt">
        <AccordionTrigger>
          <span className="flex items-center gap-2 font-semibold text-base">💲 LC Amount</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field
              label="Credit Amount"
              value={lcAmount.creditAmount}
              modified={!!changeMap["Credit Amount"]}
              previous={changeMap["Credit Amount"]?.previous}
            />
            <Field
              label="Tolerance"
              value={lcAmount.tolerance}
              modified={!!changeMap["Tolerance"]}
              previous={changeMap["Tolerance"]?.previous}
            />
            <Field
              label="Available With"
              value={lcAmount.availableWith}
              modified={!!changeMap["Available With"]}
              previous={changeMap["Available With"]?.previous}
            />
            <div className="col-span-1 md:col-span-3">
              <Field
                label="Available By"
                value={lcAmount.availableBy}
                modified={!!changeMap["Available By"]}
                previous={changeMap["Available By"]?.previous}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      {/* Shipment & Delivery */}
      <AccordionItem value="shipment">
        <AccordionTrigger>
          <span className="flex items-center gap-2 font-semibold text-base">🚢 Shipment & Delivery</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {/* Example fields, add more fields as per your use case */}
            <Field label="Shipment From" value={shipment.from} modified={!!changeMap["Shipment From"]} previous={changeMap["Shipment From"]?.previous}/>
            <Field label="Shipment To" value={shipment.to} modified={!!changeMap["Shipment To"]} previous={changeMap["Shipment To"]?.previous}/>
            <Field label="Latest Shipment Date" value={shipment.latestDate} modified={!!changeMap["Latest Shipment Date"]} previous={changeMap["Latest Shipment Date"]?.previous}/>
          </div>
        </AccordionContent>
      </AccordionItem>
      {/* Documents Required */}
      <AccordionItem value="documents">
        <AccordionTrigger>
          <span className="flex items-center gap-2 font-semibold text-base">📄 Documents Required</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {documents.map((doc, i) =>
              <div key={doc} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-base font-medium text-gray-900 dark:text-gray-100">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 text-sm">{i + 1}</span>
                {doc}
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
      {/* Additional Conditions */}
      <AccordionItem value="conditions">
        <AccordionTrigger>
          <span className="flex items-center gap-2 font-semibold text-base">⚠️ Additional Conditions</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-4 mb-3">
            <div className="text-xs font-medium text-gray-600 dark:text-amber-100 mb-1">Additional Conditions</div>
            <div className="text-gray-900 dark:text-white">{additionalConditions}</div>
          </div>
          <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
            <div className="text-xs font-medium text-gray-600 dark:text-amber-100 mb-1">Special Instructions</div>
            <div className="text-gray-900 dark:text-white">{specialInstructions}</div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AmendmentResponseDetailsAccordion;
