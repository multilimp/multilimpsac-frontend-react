
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { 
  FileSearch, 
  ShoppingCart, 
  Package, 
  ClipboardList, 
  CreditCard, 
  FileText, 
  ReceiptText, 
  BookOpen 
} from "lucide-react";

// Pages
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import CompanyPage from "./pages/CompanyPage";
import ClientPage from "./pages/ClientPage";
import SupplierPage from "./pages/SupplierPage";
import TransportPage from "./pages/TransportPage";
import UserPage from "./pages/UserPage";
import ModulePage from "./pages/ModulePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Dashboard />} />
            
            {/* Directorio */}
            <Route path="/empresas" element={<CompanyPage />} />
            <Route path="/clientes" element={<ClientPage />} />
            <Route path="/proveedores" element={<SupplierPage />} />
            <Route path="/transportes" element={<TransportPage />} />
            <Route path="/usuarios" element={<UserPage />} />
            
            {/* Operaciones */}
            <Route path="/cotizaciones" element={
              <ModulePage 
                title="Cotizaciones" 
                description="Gestione las cotizaciones para sus clientes" 
                icon={<FileSearch className="h-8 w-8 text-multilimp-green" />} 
              />
            } />
            <Route path="/ventas" element={
              <ModulePage 
                title="Ventas" 
                description="Gestione las ventas a sus clientes" 
                icon={<ShoppingCart className="h-8 w-8 text-multilimp-green" />} 
              />
            } />
            <Route path="/ordenes" element={
              <ModulePage 
                title="Órdenes de Proveedores" 
                description="Gestione las órdenes a sus proveedores" 
                icon={<Package className="h-8 w-8 text-multilimp-green" />} 
              />
            } />
            <Route path="/seguimiento" element={
              <ModulePage 
                title="Seguimiento de Órdenes" 
                description="Realice el seguimiento de las órdenes" 
                icon={<ClipboardList className="h-8 w-8 text-multilimp-green" />} 
              />
            } />
            
            {/* Finanzas */}
            <Route path="/tesoreria" element={
              <ModulePage 
                title="Tesorería" 
                description="Gestione los movimientos de tesorería" 
                icon={<CreditCard className="h-8 w-8 text-multilimp-green" />} 
              />
            } />
            <Route path="/facturacion" element={
              <ModulePage 
                title="Facturación" 
                description="Gestione las facturas de ventas" 
                icon={<FileText className="h-8 w-8 text-multilimp-green" />} 
              />
            } />
            <Route path="/cobranzas" element={
              <ModulePage 
                title="Cobranzas" 
                description="Gestione las cobranzas a clientes" 
                icon={<ReceiptText className="h-8 w-8 text-multilimp-green" />} 
              />
            } />
            
            {/* Informes */}
            <Route path="/reportes" element={
              <ModulePage 
                title="Reportes" 
                description="Visualice los reportes del sistema" 
                icon={<BookOpen className="h-8 w-8 text-multilimp-green" />} 
              />
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
