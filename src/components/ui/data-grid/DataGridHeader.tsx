
import React from "react";
import { Columns3, FileDown, Filter, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataGridColumn } from "./types";
import { Toggle } from "@/components/ui/toggle";

interface DataGridHeaderProps {
  columns: DataGridColumn[];
  visibleColumns: string[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onColumnToggle: (column: string) => void;
  onDownload: () => void;
  onReload: () => void;
  showFilters?: boolean;
  onToggleFilters?: () => void;
}

export const DataGridHeader: React.FC<DataGridHeaderProps> = ({
  columns,
  visibleColumns,
  loading,
  searchTerm,
  onSearchChange,
  onColumnToggle,
  onDownload,
  onReload,
  showFilters = true,
  onToggleFilters,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="relative w-full sm:w-72">
        <Input 
          placeholder="Search..."
          value={searchTerm}
          onChange={onSearchChange}
          className="pr-8"
        />
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Toggle
          pressed={showFilters}
          onPressedChange={onToggleFilters}
          aria-label={showFilters ? "Ocultar filtros" : "Mostrar filtros"}
          title={showFilters ? "Ocultar filtros" : "Mostrar filtros"}
        >
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
        </Toggle>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Columns3 className="h-4 w-4 mr-2" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.key}
                checked={visibleColumns.includes(column.key)}
                onCheckedChange={() => onColumnToggle(column.key)}
              >
                {column.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDownload}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Export
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onReload}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Loading
            </>
          ) : (
            <>
              <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                <path d="M16 21h5v-5"></path>
              </svg>
              Reload
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
