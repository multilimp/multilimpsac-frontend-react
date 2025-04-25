
export interface SalesFormValues {
  id?: string;
  companyId?: string;
  companyName?: string;
  clientId?: string;
  clientName?: string;
  clientRuc?: string;
  contactId?: string;
  contactName?: string;
  deliveryAddress?: string;
  deliveryRegion?: string;
  deliveryProvince?: string;
  deliveryDistrict?: string;
  deliveryReference?: string;
  deliveryDate?: string | Date;
  siafNumber?: string;
  siafStage?: string;
  siafDate?: string | Date;
  peruComprasDoc?: string;
  peruComprasDate?: string | Date;
  oce?: string;
  ocf?: string;
  totalAmount?: number;
  status?: 'draft' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

export interface ClientContact {
  id: string;
  name: string;
  position?: string;
  phone?: string;
  email?: string;
  status: boolean;
}

export interface SalesFormContextType {
  formData: SalesFormValues;
  updateFormData: (data: Partial<SalesFormValues>) => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
  errors?: Record<string, string>;
}
