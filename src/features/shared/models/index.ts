
/**
 * Base shared models for reuse across the application
 */

// Base entity interface with common properties
export interface EntityBase {
  id: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

// Address interface for entities that have location data
export interface Address {
  address?: string;
  department?: string;
  province?: string;
  district?: string;
}

// Contact interface for contact-related entities
export interface Contact {
  name: string;
  position?: string;
  phone?: string;
  email?: string;
}

// Helper functions for mapping entities
export const mapEntityStatus = (status: boolean): 'active' | 'inactive' => {
  return status ? 'active' : 'inactive';
};

export const mapStatusToBoolean = (status?: 'active' | 'inactive'): boolean => {
  return status === 'inactive' ? false : true;
};

export const formatDateString = (date?: string): string | undefined => {
  if (!date) return undefined;
  return date;
};

export const mapId = (id: number): string => {
  return id.toString();
};
