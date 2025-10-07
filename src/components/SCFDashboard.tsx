import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, FileText, Clock, Users, Package, ArrowUpRight, ArrowDownRight, Sparkles, Leaf, Building2, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SCFDashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('30days');
  const [programFilter, setProgramFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'buyer' | 'supplier'>('buyer');
  const [aiInsightsOpen, setAiInsightsOpen] = useState(false);
  const [esgTrackerOpen, setEsgTrackerOpen] = useState(false);
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-foreground">Supply Chain Finance Dashboard</h2>
          <Select value={viewMode} onValueChange={(value) => setViewMode(value as 'buyer' | 'supplier')}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buyer">Buyer View</SelectItem>
              <SelectItem value="supplier">Supplier View</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3">
          <Select value={programFilter} onValueChange={setProgramFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Program Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              <SelectItem value="payables">Payables Finance</SelectItem>
              <SelectItem value="receivables">Receivables Finance</SelectItem>
              <SelectItem value="inventory">Inventory Finance</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="professional-shadow hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Financing</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">USD 45.2M</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="professional-shadow hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Suppliers</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">284</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+8</span> new this month
            </p>
          </CardContent>
        </Card>

        <Card className="professional-shadow hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Invoices</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">142</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-muted-foreground">USD 8.3M</span> total value
            </p>
          </CardContent>
        </Card>

        <Card className="professional-shadow hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Payment Days</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">38</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowDownRight className="h-3 w-3 text-green-600" />
              <span className="text-green-600">-3 days</span> improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Program Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="professional-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Program Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Payables Finance</p>
                    <p className="text-sm text-muted-foreground">156 active transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">USD 28.5M</p>
                  <p className="text-xs text-green-600">+15.2%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Receivables Finance</p>
                    <p className="text-sm text-muted-foreground">89 active transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">USD 12.8M</p>
                  <p className="text-xs text-green-600">+8.7%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Inventory Finance</p>
                    <p className="text-sm text-muted-foreground">34 active transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">USD 3.9M</p>
                  <p className="text-xs text-green-600">+22.1%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="professional-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Invoice INV-2024-001 approved</p>
                  <p className="text-xs text-muted-foreground">Supplier: ABC Manufacturing • USD 125,000</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">New supplier onboarded</p>
                  <p className="text-xs text-muted-foreground">XYZ Logistics Ltd • Program: Payables Finance</p>
                  <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Payment initiated</p>
                  <p className="text-xs text-muted-foreground">Invoice INV-2024-098 • USD 87,500</p>
                  <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Early payment discount applied</p>
                  <p className="text-xs text-muted-foreground">Supplier: Global Parts Co • Saved USD 2,450</p>
                  <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
        <Sheet open={aiInsightsOpen} onOpenChange={setAiInsightsOpen}>
          <SheetTrigger asChild>
            <Button size="lg" className="rounded-full shadow-lg hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 mr-2" />
              AI Insights
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Insights Panel
              </SheetTitle>
              <SheetDescription>
                Predictive financing recommendations and early payment opportunities
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Financing Need Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-background rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-sm">ABC Manufacturing</p>
                      <Badge variant="outline" className="text-xs">High Priority</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Predicted financing need in 7 days</p>
                    <p className="text-lg font-bold text-foreground">USD 250,000</p>
                    <p className="text-xs text-muted-foreground mt-1">Based on historical patterns and upcoming orders</p>
                  </div>
                  <div className="p-3 bg-background rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-sm">XYZ Logistics Ltd</p>
                      <Badge variant="outline" className="text-xs">Medium</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Predicted financing need in 14 days</p>
                    <p className="text-lg font-bold text-foreground">USD 180,000</p>
                    <p className="text-xs text-muted-foreground mt-1">Seasonal demand increase detected</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Early Payment Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-background rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-sm">Invoice INV-2024-156</p>
                      <Badge className="text-xs bg-green-600">Save 2.5%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Due in 30 days • Global Parts Co</p>
                    <p className="text-lg font-bold text-foreground">USD 85,000</p>
                    <p className="text-xs text-green-600 mt-1">Potential savings: USD 2,125</p>
                  </div>
                  <div className="p-3 bg-background rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-sm">Invoice INV-2024-163</p>
                      <Badge className="text-xs bg-green-600">Save 2.0%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Due in 45 days • Tech Supplies Inc</p>
                    <p className="text-lg font-bold text-foreground">USD 120,000</p>
                    <p className="text-xs text-green-600 mt-1">Potential savings: USD 2,400</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SheetContent>
        </Sheet>

        <Sheet open={esgTrackerOpen} onOpenChange={setEsgTrackerOpen}>
          <SheetTrigger asChild>
            <Button size="lg" variant="outline" className="rounded-full shadow-lg hover:scale-105 transition-transform border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
              <Leaf className="h-5 w-5 mr-2" />
              ESG Tracker
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                ESG Impact Tracker
              </SheetTitle>
              <SheetDescription>
                Sustainable supplier financing and environmental impact metrics
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <Card className="border-green-600/20 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="text-base">Overall ESG Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-green-600">87</span>
                    <span className="text-muted-foreground mb-2">/100</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your supply chain finance portfolio has strong ESG performance
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Sustainable Supplier Financing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Green-certified suppliers</span>
                    <span className="text-lg font-bold text-green-600">68%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Renewable energy usage</span>
                    <span className="text-lg font-bold text-green-600">72%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Carbon-neutral logistics</span>
                    <span className="text-lg font-bold text-green-600">45%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top Sustainable Suppliers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-sm">EcoTech Solutions</p>
                      <Badge className="text-xs bg-green-600">ESG: 95</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">USD 2.8M financed • 100% renewable energy</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-sm">Green Manufacturing Ltd</p>
                      <Badge className="text-xs bg-green-600">ESG: 92</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">USD 1.5M financed • Carbon-neutral certified</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-sm">Sustainable Logistics Co</p>
                      <Badge className="text-xs bg-green-600">ESG: 89</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">USD 980K financed • Zero-emission fleet</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SheetContent>
        </Sheet>

        <Sheet open={marketplaceOpen} onOpenChange={setMarketplaceOpen}>
          <SheetTrigger asChild>
            <Button size="lg" variant="outline" className="rounded-full shadow-lg hover:scale-105 transition-transform">
              <Building2 className="h-5 w-5 mr-2" />
              Marketplace
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Multi-Financier Marketplace
              </SheetTitle>
              <SheetDescription>
                Compare available financing offers from banks and NBFCs
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Financier Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Financiers</SelectItem>
                    <SelectItem value="banks">Banks</SelectItem>
                    <SelectItem value="nbfc">NBFCs</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="rate">
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rate">Best Rate</SelectItem>
                    <SelectItem value="amount">Max Amount</SelectItem>
                    <SelectItem value="tenure">Tenure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card className="border-primary/30">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">HDFC Bank</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">Tier 1 Bank</p>
                    </div>
                    <Badge className="bg-blue-600">Recommended</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Interest Rate</p>
                      <p className="text-lg font-bold text-green-600">8.5% p.a.</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Max Amount</p>
                      <p className="text-lg font-bold">USD 10M</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tenure</p>
                      <p className="text-sm font-medium">Up to 180 days</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Processing</p>
                      <p className="text-sm font-medium">24-48 hours</p>
                    </div>
                  </div>
                  <Button className="w-full" size="sm">Apply Now</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">ICICI Bank</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">Tier 1 Bank</p>
                    </div>
                    <Badge variant="outline">Featured</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Interest Rate</p>
                      <p className="text-lg font-bold text-green-600">8.75% p.a.</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Max Amount</p>
                      <p className="text-lg font-bold">USD 8M</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tenure</p>
                      <p className="text-sm font-medium">Up to 120 days</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Processing</p>
                      <p className="text-sm font-medium">48 hours</p>
                    </div>
                  </div>
                  <Button className="w-full" size="sm" variant="outline">View Details</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">Tata Capital NBFC</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">Leading NBFC</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Interest Rate</p>
                      <p className="text-lg font-bold text-green-600">9.25% p.a.</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Max Amount</p>
                      <p className="text-lg font-bold">USD 5M</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tenure</p>
                      <p className="text-sm font-medium">Up to 90 days</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Processing</p>
                      <p className="text-sm font-medium">12-24 hours</p>
                    </div>
                  </div>
                  <Button className="w-full" size="sm" variant="outline">View Details</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">Bajaj Finserv NBFC</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">Leading NBFC</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Interest Rate</p>
                      <p className="text-lg font-bold text-green-600">9.5% p.a.</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Max Amount</p>
                      <p className="text-lg font-bold">USD 3M</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tenure</p>
                      <p className="text-sm font-medium">Up to 60 days</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Processing</p>
                      <p className="text-sm font-medium">6-12 hours</p>
                    </div>
                  </div>
                  <Button className="w-full" size="sm" variant="outline">View Details</Button>
                </CardContent>
              </Card>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default SCFDashboard;
