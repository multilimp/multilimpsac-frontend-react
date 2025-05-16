import { createContext, ReactNode, useMemo, useContext, useState, useEffect } from 'react';
import { RegionProps } from '@/services/ubigeo/ubigeo';
import { CompanyProps } from '@/services/companies/company';
import { ClientProps } from '@/services/clients/clients';
import { getRegions } from '@/services/ubigeo/ubigeo.requests';
import { notification } from 'antd';
import { getClients } from '@/services/clients/client.requests';
import { getCompanies } from '@/services/companies/company.requests';
import StorageService from '@/services/storageService';
import { STORAGE_KEY } from '@/utils/constants';
import { ProviderProps } from '@/services/providers/providers';
import { getProviders } from '@/services/providers/providers.request';
import { TransportProps } from '@/services/transports/transports';
import { getTransports } from '@/services/transports/transports.request';
import { useAppContext } from '.';

interface ContextProps {
  loadingRegions: boolean;
  loadingCompanies: boolean;
  loadingClients: boolean;
  regions: Array<RegionProps>;
  companies: Array<CompanyProps>;
  clients: Array<ClientProps>;
  loadingProviders: boolean;
  providers: Array<ProviderProps>;
  loadingTransports: boolean;
  transports: Array<TransportProps>;
  obtainClients: VoidFunction;
  obtainCompanies: VoidFunction;
  obtainRegions: VoidFunction;
  obtainProviders: VoidFunction;
  obtainTransports: VoidFunction;
}

const GlobalInformation = createContext({} as ContextProps);

export const useGlobalInformation = () => useContext(GlobalInformation);

const GlobalInformationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAppContext();
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [regions, setRegions] = useState<Array<RegionProps>>([]);

  const [loadingClients, setLoadingClients] = useState(false);
  const [clients, setClients] = useState<Array<ClientProps>>([]);

  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [companies, setCompanies] = useState<Array<CompanyProps>>([]);

  const [loadingProviders, setLoadingProviders] = useState(false);
  const [providers, setProviders] = useState<Array<ProviderProps>>([]);

  const [loadingTransports, setLoadingTransports] = useState(false);
  const [transports, setTransports] = useState<Array<TransportProps>>([]);

  useEffect(() => {
    const token = StorageService.get(STORAGE_KEY);
    if (!token || !user.id) return;

    obtainRegions();
    obtainClients();
    obtainCompanies();
    obtainProviders();
    obtainTransports();
  }, [user]);

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

  const obtainProviders = async () => {
    try {
      setLoadingProviders(true);
      const res = await getProviders();
      setProviders([...res]);
    } catch (error) {
      notification.error({
        message: 'Error al obtener los proveedores',
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setLoadingProviders(false);
    }
  };

  const obtainTransports = async () => {
    try {
      setLoadingTransports(true);
      const res = await getTransports();
      setTransports([...res]);
    } catch (error) {
      notification.error({
        message: 'Error al obtener los transportes',
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setLoadingTransports(false);
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
      providers,
      loadingProviders,
      transports,
      loadingTransports,
      obtainClients,
      obtainCompanies,
      obtainRegions,
      obtainProviders,
      obtainTransports,
    }),
    [loadingRegions, regions, companies, loadingCompanies, clients, loadingClients, providers, loadingProviders, transports, loadingTransports]
  );

  return <GlobalInformation.Provider value={values}>{children}</GlobalInformation.Provider>;
};

export default GlobalInformationProvider;
