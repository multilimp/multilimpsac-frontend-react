
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { quotationFormSchema, mockClients, QuotationFormValues } from "./form/QuotationFormTypes";
import QuotationClientSection from "./form/QuotationClientSection";
import QuotationItemsSection from "./form/QuotationItemsSection";
import QuotationSummarySection from "./form/QuotationSummarySection";
import QuotationFooter from "./form/QuotationFooter";
import { Cliente } from "@/features/client/models/client.model";

interface QuotationFormProps {
  onSuccess: () => void;
}

const QuotationForm: React.FC<QuotationFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  
  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [{ productName: "", description: "", quantity: 1, unitPrice: 0 }],
      notes: "",
    },
  });
  
  const onSubmit = (data: QuotationFormValues) => {
    console.log("Form data:", data);
    toast({
      title: "Cotización creada",
      description: "La cotización ha sido creada exitosamente",
    });
    onSuccess();
  };
  
  // Calculate total based on form values
  const calculateTotal = () => {
    const items = form.watch("items");
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };
  
  // Map mockClients to match the Cliente structure with proper type casting
  const mappedClients: Cliente[] = mockClients.map(client => ({
    id: client.id,
    razonSocial: client.name,
    ruc: client.ruc,
    codUnidad: client.unitCode,
    departamento: "",
    provincia: "",
    distrito: "",
    direccion: client.address,
    estado: client.active,
    createdAt: client.createdAt
  }));
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Nueva Cotización</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Client and Dates Section */}
            <QuotationClientSection form={form} clients={mappedClients} />
            
            {/* Items Section */}
            <QuotationItemsSection form={form} />
            
            {/* Summary and Notes Section */}
            <QuotationSummarySection form={form} calculateTotal={calculateTotal} />
          </CardContent>
          <CardFooter>
            <QuotationFooter onCancel={onSuccess} />
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default QuotationForm;
