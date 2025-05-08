export interface QuoteProps {
  id: string | number;
  quoteNumber: string;           // Código cotización
  ruc: string;                   // RUC cliente
  razonSocial: string;           // Razón social cliente
  departamento: string;          // Departamento
  plazaEntrega: string;          // Plaza de Entrega
  date: string;                  // Fecha cotización
  status: 'draft' | 'sent' | 'approved' | 'rejected'; // Estado
  total: number;                 // Monto
}
