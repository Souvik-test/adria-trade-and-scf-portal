import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export const GeneralPartyPane = ({ isReadOnly }: { isReadOnly: boolean }) => {
  const form = useFormContext();
  const [counterParties, setCounterParties] = useState<any[]>(
    form.getValues("counter_parties") || []
  );

  const addCounterParty = () => {
    const newParty = {
      id: Date.now().toString(),
      name: "",
      account: "",
      role: "",
    };
    const updated = [...counterParties, newParty];
    setCounterParties(updated);
    form.setValue("counter_parties", updated);
  };

  const removeCounterParty = (id: string) => {
    const updated = counterParties.filter((p) => p.id !== id);
    setCounterParties(updated);
    form.setValue("counter_parties", updated);
  };

  const updateCounterParty = (id: string, field: string, value: string) => {
    const updated = counterParties.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    );
    setCounterParties(updated);
    form.setValue("counter_parties", updated);
  };

  return (
    <div className="space-y-6">
      {/* General Details Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">General Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="program_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program ID *</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isReadOnly} placeholder="PGM-001" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="program_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Name *</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isReadOnly} placeholder="Enter program name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="product_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Code *</FormLabel>
                <FormControl>
                  <Select
                    disabled={isReadOnly}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INV_DISC">Invoice Discounting</SelectItem>
                      <SelectItem value="PO_FIN">PO Financing</SelectItem>
                      <SelectItem value="REV_FACT">Reverse Factoring</SelectItem>
                      <SelectItem value="DYN_DISC">Dynamic Discounting</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="program_currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency *</FormLabel>
                <FormControl>
                  <Select
                    disabled={isReadOnly}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="INR">INR</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="program_limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Limit *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    disabled={isReadOnly}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="available_limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available Limit *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    disabled={isReadOnly}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="effective_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Effective Date *</FormLabel>
                <FormControl>
                  <Input {...field} type="date" disabled={isReadOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiry_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date *</FormLabel>
                <FormControl>
                  <Input {...field} type="date" disabled={isReadOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="program_description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Program Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isReadOnly}
                    placeholder="Enter program description"
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Card>

      {/* Party Details Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Party Details</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <FormField
            control={form.control}
            name="anchor_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anchor Name *</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isReadOnly} placeholder="Enter anchor name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="anchor_account"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anchor Account</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isReadOnly} placeholder="Enter account number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Counter Parties</h4>
            {!isReadOnly && (
              <Button type="button" variant="outline" size="sm" onClick={addCounterParty}>
                <Plus className="h-4 w-4 mr-2" />
                Add Counter Party
              </Button>
            )}
          </div>

          {counterParties.map((party) => (
            <Card key={party.id} className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <Input
                  placeholder="Party Name"
                  value={party.name}
                  onChange={(e) => updateCounterParty(party.id, "name", e.target.value)}
                  disabled={isReadOnly}
                />
                <Input
                  placeholder="Account Number"
                  value={party.account}
                  onChange={(e) => updateCounterParty(party.id, "account", e.target.value)}
                  disabled={isReadOnly}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Role"
                    value={party.role}
                    onChange={(e) => updateCounterParty(party.id, "role", e.target.value)}
                    disabled={isReadOnly}
                  />
                  {!isReadOnly && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCounterParty(party.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Finance Parameters Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Finance Parameters</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="finance_tenor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finance Tenor</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    disabled={isReadOnly}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="finance_tenor_unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tenor Unit</FormLabel>
                <FormControl>
                  <Select
                    disabled={isReadOnly}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                      <SelectItem value="years">Years</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="margin_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Margin %</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    disabled={isReadOnly}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="finance_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finance %</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    disabled={isReadOnly}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Card>
    </div>
  );
};
