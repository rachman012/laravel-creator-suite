import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmployeeCard } from "@/components/EmployeeCard";
import { EmployeeForm } from "@/components/EmployeeForm";
import { StatsCard } from "@/components/StatsCard";
import { Users, UserPlus, Search, Building2, UserCheck, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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

interface Employee {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  hire_date: string;
  salary?: number;
  status: string;
  avatar_url?: string;
  address?: string;
}

const Index = () => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  const departments = Array.from(new Set(employees.map((e) => e.department)));

  const stats = {
    total: employees.length,
    active: employees.filter((e) => e.status === "active").length,
    inactive: employees.filter((e) => e.status === "inactive").length,
    departments: departments.length,
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchQuery, departmentFilter, statusFilter]);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Gagal memuat data karyawan.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = [...employees];

    if (searchQuery) {
      filtered = filtered.filter(
        (emp) =>
          emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.position.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter((emp) => emp.department === departmentFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((emp) => emp.status === statusFilter);
    }

    setFilteredEmployees(filtered);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setEmployeeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      const { error } = await supabase.from("employees").delete().eq("id", employeeToDelete);

      if (error) throw error;

      toast({
        title: "Berhasil!",
        description: "Karyawan berhasil dihapus.",
      });

      fetchEmployees();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Gagal menghapus karyawan.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleAddNew = () => {
    setSelectedEmployee(null);
    setFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 animate-fade-in">Sistem Manajemen Karyawan</h1>
          <p className="text-primary-foreground/90 animate-fade-in">
            Kelola data karyawan dengan mudah dan efisien
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Karyawan" value={stats.total} icon={Users} gradient />
          <StatsCard title="Karyawan Aktif" value={stats.active} icon={UserCheck} />
          <StatsCard title="Tidak Aktif" value={stats.inactive} icon={UserX} />
          <StatsCard title="Departemen" value={stats.departments} icon={Building2} />
        </div>

        {/* Filters & Actions */}
        <div className="bg-card rounded-lg p-6 shadow-[var(--shadow-card)] mb-8 animate-fade-in">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari karyawan (nama, email, posisi)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Departemen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Departemen</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleAddNew} className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90">
              <UserPlus className="w-4 h-4" />
              Tambah Karyawan
            </Button>
          </div>
        </div>

        {/* Employee List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg shadow-[var(--shadow-card)]">
            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchQuery || departmentFilter !== "all" || statusFilter !== "all"
                ? "Tidak ada karyawan yang sesuai dengan filter."
                : "Belum ada data karyawan. Klik tombol 'Tambah Karyawan' untuk memulai."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Employee Form Dialog */}
      <EmployeeForm
        open={formOpen}
        onOpenChange={setFormOpen}
        employee={selectedEmployee}
        onSuccess={fetchEmployees}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Karyawan?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus karyawan ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
