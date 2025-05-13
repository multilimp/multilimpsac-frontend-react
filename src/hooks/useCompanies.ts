import { useEffect, useState } from 'react';
import { notification } from 'antd';
import { CompanyProps } from '@/services/companies/company';
import { getCompanies } from '@/services/companies/company.requests';

const useCompanies = () => {
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [companies, setCompanies] = useState<Array<CompanyProps>>([]);

  useEffect(() => {
    obtainCompanies();
  }, []);

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

  return { loadingCompanies, companies, obtainCompanies };
};

export default useCompanies;
