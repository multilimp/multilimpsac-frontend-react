import { createContext, ReactNode, useMemo, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
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
import { useAppContext } from './index';
import { SaleProps } from '@/services/sales/sales';
import { getSales } from '@/services/sales/sales.request';
import { getTrackings } from '@/services/trackings/trackings.request';
import { TrackingProps } from '@/services/trackings/trackings.d';
import { CotizacionProps } from '@/types/cotizacion.types';
import { getCotizaciones } from '@/services/quotes/quotes.request';
import { BlackBarKeyEnum } from '@/types/global.enum';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import { getAllOrderProviders } from '@/services/providerOrders/providerOrders.requests';

export type SaleInputsType = { enterprise: null | CompanyProps; tipoVenta: 'directa' | 'privada'; file: null | File };
export type QuoteInputsType = { enterprise: null | CompanyProps };

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
  loadingSales: boolean;
  sales: Array<SaleProps>;
  loadingTrackings: boolean;
  trackings: Array<TrackingProps>;
  loadingQuotes: boolean;
  quotes: Array<CotizacionProps>;
  loadingProviderOrders: boolean;
  providerOrders: Array<ProviderOrderProps>;
  selectedSale: null | SaleProps;
  selectedQuote: null | CotizacionProps;
  saleInputValues: SaleInputsType;
  quoteInputValues: QuoteInputsType;
  blackBarKey: BlackBarKeyEnum | null;
  setSelectedSale: Dispatch<SetStateAction<null | SaleProps>>;
  setSelectedQuote: Dispatch<SetStateAction<null | CotizacionProps>>;
  obtainClients: VoidFunction;
  obtainCompanies: VoidFunction;
  obtainRegions: VoidFunction;
  obtainProviders: VoidFunction;
  obtainTransports: VoidFunction;
  obtainSales: VoidFunction;
  obtainTrackings: VoidFunction;
  obtainQuotes: VoidFunction;
  obtainProviderOrders: VoidFunction;
  setSaleInputValues: Dispatch<SetStateAction<SaleInputsType>>;
  setQuoteInputValues: Dispatch<SetStateAction<QuoteInputsType>>;
  setBlackBarKey: Dispatch<SetStateAction<BlackBarKeyEnum | null>>;
}

const GlobalInformation = createContext({} as ContextProps);

export const useGlobalInformation = () => useContext(GlobalInformation);

const GlobalInformationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAppContext();
  const [selectedSale, setSelectedSale] = useState<null | SaleProps>(null);

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

  const [loadingSales, setLoadingSales] = useState(false);
  const [sales, setSales] = useState<Array<SaleProps>>([]);

  const [loadingTrackings, setLoadingTrackings] = useState(false);
  const [trackings, setTrackings] = useState<Array<TrackingProps>>([]);

  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [quotes, setQuotes] = useState<Array<CotizacionProps>>([]);
  const [selectedQuote, setSelectedQuote] = useState<null | CotizacionProps>(null);

  const [loadingProviderOrders, setLoadingProviderOrders] = useState(false);
  const [providerOrders, setProviderOrders] = useState<Array<ProviderOrderProps>>([]);

  const [saleInputValues, setSaleInputValues] = useState<SaleInputsType>({ enterprise: null, file: null, tipoVenta: 'directa' });
  const [quoteInputValues, setQuoteInputValues] = useState<QuoteInputsType>({ enterprise: null });
  const [blackBarKey, setBlackBarKey] = useState<null | BlackBarKeyEnum>(null);

  useEffect(() => {
    const token = StorageService.get(STORAGE_KEY);
    if (!token || !user.id) return;

    obtainRegions();
    obtainClients();
    obtainCompanies();
    obtainProviders();
    obtainTransports();
    obtainSales();
    obtainTrackings();
    obtainQuotes();
    obtainProviderOrders();
  }, [user]);

  const obtainRegions = async () => {
    try {
      setLoadingRegions(true);
      const data = await getRegions();
      setRegions(data);
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
      setClients(res);
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
      setCompanies(res);
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
      setProviders(res);
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
      setTransports(res);
    } catch (error) {
      notification.error({
        message: 'Error al obtener los transportes',
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setLoadingTransports(false);
    }
  };

  const obtainSales = async () => {
    try {
      setLoadingSales(true);
      const response = await getSales({ pageSize: 1000, page: 1 });
      setSales(response);
    } catch (error) {
      notification.error({
        message: 'Error al obtener ventas',
        description: `Detalles: ${error instanceof Error ? error.message : String(error)}`,
      });
    } finally {
      setLoadingSales(false);
    }
  };

  const obtainTrackings = async () => {
    try {
      setLoadingTrackings(true);
      const data = await getTrackings();
      setTrackings(data);
    } catch (error) {
      notification.error({
        message: 'Error al obtener seguimientos',
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoadingTrackings(false);
    }
  };

  const obtainQuotes = async () => {
    try {
      setLoadingQuotes(true);
      const data = await getCotizaciones();
      setQuotes(data);
    } catch (error) {
      notification.error({
        message: 'Error al obtener cotizaciones',
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoadingQuotes(false);
    }
  };

  const obtainProviderOrders = async () => {
    try {
      setLoadingProviderOrders(true);
      const data = await getAllOrderProviders();
      setProviderOrders(data);
    } catch (error) {
      notification.error({
        message: 'Error al obtener órdenes de proveedor',
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoadingProviderOrders(false);
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
      sales,
      loadingSales,
      trackings,
      loadingTrackings,
      quotes,
      loadingQuotes,
      selectedSale,
      selectedQuote,
      saleInputValues,
      quoteInputValues,
      blackBarKey,
      providerOrders,
      loadingProviderOrders,
      setSelectedSale,
      setSelectedQuote,
      obtainClients,
      obtainCompanies,
      obtainRegions,
      obtainProviders,
      obtainTransports,
      obtainSales,
      obtainTrackings,
      obtainQuotes,
      obtainProviderOrders,
      setSaleInputValues,
      setQuoteInputValues,
      setBlackBarKey,
    }),
    [
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
      sales,
      loadingSales,
      trackings,
      loadingTrackings,
      quotes,
      loadingQuotes,
      selectedSale,
      selectedQuote,
      saleInputValues,
      quoteInputValues,
      blackBarKey,
      providerOrders,
      loadingProviderOrders,
    ]
  );

  return <GlobalInformation.Provider value={values}>{children}</GlobalInformation.Provider>;
};

export default GlobalInformationProvider;
