
// Re-export API functions and hooks
import * as companyApi from './services/api/companyApi';
import { companyCatalogApi } from './services/api/companyCatalogApi';
import * as companyHooks from './services/hooks/useCompanyHooks';
import * as catalogHooks from './services/hooks/useCompanyCatalogHooks';

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
  fetchCompanyCatalogs: companyCatalogApi.fetchCompanyCatalogs.bind(companyCatalogApi),
  fetchCompanyCatalogById: companyCatalogApi.fetchCompanyCatalogById.bind(companyCatalogApi),
  createCompanyCatalog: companyCatalogApi.createCompanyCatalog.bind(companyCatalogApi),
  updateCompanyCatalog: companyCatalogApi.updateCompanyCatalog.bind(companyCatalogApi),
  deleteCompanyCatalog: companyCatalogApi.deleteCompanyCatalog.bind(companyCatalogApi)
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
