
import * as z from "zod";

// Form validation schema
export const quotationFormSchema = z.object({
  clientId: z.string({
    required_error: "Por favor seleccione un cliente",
  }),
  date: z.string({
    required_error: "Por favor ingrese una fecha",
  }),
  expiryDate: z.string({
    required_error: "Por favor ingrese una fecha de expiración",
  }),
  items: z.array(z.object({
    productName: z.string().min(1, "El nombre del producto es requerido"),
    description: z.string().optional(),
    quantity: z.coerce.number().min(1, "La cantidad debe ser mayor que 0"),
    unitPrice: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
  })).min(1, "Debe agregar al menos un ítem"),
  notes: z.string().optional(),
});

export type QuotationFormValues = z.infer<typeof quotationFormSchema>;

// Mock clients for the dropdown - ensuring status is 'active' or 'inactive' to match Client type
export const mockClients = [
  { id: "1", name: "Empresa ABC", ruc: "12345678901", unitCode: "ABC001", status: "active" as const, address: "Av. Principal 123", email: "contacto@abc.com", contactPerson: "Juan Pérez", active: true, createdAt: "2023-01-01" },
  { id: "2", name: "Empresa XYZ", ruc: "23456789012", unitCode: "XYZ002", status: "active" as const, address: "Calle Secundaria 456", email: "contacto@xyz.com", contactPerson: "María García", active: true, createdAt: "2023-02-15" },
  { id: "3", name: "Corporación DEF", ruc: "34567890123", unitCode: "DEF003", status: "active" as const, address: "Jr. Comercial 789", email: "contacto@def.com", contactPerson: "Carlos López", active: true, createdAt: "2023-03-20" }
];
