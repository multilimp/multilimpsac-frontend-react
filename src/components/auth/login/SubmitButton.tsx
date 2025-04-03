
import React from "react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton = ({ isSubmitting }: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-multilimp-green hover:bg-multilimp-green-dark transition-all duration-300 mt-6"
      disabled={isSubmitting}
    >
      {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
    </Button>
  );
};

export default SubmitButton;
