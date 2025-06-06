
import React, { useState } from 'react';
import { ArrowLeft, MoveHorizontal, PlusCircle, Settings2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

interface ConfigurationProps {
  onBack: () => void;
}

interface Widget {
  id: string;
  title: string;
  type: string;
  active: boolean;
}

const Configuration: React.FC<ConfigurationProps> = ({ onBack }) => {
  const [activeWidgets, setActiveWidgets] = useState<Widget[]>([
    { id: 'transaction-status', title: 'Transaction Status', type: 'chart', active: true },
    { id: 'products', title: 'Products', type: 'pie', active: true },
    { id: 'limit', title: 'Limit', type: 'status', active: true },
    { id: 'lc', title: 'LC', type: 'dual', active: true },
    { id: 'assets', title: 'Current Assets', type: 'financial', active: true }
  ]);

  const [repositoryWidgets, setRepositoryWidgets] = useState<Widget[]>([
    { id: 'cash-forecast', title: 'Cash Forecast', type: 'chart', active: false },
    { id: 'liabilities', title: 'Current Liabilities', type: 'financial', active: false },
    { id: 'companies', title: 'No. of Companies', type: 'count', active: false },
    { id: 'countries', title: 'No. of Countries', type: 'count', active: false },
    { id: 'banking', title: 'Banking Relationships', type: 'count', active: false }
  ]);

  const moveToRepository = (widgetId: string) => {
    const widgetToMove = activeWidgets.find(w => w.id === widgetId);
    if (widgetToMove) {
      setActiveWidgets(activeWidgets.filter(w => w.id !== widgetId));
      setRepositoryWidgets([...repositoryWidgets, {...widgetToMove, active: false}]);
    }
  };

  const moveToDashboard = (widgetId: string) => {
    const widgetToMove = repositoryWidgets.find(w => w.id === widgetId);
    if (widgetToMove) {
      setRepositoryWidgets(repositoryWidgets.filter(w => w.id !== widgetId));
      setActiveWidgets([...activeWidgets, {...widgetToMove, active: true}]);
    }
  };

  const getWidgetTypeIcon = (type: string) => {
    switch(type) {
      case 'chart':
        return <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">C</div>;
      case 'pie':
        return <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">P</div>;
      case 'status':
        return <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs">S</div>;
      case 'dual':
        return <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">D</div>;
      case 'financial':
        return <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">F</div>;
      case 'count':
        return <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs">N</div>;
      default:
        return <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs">?</div>;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Configuration</h2>
        </div>
      </div>

      <Tabs defaultValue="widgets" className="w-full">
        <TabsList className="bg-gray-100 dark:bg-gray-800 mb-6">
          <TabsTrigger 
            value="widgets" 
            className="data-[state=active]:bg-corporate-peach-100 data-[state=active]:text-corporate-peach-800 dark:data-[state=active]:bg-corporate-peach-500/20 dark:data-[state=active]:text-corporate-peach-300"
          >
            Widget Repository
          </TabsTrigger>
          <TabsTrigger 
            value="appearance" 
            className="data-[state=active]:bg-corporate-peach-100 data-[state=active]:text-corporate-peach-800 dark:data-[state=active]:bg-corporate-peach-500/20 dark:data-[state=active]:text-corporate-peach-300"
          >
            Appearance
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="data-[state=active]:bg-corporate-peach-100 data-[state=active]:text-corporate-peach-800 dark:data-[state=active]:bg-corporate-peach-500/20 dark:data-[state=active]:text-corporate-peach-300"
          >
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="widgets" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Widgets */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Dashboard Widgets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activeWidgets.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">No active widgets</p>
                  ) : (
                    activeWidgets.map(widget => (
                      <div 
                        key={widget.id} 
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          {getWidgetTypeIcon(widget.type)}
                          <span className="font-medium">{widget.title}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-500 hover:text-red-500"
                          onClick={() => moveToRepository(widget.id)}
                          title="Move to Repository"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Widget Repository */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Widget Repository</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {repositoryWidgets.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">Repository is empty</p>
                  ) : (
                    repositoryWidgets.map(widget => (
                      <div 
                        key={widget.id} 
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          {getWidgetTypeIcon(widget.type)}
                          <span className="font-medium">{widget.title}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-gray-500 hover:text-green-500"
                          onClick={() => moveToDashboard(widget.id)}
                          title="Add to Dashboard"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
            <div className="flex items-start gap-3">
              <MoveHorizontal className="w-6 h-6 text-blue-500 mt-1" />
              <div>
                <h3 className="font-medium text-blue-700 dark:text-blue-300">Drag and Drop to Reorder</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  You can drag and drop widgets on the dashboard to reorder them. The changes will automatically be saved.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark mode</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Auto-collapse Sidebar</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Automatically collapse sidebar when not in use</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Compact View</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Use more compact layout</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive email notifications for important updates</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notifications in your browser</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Transaction Alerts</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Get real-time alerts for transaction status changes</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Document Updates</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when documents are added or changed</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button 
          variant="outline" 
          className="mr-2 border-gray-300 dark:border-gray-600"
          onClick={onBack}
        >
          Cancel
        </Button>
        <Button className="bg-corporate-peach-500 hover:bg-corporate-peach-600">
          <Settings2 className="w-4 h-4 mr-2" /> Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Configuration;
