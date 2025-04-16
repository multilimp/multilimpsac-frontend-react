import React from 'react';
import { DataGridColumn } from "@/components/ui/data-grid/types";
import { EntityDataTable } from "@/features/shared/components/entity-data-table";
import { Company } from "../models/company.model";

interface CompanyDataTableProps {
  companies: Company[];
  isLoading: boolean;
  onReload: () => void;
  onSave: (data: Partial<Company>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  renderDetailPanel: (company: Company) => React.ReactNode;
  renderFormContent: (data: Partial<Company>, onChange: (field: string, value: any) => void) => React.ReactNode;
}

const CompanyDataTable: React.FC<CompanyDataTableProps> = ({
  companies,
  isLoading,
  onReload,
  onSave,
  onDelete,
  renderDetailPanel,
  renderFormContent
}) => {
  const columns: DataGridColumn[] = [
    { key: 'id', name: 'ID', type: 'string', sortable: true, filterable: true },
    { key: 'name', name: 'Empresa', type: 'string', sortable: true, filterable: true },
    { key: 'ruc', name: 'RUC', type: 'string', sortable: true, filterable: true },
    { key: 'contact', name: 'Contacto', type: 'string', sortable: true, filterable: true },
    { key: 'phone', name: 'Teléfono', type: 'string', sortable: true, filterable: true },
    { key: 'email', name: 'Email', type: 'string', sortable: true, filterable: true },
    { key: 'status', name: 'Estado', type: 'string', sortable: true, filterable: true },
  ];

  // Definir EntityDataTable tipado con Company antes del JSX
  const TypedEntityDataTable = EntityDataTable as React.ComponentType<any>;

  return (
    <TypedEntityDataTable
      title="Empresas"
      description="Gestione las empresas en el sistema"
      data={companies}
      isLoading={isLoading}
      columns={columns}
      onReload={onReload}
      renderDetailPanel={renderDetailPanel}
      renderFormContent={renderFormContent}
      onSave={onSave}
      onDelete={onDelete}
      addButtonText="Agregar Empresa"
      domain="company"
      permissionScope="companies"
    />
  );
};

export default CompanyDataTable;
