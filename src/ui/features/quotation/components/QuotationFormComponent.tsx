
import React, { useState } from "react";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuotationForm } from "@/features/quotation/hooks/useQuotationForm";
import QuotationClientSection from "@/features/quotation/components/form/QuotationClientSection";
import QuotationItemsSection from "@/features/quotation/components/form/QuotationItemsSection";
import QuotationDeliverySection from "@/features/quotation/components/form/QuotationDeliverySection";
import QuotationPaymentSection from "@/features/quotation/components/form/QuotationPaymentSection";
import QuotationSummarySection from "@/features/quotation/components/form/QuotationSummarySection";
import { QuotationFormFooter } from "@/features/quotation/components/form/QuotationFormFooter";

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
  const [activeTab, setActiveTab] = useState("client");
  const { form, isSubmitting, onSubmit } = useQuotationForm(quotationId, onSuccess);

  const setFormStatus = (status: "draft" | "sent") => {
    form.setValue("status", status);
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
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
          
          <CardFooter>
            <QuotationFormFooter 
              isSubmitting={isSubmitting}
              quotationId={quotationId}
              onCancel={onCancel}
              setFormStatus={setFormStatus}
            />
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default QuotationFormComponent;
