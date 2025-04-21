
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/app/core/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: number;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-multilimp-green-dark">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend !== undefined && (
          <div className="mt-2 flex items-center">
            <div 
              className={cn(
                "rounded-full px-2 py-1 text-xs font-medium flex items-center",
                trend > 0 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              )}
            >
              <span className="mr-1">{trend > 0 ? "↑" : "↓"}</span>
              <span>{Math.abs(trend)}%</span>
            </div>
            <span className="ml-2 text-xs text-muted-foreground">desde el mes pasado</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
