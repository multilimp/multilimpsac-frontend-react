
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface AddressFormProps {
  control: Control<any>;
  addressField?: string;
  departmentField?: string;
  provinceField?: string;
  districtField?: string;
  required?: boolean;
  disabled?: boolean;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  control,
  addressField = "address",
  departmentField = "department",
  provinceField = "province",
  districtField = "district",
  required = false,
  disabled = false,
}) => {
  const departments = ["Lima", "Arequipa", "Cusco", "La Libertad", "Piura"];
  const provinces: Record<string, string[]> = {
    Lima: ["Lima", "Huaral", "Cañete", "Huarochirí"],
    Arequipa: ["Arequipa", "Camaná", "Caylloma", "Islay"],
    Cusco: ["Cusco", "Calca", "Urubamba", "Anta"],
    "La Libertad": ["Trujillo", "Pacasmayo", "Chepén", "Otuzco"],
    Piura: ["Piura", "Sullana", "Talara", "Paita"],
  };
  const districts: Record<string, string[]> = {
    Lima: [
      "Lima",
      "Miraflores",
      "San Isidro",
      "Surco",
      "La Molina",
      "Barranco",
      "San Borja",
    ],
    Huaral: ["Huaral", "Chancay", "Aucallama"],
    Arequipa: [
      "Cercado",
      "Cayma",
      "Yanahuara",
      "José Luis Bustamante y Rivero",
    ],
  };

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={addressField}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Dirección {required && <span className="text-destructive">*</span>}
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Ingrese la dirección completa"
                {...field}
                value={field.value || ""}
                disabled={disabled}
              />
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
              <FormLabel>
                Departamento
                {required && <span className="text-destructive">*</span>}
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione departamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={provinceField}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Provincia {required && <span className="text-destructive">*</span>}
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={
                  disabled ||
                  !control._formValues[departmentField]
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione provincia" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {control._formValues[departmentField] &&
                    provinces[control._formValues[departmentField]]?.map(
                      (prov) => (
                        <SelectItem key={prov} value={prov}>
                          {prov}
                        </SelectItem>
                      )
                    )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={districtField}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Distrito {required && <span className="text-destructive">*</span>}
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={
                  disabled ||
                  !control._formValues[provinceField]
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione distrito" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {control._formValues[provinceField] &&
                    districts[control._formValues[provinceField]]?.map(
                      (dist) => (
                        <SelectItem key={dist} value={dist}>
                          {dist}
                        </SelectItem>
                      )
                    )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AddressForm;
