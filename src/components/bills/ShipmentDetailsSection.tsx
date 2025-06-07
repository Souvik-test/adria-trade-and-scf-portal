
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';

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
    <Card className="border-0 shadow-none bg-background">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-orange-400 mb-6">Shipment & Transportation Details</h2>
      </div>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <Label htmlFor="latestShipmentDate" className="text-sm font-medium text-foreground">
              Latest Shipment Date
            </Label>
            <Input
              id="latestShipmentDate"
              value="dd/mm/yyyy"
              placeholder="dd/mm/yyyy"
              className="w-full h-12 border-gray-300 bg-gray-50"
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="actualShipmentDate" className="text-sm font-medium text-foreground">
              Actual Shipment Date <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="actualShipmentDate"
                value="dd/mm/yyyy"
                placeholder="dd/mm/yyyy"
                className="w-full h-12 border-gray-300 focus:border-orange-400 pr-10"
              />
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="billOfLading" className="text-sm font-medium text-foreground">
              Bill of Lading / AWB No. <span className="text-red-500">*</span>
            </Label>
            <Input
              id="billOfLading"
              value={billOfLading}
              onChange={(e) => setBillOfLading(e.target.value)}
              placeholder="Mandatory document ref"
              className="w-full h-12 border-gray-300 focus:border-orange-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shippingLine" className="text-sm font-medium text-foreground">
              Shipping Line / Airline Name
            </Label>
            <Input
              id="shippingLine"
              value={shippingLine}
              onChange={(e) => setShippingLine(e.target.value)}
              placeholder="Optional"
              className="w-full h-12 border-gray-300 focus:border-orange-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portOfLoading" className="text-sm font-medium text-foreground">
              Port of Loading <span className="text-red-500">*</span>
            </Label>
            <Select value={portOfLoading} onValueChange={setPortOfLoading}>
              <SelectTrigger className="w-full h-12 border-gray-300 focus:border-orange-400">
                <SelectValue placeholder="Use UN/LOCODE format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AEDXB">AEDXB - Dubai</SelectItem>
                <SelectItem value="USNYC">USNYC - New York</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="portOfDischarge" className="text-sm font-medium text-foreground">
              Port of Discharge <span className="text-red-500">*</span>
            </Label>
            <Select value={portOfDischarge} onValueChange={setPortOfDischarge}>
              <SelectTrigger className="w-full h-12 border-gray-300 focus:border-orange-400">
                <SelectValue placeholder="Required" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AEDXB">AEDXB - Dubai</SelectItem>
                <SelectItem value="USNYC">USNYC - New York</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="placeOfDelivery" className="text-sm font-medium text-foreground">
              Place of Delivery
            </Label>
            <Select value={placeOfDelivery} onValueChange={setPlaceOfDelivery}>
              <SelectTrigger className="w-full h-12 border-gray-300 focus:border-orange-400">
                <SelectValue placeholder="Optional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warehouse1">Warehouse 1</SelectItem>
                <SelectItem value="warehouse2">Warehouse 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentDetailsSection;
