
import React from "react";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface EmailInputProps {
  form: UseFormReturn<{ email: string, password: string }, any>;
  autoFocus?: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({ form, autoFocus = true }) => {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Correo electrónico</FormLabel>
          <FormControl>
            <Input
              type="email"
              placeholder="correo@ejemplo.com"
              autoFocus={autoFocus}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
