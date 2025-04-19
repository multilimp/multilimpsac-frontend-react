
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Save, FilePlus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { QuotationFormValues } from "../../models/quotationForm.model";

interface QuotationFormFooterProps {
  isSubmitting: boolean;
  quotationId?: string;
  onCancel: () => void;
  setFormStatus: (status: "draft" | "sent") => void;
  form: UseFormReturn<QuotationFormValues>;
}

export const QuotationFormFooter: React.FC<QuotationFormFooterProps> = ({
  isSubmitting,
  quotationId,
  onCancel,
  setFormStatus,
  form
}) => {
  return (
    <div className="flex justify-between">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <div className="flex gap-2">
        {!quotationId && (
          <Button 
            type="submit" 
            disabled={isSubmitting}
            onClick={() => setFormStatus("draft")}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FilePlus className="mr-2 h-4 w-4" />
            )}
            Guardar como Borrador
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={isSubmitting}
          onClick={() => setFormStatus(quotationId ? form.getValues().status : "sent")}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {quotationId ? "Actualizar" : "Crear y Enviar"}
        </Button>
      </div>
    </div>
  );
};
