
// Basic company model interfaces
export interface Company {
  id: string;
  razonSocial: string;
  ruc: string;
  codUnidad?: string;
  direccion?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  telefono?: string;
  correo?: string;
  web?: string;
  logo?: string;
  estado: boolean;
  createdAt: string;
  updatedAt?: string;
  
  // Aliases for code compatibility with existing components
  name?: string;
  address?: string; 
  phone?: string;
  email?: string;
  status?: 'active' | 'inactive';
}

// Alias for Spanish naming conventions
export type Empresa = Company;

// Database model
export interface CompanyDB {
  id: number;
  razon_social: string;
  ruc: string;
  cod_unidad?: string;
  direccion?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  telefono?: string;
  correo?: string;
  web?: string;
  logo?: string;
  estado: boolean;
  created_at: string;
  updated_at?: string;
}

// Alias for Spanish naming
export type EmpresaDB = CompanyDB;

// Company catalog model
export interface CompanyCatalog {
  id: string;
  empresaId: string;
  codigo: string;
  createdAt: string;
  updatedAt?: string;
}

// Alias for Spanish naming
export type CatalogoEmpresa = CompanyCatalog;

// Database model for catalog
export interface CompanyCatalogDB {
  id: number;
  empresa_id: number;
  codigo: string;
  created_at: string;
  updated_at?: string;
}

// Alias for Spanish naming
export type CatalogoEmpresaDB = CompanyCatalogDB;

// Mapping functions
export const mapCompanyFromDB = (db: CompanyDB): Company => ({
  id: db.id.toString(),
  razonSocial: db.razon_social,
  ruc: db.ruc,
  codUnidad: db.cod_unidad,
  direccion: db.direccion,
  departamento: db.departamento,
  provincia: db.provincia,
  distrito: db.distrito,
  telefono: db.telefono,
  correo: db.correo,
  web: db.web,
  logo: db.logo,
  estado: db.estado,
  createdAt: db.created_at,
  updatedAt: db.updated_at,
  
  // Add aliases for compatibility
  name: db.razon_social,
  address: db.direccion,
  phone: db.telefono,
  email: db.correo,
  status: db.estado ? 'active' : 'inactive'
});

export const mapEmpresaFromDB = mapCompanyFromDB;

export const mapCompanyToDB = (company: Partial<Company>): Partial<CompanyDB> => ({
  razon_social: company.razonSocial || company.name,
  ruc: company.ruc,
  cod_unidad: company.codUnidad,
  direccion: company.direccion || company.address,
  departamento: company.departamento,
  provincia: company.provincia,
  distrito: company.distrito,
  telefono: company.telefono || company.phone,
  correo: company.correo || company.email,
  web: company.web,
  logo: company.logo,
  estado: company.estado !== undefined ? company.estado : (company.status === 'active')
});

export const mapEmpresaToDB = mapCompanyToDB;

export const mapCompanyCatalogFromDB = (db: CompanyCatalogDB): CompanyCatalog => ({
  id: db.id.toString(),
  empresaId: db.empresa_id.toString(),
  codigo: db.codigo,
  createdAt: db.created_at,
  updatedAt: db.updated_at
});

export const mapCatalogoFromDB = mapCompanyCatalogFromDB;

export const mapCompanyCatalogToDB = (catalog: Partial<CompanyCatalog>): Partial<CompanyCatalogDB> => ({
  empresa_id: catalog.empresaId ? parseInt(catalog.empresaId) : undefined,
  codigo: catalog.codigo
});

export const mapCatalogoToDB = mapCompanyCatalogToDB;
