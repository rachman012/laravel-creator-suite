import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Calendar, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Employee {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  hire_date: string;
  status: string;
  avatar_url?: string;
  address?: string;
}

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export const EmployeeCard = ({ employee, onEdit, onDelete }: EmployeeCardProps) => {
  const statusColors = {
    active: "bg-accent text-accent-foreground",
    inactive: "bg-muted text-muted-foreground",
    on_leave: "bg-primary/20 text-primary",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="p-6 hover:shadow-[var(--shadow-elevated)] transition-all duration-300 animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-lg shadow-md">
          {employee.avatar_url ? (
            <img
              src={employee.avatar_url}
              alt={employee.full_name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(employee.full_name)
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-lg text-foreground truncate">
                {employee.full_name}
              </h3>
              <p className="text-sm text-muted-foreground">{employee.position}</p>
            </div>
            <Badge className={statusColors[employee.status as keyof typeof statusColors]}>
              {employee.status.replace("_", " ")}
            </Badge>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4 text-primary" />
              <span className="truncate">{employee.email}</span>
            </div>
            
            {employee.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span>{employee.phone}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Joined {format(new Date(employee.hire_date), "MMM dd, yyyy")}</span>
            </div>
            
            {employee.address && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="truncate">{employee.address}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Badge variant="secondary">{employee.department}</Badge>
            <div className="flex-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(employee)}
              className="gap-1"
            >
              <Edit className="w-3 h-3" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(employee.id)}
              className="gap-1 hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
