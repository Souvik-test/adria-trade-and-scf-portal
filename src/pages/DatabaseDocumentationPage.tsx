import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, Database, ChevronDown, ChevronRight, ArrowLeft, Layers, TableIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DATABASE_MODULES, TABLE_SCHEMAS, getTablesByModule } from "@/utils/databaseSchema";
import { generateDatabaseDocx, generateDatabaseJSON } from "@/utils/generateDatabaseDoc";
import { toast } from "sonner";

const DatabaseDocumentationPage = () => {
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [expandedTables, setExpandedTables] = useState<string[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const toggleModule = (moduleName: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleName) 
        ? prev.filter(m => m !== moduleName)
        : [...prev, moduleName]
    );
  };

  const toggleTable = (tableName: string) => {
    setExpandedTables(prev => 
      prev.includes(tableName)
        ? prev.filter(t => t !== tableName)
        : [...prev, tableName]
    );
  };

  const handleDownloadDocx = async () => {
    setIsDownloading(true);
    try {
      await generateDatabaseDocx();
      toast.success("Documentation downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate documentation");
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadJSON = () => {
    try {
      generateDatabaseJSON();
      toast.success("JSON schema downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate JSON schema");
      console.error(error);
    }
  };

  const erdDiagram = `erDiagram
    custom_users ||--o{ user_permissions : has
    custom_users ||--o{ import_lc_requests : creates
    custom_users ||--o{ remittance_transactions : initiates
    custom_users ||--o{ notifications : receives
    
    import_lc_requests ||--o{ import_lc_supporting_documents : has
    
    export_lc_bills ||--o{ export_lc_bill_documents : has
    export_lc_bills ||--o{ export_lc_bill_line_items : contains
    
    workflow_templates ||--o{ workflow_stages : has
    workflow_stages ||--o{ workflow_stage_fields : contains
    
    scf_program_configurations ||--o{ scf_invoices : finances
    scf_invoices ||--o{ invoice_disbursements : receives
    scf_invoices ||--o{ invoice_repayments : has
    
    invoices ||--o{ invoice_line_items : contains
    invoice_upload_batches ||--o{ invoice_upload_rejections : has
    
    purchase_orders ||--o{ popi_line_items : contains
    proforma_invoices ||--o{ popi_line_items : contains
    
    outward_bg_requests ||--o{ outward_bg_supporting_documents : has
    
    inward_documentary_collection_bill_payments ||--o{ inward_dc_bill_payment_documents : has
    
    remittance_transactions ||--o{ interbank_settlements : settles`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Database className="h-6 w-6 text-primary" />
                  Database Documentation
                </h1>
                <p className="text-muted-foreground text-sm">
                  Technical schema documentation for Trade Finance Platform
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownloadJSON}>
                <FileText className="h-4 w-4 mr-2" />
                Download JSON
              </Button>
              <Button onClick={handleDownloadDocx} disabled={isDownloading}>
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? "Generating..." : "Download DOCX"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Tables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{TABLE_SCHEMAS.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{DATABASE_MODULES.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Columns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {TABLE_SCHEMAS.reduce((sum, t) => sum + t.columns.length, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Foreign Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {TABLE_SCHEMAS.reduce((sum, t) => sum + (t.foreignKeys?.length || 0), 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="modules" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="modules" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              By Module
            </TabsTrigger>
            <TabsTrigger value="tables" className="flex items-center gap-2">
              <TableIcon className="h-4 w-4" />
              All Tables
            </TabsTrigger>
            <TabsTrigger value="erd" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              ERD Diagram
            </TabsTrigger>
          </TabsList>

          {/* By Module Tab */}
          <TabsContent value="modules">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Module List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Modules</CardTitle>
                    <CardDescription>Click a module to view its tables</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[600px]">
                      {DATABASE_MODULES.map(module => (
                        <div
                          key={module.name}
                          className={`p-4 border-b cursor-pointer hover:bg-accent/50 transition-colors ${
                            selectedModule === module.name ? "bg-accent" : ""
                          }`}
                          onClick={() => setSelectedModule(module.name)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{module.name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {module.description}
                              </p>
                            </div>
                            <Badge variant="secondary">{module.tables.length}</Badge>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Table Details */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {selectedModule || "Select a Module"}
                    </CardTitle>
                    {selectedModule && (
                      <CardDescription>
                        {DATABASE_MODULES.find(m => m.name === selectedModule)?.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {selectedModule ? (
                      <ScrollArea className="h-[550px]">
                        <div className="space-y-4">
                          {getTablesByModule(selectedModule).map(table => (
                            <Collapsible
                              key={table.name}
                              open={expandedTables.includes(table.name)}
                              onOpenChange={() => toggleTable(table.name)}
                            >
                              <CollapsibleTrigger className="w-full">
                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                                  <div className="flex items-center gap-2">
                                    {expandedTables.includes(table.name) ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                    <TableIcon className="h-4 w-4 text-primary" />
                                    <span className="font-mono font-medium">{table.name}</span>
                                  </div>
                                  <Badge variant="outline">{table.columns.length} columns</Badge>
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="mt-2 border rounded-lg overflow-hidden">
                                  <p className="p-3 text-sm text-muted-foreground bg-muted/30">
                                    {table.description}
                                  </p>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Column</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Nullable</TableHead>
                                        <TableHead>Default</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {table.columns.map(col => (
                                        <TableRow key={col.name}>
                                          <TableCell className="font-mono text-sm">{col.name}</TableCell>
                                          <TableCell>
                                            <Badge variant="secondary" className="font-mono text-xs">
                                              {col.type}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>
                                            {col.nullable ? (
                                              <span className="text-muted-foreground">Yes</span>
                                            ) : (
                                              <span className="text-primary font-medium">No</span>
                                            )}
                                          </TableCell>
                                          <TableCell className="font-mono text-xs text-muted-foreground">
                                            {col.defaultValue || "-"}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                  {table.foreignKeys && table.foreignKeys.length > 0 && (
                                    <div className="p-3 border-t bg-muted/30">
                                      <p className="text-sm font-medium mb-2">Foreign Keys:</p>
                                      {table.foreignKeys.map((fk, idx) => (
                                        <p key={idx} className="text-sm font-mono text-muted-foreground">
                                          {fk.column} → {fk.references}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="h-[550px] flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Select a module from the left to view its tables</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* All Tables Tab */}
          <TabsContent value="tables">
            <Card>
              <CardHeader>
                <CardTitle>All Tables ({TABLE_SCHEMAS.length})</CardTitle>
                <CardDescription>Complete list of all database tables</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Table Name</TableHead>
                        <TableHead>Module</TableHead>
                        <TableHead>Columns</TableHead>
                        <TableHead>Foreign Keys</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {TABLE_SCHEMAS.map(table => (
                        <TableRow key={table.name}>
                          <TableCell className="font-mono font-medium">{table.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{table.module}</Badge>
                          </TableCell>
                          <TableCell>{table.columns.length}</TableCell>
                          <TableCell>{table.foreignKeys?.length || 0}</TableCell>
                          <TableCell className="max-w-md text-sm text-muted-foreground truncate">
                            {table.description}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ERD Tab */}
          <TabsContent value="erd">
            <Card>
              <CardHeader>
                <CardTitle>Entity Relationship Diagram</CardTitle>
                <CardDescription>
                  Visual representation of table relationships (simplified view showing key relationships)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-6 overflow-x-auto">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {erdDiagram}
                  </pre>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Note: This is a simplified ERD showing primary relationships. Download the DOCX for complete documentation with all table details.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DatabaseDocumentationPage;
