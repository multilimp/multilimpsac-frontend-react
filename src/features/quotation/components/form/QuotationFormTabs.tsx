
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuotationFormValues } from "../../../processes/quotation/models/quotationForm.model";
import QuotationClientSection from "./QuotationClientSection";
import QuotationItemsSection from "./QuotationItemsSection";
import QuotationDeliverySection from "./QuotationDeliverySection";
import QuotationPaymentSection from "./QuotationPaymentSection";
import QuotationSummarySection from "./QuotationSummarySection";

interface QuotationFormTabsProps {
  form: UseFormReturn<QuotationFormValues>;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const QuotationFormTabs: React.FC<QuotationFormTabsProps> = ({
  form,
  activeTab,
  onTabChange
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
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
    </Tabs>
  );
};

export default QuotationFormTabs;
