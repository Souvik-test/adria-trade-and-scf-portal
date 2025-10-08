import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
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

interface FeeCataloguePaneProps {
  isReadOnly: boolean;
  mode: "add" | "edit" | "view" | "delete";
  onClose: () => void;
  isSubmitting: boolean;
}

export const FeeCataloguePane = ({
  isReadOnly,
  mode,
  onClose,
  isSubmitting,
}: FeeCataloguePaneProps) => {
  const form = useFormContext();
  const [feeCatalogue, setFeeCatalogue] = useState<any[]>(
    form.getValues("fee_catalogue") || []
  );

  const addFeeRow = () => {
    const newFee = {
      id: Date.now().toString(),
      feeType: "",
      calculationBasis: "",
      rate: "",
      minAmount: "",
      maxAmount: "",
      frequency: "",
    };
    const updated = [...feeCatalogue, newFee];
    setFeeCatalogue(updated);
    form.setValue("fee_catalogue", updated);
  };

  const removeFeeRow = (id: string) => {
    const updated = feeCatalogue.filter((fee) => fee.id !== id);
    setFeeCatalogue(updated);
    form.setValue("fee_catalogue", updated);
  };

  const updateFeeRow = (id: string, field: string, value: string) => {
    const updated = feeCatalogue.map((fee) =>
      fee.id === id ? { ...fee, [field]: value } : fee
    );
    setFeeCatalogue(updated);
    form.setValue("fee_catalogue", updated);
  };

  return (
    <div className="space-y-6">
      {/* Fee Catalogue */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Fee Catalogue</h3>
          {!isReadOnly && (
            <Button type="button" variant="outline" size="sm" onClick={addFeeRow}>
              <Plus className="h-4 w-4 mr-2" />
              Add Fee
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {feeCatalogue.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No fees added. Click "Add Fee" to create one.
            </p>
          ) : (
            feeCatalogue.map((fee) => (
              <Card key={fee.id} className="p-4 bg-muted/30">
                <div className="grid grid-cols-3 gap-4">
                  <Select
                    disabled={isReadOnly}
                    value={fee.feeType}
                    onValueChange={(value) => updateFeeRow(fee.id, "feeType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Fee Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PROCESSING">Processing Fee</SelectItem>
                      <SelectItem value="INTEREST">Interest</SelectItem>
                      <SelectItem value="SERVICE">Service Fee</SelectItem>
                      <SelectItem value="PENALTY">Penalty Fee</SelectItem>
                      <SelectItem value="COMMITMENT">Commitment Fee</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    disabled={isReadOnly}
                    value={fee.calculationBasis}
                    onValueChange={(value) => updateFeeRow(fee.id, "calculationBasis", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Calculation Basis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FLAT">Flat Amount</SelectItem>
                      <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                      <SelectItem value="TIERED">Tiered</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Rate/Amount"
                    type="number"
                    value={fee.rate}
                    onChange={(e) => updateFeeRow(fee.id, "rate", e.target.value)}
                    disabled={isReadOnly}
                  />

                  <Input
                    placeholder="Min Amount"
                    type="number"
                    value={fee.minAmount}
                    onChange={(e) => updateFeeRow(fee.id, "minAmount", e.target.value)}
                    disabled={isReadOnly}
                  />

                  <Input
                    placeholder="Max Amount"
                    type="number"
                    value={fee.maxAmount}
                    onChange={(e) => updateFeeRow(fee.id, "maxAmount", e.target.value)}
                    disabled={isReadOnly}
                  />

                  <div className="flex gap-2">
                    <Select
                      disabled={isReadOnly}
                      value={fee.frequency}
                      onValueChange={(value) => updateFeeRow(fee.id, "frequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ONCE">One Time</SelectItem>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                        <SelectItem value="ANNUALLY">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                    {!isReadOnly && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFeeRow(fee.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>

      {/* Flat Fee Configuration */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Flat Fee Configuration</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Setup Fee"
            type="number"
            disabled={isReadOnly}
            defaultValue={form.getValues("flat_fee_config.setup_fee") || ""}
            onChange={(e) =>
              form.setValue("flat_fee_config.setup_fee", parseFloat(e.target.value))
            }
          />
          <Input
            placeholder="Annual Maintenance Fee"
            type="number"
            disabled={isReadOnly}
            defaultValue={form.getValues("flat_fee_config.annual_fee") || ""}
            onChange={(e) =>
              form.setValue("flat_fee_config.annual_fee", parseFloat(e.target.value))
            }
          />
          <Input
            placeholder="Prepayment Fee"
            type="number"
            disabled={isReadOnly}
            defaultValue={form.getValues("flat_fee_config.prepayment_fee") || ""}
            onChange={(e) =>
              form.setValue("flat_fee_config.prepayment_fee", parseFloat(e.target.value))
            }
          />
          <Input
            placeholder="Cancellation Fee"
            type="number"
            disabled={isReadOnly}
            defaultValue={form.getValues("flat_fee_config.cancellation_fee") || ""}
            onChange={(e) =>
              form.setValue("flat_fee_config.cancellation_fee", parseFloat(e.target.value))
            }
          />
        </div>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          {mode === "view" ? "Close" : "Cancel"}
        </Button>
        {!isReadOnly && (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.setValue("status", "draft");
              }}
              disabled={isSubmitting}
            >
              Save as Draft
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {mode === "add" ? "Submit" : "Update"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
