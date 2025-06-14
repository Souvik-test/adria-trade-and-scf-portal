
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  transactionFilter: string;
  setTransactionFilter: (val: string) => void;
  productFilter: string;
  setProductFilter: (val: string) => void;
  limitFilter: string;
  setLimitFilter: (val: string) => void;
}

const DashboardSmallWidgets: React.FC<Props> = ({
  transactionFilter,
  setTransactionFilter,
  productFilter,
  setProductFilter,
  limitFilter,
  setLimitFilter,
}) => {
  const widgets = [
    {
      title: "Transaction Status",
      component: (
        <div className="space-y-2">
          <Select value={transactionFilter} onValueChange={setTransactionFilter}>
            <SelectTrigger className="w-full text-xs">
              <SelectValue placeholder="Filter Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="import-lc">Import Letter of Credit</SelectItem>
              <SelectItem value="po">Purchase Order (PO)</SelectItem>
              <SelectItem value="pi">Proforma Invoice (PI)</SelectItem>
              <SelectItem value="invoice">Invoice</SelectItem>
              <SelectItem value="bg">Bank Guarantee</SelectItem>
            </SelectContent>
          </Select>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Approved</span>
              <span className="text-green-600">45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-[45%]"></div>
            </div>
            <div className="flex justify-between text-xs">
              <span>Pending</span>
              <span className="text-orange-600">30%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full w-[30%]"></div>
            </div>
            <div className="flex justify-between text-xs">
              <span>In Process</span>
              <span className="text-blue-600">25%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full w-[25%]"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Products",
      component: (
        <div className="space-y-2">
          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger className="w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">1 Month</SelectItem>
              <SelectItem value="lc">3 Months</SelectItem>
              <SelectItem value="bg">6 Months</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center justify-center">
            <PieChart className="w-16 h-16 text-corporate-blue" />
          </div>
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>LC</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>Buyer's Credit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Guarantee</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Limit",
      component: (
        <div className="space-y-2">
          <Select value={limitFilter} onValueChange={setLimitFilter}>
            <SelectTrigger className="w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Unutilized & Available</SelectItem>
              <SelectItem value="utilized">Utilized</SelectItem>
              <SelectItem value="available">Available</SelectItem>
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">06</div>
              <div className="text-gray-600">Import</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">64</div>
              <div className="text-gray-600">Bills</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "LC",
      component: (
        <div className="space-y-2">
          <div className="text-xs text-gray-600">1 Month</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">06</div>
              <div className="text-gray-600">Export</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">64</div>
              <div className="text-gray-600">Outward Bank</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">64</div>
              <div className="text-gray-600">Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">64</div>
              <div className="text-gray-600">Inward Bank</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {widgets.map((widget, idx) => (
        <Card key={idx} className="hover:shadow-lg transition-shadow cursor-move" draggable>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{widget.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-3">{widget.component}</CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardSmallWidgets;
