
import React from "react";
import { useLocation } from "react-router-dom";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  label: string;
  path: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbNavProps {
  items?: BreadcrumbItem[];
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ items = [] }) => {
  const location = useLocation();
  
  // Default breadcrumb starts with Home
  const defaultItems: BreadcrumbItem[] = [
    { label: "Inicio", path: "/" }
  ];
  
  // If no items are provided, generate based on current path
  const breadcrumbItems = items.length > 0 
    ? items 
    : generateBreadcrumbItems(location.pathname);
  
  // Combine default with provided/generated items
  const allItems = [...defaultItems, ...breadcrumbItems];

  return (
    <div className="px-4 py-2 bg-background/60 border-b">
      <Breadcrumb>
        <BreadcrumbList>
          {allItems.map((item, index) => (
            <React.Fragment key={item.path}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {item.isCurrentPage ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.path}>
                    {index === 0 ? (
                      <span className="flex items-center">
                        <Home className="w-3.5 h-3.5 mr-1" />
                        {item.label}
                      </span>
                    ) : (
                      item.label
                    )}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

// Function to generate breadcrumb items based on current path
function generateBreadcrumbItems(path: string): BreadcrumbItem[] {
  if (path === "/") return [];
  
  const pathSegments = path.split("/").filter(Boolean);
  const breadcrumbItems: BreadcrumbItem[] = [];
  
  // Map from path segments to readable labels
  const pathLabels: Record<string, string> = {
    "cotizaciones": "Cotizaciones",
    "ventas": "Ventas",
    "ordenes": "Órdenes",
    "seguimiento": "Seguimiento",
    "tesoreria": "Tesorería",
    "facturacion": "Facturación",
    "cobranzas": "Cobranzas",
    "reportes": "Reportes",
    "empresas": "Empresas",
    "clientes": "Clientes",
    "proveedores": "Proveedores",
    "transportes": "Transportes",
    "usuarios": "Usuarios",
    "perfil": "Perfil",
    "configuracion": "Configuración"
  };

  let currentPath = "";
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    breadcrumbItems.push({
      label: pathLabels[segment] || segment,
      path: currentPath,
      isCurrentPage: index === pathSegments.length - 1
    });
  });
  
  return breadcrumbItems;
}

export default BreadcrumbNav;
