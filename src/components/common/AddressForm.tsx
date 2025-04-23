
import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export interface AddressFormProps {
  control: Control<any>;
  addressField?: string;
  departmentField?: string;
  provinceField?: string;
  districtField?: string;
  districtFiel?: string; // For backward compatibility with existing code
}

const AddressForm: React.FC<AddressFormProps> = ({
  control,
  addressField = 'direccion',
  departmentField = 'departamento',
  provinceField = 'provincia',
  districtField = 'distrito',
  districtFiel,  // For backward compatibility
}) => {
  // Use the districtFiel prop if districtField is not provided (for backward compatibility)
  const actualDistrictField = districtField || districtFiel || 'distrito';
  
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={addressField}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dirección</FormLabel>
            <FormControl>
              <Input placeholder="Dirección" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name={departmentField}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departamento</FormLabel>
              <FormControl>
                <Input placeholder="Departamento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name={provinceField}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provincia</FormLabel>
              <FormControl>
                <Input placeholder="Provincia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name={actualDistrictField}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distrito</FormLabel>
              <FormControl>
                <Input placeholder="Distrito" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AddressForm;
