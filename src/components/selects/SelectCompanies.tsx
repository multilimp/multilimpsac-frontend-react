import SelectContainer from './SelectContainer';
import { Select, SelectProps } from 'antd';
import { filterOptions } from '@/utils/functions';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import SelectGeneric from './SelectGeneric';

interface SelectCompaniesProps extends SelectProps {
  label: string;
}

const SelectCompanies = ({ label, ...rest }: SelectCompaniesProps) => {
  const { companies, loadingCompanies } = useGlobalInformation();

  return (
    <>
      <SelectContainer label={label}>
        <SelectGeneric
          filterOption={filterOptions}
          size="large"
          allowClear
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
        </SelectGeneric>
      </SelectContainer>
    </>
  );
};

export default SelectCompanies;
