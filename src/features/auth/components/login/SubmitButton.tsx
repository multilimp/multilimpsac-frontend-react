
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
  label?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  isLoading, 
  label = "Iniciar sesión" 
}) => {
  return (
    <Button 
      type="submit" 
      className="w-full" 
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Iniciando sesión...
        </>
      ) : (
        label
      )}
    </Button>
  );
};
