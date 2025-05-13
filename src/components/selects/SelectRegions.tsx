import { notification, Select, SelectProps } from 'antd';
import SelectContainer from './SelectContainer';
import { filterOptions } from '@/utils/functions';
import { useEffect, useState } from 'react';
import { getRegions } from '@/services/ubigeo/ubigeo.requests';
import { RegionProps } from '@/services/ubigeo/ubigeo';

interface SelectRegionsProps extends SelectProps {
  label: string;
}

const SelectRegions = ({ label, size = 'large', ...props }: SelectRegionsProps) => {
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState<Array<RegionProps>>([]);

  useEffect(() => {
    obtainData();
  }, []);

  const obtainData = async () => {
    try {
      setLoading(true);
      const data = await getRegions();
      setRegions([...data]);
    } catch (error) {
      notification.error({ message: `No se pudo obtener las regiones. ${String(error)}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SelectContainer label={label}>
      <Select showSearch filterOption={filterOptions} size={size} style={{ width: '100%' }} loading={loading} disabled={loading} {...props}>
        {regions.map((item) => (
          <Select.Option key={item.id} value={item.id} optiondata={item} title={item.name}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    </SelectContainer>
  );
};

export default SelectRegions;
