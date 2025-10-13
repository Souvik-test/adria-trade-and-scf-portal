import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Eye, Pencil, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ProgramFormDialog } from "./ProgramFormDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProgramConfig {
  id: string;
  program_id: string;
  program_name: string;
  product_code: string;
  anchor_name: string;
  program_limit: number;
  available_limit: number;
  effective_date: string;
  expiry_date: string;
  program_currency: string;
  status: string;
}

interface SCFProgramConfigurationProps {
  onBack: () => void;
  initialMode?: "add";
  selectedProductCode?: string;
}

export const SCFProgramConfiguration = ({ onBack, initialMode, selectedProductCode }: SCFProgramConfigurationProps) => {
  const [programs, setPrograms] = useState<ProgramConfig[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | "view" | "delete">("add");
  const [selectedProgram, setSelectedProgram] = useState<ProgramConfig | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  // Auto-open dialog in add mode if navigating from Product Definition
  useEffect(() => {
    if (initialMode === "add") {
      handleAdd();
    }
  }, [initialMode]);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from("scf_program_configurations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error("Error fetching programs:", error);
      toast({
        title: "Error",
        description: "Failed to load program configurations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedProgram(null);
    setDialogMode("add");
    setDialogOpen(true);
  };

  const handleView = (program: ProgramConfig) => {
    setSelectedProgram(program);
    setDialogMode("view");
    setDialogOpen(true);
  };

  const handleEdit = (program: ProgramConfig) => {
    setSelectedProgram(program);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleDeleteClick = (programId: string) => {
    setProgramToDelete(programId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!programToDelete) return;

    try {
      const { error } = await supabase
        .from("scf_program_configurations")
        .delete()
        .eq("id", programToDelete);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Program deleted successfully",
      });
      fetchPrograms();
    } catch (error) {
      console.error("Error deleting program:", error);
      toast({
        title: "Error",
        description: "Failed to delete program",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setProgramToDelete(null);
    }
  };

  const handleSuccess = () => {
    fetchPrograms();
    setDialogOpen(false);
  };

  const filteredPrograms = programs.filter(
    (program) =>
      program.program_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.program_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.product_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.anchor_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Program Configuration</h1>
            <p className="text-muted-foreground mt-1">
              Manage SCF program configurations and parameters
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack}>
              Back to Dashboard
            </Button>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Program
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by program name, ID, product code, or anchor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program ID</TableHead>
                <TableHead>Program Name</TableHead>
                <TableHead>Product Code</TableHead>
                <TableHead>Anchor Name</TableHead>
                <TableHead>Program Limit</TableHead>
                <TableHead>Available Limit</TableHead>
                <TableHead>Effective Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredPrograms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No programs found. Click "Add Program" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPrograms.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.program_id}</TableCell>
                    <TableCell>{program.program_name}</TableCell>
                    <TableCell>{program.product_code}</TableCell>
                    <TableCell>{program.anchor_name}</TableCell>
                    <TableCell>
                      {program.program_currency} {program.program_limit.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {program.program_currency} {program.available_limit.toLocaleString()}
                    </TableCell>
                    <TableCell>{new Date(program.effective_date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(program.expiry_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={program.status === "active" ? "default" : "secondary"}>
                        {program.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(program)}
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(program)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(program.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Form Dialog */}
      <ProgramFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        program={selectedProgram}
        onSuccess={handleSuccess}
        selectedProductCode={selectedProductCode}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this program configuration? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
