import { CompanyProps } from '../companies/company';

export interface CatalogProps {
  id: number;
  nombre: string;
  descripcion: string;
  empresa: CompanyProps;
}
