
import React, { useState } from 'react';
import { useQuotations } from '../hooks/useQuotations';
import QuotationList from './QuotationList';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X, RefreshCw } from 'lucide-react';
import { Quotation } from '@/domain/quotation/models/quotation.model';

interface QuotationListWithFiltersProps {
  onEdit: (id: string) => void;
}

const QuotationListWithFilters: React.FC<QuotationListWithFiltersProps> = ({ onEdit }) => {
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    quotations,
    totalCount,
    totalPages,
    currentPage,
    isLoading,
    filters,
    updateFilter,
    clearFilters,
    setCurrentPage,
    refetch
  } = useQuotations();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter({ searchTerm: e.target.value });
  };

  const handleStatusChange = (status: string) => {
    if (status === 'all') {
      updateFilter({ status: undefined });
    } else {
      updateFilter({ status: status as Quotation['status'] });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative flex-1 w-full md:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Buscar cotización..."
            className="pl-9 w-full"
            value={filters.searchTerm || ''}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
          
          {(filters.status || filters.searchTerm || filters.fromDate || filters.toDate) && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Limpiar filtros
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado</label>
                <Select 
                  value={filters.status || 'all'} 
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="sent">Enviada</SelectItem>
                    <SelectItem value="approved">Aprobada</SelectItem>
                    <SelectItem value="rejected">Rechazada</SelectItem>
                    <SelectItem value="expired">Expirada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Desde</label>
                <Input 
                  type="date" 
                  value={filters.fromDate || ''}
                  onChange={(e) => updateFilter({ fromDate: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Hasta</label>
                <Input 
                  type="date" 
                  value={filters.toDate || ''}
                  onChange={(e) => updateFilter({ toDate: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="bg-card rounded-lg">
        <QuotationList 
          quotations={quotations}
          isLoading={isLoading}
          onRefresh={refetch}
          onEdit={onEdit}
        />
        
        {totalCount > 0 && (
          <div className="py-4 px-6 flex items-center justify-between border-t">
            <div className="text-sm text-muted-foreground">
              Mostrando {quotations.length} de {totalCount} resultados
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Anterior
              </Button>
              
              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotationListWithFilters;
