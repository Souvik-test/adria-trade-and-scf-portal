
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ShipmentTransportationPaneProps {
  shipmentDetails: string;
  setShipmentDetails: (value: string) => void;
  billOfLadingNo: string;
  setBillOfLadingNo: (value: string) => void;
}

const ShipmentTransportationPane: React.FC<ShipmentTransportationPaneProps> = ({
  shipmentDetails,
  setShipmentDetails,
  billOfLadingNo,
  setBillOfLadingNo
}) => {
  return (
    <ScrollArea className="h-full" style={{ scrollbarWidth: 'auto' }}>
      <Card className="border border-gray-200 dark:border-gray-600 h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
            Shipment & Transportation Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Shipment Date</Label>
              <Input type="date" className="mt-1" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Port of Loading</Label>
              <Input placeholder="Enter port of loading" className="mt-1" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Port of Discharge</Label>
              <Input placeholder="Enter port of discharge" className="mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Transportation Mode</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select transportation mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sea">Sea</SelectItem>
                  <SelectItem value="air">Air</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="multimodal">Multimodal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Vessel/Flight Details</Label>
              <Input placeholder="Enter vessel/flight details" className="mt-1" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bill of Lading / AWB No.</Label>
              <Input 
                value={billOfLadingNo}
                onChange={(e) => setBillOfLadingNo(e.target.value)}
                placeholder="Enter bill of lading/AWB number" 
                className="mt-1" 
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Shipment Description</Label>
            <Textarea 
              value={shipmentDetails}
              onChange={(e) => setShipmentDetails(e.target.value)}
              className="mt-1" 
              rows={4}
              placeholder="Enter shipment description"
            />
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  );
};

export default ShipmentTransportationPane;
