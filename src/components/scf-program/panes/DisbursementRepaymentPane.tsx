import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ArrowRight, Plus, Trash2, ChevronLeft } from "lucide-react";

interface DisbursementRepaymentPaneProps {
  isReadOnly: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const DisbursementRepaymentPane = ({ 
  isReadOnly, 
  onNext,
  onPrevious 
}: DisbursementRepaymentPaneProps) => {
  const form = useFormContext();
  const insuranceRequired = form.watch("insurance_required");
  const multipleDisb = form.watch("multiple_disbursement");
  const repaymentBy = form.watch("repayment_by");

  const [insurancePolicies, setInsurancePolicies] = useState<any[]>(
    form.getValues("insurance_policies") || []
  );
  const [appropriationAfterDue, setAppropriationAfterDue] = useState<string[]>(
    form.getValues("appropriation_sequence_after_due") || []
  );
  const [appropriationBeforeDue, setAppropriationBeforeDue] = useState<string[]>(
    form.getValues("appropriation_sequence_before_due") || []
  );

  const appropriationOptions = [
    { value: "P", label: "Principal" },
    { value: "I", label: "Interest" },
    { value: "C", label: "Charge" },
    { value: "N", label: "Penalty" },
  ];

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

  const moveAppropriationItem = (
    list: string[],
    setter: (val: string[]) => void,
    formField: string,
    index: number,
    direction: "up" | "down"
  ) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === list.length - 1)
    ) {
      return;
    }
    const newList = [...list];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    setter(newList);
    form.setValue(formField, newList);
  };

  const addAppropriationItem = (
    list: string[],
    setter: (val: string[]) => void,
    formField: string,
    value: string
  ) => {
    if (list.includes(value)) return;
    const updated = [...list, value];
    setter(updated);
    form.setValue(formField, updated);
  };

  const removeAppropriationItem = (
    list: string[],
    setter: (val: string[]) => void,
    formField: string,
    index: number
  ) => {
    const updated = list.filter((_, i) => i !== index);
    setter(updated);
    form.setValue(formField, updated);
  };

  const getAvailableOptions = (currentList: string[]) => {
    return appropriationOptions.filter((opt) => !currentList.includes(opt.value));
  };

  return (
    <div className="space-y-6">
      {/* Disbursement Parameters */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Disbursement Parameters</h3>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="multiple_disbursement"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel>Multiple Disbursement</FormLabel>
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

          {multipleDisb && (
            <FormField
              control={form.control}
              name="max_disbursements_allowed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Disbursements Allowed (1-100)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      disabled={isReadOnly}
                      placeholder="Enter max disbursements"
                      min={1}
                      max={100}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="auto_disbursement"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel>Auto-Disbursement</FormLabel>
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

          <FormField
            control={form.control}
            name="holiday_treatment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Holiday Treatment</FormLabel>
                <FormControl>
                  <Select
                    disabled={isReadOnly}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select treatment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Next Business Day">Next Business Day</SelectItem>
                      <SelectItem value="Previous Business Day">Previous Business Day</SelectItem>
                      <SelectItem value="No Change">No Change</SelectItem>
                    </SelectContent>
                  </Select>
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
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="repayment_by"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repayment By</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isReadOnly}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select repayment by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Buyer">Buyer</SelectItem>
                        <SelectItem value="Supplier">Supplier</SelectItem>
                        <SelectItem value="Account Debit">Account Debit</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {repaymentBy === "Account Debit" && (
              <FormField
                control={form.control}
                name="debit_account_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Debit Account Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isReadOnly}
                        placeholder="Enter account number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="auto_repayment"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Auto-Repayment</FormLabel>
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

            <FormField
              control={form.control}
              name="part_payment_allowed"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Part Payment</FormLabel>
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

            <FormField
              control={form.control}
              name="pre_payment_allowed"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Pre-Payment</FormLabel>
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

            <FormField
              control={form.control}
              name="charge_penalty_on_prepayment"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Charge Penalty on Prepayment</FormLabel>
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
          </div>

          {/* Appropriation Sequences */}
          <div className="grid grid-cols-2 gap-6">
            {/* On/After Due Date */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Appropriation Sequence On/After Due Date</h4>
                {!isReadOnly && (
                  <Select
                    onValueChange={(value) =>
                      addAppropriationItem(
                        appropriationAfterDue,
                        setAppropriationAfterDue,
                        "appropriation_sequence_after_due",
                        value
                      )
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Add" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableOptions(appropriationAfterDue).map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {appropriationAfterDue.map((item, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div className="flex items-center bg-muted px-3 py-2 rounded-md gap-2">
                      <span className="font-medium">
                        {appropriationOptions.find((o) => o.value === item)?.label} ({item})
                      </span>
                      {!isReadOnly && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() =>
                            removeAppropriationItem(
                              appropriationAfterDue,
                              setAppropriationAfterDue,
                              "appropriation_sequence_after_due",
                              index
                            )
                          }
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    {index < appropriationAfterDue.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Before Due Date */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Appropriation Sequence Before Due Date</h4>
                {!isReadOnly && (
                  <Select
                    onValueChange={(value) =>
                      addAppropriationItem(
                        appropriationBeforeDue,
                        setAppropriationBeforeDue,
                        "appropriation_sequence_before_due",
                        value
                      )
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Add" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableOptions(appropriationBeforeDue).map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {appropriationBeforeDue.map((item, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div className="flex items-center bg-muted px-3 py-2 rounded-md gap-2">
                      <span className="font-medium">
                        {appropriationOptions.find((o) => o.value === item)?.label} ({item})
                      </span>
                      {!isReadOnly && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() =>
                            removeAppropriationItem(
                              appropriationBeforeDue,
                              setAppropriationBeforeDue,
                              "appropriation_sequence_before_due",
                              index
                            )
                          }
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    {index < appropriationBeforeDue.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
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

      {/* Navigation Buttons */}
      {!isReadOnly && (
        <div className="flex justify-between">
          {onPrevious && (
            <Button type="button" variant="outline" onClick={onPrevious}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
          )}
          {onNext && (
            <Button type="button" onClick={onNext} className="ml-auto">
              Next
            </Button>
          )}
        </div>
      )}
    </div>
  );
};