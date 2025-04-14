
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, checkSupabaseConnection, checkTableAccess, SUPABASE_URL } from '@/integrations/supabase/client';
import SupabaseConnectionTester from '@/components/dev/SupabaseConnectionTester';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Importar la URL de Supabase
import { SUPABASE_URL } from '@/integrations/supabase/client';

interface TableStatus {
  name: string;
  exists: boolean;
  error?: string;
  checking: boolean;
}

const DiagnosticPage: React.FC = () => {
  const { connectionStatus, refreshSession } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [authStatus, setAuthStatus] = useState<{status: 'unknown' | 'success' | 'error', message: string}>({
    status: 'unknown',
    message: 'No verificado'
  });
  const [tablesStatus, setTablesStatus] = useState<TableStatus[]>([
    { name: 'profiles', exists: false, checking: false },
    { name: 'clientes', exists: false, checking: false },
    { name: 'proveedores', exists: false, checking: false },
    { name: 'productos', exists: false, checking: false }
  ]);

  const checkConnection = async () => {
    setIsChecking(true);
    
    try {
      // Verificar URL de Supabase
      setSupabaseUrl(SUPABASE_URL);
      
      // Verificar conexión básica
      const isConnected = await checkSupabaseConnection();
      
      if (!isConnected) {
        setAuthStatus({
          status: 'error',
          message: 'No se pudo establecer conexión con Supabase'
        });
        setIsChecking(false);
        return;
      }
      
      // Verificar autenticación
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setAuthStatus({
          status: 'error',
          message: `Error de autenticación: ${error.message}`
        });
      } else {
        setAuthStatus({
          status: 'success',
          message: data.session ? 'Sesión activa' : 'Sin sesión activa, pero servicio disponible'
        });
      }
      
      // Verificar tablas
      const updatedTablesStatus = [...tablesStatus];
      
      for (let i = 0; i < updatedTablesStatus.length; i++) {
        const table = updatedTablesStatus[i];
        table.checking = true;
        setTablesStatus([...updatedTablesStatus]);
        
        const { exists, error } = await checkTableAccess(table.name);
        
        updatedTablesStatus[i] = {
          ...table,
          exists,
          error: error,
          checking: false
        };
        
        setTablesStatus([...updatedTablesStatus]);
      }
    } catch (error: any) {
      console.error('Error en diagnóstico:', error);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-3xl font-bold">Diagnóstico del Sistema</h1>
        <p className="text-muted-foreground">
          Esta página te ayuda a diagnosticar problemas de conexión con Supabase y otros servicios.
        </p>
        
        <Tabs defaultValue="connection">
          <TabsList>
            <TabsTrigger value="connection">Conexión</TabsTrigger>
            <TabsTrigger value="tables">Tablas</TabsTrigger>
            <TabsTrigger value="advanced">Avanzado</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connection" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Estado de la Conexión</CardTitle>
                <CardDescription>
                  Información sobre la conexión a Supabase
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">URL de Supabase:</span>
                      <span>{supabaseUrl || 'No verificado'}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="font-medium">Estado de conexión:</span>
                      <span className={
                        connectionStatus === 'connected' ? 'text-green-600' :
                        connectionStatus === 'disconnected' ? 'text-red-600' :
                        'text-yellow-600'
                      }>
                        {connectionStatus === 'connected' ? 'Conectado' :
                         connectionStatus === 'disconnected' ? 'Desconectado' :
                         'Verificando...'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="font-medium">Autenticación:</span>
                      <span className={
                        authStatus.status === 'success' ? 'text-green-600' :
                        authStatus.status === 'error' ? 'text-red-600' :
                        'text-muted-foreground'
                      }>
                        {authStatus.message}
                      </span>
                    </div>
                  </div>
                  
                  <Alert variant={connectionStatus === 'connected' ? 'default' : 'destructive'}>
                    {connectionStatus === 'connected' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                    <AlertTitle>
                      {connectionStatus === 'connected' ? 'Conexión establecida' : 'Problema de conexión'}
                    </AlertTitle>
                    <AlertDescription>
                      {connectionStatus === 'connected' 
                        ? 'La conexión con Supabase está funcionando correctamente.'
                        : 'No se puede conectar con Supabase. Verifica tu conexión a internet y que el servicio esté disponible.'}
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  onClick={checkConnection} 
                  disabled={isChecking}
                  className="flex items-center gap-2"
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Verificar conexión
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={refreshSession} 
                  disabled={isChecking}
                >
                  Actualizar sesión
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="tables" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Estado de las Tablas</CardTitle>
                <CardDescription>
                  Verifica el acceso a las tablas necesarias para el funcionamiento del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tablesStatus.map((table) => (
                    <div key={table.name} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <span className="font-medium">{table.name}</span>
                        {table.error && (
                          <p className="text-sm text-red-600 mt-1">{table.error}</p>
                        )}
                      </div>
                      
                      {table.checking ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : table.exists ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={checkConnection} 
                  disabled={isChecking}
                  className="flex items-center gap-2"
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Verificar tablas
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced">
            <SupabaseConnectionTester />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DiagnosticPage;
