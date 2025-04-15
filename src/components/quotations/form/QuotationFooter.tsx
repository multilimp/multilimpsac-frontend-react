
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface QuotationFooterProps {
  onCancel: () => void;
}

const QuotationFooter: React.FC<QuotationFooterProps> = ({ onCancel }) => {
  return (
    <div className="flex justify-between">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit">
        <Save className="mr-2 h-4 w-4" />
        Guardar Cotización
      </Button>
    </div>
  );
};

export default QuotationFooter;
