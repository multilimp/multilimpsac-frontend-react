
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company } from "../models/company.model";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

// Schema for company form validation
const companySchema = z.object({
  name: z.string().min(1, { message: "El nombre de la empresa es requerido" }),
  ruc: z.string().min(11, { message: "El RUC debe tener 11 dígitos" }).max(11),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: "Email inválido" }).optional().or(z.literal('')),
  contact: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  web: z.string().optional().or(z.literal('')),
  direcciones: z.string().optional().or(z.literal('')),
  cod_unidad: z.string().optional().or(z.literal('')),
  departamento: z.string().optional().or(z.literal('')),
  provincia: z.string().optional().or(z.literal('')),
  distrito: z.string().optional().or(z.literal(''))
});

export type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyFormProps {
  data: Partial<Company>;
  onChange: (field: string, value: any) => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ data, onChange }) => {
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: data.name || '',
      ruc: data.ruc || '',
      address: data.address || '',
      phone: data.phone || '',
      email: data.email || '',
      contact: data.contact || '',
      status: data.status || 'active',
      web: data.web || '',
      direcciones: data.direcciones || '',
      cod_unidad: data.cod_unidad || '',
      departamento: data.departamento || '',
      provincia: data.provincia || '',
      distrito: data.distrito || ''
    }
  });

  return (
    <Form {...form}>
      <form className="space-y-4 py-4">
        <BasicInfoSection form={form} onChange={onChange} />
        <ContactInfoSection form={form} onChange={onChange} />
        <WebAndContactSection form={form} onChange={onChange} />
        <LocationInfoSection form={form} onChange={onChange} />
        <AddressSection form={form} onChange={onChange} />
        <StatusToggle form={form} onChange={onChange} />
      </form>
    </Form>
  );
};

// Sub-components to organize the form
const BasicInfoSection: React.FC<{
  form: any;
  onChange: (field: string, value: any) => void;
}> = ({ form, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Razón Social*</FormLabel>
          <FormControl>
            <Input
              {...field}
              onChange={(e) => {
                field.onChange(e);
                onChange('name', e.target.value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    
    <FormField
      control={form.control}
      name="ruc"
      render={({ field }) => (
        <FormItem>
          <FormLabel>RUC*</FormLabel>
          <FormControl>
            <Input
              {...field}
              onChange={(e) => {
                field.onChange(e);
                onChange('ruc', e.target.value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

const ContactInfoSection: React.FC<{
  form: any;
  onChange: (field: string, value: any) => void;
}> = ({ form, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              {...field}
              onChange={(e) => {
                field.onChange(e);
                onChange('email', e.target.value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    
    <FormField
      control={form.control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Teléfono</FormLabel>
          <FormControl>
            <Input
              {...field}
              onChange={(e) => {
                field.onChange(e);
                onChange('phone', e.target.value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

const WebAndContactSection: React.FC<{
  form: any;
  onChange: (field: string, value: any) => void;
}> = ({ form, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField
      control={form.control}
      name="web"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Sitio Web</FormLabel>
          <FormControl>
            <Input
              {...field}
              onChange={(e) => {
                field.onChange(e);
                onChange('web', e.target.value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    
    <FormField
      control={form.control}
      name="contact"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Persona de Contacto</FormLabel>
          <FormControl>
            <Input
              {...field}
              onChange={(e) => {
                field.onChange(e);
                onChange('contact', e.target.value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

const LocationInfoSection: React.FC<{
  form: any;
  onChange: (field: string, value: any) => void;
}> = ({ form, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <FormField
      control={form.control}
      name="departamento"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Departamento</FormLabel>
          <FormControl>
            <Input
              {...field}
              onChange={(e) => {
                field.onChange(e);
                onChange('departamento', e.target.value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    
    <FormField
      control={form.control}
      name="provincia"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Provincia</FormLabel>
          <FormControl>
            <Input
              {...field}
              onChange={(e) => {
                field.onChange(e);
                onChange('provincia', e.target.value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="distrito"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Distrito</FormLabel>
          <FormControl>
            <Input
              {...field}
              onChange={(e) => {
                field.onChange(e);
                onChange('distrito', e.target.value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

const AddressSection: React.FC<{
  form: any;
  onChange: (field: string, value: any) => void;
}> = ({ form, onChange }) => (
  <>
    <FormField
      control={form.control}
      name="address"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Dirección</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              onChange={(e) => {
                field.onChange(e);
                onChange('address', e.target.value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="direcciones"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Direcciones Adicionales</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              onChange={(e) => {
                field.onChange(e);
                onChange('direcciones', e.target.value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
);

const StatusToggle: React.FC<{
  form: any;
  onChange: (field: string, value: any) => void;
}> = ({ form, onChange }) => (
  <FormField
    control={form.control}
    name="status"
    render={({ field }) => (
      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
        <div className="space-y-0.5">
          <FormLabel>Estado</FormLabel>
        </div>
        <FormControl>
          <Switch
            checked={field.value === "active"}
            onCheckedChange={(checked) => {
              const value = checked ? "active" : "inactive";
              field.onChange(value);
              onChange('status', value);
            }}
          />
        </FormControl>
      </FormItem>
    )}
  />
);

export default CompanyForm;
