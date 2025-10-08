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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Search } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface GeneralPartyPaneProps {
  isReadOnly: boolean;
  onNext?: () => void;
}

export const GeneralPartyPane = ({ isReadOnly, onNext }: GeneralPartyPaneProps) => {
  const form = useFormContext();
  const [counterParties, setCounterParties] = useState<any[]>(
    form.getValues("counter_parties") || []
  );

  const addCounterParty = () => {
    const newParty = {
      id: Date.now().toString(),
      counter_party_id: "",
      counter_party_name: "",
      limit_currency: form.getValues("program_currency") || "USD",
      limit_amount: 0,
      available_limit_currency: form.getValues("program_currency") || "USD",
      available_limit_amount: 0,
      disbursement_currency: form.getValues("program_currency") || "USD",
      preferred_disbursement_method: "",
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

  const updateCounterParty = (id: string, field: string, value: any) => {
    const updated = counterParties.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    );
    setCounterParties(updated);
    form.setValue("counter_parties", updated);
  };

  return (
    <div className="space-y-6">
      {/* General Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">General Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="program_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program ID</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isReadOnly} placeholder="Enter program ID" />
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
                <FormLabel>Program Name</FormLabel>
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
                <FormLabel>Product Code</FormLabel>
                <FormControl>
                  <Select
                    disabled={isReadOnly}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INV_FIN">INV_FIN</SelectItem>
                      <SelectItem value="PO_FIN">PO_FIN</SelectItem>
                      <SelectItem value="DIS_FIN">DIS_FIN</SelectItem>
                      <SelectItem value="VEN_FIN">VEN_FIN</SelectItem>
                      <SelectItem value="DYN_DISC">DYN_DISC</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="product_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled placeholder="Auto-populated" />
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
                <FormLabel>Program Currency</FormLabel>
                <FormControl>
                  <Select
                    disabled={isReadOnly}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
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
                <FormLabel>Program Limit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    disabled={isReadOnly}
                    placeholder="Enter limit"
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
                <FormLabel>Program Available Limit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    disabled={isReadOnly}
                    placeholder="Enter available limit"
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
                <FormLabel>Program Period From</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={isReadOnly} />
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
                <FormLabel>Program Period To</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={isReadOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="program_description"
            render={({ field }) => (
              <FormItem className="col-span-3">
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

      {/* Party Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Party Details</h3>
        <div className="space-y-6">
          {/* Anchor Details */}
          <div className="space-y-4">
            <h4 className="font-medium">Anchor Details</h4>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="anchor_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anchor ID</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} disabled={isReadOnly} placeholder="Search anchor ID" />
                      </FormControl>
                      {!isReadOnly && (
                        <Button type="button" variant="outline" size="icon">
                          <Search className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="anchor_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anchor Name</FormLabel>
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

              <FormField
                control={form.control}
                name="anchor_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anchor Limit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        disabled={isReadOnly}
                        placeholder="Enter limit"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="anchor_available_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anchor Available Limit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        disabled={isReadOnly}
                        placeholder="Enter available limit"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="anchor_limit_currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anchor Limit Currency</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isReadOnly}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
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
            </div>
          </div>

          {/* Counter Parties */}
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

            {counterParties.length > 0 && (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Counter Party ID</TableHead>
                      <TableHead>Counter Party Name</TableHead>
                      <TableHead>Limit</TableHead>
                      <TableHead>Available Limit</TableHead>
                      <TableHead>Disbursement Currency</TableHead>
                      <TableHead>Preferred Method</TableHead>
                      {!isReadOnly && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {counterParties.map((party) => (
                      <TableRow key={party.id}>
                        <TableCell>
                          <Input
                            value={party.counter_party_id}
                            onChange={(e) =>
                              updateCounterParty(party.id, "counter_party_id", e.target.value)
                            }
                            disabled={isReadOnly}
                            placeholder="Optional"
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={party.counter_party_name}
                            onChange={(e) =>
                              updateCounterParty(party.id, "counter_party_name", e.target.value)
                            }
                            disabled={isReadOnly}
                            placeholder="Name"
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Select
                              disabled={isReadOnly}
                              value={party.limit_currency}
                              onValueChange={(value) =>
                                updateCounterParty(party.id, "limit_currency", value)
                              }
                            >
                              <SelectTrigger className="h-8 w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                                <SelectItem value="GBP">GBP</SelectItem>
                                <SelectItem value="INR">INR</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              value={party.limit_amount}
                              onChange={(e) =>
                                updateCounterParty(party.id, "limit_amount", parseFloat(e.target.value) || 0)
                              }
                              disabled={isReadOnly}
                              placeholder="Amount"
                              className="h-8"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Select
                              disabled={isReadOnly}
                              value={party.available_limit_currency}
                              onValueChange={(value) =>
                                updateCounterParty(party.id, "available_limit_currency", value)
                              }
                            >
                              <SelectTrigger className="h-8 w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                                <SelectItem value="GBP">GBP</SelectItem>
                                <SelectItem value="INR">INR</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              value={party.available_limit_amount}
                              onChange={(e) =>
                                updateCounterParty(party.id, "available_limit_amount", parseFloat(e.target.value) || 0)
                              }
                              disabled={isReadOnly}
                              placeholder="Amount"
                              className="h-8"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            disabled={isReadOnly}
                            value={party.disbursement_currency}
                            onValueChange={(value) =>
                              updateCounterParty(party.id, "disbursement_currency", value)
                            }
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="INR">INR</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            disabled={isReadOnly}
                            value={party.preferred_disbursement_method}
                            onValueChange={(value) =>
                              updateCounterParty(party.id, "preferred_disbursement_method", value)
                            }
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="RTGS">RTGS</SelectItem>
                              <SelectItem value="NEFT">NEFT</SelectItem>
                              <SelectItem value="IMPS">IMPS</SelectItem>
                              <SelectItem value="WIRE">Wire Transfer</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        {!isReadOnly && (
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeCounterParty(party.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Finance Parameters */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Finance Parameters</h3>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="anchor_party"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anchor Party</FormLabel>
                <FormControl>
                  <Input {...field} disabled placeholder="Auto-populated from Anchor Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="borrower_selection"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Borrower</FormLabel>
                <FormControl>
                  <Select
                    disabled={isReadOnly}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select borrower" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Anchor Party">Anchor Party</SelectItem>
                      <SelectItem value="Counter Party">Counter Party</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
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
                <FormLabel>Finance % (Max 100%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    disabled={isReadOnly}
                    placeholder="Enter percentage"
                    max={100}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Minimum Tenor */}
          <div className="space-y-2">
            <FormLabel>Minimum Tenor</FormLabel>
            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="min_tenor_years"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        disabled={isReadOnly}
                        placeholder="Years"
                        min={0}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="min_tenor_months"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        disabled={isReadOnly}
                        placeholder="Months"
                        min={0}
                        max={11}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="min_tenor_days"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        disabled={isReadOnly}
                        placeholder="Days"
                        min={0}
                        max={30}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Maximum Tenor */}
          <div className="space-y-2">
            <FormLabel>Maximum Tenor</FormLabel>
            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="max_tenor_years"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        disabled={isReadOnly}
                        placeholder="Years"
                        min={0}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_tenor_months"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        disabled={isReadOnly}
                        placeholder="Months"
                        min={0}
                        max={11}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_tenor_days"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        disabled={isReadOnly}
                        placeholder="Days"
                        min={0}
                        max={30}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="margin_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Margin %</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    disabled={isReadOnly}
                    placeholder="Enter margin"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="grace_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grace Days</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    disabled={isReadOnly}
                    placeholder="Enter grace days"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stale_period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stale Period (Days)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    disabled={isReadOnly}
                    placeholder="Enter stale period"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Assignment Finance */}
          <FormField
            control={form.control}
            name="assignment_enabled"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={isReadOnly}
                    className="h-4 w-4"
                  />
                </FormControl>
                <FormLabel className="!mt-0">Assignment Finance</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("assignment_enabled") && (
            <FormField
              control={form.control}
              name="assignment_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignment %</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      disabled={isReadOnly}
                      placeholder="Enter percentage"
                      max={100}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Unaccepted Invoice Finance */}
          <FormField
            control={form.control}
            name="unaccepted_invoice_finance_enabled"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={isReadOnly}
                    className="h-4 w-4"
                  />
                </FormControl>
                <FormLabel className="!mt-0">Unaccepted Invoice Finance</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("unaccepted_invoice_finance_enabled") && (
            <FormField
              control={form.control}
              name="unaccepted_invoice_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unaccepted Invoice %</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      disabled={isReadOnly}
                      placeholder="Enter percentage"
                      max={100}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Recourse */}
          <FormField
            control={form.control}
            name="recourse_enabled"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={isReadOnly}
                    className="h-4 w-4"
                  />
                </FormControl>
                <FormLabel className="!mt-0">Recourse</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("recourse_enabled") && (
            <FormField
              control={form.control}
              name="recourse_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recourse %</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      disabled={isReadOnly}
                      placeholder="Enter percentage"
                      max={100}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </Card>

      {!isReadOnly && onNext && (
        <div className="flex justify-end">
          <Button type="button" onClick={onNext}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
};