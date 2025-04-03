
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface EmailInputProps {
  email: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmailInput = ({ email, onChange }: EmailInputProps) => {
  return (
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
          onChange={onChange}
          className="pl-10 border-multilimp-green/30 focus:border-multilimp-green focus-visible:ring-multilimp-green/20"
          required
        />
      </div>
    </div>
  );
};

export default EmailInput;
