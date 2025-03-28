
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
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
import { AuthProvider } from "@/contexts/AuthContext";
import { SecondaryNavProvider } from "@/contexts/SecondaryNavContext";
import { RequireAuth, RedirectIfAuthenticated } from "@/core/utils/guards";
import { initializeAuthStore } from "@/store/authStore";

// Lazy load pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const LoginPage = lazy(() => import("./features/auth/pages/LoginPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CompanyPage = lazy(() => import("./pages/CompanyPage"));
const ClientPage = lazy(() => import("./pages/ClientPage"));
const SupplierPage = lazy(() => import("./pages/SupplierPage"));
const TransportPage = lazy(() => import("./pages/TransportPage"));
const UserPage = lazy(() => import("./pages/UserPage"));
const ModulePage = lazy(() => import("./pages/ModulePage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const SalesReportPage = lazy(() => import("./pages/reports/SalesReportPage"));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-multilimp-green text-lg">Cargando módulo...</div>
  </div>
);

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize auth store
    initializeAuthStore();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SecondaryNavProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Public routes */}
                  <Route 
                    path="/login" 
                    element={
                      <RedirectIfAuthenticated>
                        <LoginPage />
                      </RedirectIfAuthenticated>
                    } 
                  />
                  
                  {/* Protected routes */}
                  <Route 
                    path="/" 
                    element={
                      <RequireAuth>
                        <Dashboard />
                      </RequireAuth>
                    } 
                  />
                  
                  {/* Directorio */}
                  <Route 
                    path="/empresas" 
                    element={
                      <RequireAuth>
                        <CompanyPage />
                      </RequireAuth>
                    } 
                  />
                  <Route 
                    path="/clientes" 
                    element={
                      <RequireAuth>
                        <ClientPage />
                      </RequireAuth>
                    } 
                  />
                  <Route 
                    path="/proveedores" 
                    element={
                      <RequireAuth>
                        <SupplierPage />
                      </RequireAuth>
                    } 
                  />
                  <Route 
                    path="/transportes" 
                    element={
                      <RequireAuth>
                        <TransportPage />
                      </RequireAuth>
                    } 
                  />
                  <Route 
                    path="/usuarios" 
                    element={
                      <RequireAuth>
                        <UserPage />
                      </RequireAuth>
                    } 
                  />
                  
                  {/* Operaciones/Procesos */}
                  <Route 
                    path="/cotizaciones" 
                    element={
                      <RequireAuth>
                        <ModulePage 
                          title="Cotizaciones" 
                          description="Gestione las cotizaciones para sus clientes" 
                          icon={<FileSearch className="h-8 w-8 text-multilimp-green" />} 
                        />
                      </RequireAuth>
                    } 
                  />
                  <Route 
                    path="/ventas" 
                    element={
                      <RequireAuth>
                        <ModulePage 
                          title="Ventas" 
                          description="Gestione las ventas a sus clientes" 
                          icon={<ShoppingCart className="h-8 w-8 text-multilimp-green" />} 
                        />
                      </RequireAuth>
                    } 
                  />
                  <Route 
                    path="/ordenes" 
                    element={
                      <RequireAuth>
                        <ModulePage 
                          title="Órdenes de Proveedores" 
                          description="Gestione las órdenes a sus proveedores" 
                          icon={<Package className="h-8 w-8 text-multilimp-green" />} 
                        />
                      </RequireAuth>
                    } 
                  />
                  <Route 
                    path="/seguimiento" 
                    element={
                      <RequireAuth>
                        <ModulePage 
                          title="Seguimiento de Órdenes" 
                          description="Realice el seguimiento de las órdenes" 
                          icon={<ClipboardList className="h-8 w-8 text-multilimp-green" />} 
                        />
                      </RequireAuth>
                    } 
                  />
                  
                  {/* Finanzas */}
                  <Route 
                    path="/tesoreria" 
                    element={
                      <RequireAuth>
                        <ModulePage 
                          title="Tesorería" 
                          description="Gestione los movimientos de tesorería" 
                          icon={<CreditCard className="h-8 w-8 text-multilimp-green" />} 
                        />
                      </RequireAuth>
                    } 
                  />
                  <Route 
                    path="/facturacion" 
                    element={
                      <RequireAuth>
                        <ModulePage 
                          title="Facturación" 
                          description="Gestione las facturas de ventas" 
                          icon={<FileText className="h-8 w-8 text-multilimp-green" />} 
                        />
                      </RequireAuth>
                    } 
                  />
                  <Route 
                    path="/cobranzas" 
                    element={
                      <RequireAuth>
                        <ModulePage 
                          title="Cobranzas" 
                          description="Gestione las cobranzas a clientes" 
                          icon={<ReceiptText className="h-8 w-8 text-multilimp-green" />} 
                        />
                      </RequireAuth>
                    } 
                  />
                  
                  {/* Reportes */}
                  <Route 
                    path="/reportes/ventas" 
                    element={
                      <RequireAuth>
                        <SalesReportPage />
                      </RequireAuth>
                    } 
                  />
                  <Route 
                    path="/reportes/cobranzas" 
                    element={
                      <RequireAuth>
                        <ModulePage 
                          title="Reporte de Cobranzas" 
                          description="Visualice los reportes de cobranzas" 
                          icon={<ReceiptText className="h-8 w-8 text-multilimp-green" />} 
                        />
                      </RequireAuth>
                    } 
                  />
                  <Route 
                    path="/reportes/entregas" 
                    element={
                      <RequireAuth>
                        <ModulePage 
                          title="Reporte de Entregas OC" 
                          description="Visualice los reportes de entregas de órdenes de compra" 
                          icon={<Package className="h-8 w-8 text-multilimp-green" />} 
                        />
                      </RequireAuth>
                    } 
                  />
                  <Route 
                    path="/reportes/ranking" 
                    element={
                      <RequireAuth>
                        <ModulePage 
                          title="Ranking" 
                          description="Visualice el ranking de ventas y clientes" 
                          icon={<BookOpen className="h-8 w-8 text-multilimp-green" />} 
                        />
                      </RequireAuth>
                    } 
                  />
                  
                  {/* Perfil y Configuración */}
                  <Route 
                    path="/perfil" 
                    element={
                      <RequireAuth>
                        <ProfilePage />
                      </RequireAuth>
                    } 
                  />
                  <Route 
                    path="/configuracion" 
                    element={
                      <RequireAuth>
                        <SettingsPage />
                      </RequireAuth>
                    } 
                  />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </SecondaryNavProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
