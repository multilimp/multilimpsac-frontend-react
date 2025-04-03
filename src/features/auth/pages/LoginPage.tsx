
import React from "react";
import { LoginForm } from "@/features/auth/components/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Columna de imagen */}
      <div className="hidden lg:flex lg:w-1/2 bg-multilimp-green relative overflow-hidden">
        <div className="absolute inset-0 bg-[rgba(71,168,130,0.85)]"></div>
        <img 
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
          alt="Gestión de productos de limpieza" 
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-50"
        />
        <div className="absolute inset-0 bg-pattern opacity-20 z-0"></div>
        <div className="absolute bottom-10 left-10 right-10 text-multilimp-navy-dark z-10">
          <h2 className="text-3xl font-bold mb-4">Sistema ERP Multilimp</h2>
          <p className="text-lg font-semibold opacity-90">
            Gestión completa de operaciones para su empresa de limpieza
          </p>
        </div>
      </div>
      
      {/* Columna de formulario con fondo mejorado */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-0"></div>
        <div className="relative z-10 w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
