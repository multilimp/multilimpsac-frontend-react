
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

export interface AddressFormProps {
  control: Control<any>;
  addressField?: string;
  departmentField?: string;
  provinceField?: string;
  districtField?: string;
  referenceField?: string;
}

const AddressForm: React.FC<AddressFormProps> = ({
  control,
  addressField = "address",
  departmentField = "department",
  provinceField = "province",
  districtField = "district",
  referenceField
}) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={addressField}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dirección</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ej. Av. Principal 123" />
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
                <Input {...field} placeholder="Ej. Lima" />
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
                <Input {...field} placeholder="Ej. Lima" />
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
                <Input {...field} placeholder="Ej. Miraflores" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {referenceField && (
        <FormField
          control={control}
          name={referenceField}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referencia</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej. Cerca al parque" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default AddressForm;
