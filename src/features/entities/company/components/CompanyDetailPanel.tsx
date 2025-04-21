
import React from 'react';
import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Company } from '../models/company.model';
import { Button } from '@/components/ui/button';

export interface CompanyDetailPanelProps {
  company: Company;
  onViewCatalogs?: (company: Company) => void;
}

const CompanyDetailPanel: React.FC<CompanyDetailPanelProps> = ({ company, onViewCatalogs }) => {
  const renderContactInfo = () => (
    <div className="grid gap-4">
      {company.telefono && (
        <div className="flex items-start">
          <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
          <div>
            <p className="text-muted-foreground text-sm">Teléfono</p>
            <p>{company.telefono}</p>
          </div>
        </div>
      )}
      
      {company.correo && (
        <div className="flex items-start">
          <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
          <div>
            <p className="text-muted-foreground text-sm">Correo</p>
            <p>{company.correo}</p>
          </div>
        </div>
      )}
      
      {company.web && (
        <div className="flex items-start">
          <ExternalLink className="h-5 w-5 mr-2 text-muted-foreground" />
          <div>
            <p className="text-muted-foreground text-sm">Sitio Web</p>
            <p>{company.web}</p>
          </div>
        </div>
      )}
      
      {company.direccion && (
        <div className="flex items-start">
          <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
          <div>
            <p className="text-muted-foreground text-sm">Dirección</p>
            <p>{company.direccion}</p>
            <p className="text-sm text-muted-foreground">
              {[company.distrito, company.provincia, company.departamento]
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <p className="text-muted-foreground text-sm">Razón Social</p>
              <p className="font-medium">{company.razonSocial}</p>
            </div>
            
            <div>
              <p className="text-muted-foreground text-sm">RUC</p>
              <p>{company.ruc}</p>
            </div>
            
            {company.codUnidad && (
              <div>
                <p className="text-muted-foreground text-sm">Código de Unidad</p>
                <p>{company.codUnidad}</p>
              </div>
            )}
            
            <div>
              <p className="text-muted-foreground text-sm">Estado</p>
              <p>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  company.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {company.estado ? 'Activo' : 'Inactivo'}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Contacto</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContactInfo()}
        </CardContent>
      </Card>
      
      {onViewCatalogs && (
        <Card className="md:col-span-2">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle>Catálogos</CardTitle>
            <Button variant="outline" onClick={() => onViewCatalogs(company)}>
              Ver Catálogos
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Gestione los catálogos asociados a esta empresa.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompanyDetailPanel;
