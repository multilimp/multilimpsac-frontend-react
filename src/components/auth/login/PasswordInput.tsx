
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordInputProps {
  password: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput = ({ password, onChange }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
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
          onChange={onChange}
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
  );
};

export default PasswordInput;
