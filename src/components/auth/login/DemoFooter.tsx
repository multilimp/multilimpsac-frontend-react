
import React from "react";
import { CardFooter } from "@/components/ui/card";

interface DemoFooterProps {
  isActive: boolean;
}

const DemoFooter = ({ isActive }: DemoFooterProps) => {
  if (!isActive) return null;
  
  return (
    <CardFooter className="flex flex-col items-center justify-center pt-0">
      <p className="text-xs text-gray-500 mt-4 text-center">
        <span className="font-semibold">Modo demo:</span> La autenticación está desactivada temporalmente.
        <br />
        Se mantiene la conexión a Supabase para otras funcionalidades.
      </p>
    </CardFooter>
  );
};

export default DemoFooter;
