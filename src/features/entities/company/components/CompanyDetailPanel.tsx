
import React from 'react';
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";
import { Company } from "../models/company.model";

interface CompanyDetailPanelProps {
  company: Company;
  onViewCatalogs: (company: Company) => void;
}

const CompanyDetailPanel: React.FC<CompanyDetailPanelProps> = ({ company, onViewCatalogs }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div>
        <h3 className="text-lg font-medium">Información General</h3>
        <div className="mt-2 space-y-2">
          <div>
            <span className="font-medium">Razón Social:</span> {company.name}
          </div>
          <div>
            <span className="font-medium">RUC:</span> {company.ruc}
          </div>
          <div>
            <span className="font-medium">Estado:</span> {company.status === "active" ? "Activo" : "Inactivo"}
          </div>
          <div>
            <span className="font-medium">Teléfono:</span> {company.phone || "No registrado"}
          </div>
          <div>
            <span className="font-medium">Email:</span> {company.email || "No registrado"}
          </div>
          <div>
            <span className="font-medium">Web:</span> {company.web || "No registrado"}
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium">Ubicación</h3>
        <div className="mt-2 space-y-2">
          <div>
            <span className="font-medium">Dirección:</span> {company.address || "No registrada"}
          </div>
          <div>
            <span className="font-medium">Departamento:</span> {company.departamento || "No registrado"}
          </div>
          <div>
            <span className="font-medium">Provincia:</span> {company.provincia || "No registrado"}
          </div>
          <div>
            <span className="font-medium">Distrito:</span> {company.distrito || "No registrado"}
          </div>
        </div>
      </div>
      <div className="md:col-span-2">
        <Button 
          onClick={() => onViewCatalogs(company)} 
          className="mt-4"
          variant="outline"
        >
          <ListFilter className="mr-2 h-4 w-4" />
          Ver Catálogos
        </Button>
      </div>
    </div>
  );
};

export default CompanyDetailPanel;
