
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showAddButton?: boolean;
  addButtonText?: string;
  onAddClick?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showAddButton = false,
  addButtonText = "Agregar",
  onAddClick,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-multilimp-navy-dark tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {showAddButton && (
        <Button
          onClick={onAddClick}
          className="mt-4 md:mt-0 bg-multilimp-green hover:bg-multilimp-green-dark text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          {addButtonText}
        </Button>
      )}
    </div>
  );
};

export default PageHeader;
