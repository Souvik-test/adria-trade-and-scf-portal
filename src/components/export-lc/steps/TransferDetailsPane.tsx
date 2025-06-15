
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const TransferDetailsPane = ({ form }: { form: any }) => (
  <div className="bg-card border rounded-lg p-6 md:p-8 max-w-3xl mx-auto">
    <h2 className="text-lg font-semibold mb-6">Transfer Details</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label className="mb-1 block">Transfer Type</Label>
        <Select
          value={form.form.transferType}
          onValueChange={v => form.updateField({ transferType: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Full">Full Transfer</SelectItem>
            <SelectItem value="Partial">Partial Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="mb-1 block">Transfer Amount</Label>
        <Input
          type="number"
          value={form.form.transferAmount}
          onChange={e => form.updateField({ transferAmount: e.target.value })}
        />
      </div>
      <div className="md:col-span-2">
        <Label className="mb-1 block">Transfer Conditions (if any)</Label>
        <Textarea
          value={form.form.transferConditions}
          onChange={e => form.updateField({ transferConditions: e.target.value })}
          placeholder="State any specific transfer conditions (optional)"
          rows={3}
        />
      </div>
    </div>
  </div>
);

export default TransferDetailsPane;
