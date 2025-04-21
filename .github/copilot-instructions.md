# Instrucciones para GitHub Copilot en el proyecto multilimp-react

## Contexto del Proyecto

Estás trabajando en `multilimp-react`, una aplicación web construida con:

* **Framework:** React (v18+) con Vite
* **Lenguaje:** TypeScript
* **Estilos:** Tailwind CSS y shadcn-ui (basado en Radix UI)
* **Gestión de Estado:**
  * Estado Global: Zustand
  * Estado del Servidor/Caché: React Query (`@tanstack/react-query`)
* **Routing:** React Router DOM (v6+)
* **Backend/Integraciones:** Supabase (para autenticación y base de datos) y potencialmente una API REST separada.

## Estructura y Arquitectura del Proyecto

### 1. Estructura Modular Base

```plaintext
src/
├── app/                # Configuración global de la app
│   ├── routes/         # Rutas principales
│   ├── providers/      # Providers globales
│   └── core/           # Configuración general
├── features/           
│   ├── entities/       # Gestión de Entidades
│   │   ├── client/     # Gestión de Clientes
│   │   ├── supplier/   # Gestión de Proveedores
│   │   ├── transport/  # Gestión de Transportes
│   │   ├── company/    # Gestión de Empresas
│   │   └── user/       # Gestión de Usuarios
│   └── processes/      # Procesos de Negocio
│       ├── quotation/  # Cotizaciones
│       ├── sales/      # Ventas
│       ├── purchase-orders/ # Órdenes de Compra
│       ├── treasury/   # Tesorería
│       ├── tracking/   # Seguimientos
│       ├── billing/    # Facturación
│       └── collections/ # Cobranzas
├── components/         
│   ├── entities/       # Componentes de Entidades
│   ├── processes/      # Componentes de Procesos
│   └── shared/         # Componentes Compartidos
├── store/              # Estado Global
│   ├── entities/       # Estados de Entidades
│   └── processes/      # Estados de Procesos
└── types/             # Tipos Globales
```

### 2. Modularidad y Separación de Dominios

Cada feature debe mantener una separación estricta entre entidades y procesos:

```plaintext
src/features/[domain]/[feature-name]/
├── ui/                 # Componentes específicos de la feature
├── model/             # Lógica de negocio y tipos
├── services/          # Servicios de API
└── hooks/             # Hooks específicos
```

### 3. Principios de Diseño

1. **Separación de Dominios:**
   * Las entidades (clients, suppliers, etc.) no deben depender de los procesos
   * Los procesos pueden consumir entidades a través de interfaces definidas
   * Evitar acoplamiento directo entre componentes de diferentes dominios

2. **Gestión de Estado:**
   * Estados de entidades y procesos separados en diferentes stores
   * Usar interfaces para la comunicación entre dominios
   * Mantener la consistencia de datos entre dominios

3. **Comunicación entre Dominios:**
   * Usar servicios intermediarios para la comunicación entre entidades y procesos
   * Implementar interfaces claras para el consumo de entidades en procesos
   * Mantener la unidireccionalidad del flujo de datos

## Directrices Generales

1. **Desarrollo de Features:**
   * Crear nuevas features siguiendo la estructura modular establecida
   * Mantener la lógica de negocio separada de la UI
   * Usar tipos TypeScript estrictos

2. **Componentes:**
   * Componentes de UI básicos en `src/components/ui`
   * Componentes complejos reutilizables en `src/components/shared`
   * Componentes específicos de feature en su carpeta correspondiente

3. **Estado y Datos:**
   * Usar React Query para interacciones con el backend
   * Implementar stores de Zustand por dominio funcional
   * Mantener la persistencia de datos consistente

4. **Convenciones de Código:**
   * Nombres descriptivos en camelCase/PascalCase según corresponda
   * Documentación clara en componentes y funciones complejas
   * Tests para lógica de negocio crítica

## Directrices de Implementación

1. **Para Entidades (src/features/entities):**

```typescript
// src/features/entities/client/types.ts
export interface Client {
  id: string;
  name: string;
  // ...otros campos
}

// src/features/entities/client/model/client.store.ts
export const useClientStore = create<ClientState>((set) => ({
  clients: [],
  setClients: (clients) => set({ clients }),
}));
```

2. **Para Procesos (src/features/processes):**

```typescript
// src/features/processes/purchase-orders/services/purchase-order.service.ts
export const usePurchaseOrder = (clientId: string) => {
  const client = useClientStore(state => state.getClient(clientId));
  
  return useQuery(['purchase-order', clientId], async () => {
    // Lógica específica del proceso
    return data;
  });
};
```

## Ejemplo de Implementación

Para una nueva feature, seguir este patrón:

```typescript
// src/features/auth/services/auth.service.ts
export const useAuth = () => {
  return useQuery(['auth'], async () => {
    const response = await supabase.auth.getSession();
    return response.data;
  });
};

// src/features/auth/model/auth.store.ts
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

Esta estructura garantiza:

* Clara separación entre entidades y procesos
* Evita dependencias circulares
* Facilita el mantenimiento y escalabilidad
* Permite la reutilización de entidades en diferentes procesos
