
import React from "react";
import { Quotation } from "@/data/models/quotation";
import { useToast } from "@/hooks/use-toast";
import { updateQuotationStatus } from "@/data/services/quotationService";

interface QuotationActionsProps {
  quotation: Quotation;
  onStatusChange: (quotation: Quotation, newStatus: Quotation['status']) => Promise<void>;
}

const QuotationActions: React.FC<QuotationActionsProps> = ({ quotation, onStatusChange }) => {
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: Quotation['status']) => {
    try {
      await onStatusChange(quotation, newStatus);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al actualizar estado",
        description: error instanceof Error ? error.message : "Ocurrió un error al actualizar el estado",
      });
    }
  };

  // Additional actions can be added here

  return (
    <div className="flex flex-wrap gap-2">
      {/* Status change actions can be placed here if needed */}
    </div>
  );
};

export default QuotationActions;
