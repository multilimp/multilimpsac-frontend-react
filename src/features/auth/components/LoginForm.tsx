
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { EmailInput } from './login/EmailInput';
import { PasswordInput } from './login/PasswordInput';
import { SubmitButton } from './login/SubmitButton';
import Logo from '@/components/layout/Logo';

const formSchema = z.object({
  email: z.string().email('Ingrese un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const LoginForm: React.FC = () => {
  const { login, isLoading, connectionStatus, isDemoMode, enableDemoMode } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await login(values.email, values.password);
  };

  return (
    <Card className="w-full max-w-md shadow-md">
      {/* <div className="bg-multilimp-green p-6 rounded-lg mx-auto flex flex-col items-center justify-center 
                     shadow-lg ring-1 ring-black/5">
        <Logo />
      </div> */}
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Bienvenido</CardTitle>
        <CardDescription className="text-center">
          Ingrese sus credenciales para acceder al sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <EmailInput form={form as any} />
            <PasswordInput form={form as any} />
            
            <div className="pt-2">
              <SubmitButton isLoading={isLoading} />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
