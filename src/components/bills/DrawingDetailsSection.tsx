
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const tenorOptions = ['Sight', 'Usance'];

  return (
    <Card className="border-border">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-lg text-primary">
          Section 3: Drawing Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="drawingAmount">Drawing Amount * (M)</Label>
            <Input
              id="drawingAmount"
              value={drawingAmount}
              onChange={(e) => setDrawingAmount(e.target.value)}
              placeholder="Must be ≤ available balance (15 digits)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="drawingCurrency">Drawing Currency (CM) - Auto-fetched</Label>
            <Input
              id="drawingCurrency"
              value={drawingCurrency}
              onChange={(e) => setDrawingCurrency(e.target.value)}
              placeholder="ISO String (3 chars)"
              maxLength={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenor">Tenor (Sight/Usance) * (M) - Based on LC terms</Label>
            <Select value={tenor} onValueChange={setTenor}>
              <SelectTrigger>
                <SelectValue placeholder="Based on LC terms" />
              </SelectTrigger>
              <SelectContent>
                {tenorOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenorDays">Tenor Days (if Usance) (O)</Label>
            <Input
              id="tenorDays"
              type="number"
              value={tenorDays}
              onChange={(e) => setTenorDays(e.target.value)}
              placeholder="Required if Tenor = Usance"
              disabled={tenor !== 'Usance'}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DrawingDetailsSection;
