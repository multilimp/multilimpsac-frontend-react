// src/services/providers/provider.ts
export interface ProviderProps {
    id: string;
    ruc: string;
    socialReason: string;
    contacts: string[];
    department: string;
    province: string;
    district: string;
    address: string;
    // Puedes añadir más campos si necesitas
  }