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
import { Switch } from "@/components/ui/switch";
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

export const DisbursementRepaymentPane = ({ isReadOnly }: { isReadOnly: boolean }) => {
  const form = useFormContext();
  const insuranceRequired = form.watch("insurance_required");
  const [insurancePolicies, setInsurancePolicies] = useState<any[]>(
    form.getValues("insurance_policies") || []
  );
  const [appropriationSeq, setAppropriationSeq] = useState<any[]>(
    form.getValues("appropriation_sequence") || []
  );

  const addInsurancePolicy = () => {
    const newPolicy = {
      id: Date.now().toString(),
      policyNumber: "",
      provider: "",
      coverage: "",
      premium: "",
    };
    const updated = [...insurancePolicies, newPolicy];
    setInsurancePolicies(updated);
    form.setValue("insurance_policies", updated);
  };

  const removeInsurancePolicy = (id: string) => {
    const updated = insurancePolicies.filter((p) => p.id !== id);
    setInsurancePolicies(updated);
    form.setValue("insurance_policies", updated);
  };

  const updateInsurancePolicy = (id: string, field: string, value: string) => {
    const updated = insurancePolicies.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    );
    setInsurancePolicies(updated);
    form.setValue("insurance_policies", updated);
  };

  const addAppropriationItem = () => {
    const newItem = {
      id: Date.now().toString(),
      priority: appropriationSeq.length + 1,
      type: "",
      percentage: "",
    };
    const updated = [...appropriationSeq, newItem];
    setAppropriationSeq(updated);
    form.setValue("appropriation_sequence", updated);
  };

  const removeAppropriationItem = (id: string) => {
    const updated = appropriationSeq.filter((item) => item.id !== id);
    setAppropriationSeq(updated);
    form.setValue("appropriation_sequence", updated);
  };

  const updateAppropriationItem = (id: string, field: string, value: string) => {
    const updated = appropriationSeq.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setAppropriationSeq(updated);
    form.setValue("appropriation_sequence", updated);
  };

  return (
    <div className="space-y-6">
      {/* Disbursement Parameters */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Disbursement Parameters</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="disbursement_mode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disbursement Mode</FormLabel>
                <FormControl>
                  <Select
                    disabled={isReadOnly}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RTGS">RTGS</SelectItem>
                      <SelectItem value="NEFT">NEFT</SelectItem>
                      <SelectItem value="IMPS">IMPS</SelectItem>
                      <SelectItem value="WIRE">Wire Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="disbursement_account"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disbursement Account</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isReadOnly} placeholder="Account number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="disbursement_conditions"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Disbursement Conditions</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isReadOnly}
                    placeholder="Enter conditions"
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Card>

      {/* Repayment Parameters */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Repayment Parameters</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <FormField
            control={form.control}
            name="repayment_mode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repayment Mode</FormLabel>
                <FormControl>
                  <Select
                    disabled={isReadOnly}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AUTO_DEBIT">Auto Debit</SelectItem>
                      <SelectItem value="MANUAL">Manual</SelectItem>
                      <SelectItem value="STANDING_INST">Standing Instruction</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="repayment_account"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repayment Account</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isReadOnly} placeholder="Account number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Appropriation Sequence</h4>
            {!isReadOnly && (
              <Button type="button" variant="outline" size="sm" onClick={addAppropriationItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            )}
          </div>

          {appropriationSeq.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="grid grid-cols-4 gap-4">
                <Input
                  placeholder="Priority"
                  type="number"
                  value={item.priority}
                  onChange={(e) => updateAppropriationItem(item.id, "priority", e.target.value)}
                  disabled={isReadOnly}
                />
                <Input
                  placeholder="Type"
                  value={item.type}
                  onChange={(e) => updateAppropriationItem(item.id, "type", e.target.value)}
                  disabled={isReadOnly}
                />
                <Input
                  placeholder="Percentage"
                  type="number"
                  value={item.percentage}
                  onChange={(e) => updateAppropriationItem(item.id, "percentage", e.target.value)}
                  disabled={isReadOnly}
                />
                {!isReadOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAppropriationItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Insurance Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Insurance Details</h3>
        <FormField
          control={form.control}
          name="insurance_required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between mb-6">
              <FormLabel>Insurance Required</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isReadOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {insuranceRequired && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Insurance Policies</h4>
              {!isReadOnly && (
                <Button type="button" variant="outline" size="sm" onClick={addInsurancePolicy}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Policy
                </Button>
              )}
            </div>

            {insurancePolicies.map((policy) => (
              <Card key={policy.id} className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Policy Number"
                    value={policy.policyNumber}
                    onChange={(e) =>
                      updateInsurancePolicy(policy.id, "policyNumber", e.target.value)
                    }
                    disabled={isReadOnly}
                  />
                  <Input
                    placeholder="Provider"
                    value={policy.provider}
                    onChange={(e) => updateInsurancePolicy(policy.id, "provider", e.target.value)}
                    disabled={isReadOnly}
                  />
                  <Input
                    placeholder="Coverage"
                    value={policy.coverage}
                    onChange={(e) => updateInsurancePolicy(policy.id, "coverage", e.target.value)}
                    disabled={isReadOnly}
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder="Premium"
                      value={policy.premium}
                      onChange={(e) => updateInsurancePolicy(policy.id, "premium", e.target.value)}
                      disabled={isReadOnly}
                    />
                    {!isReadOnly && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInsurancePolicy(policy.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
