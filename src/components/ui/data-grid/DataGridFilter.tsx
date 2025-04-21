
import React from "react";
import { Input } from "@/components/ui/input";
import { ColumnType, DataGridColumn } from "./types";

interface NumberRangeFilterProps {
  value: { min?: number; max?: number } | undefined;
  onChange: (value: { min?: number; max?: number } | undefined) => void;
}

const NumberRangeFilter: React.FC<NumberRangeFilterProps> = ({ value = {}, onChange }) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = e.target.value ? Number(e.target.value) : undefined;
    onChange({ ...value, min });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = e.target.value ? Number(e.target.value) : undefined;
    onChange({ ...value, max });
  };

  return (
    <div className="flex gap-2">
      <Input
        type="number"
        placeholder="Min"
        value={value.min ?? ""}
        onChange={handleMinChange}
        className="h-8 w-20"
      />
      <Input
        type="number"
        placeholder="Max"
        value={value.max ?? ""}
        onChange={handleMaxChange}
        className="h-8 w-20"
      />
    </div>
  );
};

interface TextFilterProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

const TextFilter: React.FC<TextFilterProps> = ({ value = "", onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value || undefined);
  };

  return (
    <Input
      type="text"
      placeholder="Filter..."
      value={value ?? ""}
      onChange={handleChange}
      className="h-8"
    />
  );
};

interface DataGridFilterProps {
  column: DataGridColumn;
  value: any;
  onChange: (value: any) => void;
}

export const DataGridFilter: React.FC<DataGridFilterProps> = ({ 
  column, 
  value, 
  onChange 
}) => {
  switch (column.type) {
    case 'number':
      return (
        <NumberRangeFilter 
          value={value} 
          onChange={onChange} 
        />
      );
    case 'string':
    case 'date':
    default:
      return (
        <TextFilter 
          value={value} 
          onChange={onChange} 
        />
      );
  }
};
