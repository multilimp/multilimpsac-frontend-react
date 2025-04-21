# Instrucciones para GitHub Copilot en el proyecto multilimp-react

## 📃 Contexto del Proyecto

Aplicación web empresarial llamada `multilimp-react`, basada en:

- **Framework:** React (v18+) + Vite
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS + shadcn/ui (Radix UI)
- **Estado Global:** Zustand
- **Cache de Servidor:** React Query (`@tanstack/react-query`)
- **Routing:** React Router DOM (v6+)
- **Backend:** Supabase (auth, base de datos) + posible API REST externa

## 🏛️ Arquitectura Basada en Feature-Sliced Design (FSD)

### 1. Capas del Proyecto

```plaintext
src/
├── app/                # Inicialización global, rutas, providers
├── pages/              # Páginas principales
├── widgets/            # Componentes UI autocontenidos
├── features/           # Funcionalidades con valor de negocio
├── entities/           # Modelos centrales (cliente, proveedor, etc.)
├── shared/             # Utilidades y componentes genéricos
└── types/              # Tipos globales
```

Cada slice (`features`, `entities`, etc.) puede contener:

```plaintext
[domain]/[feature-name]/
├── model/       # Lógica y estado (Zustand)
├── ui/          # Componentes UI
├── services/    # Integración API (React Query)
├── hooks/       # Hooks personalizados
├── lib/         # Funciones auxiliares
└── index.ts     # Public API del slice
```

### 2. Principios Clave

- **Separación estricta entre features, entidades y procesos**
- **Flujo de datos unidireccional**
- **Última palabra la tiene la lógica de negocio (`model/`)**
- **Comunicación entre slices solo a través de servicios bien definidos**
- **Estructura basada en dominios, no en tipos técnicos**

## ✅ Directrices para GitHub Copilot y la IA

- Sugerir código siguiendo el esquema modular y de slices
- No mezclar UI con lógica de negocio
- No generar dependencia cruzada entre slices
- Usar `model/` + `services/` para toda nueva lógica funcional
- Mantener consistencia en nomenclatura y arquitectura

## ⚖️ Convenciones de Código

- `camelCase` para variables y funciones
- `PascalCase` para componentes y tipos
- Imports ordenados: externos > internos
- Tipado estricto con TypeScript
- Documentar componentes y hooks complejos

## 📆 Patrones de Implementación

### Entidades (ej. Clientes)

```ts
// src/entities/client/model/client.store.ts
export const useClientStore = create<ClientState>((set) => ({
  clients: [],
  setClients: (clients) => set({ clients }),
}));
```

### Procesos (ej. Órdenes de Compra)

```ts
// src/features/purchase-orders/services/purchase-order.service.ts
export const usePurchaseOrder = (clientId: string) => {
  const client = useClientStore(state => state.getClient(clientId));

  return useQuery(['purchase-order', clientId], async () => {
    return await fetchPurchaseOrder(client.id);
  });
};
```

### Autenticación (ejemplo completo)

```ts
// src/features/auth/services/auth.service.ts
export const useAuth = () =>
  useQuery(['auth'], async () => {
    const response = await supabase.auth.getSession();
    return response.data;
  });

// src/features/auth/model/auth.store.ts
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

## 🔄 Beneficios Esperados

- Escalabilidad y mantenibilidad de largo plazo
- Claridad entre lógica, datos y presentación
- Reducción de dependencias cruzadas
- Facilitación del testing y reusabilidad
- Base sólida para colaborar en equipo

---

Copilot deberá sugerir código que respete esta estructura en toda nueva feature o mejora.
