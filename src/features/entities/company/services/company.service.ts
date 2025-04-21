import { useQuery } from "@tanstack/react-query";
import { 
  Company, 
  CompanyDB, 
  mapCompanyFromDB, 
  mapCompanyToDB,
  CompanyCatalog,
  CompanyCatalogDB,
  mapCompanyCatalogFromDB,
  mapCompanyCatalogToDB
} from "../../entities/company/models/company.model";
import { supabase } from "@/integrations/supabase/client";
import { stringIdToNumber } from "@/utils/id-conversions";

/**
 * Servicio para gestionar operaciones relacionadas con empresas
 */
export const companyService = {
  /**
   * Obtiene todas las empresas
   */
  fetchCompanies: async (): Promise<Company[]> => {
    const { data, error } = await supabase
      .from("empresas")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error al obtener las empresas:", error);
      throw new Error(`No se pudieron obtener las empresas: ${error.message}`);
    }

    return (data as CompanyDB[]).map(mapCompanyFromDB);
  },

  /**
   * Obtiene una empresa por su ID
   */
  fetchCompanyById: async (id: string): Promise<Company> => {
    const { data, error } = await supabase
      .from("empresas")
      .select("*")
      .eq("id", stringIdToNumber(id))
      .single();

    if (error) {
      console.error(`Error al obtener la empresa con ID ${id}:`, error);
      throw new Error(`No se pudo obtener la empresa: ${error.message}`);
    }

    return mapCompanyFromDB(data as CompanyDB);
  },

  /**
   * Crea una nueva empresa
   */
  createCompany: async (companyData: Partial<Company>): Promise<Company> => {
    const companyDB = mapCompanyToDB(companyData);
    
    const { data, error } = await supabase
      .from("empresas")
      .insert([companyDB])
      .select()
      .single();

    if (error) {
      console.error("Error al crear la empresa:", error);
      throw new Error(`No se pudo crear la empresa: ${error.message}`);
    }

    return mapCompanyFromDB(data as CompanyDB);
  },

  /**
   * Actualiza una empresa existente
   */
  updateCompany: async (id: string, companyData: Partial<Company>): Promise<Company> => {
    const companyDB = mapCompanyToDB(companyData);
    
    const { data, error } = await supabase
      .from("empresas")
      .update(companyDB)
      .eq("id", stringIdToNumber(id))
      .select()
      .single();

    if (error) {
      console.error(`Error al actualizar la empresa con ID ${id}:`, error);
      throw new Error(`No se pudo actualizar la empresa: ${error.message}`);
    }

    return mapCompanyFromDB(data as CompanyDB);
  },

  /**
   * Elimina una empresa
   */
  deleteCompany: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("empresas")
      .delete()
      .eq("id", stringIdToNumber(id));

    if (error) {
      console.error(`Error al eliminar la empresa con ID ${id}:`, error);
      throw new Error(`No se pudo eliminar la empresa: ${error.message}`);
    }
  },

  /**
   * Obtiene todos los catálogos de una empresa
   */
  fetchCompanyCatalogs: async (companyId: string): Promise<CompanyCatalog[]> => {
    const { data, error } = await supabase
      .from("catalogo_empresas")
      .select("*")
      .eq("empresa_id", stringIdToNumber(companyId))
      .order("id", { ascending: true });

    if (error) {
      console.error(`Error al obtener los catálogos de la empresa con ID ${companyId}:`, error);
      throw new Error(`No se pudieron obtener los catálogos: ${error.message}`);
    }

    return (data as CompanyCatalogDB[]).map(mapCompanyCatalogFromDB);
  },

  /**
   * Crea un nuevo catálogo para una empresa
   */
  createCompanyCatalog: async (catalogData: Partial<CompanyCatalog> & { empresa_id: number }): Promise<CompanyCatalog> => {
    const catalogDB = mapCompanyCatalogToDB(catalogData);
    
    const { data, error } = await supabase
      .from("catalogo_empresas")
      .insert([catalogDB])
      .select()
      .single();

    if (error) {
      console.error("Error al crear el catálogo:", error);
      throw new Error(`No se pudo crear el catálogo: ${error.message}`);
    }

    return mapCompanyCatalogFromDB(data as CompanyCatalogDB);
  },

  /**
   * Actualiza un catálogo existente
   */
  updateCompanyCatalog: async (id: string, catalogData: Partial<CompanyCatalog>): Promise<CompanyCatalog> => {
    const catalogDB = mapCompanyCatalogToDB(catalogData);
    
    const { data, error } = await supabase
      .from("catalogo_empresas")
      .update(catalogDB)
      .eq("id", stringIdToNumber(id))
      .select()
      .single();

    if (error) {
      console.error(`Error al actualizar el catálogo con ID ${id}:`, error);
      throw new Error(`No se pudo actualizar el catálogo: ${error.message}`);
    }

    return mapCompanyCatalogFromDB(data as CompanyCatalogDB);
  },

  /**
   * Elimina un catálogo
   */
  deleteCompanyCatalog: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("catalogo_empresas")
      .delete()
      .eq("id", stringIdToNumber(id));

    if (error) {
      console.error(`Error al eliminar el catálogo con ID ${id}:`, error);
      throw new Error(`No se pudo eliminar el catálogo: ${error.message}`);
    }
  },
};

/**
 * Hook para obtener todas las empresas
 */
export const useCompanies = () => {
  return useQuery({
    queryKey: ["companies"],
    queryFn: companyService.fetchCompanies,
  });
};

/**
 * Hook para obtener una empresa por su ID
 */
export const useCompany = (id: string) => {
  return useQuery({
    queryKey: ["company", id],
    queryFn: () => companyService.fetchCompanyById(id),
    enabled: !!id,
  });
};

/**
 * Hook para obtener los catálogos de una empresa
 */
export const useCompanyCatalogs = (companyId: string) => {
  return useQuery({
    queryKey: ["companyCatalogs", companyId],
    queryFn: () => companyService.fetchCompanyCatalogs(companyId),
    enabled: !!companyId,
  });
};
