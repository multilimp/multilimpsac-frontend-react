import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/layout/Logo";
import { Eye, EyeOff, User, Lock, Info } from "lucide-react";
import { useAuth, DEMO_MODE } from '@/features/auth';
import { Alert, AlertDescription } from "@/components/ui/alert";

const LoginForm = () => {
  const [email, setEmail] = useState(DEMO_MODE ? "demo@multilimpsac.com" : "");
  const [password, setPassword] = useState(DEMO_MODE ? "demo123" : "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        {DEMO_MODE && (
          <Alert className="mb-4 bg-blue-50 border-blue-200 text-blue-800">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm">
              Modo demo activado. Use las credenciales pre-llenadas para ingresar.
            </AlertDescription>
          </Alert>
        )}
        
        {connectionStatus === 'disconnected' && (
          <Alert className="mb-4 bg-amber-50 border-amber-200 text-amber-800">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm">
              No hay conexión con el servidor. Se usará el modo demo para iniciar sesión.
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-multilimp-navy">Correo electrónico</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-multilimp-green">
                <User size={18} />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@multilimp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 border-multilimp-green/30 focus:border-multilimp-green focus-visible:ring-multilimp-green/20"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-multilimp-navy">Contraseña</Label>
              <Button variant="link" className="p-0 h-auto text-xs text-multilimp-green" type="button">
                ¿Olvidó su contraseña?
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-multilimp-green">
                <Lock size={18} />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 border-multilimp-green/30 focus:border-multilimp-green focus-visible:ring-multilimp-green/20"
                required
              />
              <Button
                type="button"
                variant="ghost"
                className="absolute inset-y-0 right-0 px-3 flex items-center text-multilimp-green hover:text-multilimp-green-dark"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-multilimp-green hover:bg-multilimp-green-dark transition-all duration-300 mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>
      </CardContent>
      
      {DEMO_MODE && (
        <CardFooter className="flex flex-col items-center justify-center pt-0">
          <p className="text-xs text-gray-500 mt-4 text-center">
            <span className="font-semibold">Modo demo:</span> La autenticación está desactivada temporalmente.
            <br />
            Se mantiene la conexión a Supabase para otras funcionalidades.
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default LoginForm;
