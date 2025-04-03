
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/layout/Logo";
import { useAuth, DEMO_MODE } from '@/features/auth';
import { 
  EmailInput, 
  PasswordInput, 
  SubmitButton, 
  DemoFooter,
  DemoModeAlert,
  ConnectionStatusAlert
} from "@/features/auth/components/login";

const LoginForm = () => {
  const [email, setEmail] = useState(DEMO_MODE ? "demo@multilimpsac.com" : "");
  const [password, setPassword] = useState(DEMO_MODE ? "demo123" : "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, connectionStatus } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al sistema ERP de Multilimp",
      });
      navigate("/");
    } catch (error) {
      console.error("Error de login:", error);
      // El mensaje de error ya se muestra en el contexto de autenticación
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="space-y-1 flex flex-col items-center">
        <div className="mb-6 mt-2">
          <Logo />
        </div>
        <CardTitle className="text-2xl font-bold text-center text-multilimp-navy">Iniciar sesión</CardTitle>
        <CardDescription className="text-center text-multilimp-navy/70">
          Acceda al Sistema ERP de Multilimp
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DemoModeAlert isActive={DEMO_MODE} />
        <ConnectionStatusAlert status={connectionStatus} />
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <EmailInput 
            email={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
          
          <PasswordInput 
            password={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <SubmitButton isSubmitting={isSubmitting} />
        </form>
      </CardContent>
      
      <DemoFooter isActive={DEMO_MODE} />
    </Card>
  );
};

export default LoginForm;
