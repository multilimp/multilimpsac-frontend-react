
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, X, RefreshCw, Info } from 'lucide-react';
import { supabase, checkSupabaseConnection } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Constante para verificar si estamos en modo demo (debe coincidir con la del AuthContext)
const DEMO_MODE = true;

/**
 * Componente para probar la conexión a Supabase
 * Solo visible en desarrollo
 */
const SupabaseConnectionTester: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [connectionOk, setConnectionOk] = useState<boolean | null>(null);
  const [authOk, setAuthOk] = useState<boolean | null>(null);
  const [usuariosOk, setUsuariosOk] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { connectionStatus, refreshSession } = useAuth();

  const checkConnection = async () => {
    setIsChecking(true);
    setError(null);
    
    try {
      // Si estamos en modo demo, simulamos algunos resultados
      if (DEMO_MODE) {
        // Simulamos que la conexión básica funciona pero hay problemas con usuarios
        setConnectionOk(true);
        setAuthOk(true);
        setUsuariosOk(false);
        setError('Error simulado en modo demo: Error al acceder a usuarios (500 Internal Server Error)');
        setIsChecking(false);
        return;
      }
      
      // Probar conexión básica
      const isConnected = await checkSupabaseConnection();
      setConnectionOk(isConnected);
      
      if (!isConnected) {
        throw new Error('No se pudo conectar a Supabase');
      }
      
      // Probar autenticación anónima
      const { data: authData, error: authError } = await supabase.auth.getSession();
      setAuthOk(!authError);
      
      if (authError) {
        throw new Error(`Error de autenticación: ${authError.message}`);
      }
      
      // Probar acceso a tabla usuarios - use the proper table name 'users'
      const { error: usuariosError } = await supabase
        .from('users')  // Changed from 'usuarios' to 'users'
        .select('count', { count: 'exact', head: true });
      
      setUsuariosOk(!usuariosError);
      
      if (usuariosError) {
        throw new Error(`Error al acceder a usuarios: ${usuariosError.message}`);
      }
    } catch (err: any) {
      console.error('Error en prueba de conexión:', err);
      setError(err.message || 'Error desconocido');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Ejecutar prueba al montar el componente
    checkConnection();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Estado de Supabase
          {DEMO_MODE ? (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Modo Demo
            </Badge>
          ) : (
            <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'}>
              {connectionStatus === 'connected' ? 'Conectado' : 
              connectionStatus === 'disconnected' ? 'Desconectado' : 'Verificando'}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Diagnóstico de conexión a Supabase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {DEMO_MODE && (
          <Alert className="mb-4 bg-blue-50 border-blue-200 text-blue-800">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm">
              Modo demo activado. La autenticación está desactivada pero se mantiene la conexión a Supabase.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Conexión básica:</span>
            {isChecking ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : connectionOk === null ? (
              <span className="text-sm text-muted-foreground">No verificado</span>
            ) : connectionOk ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Autenticación:</span>
            {isChecking ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : authOk === null ? (
              <span className="text-sm text-muted-foreground">No verificado</span>
            ) : authOk ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Acceso a usuarios:</span>
            {isChecking ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : usuariosOk === null ? (
              <span className="text-sm text-muted-foreground">No verificado</span>
            ) : usuariosOk ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
        
        {DEMO_MODE && !error && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 text-sm">
            En modo demo, algunos errores son simulados para mostrar el comportamiento esperado.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={checkConnection} 
          disabled={isChecking}
          className="flex items-center gap-2"
        >
          {isChecking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Verificar conexión
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshSession} 
          disabled={isChecking || DEMO_MODE}
          className="flex items-center gap-2"
        >
          Actualizar sesión
          {DEMO_MODE && <span className="text-xs text-gray-500 ml-1">(desactivado en demo)</span>}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SupabaseConnectionTester;
