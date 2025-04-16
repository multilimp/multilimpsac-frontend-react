
import { z } from "zod";

// Form validation schema
export const quotationFormSchema = z.object({
  clientId: z.string({
    required_error: "Debe seleccionar un cliente",
  }),
  contactId: z.string().optional(),
  date: z.string({
    required_error: "Debe ingresar una fecha",
  }),
  expiryDate: z.string({
    required_error: "Debe ingresar una fecha de vencimiento",
  }),
  items: z.array(
    z.object({
      id: z.string().optional(),
      code: z.string().optional(),
      productName: z.string().min(1, "Nombre del producto es requerido"),
      description: z.string().optional(),
      unitMeasure: z.string().optional(),
      quantity: z.coerce.number().min(1, "Cantidad debe ser mayor a 0"),
      unitPrice: z.coerce.number().min(0, "Precio debe ser mayor o igual a 0"),
    })
  ).min(1, "Debe agregar al menos un ítem"),
  paymentType: z.string().optional(),
  paymentNote: z.string().optional(),
  orderNote: z.string().optional(),
  deliveryAddress: z.string().optional(),
  deliveryDistrict: z.string().optional(),
  deliveryProvince: z.string().optional(),
  deliveryDepartment: z.string().optional(),
  deliveryReference: z.string().optional(),
  status: z.string().default("draft"),
});

export type QuotationFormValues = z.infer<typeof quotationFormSchema>;
