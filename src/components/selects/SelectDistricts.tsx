import { notification, Select, SelectProps } from 'antd';
import SelectContainer from './SelectContainer';
import { filterOptions } from '@/utils/functions';
import { useEffect, useState } from 'react';
import { getDistricts } from '@/services/ubigeo/ubigeo.requests';
import { DistrictProps } from '@/services/ubigeo/ubigeo';

interface SelectDistrictsProps extends SelectProps {
  label: string;
  provinceId?: string;
}

const SelectDistricts = ({ label, provinceId, size = 'large', ...props }: SelectDistrictsProps) => {
  const [loading, setLoading] = useState(false);
  const [districts, setDistricts] = useState<Array<DistrictProps>>([]);

  useEffect(() => {
    if (!provinceId) {
      setDistricts([]);
      return;
    }
    obtainData();
  }, [provinceId]);

  const obtainData = async () => {
    try {
      setLoading(true);
      const data = await getDistricts(provinceId);
      setDistricts([...data]);
    } catch (error) {
      notification.error({ message: `No se pudo obtener los distritos. ${String(error)}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SelectContainer label={label}>
      <Select showSearch filterOption={filterOptions} size={size} style={{ width: '100%' }} loading={loading} disabled={loading} {...props}>
        {districts.map((item) => (
          <Select.Option key={item.id} value={item.id} optiondata={item} title={item.name}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    </SelectContainer>
  );
};

export default SelectDistricts;
