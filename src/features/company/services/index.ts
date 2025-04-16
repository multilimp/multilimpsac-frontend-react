
// Re-export API functions and hooks
import * as companyApi from './api/companyApi';
import * as catalogApi from './api/companyCatalogApi';
import * as companyHooks from './hooks/useCompanyHooks';
import * as catalogHooks from './hooks/useCompanyCatalogHooks';

// Create a service object with all the functions and hooks
export const companyService = {
  // Company API
  fetchCompanies: companyApi.fetchCompanies,
  fetchCompanyById: companyApi.fetchCompanyById,
  saveCompany: companyApi.saveCompany,
  createCompany: companyApi.createCompany,
  updateCompany: companyApi.updateCompany,
  deleteCompany: companyApi.deleteCompany,
  
  // Catalog API
  fetchCompanyCatalogs: catalogApi.fetchCompanyCatalogs,
  fetchCompanyCatalogById: catalogApi.fetchCompanyCatalogById,
  saveCompanyCatalog: catalogApi.saveCompanyCatalog,
  createCompanyCatalog: catalogApi.createCompanyCatalog,
  updateCompanyCatalog: catalogApi.updateCompanyCatalog,
  deleteCompanyCatalog: catalogApi.deleteCompanyCatalog
};

// Re-export hooks
export const {
  useCompanies,
  useCompany,
  useCreateCompany,
  useUpdateCompany,
  useDeleteCompany
} = companyHooks;

export const {
  useCompanyCatalogs,
  useCreateCompanyCatalog,
  useUpdateCompanyCatalog,
  useDeleteCompanyCatalog
} = catalogHooks;
