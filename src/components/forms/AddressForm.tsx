
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

export interface AddressFormProps {
  control: Control<any>;
  addressField: string;
  departmentField: string;
  provinceField: string;
  districtField: string;
  required?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  control,
  addressField,
  departmentField,
  provinceField,
  districtField,
  required = false,
}) => {
  return (
    <>
      <FormField
        control={control}
        name={addressField}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{required ? "Dirección *" : "Dirección"}</FormLabel>
            <FormControl>
              <Input placeholder="Dirección completa" {...field} />
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
          name={districtField}
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
    </>
  );
};

export default AddressForm;
