export interface ClientProps {
  id: number;
  ruc: string;
  socialReason: string;   // Cambiar a razon_social si usas el nombre en español
  unitCode: string;       // Cambiar a cod_unidad si usas el nombre en español
  contacts: string;
  department: string;     // Cambiar a departamento si usas el nombre en español
  province: string;       // Cambiar a provincia si usas el nombre en español
  district: string;       // Cambiar a distrito si usas el nombre en español
  address: string;        // Cambiar a direccion si usas el nombre en español
}
