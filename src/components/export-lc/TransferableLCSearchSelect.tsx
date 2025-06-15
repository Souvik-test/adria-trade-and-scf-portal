
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransferableLC {
  id: string;
  popi_number: string;
  applicant_name?: string;
  currency?: string;
  lc_amount?: number;
  expiry_date?: string;
  beneficiary_name?: string;
  issuing_bank_name?: string;
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

  useEffect(() => {
    if (open) fetchLCs(query);
    // eslint-disable-next-line
  }, [open]);

  const fetchLCs = async (search: string) => {
    setLoading(true);
    let filter = supabase
      .from("import_lc_requests")
      .select("id, popi_number, applicant_name, lc_amount, currency, expiry_date, beneficiary_name")
      .eq("is_transferable", true)
      .order("created_at", { ascending: false })
      .limit(30);

    if (search && search.trim().length > 1) {
      filter = filter.ilike("popi_number", `%${search.trim()}%`);
    }
    const { data, error } = await filter;
    setLoading(false);
    if (error) {
      setLCs([]);
      return;
    }
    setLCs(data || []);
  };

  const selectedLC = lcs.find((lc) => lc.popi_number === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className={cn("w-full justify-between", !value && "text-muted-foreground")}>
          {selectedLC
            ? `${selectedLC.popi_number} • ${selectedLC.currency ?? ""} ${selectedLC.lc_amount?.toLocaleString() ?? ""}`
            : value
            ? value
            : "Search & select LC Number..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[280px] p-0 z-[101] bg-background">
        <Command>
          <CommandInput 
            placeholder="Type LC Number to search"
            value={query}
            onValueChange={(val) => {
              setQuery(val);
              fetchLCs(val);
            }}
            autoFocus
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading..." : "No transferable LCs found"}
            </CommandEmpty>
            <CommandGroup>
              {lcs.map((lc) => (
                <CommandItem
                  value={lc.popi_number}
                  key={lc.id}
                  onSelect={() => {
                    onChange(lc);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === lc.popi_number ? "opacity-100" : "opacity-0")} />
                  <div>
                    <div className="font-medium">{lc.popi_number}</div>
                    <div className="text-xs text-muted-foreground">
                      {lc.currency} {lc.lc_amount?.toLocaleString() ?? ""}
                      {lc.beneficiary_name ? ` • ${lc.beneficiary_name}` : ""}
                      {lc.expiry_date ? ` • Exp: ${lc.expiry_date}` : ""}
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

