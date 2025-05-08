import useCompanies from '@/hooks/useCompanies';
import SelectContainer from './SelectContainer';
import { Select, SelectProps } from 'antd';
import { filterOptions } from '@/utils/functions';

interface SelectCompaniesProps extends SelectProps {
  label: string;
}

const SelectCompanies = ({ label, ...rest }: SelectCompaniesProps) => {
  const { companies, loadingCompanies } = useCompanies();

  return (
    <SelectContainer label={label}>
      <Select
        showSearch
        filterOption={filterOptions}
        size="large"
        style={{ width: '100%' }}
        loading={loadingCompanies}
        disabled={loadingCompanies}
        {...rest}
      >
        {companies.map((item) => (
          <Select.Option key={item.id} value={item.id} optiondata={item} title={item.razonSocial}>
            {item.razonSocial}
          </Select.Option>
        ))}
      </Select>
    </SelectContainer>
  );
};

export default SelectCompanies;
