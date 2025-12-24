import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderingCustomer, COUNTRY_OPTIONS } from '@/types/internationalRemittance';

interface OrderingCustomerPaneProps {
  data: OrderingCustomer;
  onChange: (field: keyof OrderingCustomer, value: string) => void;
  readOnly?: boolean;
}

const OrderingCustomerPane: React.FC<OrderingCustomerPaneProps> = ({
  data,
  onChange,
  readOnly = false,
}) => {
  const inputClassName = readOnly ? 'bg-muted cursor-not-allowed' : '';

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Ordering Customer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ordering Customer Name */}
          <div className="space-y-2">
            <Label htmlFor="ordName" className="text-sm">
              Ordering Customer Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="ordName"
              value={data.ordName}
              onChange={(e) => onChange('ordName', e.target.value.slice(0, 140))}
              placeholder="Enter ordering customer name"
              maxLength={140}
              disabled={readOnly}
              className={inputClassName}
            />
            <span className="text-xs text-muted-foreground">{data.ordName.length}/140</span>
          </div>

          {/* Ordering Account/IBAN */}
          <div className="space-y-2">
            <Label htmlFor="ordAcct" className="text-sm">
              Ordering Account/IBAN <span className="text-destructive">*</span>
            </Label>
            <Input
              id="ordAcct"
              value={data.ordAcct}
              onChange={(e) => onChange('ordAcct', e.target.value.toUpperCase().slice(0, 34))}
              placeholder="Enter IBAN or account number"
              maxLength={34}
              disabled={readOnly}
              className={inputClassName}
            />
            <span className="text-xs text-muted-foreground">{data.ordAcct.length}/34</span>
          </div>
        </div>

        {/* Address Section - Country, State/Region, City/Town */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="ordCountry" className="text-sm">
              Country <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.ordCountry}
              onValueChange={(value) => onChange('ordCountry', value)}
              disabled={readOnly}
            >
              <SelectTrigger className={inputClassName}>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRY_OPTIONS.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* State/Region */}
          <div className="space-y-2">
            <Label htmlFor="ordState" className="text-sm">
              State/Region
            </Label>
            <Input
              id="ordState"
              value={data.ordState}
              onChange={(e) => onChange('ordState', e.target.value.slice(0, 35))}
              placeholder="Enter state or region"
              maxLength={35}
              disabled={readOnly}
              className={inputClassName}
            />
          </div>

          {/* City/Town */}
          <div className="space-y-2">
            <Label htmlFor="ordCity" className="text-sm">
              City/Town
            </Label>
            <Input
              id="ordCity"
              value={data.ordCity}
              onChange={(e) => onChange('ordCity', e.target.value.slice(0, 35))}
              placeholder="Enter city or town"
              maxLength={35}
              disabled={readOnly}
              className={inputClassName}
            />
          </div>
        </div>

        {/* Address Line 1, Address Line 2, PIN/Post Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Address Line 1 */}
          <div className="space-y-2">
            <Label htmlFor="ordAddr1" className="text-sm">
              Address Line-1
            </Label>
            <Input
              id="ordAddr1"
              value={data.ordAddr1}
              onChange={(e) => onChange('ordAddr1', e.target.value.slice(0, 70))}
              placeholder="Enter address line 1"
              maxLength={70}
              disabled={readOnly}
              className={inputClassName}
            />
            <span className="text-xs text-muted-foreground">{data.ordAddr1.length}/70</span>
          </div>

          {/* Address Line 2 */}
          <div className="space-y-2">
            <Label htmlFor="ordAddr2" className="text-sm">
              Address Line-2
            </Label>
            <Input
              id="ordAddr2"
              value={data.ordAddr2}
              onChange={(e) => onChange('ordAddr2', e.target.value.slice(0, 70))}
              placeholder="Enter address line 2"
              maxLength={70}
              disabled={readOnly}
              className={inputClassName}
            />
            <span className="text-xs text-muted-foreground">{data.ordAddr2.length}/70</span>
          </div>

          {/* PIN/Post Code */}
          <div className="space-y-2">
            <Label htmlFor="ordPostCode" className="text-sm">
              PIN/Post Code
            </Label>
            <Input
              id="ordPostCode"
              value={data.ordPostCode}
              onChange={(e) => onChange('ordPostCode', e.target.value.slice(0, 16))}
              placeholder="Enter PIN or post code"
              maxLength={16}
              disabled={readOnly}
              className={inputClassName}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderingCustomerPane;
