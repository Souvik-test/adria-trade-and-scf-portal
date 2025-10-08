import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface GeneralPartyPaneProps {
  isReadOnly: boolean;
  onNext?: () => void;
}

export const GeneralPartyPane = ({ isReadOnly, onNext }: GeneralPartyPaneProps) => {
  const { control, setValue, watch } = useFormContext();
  const [counterParties, setCounterParties] = useState<any[]>(
    watch("counter_parties") || []
  );

  const programLimit = watch("program_limit");
  const programCurrency = watch("program_currency");

  const addCounterParty = () => {
    const newCounterParty = {
      id: "",
      name: "",
      limit_currency: programCurrency || "USD",
      limit_amount: 0,
      available_limit_currency: programCurrency || "USD",
      available_limit_amount: 0,
      disbursement_currency: programCurrency || "USD",
      preferred_disbursement_method: "",
    };
    const updated = [...counterParties, newCounterParty];
    setCounterParties(updated);
    setValue("counter_parties", updated);
  };

  const removeCounterParty = (index: number) => {
    const updated = counterParties.filter((_, i) => i !== index);
    setCounterParties(updated);
    setValue("counter_parties", updated);
  };

  const updateCounterParty = (index: number, field: string, value: any) => {
    const updated = counterParties.map((cp, i) =>
      i === index ? { ...cp, [field]: value } : cp
    );
    setCounterParties(updated);
    setValue("counter_parties", updated);
  };

  return (
    <div className="space-y-6">
      {/* General Details */}
      <Card>
        <CardHeader>
          <CardTitle>General Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="program_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program ID *</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isReadOnly} placeholder="Enter program ID" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
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
              control={control}
              name="product_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Code *</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isReadOnly}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product code" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        <SelectItem value="SCFI">Invoice Finance</SelectItem>
                        <SelectItem value="SCFPO">PO Finance</SelectItem>
                        <SelectItem value="SCFVF">Vendor Finance</SelectItem>
                        <SelectItem value="SCFDF">Distributor Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="product_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled placeholder="Auto-populated" className="bg-muted" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="program_currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Currency *</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isReadOnly}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
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
              control={control}
              name="program_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Limit *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      disabled={isReadOnly}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      placeholder="Enter program limit"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="available_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Available Limit *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      disabled={isReadOnly}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      placeholder="Auto-set to program limit"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="effective_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Effective Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} disabled={isReadOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="expiry_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} disabled={isReadOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="program_description"
            render={({ field }) => (
              <FormItem>
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
        </CardContent>
      </Card>

      {/* Party Details */}
      <Card>
        <CardHeader>
          <CardTitle>Party Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="anchor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anchor ID</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isReadOnly} placeholder="Search or enter anchor ID" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
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
              control={control}
              name="anchor_account"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anchor Account</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isReadOnly} placeholder="Enter anchor account" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Anchor Limit</Label>
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={control}
                  name="anchor_limit_currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          disabled={isReadOnly}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background z-50">
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="INR">INR</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="anchor_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          disabled={isReadOnly}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            if (value > programLimit) {
                              field.onChange(programLimit);
                            } else {
                              field.onChange(value);
                            }
                          }}
                          placeholder="Amount"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-xs text-muted-foreground">Cannot exceed program limit</p>
            </div>

            <div className="space-y-2">
              <Label>Anchor Available Limit</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select disabled value={programCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value={programCurrency}>{programCurrency}</SelectItem>
                  </SelectContent>
                </Select>
                <FormField
                  control={control}
                  name="anchor_available_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          disabled={isReadOnly}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          placeholder="Amount"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Counter Parties */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Counter Parties</Label>
              {!isReadOnly && (
                <Button type="button" variant="outline" size="sm" onClick={addCounterParty}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Counter Party
                </Button>
              )}
            </div>

            {counterParties.map((cp, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Counter Party {index + 1}</h4>
                      {!isReadOnly && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCounterParty(index)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Counter Party ID</Label>
                        <Input
                          value={cp.id || ""}
                          onChange={(e) => updateCounterParty(index, "id", e.target.value)}
                          disabled={isReadOnly}
                          placeholder="Optional"
                        />
                      </div>

                      <div>
                        <Label>Counter Party Name *</Label>
                        <Input
                          value={cp.name || ""}
                          onChange={(e) => updateCounterParty(index, "name", e.target.value)}
                          disabled={isReadOnly}
                          placeholder="Enter name"
                        />
                      </div>

                      <div>
                        <Label>Counter Party Limit</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={cp.limit_currency}
                            onValueChange={(value) => updateCounterParty(index, "limit_currency", value)}
                            disabled={isReadOnly}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-background z-50">
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="INR">INR</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            type="number"
                            value={cp.limit_amount || 0}
                            onChange={(e) => updateCounterParty(index, "limit_amount", parseFloat(e.target.value) || 0)}
                            disabled={isReadOnly}
                            placeholder="Amount"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Counter Party Available Limit</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={cp.available_limit_currency}
                            onValueChange={(value) => updateCounterParty(index, "available_limit_currency", value)}
                            disabled={isReadOnly}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-background z-50">
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="INR">INR</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            type="number"
                            value={cp.available_limit_amount || 0}
                            onChange={(e) => updateCounterParty(index, "available_limit_amount", parseFloat(e.target.value) || 0)}
                            disabled={isReadOnly}
                            placeholder="Amount"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Disbursement Currency</Label>
                        <Select
                          value={cp.disbursement_currency}
                          onValueChange={(value) => updateCounterParty(index, "disbursement_currency", value)}
                          disabled={isReadOnly}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background z-50">
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="INR">INR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Preferred Disbursement Method</Label>
                        <Select
                          value={cp.preferred_disbursement_method}
                          onValueChange={(value) => updateCounterParty(index, "preferred_disbursement_method", value)}
                          disabled={isReadOnly}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent className="bg-background z-50">
                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                            <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                            <SelectItem value="Check">Check</SelectItem>
                            <SelectItem value="ACH">ACH</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Finance Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Finance Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="anchor_party"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anchor Party</FormLabel>
                  <FormControl>
                    <Input {...field} disabled placeholder="Auto-populated from anchor name" className="bg-muted" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="borrower_selection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Borrower *</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isReadOnly}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select borrower" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        <SelectItem value="Anchor Party">Anchor Party</SelectItem>
                        <SelectItem value="Counter Party">Counter Party</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Minimum Tenor</Label>
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={control}
                  name="min_tenor"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          disabled={isReadOnly}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          placeholder="Value"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="min_tenor_unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          disabled={isReadOnly}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background z-50">
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                            <SelectItem value="years">Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Maximum Tenor</Label>
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={control}
                  name="max_tenor"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          disabled={isReadOnly}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          placeholder="Value"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="max_tenor_unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          disabled={isReadOnly}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background z-50">
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                            <SelectItem value="years">Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={control}
              name="margin_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Margin %</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      disabled={isReadOnly}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      placeholder="Enter margin percentage"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="finance_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Finance %</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      disabled={isReadOnly}
                      max={100}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        field.onChange(value > 100 ? 100 : value);
                      }}
                      placeholder="Max 100%"
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">Should not exceed 100% of underlying instrument value</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="grace_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grace Days</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      disabled={isReadOnly}
                      min={0}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      placeholder="Default: 0"
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">Days added to maturity date where interest is still charged</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="stale_period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stale Period (Days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      disabled={isReadOnly}
                      min={0}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      placeholder="Enter stale period"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Assignment Section */}
          <div className="space-y-3 pt-4 border-t">
            <FormField
              control={control}
              name="assignment_enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isReadOnly}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Enable Assignment</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {watch("assignment_enabled") && (
              <FormField
                control={control}
                name="assignment_percentage"
                render={({ field }) => (
                  <FormItem className="ml-6">
                    <FormLabel>Assignment %</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        disabled={isReadOnly}
                        max={100}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          field.onChange(value > 100 ? 100 : value);
                        }}
                        placeholder="Max 100%"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Unaccepted Invoice Finance Section */}
          <div className="space-y-3 pt-4 border-t">
            <FormField
              control={control}
              name="unaccepted_invoice_finance_enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isReadOnly}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Enable Unaccepted Invoice Finance</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {watch("unaccepted_invoice_finance_enabled") && (
              <FormField
                control={control}
                name="unaccepted_invoice_percentage"
                render={({ field }) => (
                  <FormItem className="ml-6">
                    <FormLabel>Unaccepted Invoice %</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        disabled={isReadOnly}
                        max={100}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          field.onChange(value > 100 ? 100 : value);
                        }}
                        placeholder="Max 100%"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Recourse Section */}
          <div className="space-y-3 pt-4 border-t">
            <FormField
              control={control}
              name="recourse_enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isReadOnly}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Enable Recourse</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {watch("recourse_enabled") && (
              <FormField
                control={control}
                name="recourse_percentage"
                render={({ field }) => (
                  <FormItem className="ml-6">
                    <FormLabel>Recourse %</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        disabled={isReadOnly}
                        max={100}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          field.onChange(value > 100 ? 100 : value);
                        }}
                        placeholder="Max 100%"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Next Button */}
      {!isReadOnly && onNext && (
        <div className="flex justify-end pt-4">
          <Button type="button" onClick={onNext} className="gap-2">
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
