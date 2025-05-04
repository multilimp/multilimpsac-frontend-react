export interface TransportProps {
    id: string;
    ruc: string;
    socialReason: string;
    contacts: string[];
    coverage: string[];
    department: string;
    province: string;
    district: string;
    address: string;
    createdAt?: Date;
    updatedAt?: Date;
  }