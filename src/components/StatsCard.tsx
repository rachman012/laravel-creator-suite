import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  gradient?: boolean;
}

export const StatsCard = ({ title, value, icon: Icon, trend, gradient }: StatsCardProps) => {
  return (
    <Card
      className={`p-6 transition-all duration-300 hover:shadow-[var(--shadow-elevated)] animate-fade-in ${
        gradient ? "bg-gradient-to-br from-primary to-accent text-primary-foreground" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${gradient ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
            {title}
          </p>
          <p className={`text-3xl font-bold mt-2 ${gradient ? "text-primary-foreground" : "text-foreground"}`}>
            {value}
          </p>
          {trend && (
            <p className={`text-xs mt-1 ${gradient ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
              {trend}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            gradient ? "bg-primary-foreground/20" : "bg-primary/10"
          }`}
        >
          <Icon className={`w-6 h-6 ${gradient ? "text-primary-foreground" : "text-primary"}`} />
        </div>
      </div>
    </Card>
  );
};
