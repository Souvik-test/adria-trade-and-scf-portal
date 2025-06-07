
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DrawingDetailsSectionProps {
  drawingAmount: string;
  setDrawingAmount: (value: string) => void;
  drawingCurrency: string;
  setDrawingCurrency: (value: string) => void;
  tenor: string;
  setTenor: (value: string) => void;
  tenorDays: string;
  setTenorDays: (value: string) => void;
}

const DrawingDetailsSection: React.FC<DrawingDetailsSectionProps> = ({
  drawingAmount,
  setDrawingAmount,
  drawingCurrency,
  setDrawingCurrency,
  tenor,
  setTenor,
  tenorDays,
  setTenorDays
}) => {
  return (
    <Card className="border-0 shadow-none bg-background">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-orange-400 mb-6">Drawing Details</h2>
      </div>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label htmlFor="drawingAmount" className="text-sm font-medium text-foreground">
              Drawing Amount <span className="text-red-500">*</span>
            </Label>
            <Input
              id="drawingAmount"
              value={drawingAmount}
              onChange={(e) => setDrawingAmount(e.target.value)}
              placeholder="Must be ≤ available balance"
              className="w-full h-12 border-gray-300 focus:border-orange-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="drawingCurrency" className="text-sm font-medium text-foreground">
              Drawing Currency
            </Label>
            <Input
              id="drawingCurrency"
              value="Auto-fetched"
              placeholder="Auto-fetched"
              className="w-full h-12 border-gray-300 bg-gray-50"
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenor" className="text-sm font-medium text-foreground">
              Tenor (Sight/Usance) <span className="text-red-500">*</span>
            </Label>
            <Select value={tenor} onValueChange={setTenor}>
              <SelectTrigger className="w-full h-12 border-gray-300 focus:border-orange-400">
                <SelectValue placeholder="Based on LC terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sight">Sight</SelectItem>
                <SelectItem value="Usance">Usance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenorDays" className="text-sm font-medium text-foreground">
              Tenor Days (if Usance)
            </Label>
            <Input
              id="tenorDays"
              type="number"
              value={tenorDays}
              onChange={(e) => setTenorDays(e.target.value)}
              placeholder="Required if Tenor = Usance"
              className="w-full h-12 border-gray-300 focus:border-orange-400"
              disabled={tenor !== 'Usance'}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DrawingDetailsSection;
