import { notification, Select, SelectProps } from 'antd';
import SelectContainer from './SelectContainer';
import { filterOptions } from '@/utils/functions';
import { useEffect, useState } from 'react';
import { getProvinces } from '@/services/ubigeo/ubigeo.requests';
import { ProvinceProps } from '@/services/ubigeo/ubigeo';

interface SelectProvincesProps extends SelectProps {
  label: string;
  regionId?: string;
}

const SelectProvinces = ({ label, regionId, size = 'large', ...props }: SelectProvincesProps) => {
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState<Array<ProvinceProps>>([]);

  useEffect(() => {
    if (!regionId) {
      setProvinces([]);
      return;
    }
    obtainData();
  }, [regionId]);

  const obtainData = async () => {
    try {
      setLoading(true);
      const data = await getProvinces(regionId);
      setProvinces([...data]);
    } catch (error) {
      notification.error({ message: `No se pudo obtener las provincias. ${String(error)}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SelectContainer label={label}>
      <Select showSearch filterOption={filterOptions} size={size} style={{ width: '100%' }} loading={loading} disabled={loading} {...props}>
        {provinces.map((item) => (
          <Select.Option key={item.id} value={item.id} optiondata={item} title={item.name}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    </SelectContainer>
  );
};

export default SelectProvinces;
