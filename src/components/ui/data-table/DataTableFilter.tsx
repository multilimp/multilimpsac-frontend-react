
import React from 'react';
import { Input } from '@/components/ui/input';
import { DataTableFilterProps } from './types';

export function DataTableFilter({ column, table }: DataTableFilterProps) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === 'number' ? (
    <div className="flex space-x-2">
      <Input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder="Min"
        className="h-8 w-20"
      />
      <Input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder="Max"
        className="h-8 w-20"
      />
    </div>
  ) : (
    <Input
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder="Buscar..."
      className="h-8 w-full"
    />
  );
}
