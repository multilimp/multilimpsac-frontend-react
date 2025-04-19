
import React, { useState } from "react";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuotationForm } from "@/features/quotation/hooks/useQuotationForm";
import { QuotationFormFooter } from "@/features/quotation/components/form/QuotationFormFooter";
import QuotationFormTabs from "@/features/quotation/components/form/QuotationFormTabs";

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
          
          <CardContent>
            <QuotationFormTabs 
              form={form}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </CardContent>
          
          <CardFooter>
            <QuotationFormFooter 
              isSubmitting={isSubmitting}
              quotationId={quotationId}
              onCancel={onCancel}
              setFormStatus={setFormStatus}
              form={form}
            />
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default QuotationFormComponent;
