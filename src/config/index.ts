// src/config/index.ts
import { environment as devEnvironment } from './environments/environment';
import { environment as prodEnvironment } from './environments/environment.prod';

// Determinar qué entorno usar basado en las variables de Vite
const isProduction = import.meta.env.PROD;

// Variables de Vite pueden sobreescribir valores específicos
const viteOverrides = {
  apiUrl: import.meta.env.VITE_API_URL,
  appName: import.meta.env.VITE_APP_NAME,
};

// Seleccionar environment base según el entorno
const baseEnvironment = isProduction ? prodEnvironment : devEnvironment;

// Combinar environment base con las variables de Vite (si existen)
export const environment = {
  ...baseEnvironment,
  ...Object.fromEntries(
    Object.entries(viteOverrides).filter(([_, value]) => value !== undefined)
  ),
  // Añadir otras variables generadas en tiempo de compilación
  buildDate: new Date().toISOString(),
  commitHash: import.meta.env.VITE_COMMIT_HASH || 'dev',
};

// Para debugging en desarrollo
if (!isProduction) {
  console.log('🔧 Environment:', environment);
}