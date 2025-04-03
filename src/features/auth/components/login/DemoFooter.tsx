
import React from "react";
import { Button } from "@/components/ui/button";

interface DemoFooterProps {
  onUseDemo: () => void;
}

export const DemoFooter: React.FC<DemoFooterProps> = ({ onUseDemo }) => {
  return (
    <div className="mt-6 text-center">
      <div className="text-sm text-gray-500 mb-2">
        ¿Quiere explorar la aplicación sin crear una cuenta?
      </div>
      <Button 
        variant="outline" 
        className="w-full border-dashed border-gray-300 text-gray-600"
        onClick={onUseDemo}
      >
        Usar modo demostración
      </Button>
    </div>
  );
};
