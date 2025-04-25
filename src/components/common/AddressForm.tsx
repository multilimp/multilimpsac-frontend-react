
import React from 'react';
import { 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';

export interface AddressFormProps {
  control: Control<any>;
  addressName?: string;
  departmentName?: string;
  provinceName?: string;
  districtName?: string;
  required?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  control,
  addressName = 'address',
  departmentName = 'department',
  provinceName = 'province',
  districtName = 'district',
  required = false
}) => {
  return (
    <>
      <FormField
        control={control}
        name={addressName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{required ? 'Dirección*' : 'Dirección'}</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Av. Principal 123" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <FormField
          control={control}
          name={departmentName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departamento</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Lima" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={provinceName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provincia</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Lima" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={districtName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distrito</FormLabel>
              <FormControl>
                <Input {...field} placeholder="San Isidro" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default AddressForm;
