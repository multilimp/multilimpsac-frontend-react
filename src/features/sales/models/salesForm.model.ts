
import { z } from "zod";

export const salesFormSchema = z.object({
  empresaId: z.string({
    required_error: "Debe seleccionar una empresa",
  }),
  clienteId: z.string({
    required_error: "Debe seleccionar un cliente",
  }),
  contactoClienteId: z.string().optional(),
  catalogoEmpresaId: z.string({
    required_error: "Debe seleccionar un catálogo",
  }),
  direccionEntrega: z.string().optional(),
  distritoEntrega: z.string().optional(),
  provinciaEntrega: z.string().optional(),
  departamentoEntrega: z.string().optional(),
  referenciaEntrega: z.string().optional(),
  fechaFormalizacion: z.string({
    required_error: "Debe ingresar una fecha de formalización",
  }),
  fechaMaxFormalizacion: z.string({
    required_error: "Debe ingresar una fecha máxima de formalización",
  }),
  montoTotal: z.coerce.number().min(0, "El monto debe ser mayor a 0"),
  etapaSiaf: z.string().optional(),
  numeroSiaf: z.string().optional(),
});

export type SalesFormValues = z.infer<typeof salesFormSchema>;
