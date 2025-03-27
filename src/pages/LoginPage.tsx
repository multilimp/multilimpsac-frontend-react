
import React from "react";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Columna de imagen */}
      <div className="hidden lg:flex lg:w-1/2 bg-multilimp-green relative overflow-hidden">
        <div className="absolute inset-0 bg-[rgba(71,168,130,0.85)]"></div>
        <img 
          src="/lovable-uploads/f3c433cb-2627-44da-9adf-e040b6f29cd4.png" 
          alt="Multilimp Logo" 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 object-contain z-10"
        />
        <div className="absolute inset-0 bg-pattern opacity-20 z-0"></div>
        <div className="absolute bottom-10 left-10 right-10 text-white z-10">
          <h2 className="text-3xl font-bold mb-4">Sistema ERP Multilimp</h2>
          <p className="text-lg opacity-90">
            Gestión completa de operaciones para su empresa de limpieza
          </p>
        </div>
      </div>
      
      {/* Columna de formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
