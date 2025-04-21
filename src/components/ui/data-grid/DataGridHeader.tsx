
import React from 'react';
import { Input } from '@/components/ui/input';
import { DataGridHeaderProps } from './types';

export const DataGridHeader: React.FC<DataGridHeaderProps> = ({
  filterValue,
  setFilterValue,
  searchPlaceholder
}) => {
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex-1 max-w-sm">
        <Input
          placeholder={searchPlaceholder}
          value={filterValue}
          onChange={handleFilterChange}
          className="w-full"
        />
      </div>
    </div>
  );
};
