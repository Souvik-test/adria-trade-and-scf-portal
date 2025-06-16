
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const NewBeneficiariesPane = ({ form }: { form: any }) => (
  <div className="w-full bg-card border border-border rounded-2xl shadow-md p-8 max-w-none transition-colors">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-semibold text-corporate-blue">New Beneficiaries Information</h2>
      <Button
        type="button"
        onClick={form.addNewBeneficiary}
        className="bg-corporate-blue hover:bg-corporate-blue/90 text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Beneficiary
      </Button>
    </div>

    <div className="space-y-8">
      {form.form.newBeneficiaries.map((beneficiary: any, index: number) => (
        <div key={index} className="border border-border rounded-lg p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-medium text-foreground">
              Beneficiary {index + 1}
            </h3>
            {form.form.newBeneficiaries.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => form.removeNewBeneficiary(index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="font-medium mb-1 block text-foreground">Beneficiary Name</Label>
              <Input
                value={beneficiary.name}
                onChange={e => form.updateNewBeneficiary(index, { name: e.target.value })}
              />
            </div>
            <div>
              <Label className="font-medium mb-1 block text-foreground">Transfer Amount</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-muted-foreground bg-muted border border-r-0 border-border rounded-l-md">
                  {form.form.currency}
                </span>
                <Input
                  type="number"
                  value={beneficiary.transferAmount}
                  onChange={e => form.updateNewBeneficiary(index, { transferAmount: e.target.value ? Number(e.target.value) : '' })}
                  className="rounded-l-none"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <Label className="font-medium mb-1 block text-foreground">Address</Label>
              <Textarea
                value={beneficiary.address}
                onChange={e => form.updateNewBeneficiary(index, { address: e.target.value })}
                className="min-h-[70px]"
              />
            </div>
            <div>
              <Label className="font-medium mb-1 block text-foreground">Country</Label>
              <select 
                className="block w-full border border-border rounded-md px-3 py-2 mt-1 bg-background text-foreground"
                value={beneficiary.country || ""}
                onChange={e => form.updateNewBeneficiary(index, { country: e.target.value })}
              >
                <option value="">Select Country</option>
                <option>India</option>
                <option>United States</option>
                <option>UAE</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-foreground mb-4">Banking Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-medium text-foreground">Bank Name</Label>
                <Input
                  value={beneficiary.bankName}
                  onChange={e => form.updateNewBeneficiary(index, { bankName: e.target.value })}
                />
              </div>
              <div>
                <Label className="font-medium text-foreground">Bank Address</Label>
                <Textarea
                  value={beneficiary.bankAddress}
                  onChange={e => form.updateNewBeneficiary(index, { bankAddress: e.target.value })}
                  className="min-h-[50px]"
                />
              </div>
              <div>
                <Label className="font-medium text-foreground">SWIFT Code</Label>
                <Input
                  value={beneficiary.swiftCode}
                  onChange={e => form.updateNewBeneficiary(index, { swiftCode: e.target.value })}
                />
              </div>
              <div>
                <Label className="font-medium text-foreground">Account Number</Label>
                <Input
                  value={beneficiary.accountNumber}
                  onChange={e => form.updateNewBeneficiary(index, { accountNumber: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default NewBeneficiariesPane;
