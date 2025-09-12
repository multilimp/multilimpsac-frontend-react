import SelectContainer from './SelectContainer';
import { Select, SelectProps } from 'antd';
import { filterOptions } from '@/utils/functions';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';

interface SelectCompaniesProps extends SelectProps {
  label: string;
}

const SelectCompanies = ({ label, ...rest }: SelectCompaniesProps) => {
  const { companies, loadingCompanies } = useGlobalInformation();

  return (
    <div style={{ position: 'relative' }}>
      <style>
        {`
          .input-select-form .float-label .label {
            color: #ffffff !important;
          }
          .input-select-form .float-label .label-float {
            color: #ffffff !important;
          }
        `}
      </style>
      <SelectContainer label={label}>
        <Select
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
        </Select>
      </SelectContainer>
    </div>
  );
};

export default SelectCompanies;
