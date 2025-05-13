import { createContext, ReactNode, useMemo, useContext, useState, useEffect } from 'react';
import { RegionProps } from '@/services/ubigeo/ubigeo';
import { CompanyProps } from '@/services/companies/company';
import { ClientProps } from '@/services/clients/clients';
import { getRegions } from '@/services/ubigeo/ubigeo.requests';
import { notification } from 'antd';
import { getClients } from '@/services/clients/client.requests';
import { getCompanies } from '@/services/companies/company.requests';

interface ContextProps {
  loadingRegions: boolean;
  loadingCompanies: boolean;
  loadingClients: boolean;
  regions: Array<RegionProps>;
  companies: Array<CompanyProps>;
  clients: Array<ClientProps>;
  obtainClients: VoidFunction;
  obtainCompanies: VoidFunction;
  obtainRegions: VoidFunction;
}

const GlobalInformation = createContext({} as ContextProps);

export const useGlobalInformation = () => useContext(GlobalInformation);

const GlobalInformationProvider = ({ children }: { children: ReactNode }) => {
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [regions, setRegions] = useState<Array<RegionProps>>([]);

  const [loadingClients, setLoadingClients] = useState(false);
  const [clients, setClients] = useState<Array<ClientProps>>([]);

  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [companies, setCompanies] = useState<Array<CompanyProps>>([]);

  useEffect(() => {
    obtainRegions();
    obtainClients();
    obtainCompanies();
  }, []);

  const obtainRegions = async () => {
    try {
      setLoadingRegions(true);
      const data = await getRegions();
      setRegions([...data]);
    } catch (error) {
      notification.error({ message: `No se pudo obtener las regiones. ${String(error)}` });
    } finally {
      setLoadingRegions(false);
    }
  };

  const obtainClients = async () => {
    try {
      setLoadingClients(true);
      const res = await getClients();
      setClients([...res]);
    } catch (error) {
      notification.error({
        message: 'Error al obtener clientes',
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setLoadingClients(false);
    }
  };

  const obtainCompanies = async () => {
    try {
      setLoadingCompanies(true);
      const res = await getCompanies();
      setCompanies([...res]);
    } catch (error) {
      notification.error({
        message: 'Error al obtener las empresas',
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setLoadingCompanies(false);
    }
  };

  const values = useMemo(
    () => ({
      loadingRegions,
      regions,
      companies,
      loadingCompanies,
      clients,
      loadingClients,
      obtainClients,
      obtainCompanies,
      obtainRegions,
    }),
    [loadingRegions, regions, companies, loadingCompanies, clients, loadingClients]
  );

  return <GlobalInformation.Provider value={values}>{children}</GlobalInformation.Provider>;
};

export default GlobalInformationProvider;
