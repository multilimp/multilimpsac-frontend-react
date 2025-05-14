import { Select, SelectProps } from 'antd';
import SelectContainer from './SelectContainer';
import { filterOptions } from '@/utils/functions';
import useCatalogs from '@/hooks/useCatalogs';

interface SelectCatalogsProps extends SelectProps {
  label: string;
  companyId: number;
}

const SelectCatalogs = ({ label, size = 'large', companyId, ...props }: SelectCatalogsProps) => {
  const { catalogs, loadingCatalogs } = useCatalogs(companyId);

  return (
    <SelectContainer label={label}>
      <Select
        showSearch
        filterOption={filterOptions}
        size={size}
        style={{ width: '100%' }}
        loading={loadingCatalogs}
        disabled={loadingCatalogs}
        {...props}
      >
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
