import { notification, Select, SelectProps } from 'antd';
import SelectContainer from './SelectContainer';
import { filterOptions } from '@/utils/functions';
import { useEffect, useState } from 'react';
import { CatalogProps } from '@/services/catalogs/catalogs';
import { getCatalogs } from '@/services/catalogs/catalogs.requests';

interface SelectCatalogsProps extends SelectProps {
  label: string;
}

const SelectCatalogs = ({ label, size = 'large', ...props }: SelectCatalogsProps) => {
  const [loading, setLoading] = useState(false);
  const [catalogs, setCatalogs] = useState<Array<CatalogProps>>([]);

  useEffect(() => {
    obtainData();
  }, []);

  const obtainData = async () => {
    try {
      setLoading(true);
      const data = await getCatalogs();
      setCatalogs([...data]);
    } catch (error) {
      notification.error({ message: `No se pudo obtener los catálogos. ${String(error)}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SelectContainer label={label}>
      <Select showSearch filterOption={filterOptions} size={size} style={{ width: '100%' }} loading={loading} disabled={loading} {...props}>
        {catalogs.map((item) => (
          <Select.Option key={item.id} value={item.id} optiondata={item} title={`${item.nombre} ${item.descripcion}`}>
            {item.nombre} - {item.descripcion}
          </Select.Option>
        ))}
      </Select>
    </SelectContainer>
  );
};

export default SelectCatalogs;
