import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, FilePlus } from "lucide-react";
import { quotationFormSchema, QuotationFormValues } from "../../processes/quotation/models/quotationForm.model";
import { quotationService } from "../services/quotationFormService";
import QuotationClientSection from "./form/QuotationClientSection";
import QuotationItemsSection from "./form/QuotationItemsSection";
import QuotationDeliverySection from "./form/QuotationDeliverySection";
import QuotationPaymentSection from "./form/QuotationPaymentSection";
import QuotationSummarySection from "./form/QuotationSummarySection";

interface QuotationFormComponentProps {
  quotationId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const QuotationFormComponent: React.FC<QuotationFormComponentProps> = ({
  quotationId,
  onSuccess,
  onCancel,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("client");

  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: quotationService.getEmptyQuotationForm(),
  });

  // Load quotation data if editing
  React.useEffect(() => {
    const loadQuotation = async () => {
      if (!quotationId) return;
      
      try {
        const quotation = await quotationService.getQuotationById(quotationId);
        
        // Transform quotation data to form values
        const formValues: QuotationFormValues = {
          clientId: quotation.clientId,
          contactId: "", // Need to load from DB
          date: quotation.date,
          expiryDate: quotation.expiryDate,
          items: quotation.items.map(item => ({
            id: item.id,
            productName: item.productName,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          status: quotation.status,
          orderNote: quotation.notes,
          deliveryAddress: quotation.deliveryAddress,
          deliveryDistrict: quotation.deliveryDistrict,
          deliveryProvince: quotation.deliveryProvince,
          deliveryDepartment: quotation.deliveryDepartment,
          deliveryReference: quotation.deliveryReference,
          paymentNote: quotation.paymentNote,
          paymentType: quotation.paymentType
          // Other fields would be loaded from the DB
        };
        
        form.reset(formValues);
      } catch (error) {
        console.error("Error loading quotation:", error);
        toast({
          variant: "destructive",
          title: "Error al cargar cotización",
          description: "No se pudo cargar la información de la cotización.",
        });
      }
    };
    
    loadQuotation();
  }, [quotationId, form, toast]);

  const onSubmit = async (data: QuotationFormValues) => {
    setIsSubmitting(true);
    
    try {
      if (quotationId) {
        await quotationService.updateQuotation(quotationId, data);
        toast({
          title: "Cotización actualizada",
          description: "La cotización se ha actualizado correctamente.",
        });
      } else {
        await quotationService.createQuotation(data);
        toast({
          title: "Cotización creada",
          description: "La cotización se ha creado correctamente.",
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error saving quotation:", error);
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: "No se pudo guardar la cotización. Intente nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>
              {quotationId ? "Editar Cotización" : "Nueva Cotización"}
            </CardTitle>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardContent>
              <TabsList className="mb-4">
                <TabsTrigger value="client">Cliente</TabsTrigger>
                <TabsTrigger value="items">Ítems</TabsTrigger>
                <TabsTrigger value="delivery">Entrega</TabsTrigger>
                <TabsTrigger value="payment">Pago</TabsTrigger>
                <TabsTrigger value="summary">Resumen</TabsTrigger>
              </TabsList>

              <TabsContent value="client" className="mt-0">
                <QuotationClientSection form={form} />
              </TabsContent>
              
              <TabsContent value="items" className="mt-0">
                <QuotationItemsSection form={form} />
              </TabsContent>
              
              <TabsContent value="delivery" className="mt-0">
                <QuotationDeliverySection form={form} />
              </TabsContent>
              
              <TabsContent value="payment" className="mt-0">
                <QuotationPaymentSection form={form} />
              </TabsContent>
              
              <TabsContent value="summary" className="mt-0">
                <QuotationSummarySection form={form} />
              </TabsContent>
            </CardContent>
          </Tabs>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <div className="flex gap-2">
              {!quotationId && (
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  onClick={() => form.setValue("status", "draft")}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FilePlus className="mr-2 h-4 w-4" />
                  )}
                  Guardar como Borrador
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isSubmitting}
                onClick={() => form.setValue("status", quotationId ? form.getValues().status : "sent")}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {quotationId ? "Actualizar" : "Crear y Enviar"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default QuotationFormComponent;
