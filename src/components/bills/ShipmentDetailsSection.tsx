
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ShipmentDetailsSectionProps {
  latestShipmentDate: Date | null;
  actualShipmentDate: Date | null;
  setActualShipmentDate: (value: Date | null) => void;
  billOfLading: string;
  setBillOfLading: (value: string) => void;
  shippingLine: string;
  setShippingLine: (value: string) => void;
  portOfLoading: string;
  setPortOfLoading: (value: string) => void;
  portOfDischarge: string;
  setPortOfDischarge: (value: string) => void;
  placeOfDelivery: string;
  setPlaceOfDelivery: (value: string) => void;
}

const ShipmentDetailsSection: React.FC<ShipmentDetailsSectionProps> = ({
  latestShipmentDate,
  actualShipmentDate,
  setActualShipmentDate,
  billOfLading,
  setBillOfLading,
  shippingLine,
  setShippingLine,
  portOfLoading,
  setPortOfLoading,
  portOfDischarge,
  setPortOfDischarge,
  placeOfDelivery,
  setPlaceOfDelivery
}) => {
  return (
    <Card className="border-border">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-lg text-primary">
          Section 4: Shipment & Transportation Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latestShipmentDate">Latest Shipment Date (CM) - Non-editable</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !latestShipmentDate && "text-muted-foreground"
                  )}
                  disabled
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {latestShipmentDate ? format(latestShipmentDate, "PPP") : "Non-editable"}
                </Button>
              </PopoverTrigger>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="actualShipmentDate">Actual Shipment Date * (M)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !actualShipmentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {actualShipmentDate ? format(actualShipmentDate, "PPP") : "Must ≤ Latest Shipment Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={actualShipmentDate}
                  onSelect={setActualShipmentDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="billOfLading">Bill of Lading / AWB No. * (M)</Label>
            <Input
              id="billOfLading"
              value={billOfLading}
              onChange={(e) => setBillOfLading(e.target.value)}
              placeholder="Mandatory document ref (35 chars max)"
              maxLength={35}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shippingLine">Shipping Line / Airline Name (O)</Label>
            <Input
              id="shippingLine"
              value={shippingLine}
              onChange={(e) => setShippingLine(e.target.value)}
              placeholder="Optional (35 chars max)"
              maxLength={35}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portOfLoading">Port of Loading * (M)</Label>
            <Input
              id="portOfLoading"
              value={portOfLoading}
              onChange={(e) => setPortOfLoading(e.target.value)}
              placeholder="Use UN/LOCODE format (35 chars max)"
              maxLength={35}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portOfDischarge">Port of Discharge * (M)</Label>
            <Input
              id="portOfDischarge"
              value={portOfDischarge}
              onChange={(e) => setPortOfDischarge(e.target.value)}
              placeholder="Required (35 chars max)"
              maxLength={35}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="placeOfDelivery">Place of Delivery (M)</Label>
            <Input
              id="placeOfDelivery"
              value={placeOfDelivery}
              onChange={(e) => setPlaceOfDelivery(e.target.value)}
              placeholder="Optional (35 chars max)"
              maxLength={35}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentDetailsSection;
