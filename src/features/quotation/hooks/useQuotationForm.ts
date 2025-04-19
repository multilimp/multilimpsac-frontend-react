
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { quotationFormSchema, QuotationFormValues } from "../models/quotationForm.model";
import { quotationService } from "../services/quotationFormService";

export const useQuotationForm = (
  quotationId?: string,
  onSuccess?: () => void,
) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: quotationService.getEmptyQuotationForm(),
  });

  // Reset contact when client changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'clientId') {
        form.setValue('contactId', ''); // Reset contact when client changes
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Load quotation data if editing
  useEffect(() => {
    const loadQuotation = async () => {
      if (!quotationId) return;
      
      try {
        const quotation = await quotationService.getQuotationById(quotationId);
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
            code: item.code,
            unitMeasure: item.unitMeasure
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
      
      onSuccess?.();
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

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit)
  };
};
