import React, { useMemo } from "react"; // Import useMemo
import { useLocation, Link } from "react-router-dom"; // Import Link
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemDef { // Renamed interface slightly for clarity
  label: string;
  path: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbNavProps {
  items?: BreadcrumbItemDef[];
}

// Define pathLabels outside the component/function
// Consider moving this to a central route configuration file
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
  // Add more labels as needed
};

// Function to generate breadcrumb items based on current path
// (Could also be moved to a utils file)
function generateBreadcrumbItems(path: string): BreadcrumbItemDef[] {
  if (path === "/") return [];

  const pathSegments = path.split("/").filter(Boolean);
  const breadcrumbItems: BreadcrumbItemDef[] = [];
  let currentPath = "";

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    // Basic dynamic segment handling placeholder:
    const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1); // Capitalize fallback

    breadcrumbItems.push({
      label: label,
      path: currentPath,
      isCurrentPage: index === pathSegments.length - 1
    });
  });

  return breadcrumbItems;
}


const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ items = [] }) => {
  const location = useLocation();

  // Memoize default items
  const defaultItems: BreadcrumbItemDef[] = useMemo(() => [
    { label: "Inicio", path: "/" }
  ], []);

  // Memoize generated items based on location.pathname and items prop
  const generatedItems = useMemo(() => {
    return items.length > 0 ? items : generateBreadcrumbItems(location.pathname);
  }, [location.pathname, items]);

  // Memoize the final list of all items
  const allItems = useMemo(() => [...defaultItems, ...generatedItems], [defaultItems, generatedItems]);

  return (
    <div className="px-4 py-2 bg-background/60 border-b mb-5">
      <Breadcrumb>
        <BreadcrumbList>
          {allItems.map((item, index) => (
            <React.Fragment key={item.path}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {item.isCurrentPage ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  // Use Link from react-router-dom via asChild
                  <BreadcrumbLink asChild>
                    <Link to={item.path}>
                      {index === 0 ? (
                        <span className="flex items-center">
                          <Home className="w-3.5 h-3.5 mr-1" />
                          {item.label}
                        </span>
                      ) : (
                        item.label
                      )}
                    </Link>
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

export default BreadcrumbNav;