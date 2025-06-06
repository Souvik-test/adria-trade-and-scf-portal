
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, FileText, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const DashboardWidgets: React.FC = () => {
  const widgets = [
    {
      title: 'Total Outstanding',
      value: '$2,450,000',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Pending Approvals',
      value: '24',
      change: '+3',
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      title: 'Active LCs',
      value: '156',
      change: '+8',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Completed Transactions',
      value: '89%',
      change: '+2.1%',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Risk Alerts',
      value: '3',
      change: '-2',
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      title: 'Monthly Growth',
      value: '15.2%',
      change: '+1.8%',
      icon: TrendingUp,
      color: 'text-corporate-blue'
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Trade Finance Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map((widget, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {widget.title}
              </CardTitle>
              <widget.icon className={`h-5 w-5 ${widget.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {widget.value}
              </div>
              <p className={`text-xs ${widget.color} mt-1`}>
                {widget.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardWidgets;
