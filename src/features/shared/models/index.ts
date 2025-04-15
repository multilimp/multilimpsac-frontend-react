
/**
 * Modelos compartidos para entidades comunes
 */

// Interfaces base para entidades comunes
export interface EntityBase {
  id: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

// Interfaces compartidas para direcciones
export interface Address {
  address: string;
  district?: string;
  province?: string;
  department?: string;
}

// Interfaces compartidas para contactos
export interface Contact {
  name: string;
  position?: string;
  email?: string;
  phone?: string;
  isPrimary?: boolean;
}

// Mapeo de estados booleanos a estados de dominio
export const mapEntityStatus = (estado: boolean): "active" | "inactive" => {
  return estado ? "active" : "inactive";
};

// Mapeo de estados de dominio a estados booleanos para base de datos
export const mapStatusToBoolean = (status: "active" | "inactive"): boolean => {
  return status === "active";
};

// Utilidades para mapeo de fechas
export const formatDateString = (date?: string | null): string | undefined => {
  if (!date) return undefined;
  return new Date(date).toISOString();
};

// Utilidades para mapeo de IDs
export const mapId = (id: number | string): string => {
  return id.toString();
};
