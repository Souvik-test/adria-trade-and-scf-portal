
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const bigWidgets = [
  {
    title: "Insights by Watsaxi AI",
    content: (
      <div className="p-4 space-y-2">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500 mt-1" />
          <div className="text-sm">
            <div className="font-semibold">Alert: Credit Limit Review</div>
            <div className="text-xs text-gray-600">
              Credit limit has not been reviewed in 6 months. You can apply for Credit Limit Increase.
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded">Liquidate your FD</button>
          <button className="px-3 py-1 bg-green-500 text-white text-xs rounded">Apply for Credit Limit</button>
        </div>
      </div>
    ),
  },
  {
    title: "News & Promotions",
    content: (
      <div className="p-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-3 text-white text-sm">
          <div className="font-semibold">UAE Foreign Trade hit record $517bn in 2024</div>
        </div>
      </div>
    ),
  },
  {
    title: "Notes",
    content: (
      <div className="p-4 space-y-2">
        <div className="text-xs text-gray-600">Add New</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Call today's schedule for pricing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Meet Credit Limit Officer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span>Check Pending Transactions</span>
          </div>
        </div>
      </div>
    ),
  },
];

const DashboardBigWidgets: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {bigWidgets.map((widget, idx) => (
      <Card key={idx} className="hover:shadow-lg transition-shadow cursor-move" draggable>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{widget.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">{widget.content}</CardContent>
      </Card>
    ))}
  </div>
);

export default DashboardBigWidgets;
