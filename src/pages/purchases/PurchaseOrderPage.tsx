
import React, { useEffect } from "react";
import { useNavigate, useLocation, Outlet, Routes, Route } from "react-router-dom";
import { ShoppingCart, FileText, Package, Truck } from "lucide-react";
import SecondaryNavWrapper from "@/components/layout/SecondaryNavWrapper";
import PageWithSecondaryNav from "@/components/layout/PageWithSecondaryNav";
import PageHeader from "@/components/common/PageHeader";
import PurchaseOrderList from "../../components/purchases/PurchaseOrderList";
import PurchaseOrderForm from "../../components/purchases/PurchaseOrderForm";
import SupplierOrderList from "../../components/purchases/SupplierOrderList";
import TransportAssignmentList from "../../components/purchases/TransportAssignmentList";

const navItems = [
  {
    label: "Órdenes de Compra",
    path: "/ordenes",
    icon: ShoppingCart
  },
  {
    label: "Detalle OC",
    path: "/ordenes/detalle",
    icon: FileText
  },
  {
    label: "Órdenes de Proveedores",
    path: "/ordenes/proveedores",
    icon: Package
  },
  {
    label: "Transportes",
    path: "/ordenes/transportes",
    icon: Truck
  }
];

const PurchaseOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Si estamos en la ruta principal, redirigir a la primera subruta
    if (location.pathname === "/ordenes") {
      navigate("/ordenes", { replace: true });
    }
  }, [location.pathname, navigate]);
  
  return (
    <SecondaryNavWrapper 
      navItems={navItems}
      title="Gestión de Órdenes"
    >
      <PageWithSecondaryNav>
        <Outlet />
      </PageWithSecondaryNav>
    </SecondaryNavWrapper>
  );
};

// Componente para la página principal de Órdenes de Compra
const PurchaseOrdersMain: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Órdenes de Compra" 
        subtitle="Gestione las órdenes de compra de clientes" 
        showAddButton 
        addButtonText="Nueva Orden"
        onAddClick={() => {}}
      />
      <PurchaseOrderList />
    </div>
  );
};

// Componente para la página de detalle de OC
const PurchaseOrderDetail: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Detalle de Orden de Compra" 
        subtitle="Visualice y edite los detalles de la orden"
      />
      <PurchaseOrderForm />
    </div>
  );
};

// Componente para la página de Órdenes de Proveedores
const SupplierOrdersPage: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Órdenes de Proveedores" 
        subtitle="Gestione las órdenes a proveedores"
        showAddButton 
        addButtonText="Nueva OP"
        onAddClick={() => {}}
      />
      <SupplierOrderList />
    </div>
  );
};

// Componente para la página de asignación de transportes
const TransportAssignmentPage: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Asignación de Transportes" 
        subtitle="Gestione los transportes para las órdenes"
      />
      <TransportAssignmentList />
    </div>
  );
};

// Configuración de rutas
export const PurchaseOrderRoutes = () => (
  <Routes>
    <Route path="/" element={<PurchaseOrderPage />}>
      <Route index element={<PurchaseOrdersMain />} />
      <Route path="detalle" element={<PurchaseOrderDetail />} />
      <Route path="proveedores" element={<SupplierOrdersPage />} />
      <Route path="transportes" element={<TransportAssignmentPage />} />
    </Route>
  </Routes>
);

export default PurchaseOrderPage;
