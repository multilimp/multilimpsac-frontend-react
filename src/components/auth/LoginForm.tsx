
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/layout/Logo";
import { useAuthStore } from "@/store/authStore";
import { Eye, EyeOff, User, Lock } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore(state => state.login);
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
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: error instanceof Error ? error.message : "Ocurrió un error",
      });
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
          <div className="text-center mt-6 p-4 bg-gray-50/80 rounded-lg border border-gray-100">
            <p className="text-sm font-semibold text-gray-700 mb-2">Credenciales de demostración:</p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-600">
              <div className="text-right font-medium">Admin:</div>
              <div>admin@multilimp.com / admin123</div>
              <div className="text-right font-medium">Usuario:</div>
              <div>usuario@multilimp.com / user123</div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
