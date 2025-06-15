
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransferableLC {
  id: string;
  corporate_reference: string;
  applicant_name?: string;
  currency?: string;
  lc_amount?: number;
  expiry_date?: string;
  beneficiary_name?: string;
  beneficiary_bank_name?: string;
  issue_date?: string;
  place_of_expiry?: string;
}

interface TransferableLCSearchSelectProps {
  value: string;
  onChange: (lc: TransferableLC) => void;
}

const TransferableLCSearchSelect: React.FC<TransferableLCSearchSelectProps> = ({ value, onChange }) => {
  const [lcs, setLCs] = useState<TransferableLC[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  // Fetch transferable LCs when query changes or dropdown opens
  useEffect(() => {
    if (open) {
      fetchLCs(query);
    }
    // eslint-disable-next-line
  }, [open, query]);

  // Only fetch columns that exist in import_lc_requests
  const fetchLCs = async (search: string) => {
    setLoading(true);

    let filter = supabase
      .from("import_lc_requests")
      .select(
        `
        id,
        corporate_reference,
        applicant_name,
        currency,
        lc_amount,
        expiry_date,
        beneficiary_name,
        beneficiary_bank_name,
        issue_date,
        place_of_expiry
        `
      )
      .eq("is_transferable", true)
      .order("created_at", { ascending: false })
      .limit(50);

    if (search && search.trim().length > 1) {
      filter = filter.ilike("corporate_reference", `%${search.trim()}%`);
    }

    const { data, error } = await filter;
    setLoading(false);

    if (error || !data) {
      console.error("Supabase error:", error);
      setLCs([]);
      return;
    }
    // Debug log
    console.log("[TransferableLCSearchSelect] Fetched LCs:", data);
    setLCs(data as TransferableLC[]);
  };

  // Always try to select from LCs if the value matches a corporate_reference
  const selectedLC: TransferableLC | undefined = lcs.find(
    (lc) => lc.corporate_reference === value
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between font-semibold border-corporate-blue/30",
            !value && "text-muted-foreground"
          )}
        >
          {selectedLC ? (
            <div className="flex flex-col">
              <span className="text-corporate-blue font-bold">{selectedLC.corporate_reference}</span>
              <span className="text-xs text-muted-foreground">
                {selectedLC.currency ?? ""} {selectedLC.lc_amount?.toLocaleString() ?? ""}
                {selectedLC.beneficiary_bank_name ? (
                  <span className="ml-2">• <span className="font-medium text-foreground">Beneficiary Bank:</span> <span className="text-foreground">{selectedLC.beneficiary_bank_name}</span></span>
                ) : ""}
                {selectedLC.beneficiary_name ? (
                  <span className="ml-2">• Ben: {selectedLC.beneficiary_name}</span>
                ) : ""}
                {selectedLC.expiry_date ? (
                  <span className="ml-2">• Exp: {selectedLC.expiry_date}</span>
                ) : ""}
              </span>
            </div>
          ) : value ? (
            value
          ) : (
            "Search & select LC Number..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[370px] p-0 z-[110] bg-background">
        <Command>
          <CommandInput
            placeholder="Type LC Number / Corporate Reference to search"
            value={query}
            onValueChange={val => {
              setQuery(val);
              // no need to call fetchLCs here, useEffect handles it
            }}
            autoFocus
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading..." : "No transferable LCs found"}
            </CommandEmpty>
            <CommandGroup>
              {lcs.map(lc => (
                <CommandItem
                  value={lc.corporate_reference}
                  key={lc.id}
                  onSelect={() => {
                    onChange(lc);
                    setOpen(false);
                  }}
                  className="py-2 px-2"
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", value === lc.corporate_reference ? "opacity-100" : "opacity-0")}
                  />
                  <div>
                    <div className="font-bold text-corporate-blue">
                      {lc.corporate_reference}
                      <span className="ml-2 text-xs text-muted-foreground">{lc.currency} {lc.lc_amount?.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {lc.beneficiary_bank_name && (
                        <span>
                          <span className="font-medium text-foreground">Beneficiary Bank:</span>{" "}
                          <span className="text-foreground">{lc.beneficiary_bank_name}</span>
                          {" • "}
                        </span>
                      )}
                      {lc.applicant_name && (
                        <span>
                          Applicant: {lc.applicant_name}{" • "}
                        </span>
                      )}
                      {lc.beneficiary_name && (
                        <span>
                          Ben: {lc.beneficiary_name}{" • "}
                        </span>
                      )}
                      {lc.expiry_date && (
                        <span>
                          Exp: {lc.expiry_date}
                        </span>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TransferableLCSearchSelect;
