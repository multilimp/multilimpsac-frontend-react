import { useEffect, useState } from 'react';
import { notification } from 'antd';
import { CatalogProps } from '@/services/catalogs/catalogs';
import { getCatalogsByCompany } from '@/services/catalogs/catalogs.requests';

const useCatalogs = (companyId?: number) => {
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);
  const [catalogs, setCatalogs] = useState<Array<CatalogProps>>([]);

  useEffect(() => {
    obtainCatalogs();
  }, [companyId]);

  const obtainCatalogs = async () => {
    try {
      setLoadingCatalogs(true);

      if (!companyId) {
        setCatalogs([]);
        return;
      }

      const res = await getCatalogsByCompany(companyId);
      setCatalogs(res);
    } catch (error) {
      notification.error({
        message: 'Error al obtener los catálogos',
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
      setCatalogs([]);
    } finally {
      setLoadingCatalogs(false);
    }
  };

  return { loadingCatalogs, catalogs, obtainCatalogs };
};

export default useCatalogs;
