
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  showAddButton?: boolean;
  addButtonText?: string;
  onAddClick?: () => void;
  backButton?: {
    label: string;
    onClick: () => void;
  };
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  description,
  showAddButton = false,
  addButtonText = "Agregar",
  onAddClick,
  backButton,
  actions,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      {backButton && (
        <Button 
          variant="ghost" 
          className="w-fit flex items-center gap-1 -ml-2 mb-2" 
          onClick={backButton.onClick}
        >
          <ArrowLeft className="h-4 w-4" />
          {backButton.label}
        </Button>
      )}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          {subtitle && !description && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          {actions}
          {showAddButton && (
            <Button
              onClick={onAddClick}
              className="mt-4 md:mt-0"
            >
              <Plus className="mr-2 h-4 w-4" />
              {addButtonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
