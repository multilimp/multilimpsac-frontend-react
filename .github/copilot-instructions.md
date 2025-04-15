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
* **Arquitectura:** Modular / Feature-Sliced Design. El código se organiza principalmente en `src/features`, `src/components`, `src/app`, `src/core`, `src/layouts`, ``, `src/store`, `src/integrations`.

## Directrices Generales

1. **Sigue la Arquitectura:**
    * Coloca la lógica de negocio específica de un dominio dentro de la carpeta `src/features` correspondiente.
    * Los componentes de UI reutilizables y no específicos de una feature van en `src/components/ui` (para shadcn) o `src/components/shared` (para componentes personalizados generales).
    * Las páginas van en `` o dentro de la carpeta `pages` de una feature específica.
    * Las utilidades globales y hooks van en `src/core/utils` o `src/core/hooks`.
    * La configuración de rutas está en `src/app/routes`.
    * La configuración del cliente API/Supabase está en `src/app/core/api` y `src/integrations/supabase`.
2. **Usa las Tecnologías Establecidas:**
    * Prefiere componentes de `shadcn-ui` (`@/components/ui`) para la interfaz de usuario.
    * Usa Tailwind CSS para estilizar. Evita CSS/SCSS simple a menos que sea estrictamente necesario.
    * Utiliza `React Query` para interactuar con el backend (fetching, caching, mutations). Define los servicios que usan React Query dentro de las features correspondientes (`src/features/*/services`).
    * Usa `Zustand` para el estado global (`src/store`).
    * Interactúa con Supabase a través del cliente configurado en `src/integrations/supabase`.
3. **Estilo de Código y Convenciones:**
    * Escribe TypeScript estricto. Usa tipos claros y definidos (interfaces o types). Aprovecha los tipos generados por Supabase (`src/integrations/supabase/types.ts`).
    * Usa componentes funcionales de React con Hooks.
    * Sigue las convenciones de nomenclatura existentes (camelCase para variables/funciones, PascalCase para componentes/tipos/interfaces).
    * Mantén el código limpio, legible y bien comentado cuando la lógica sea compleja.
    * Usa las importaciones con alias (`@/`) configuradas en `tsconfig.json`.
4. **Generación de Código:**
    * Al generar componentes, incluye las importaciones necesarias.
    * Al sugerir código que interactúa con datos, considera el uso de React Query.
    * Al manejar estado global, usa el store de Zustand existente o sugiere cómo crear uno nuevo si es necesario.
    * Asegúrate de que el código propuesto sea consistente con el resto de la base de código.

## Ejemplo de Interacción

**Usuario:** "Crea un servicio para obtener la lista de clientes usando React Query."

**Copilot (Esperado):** Sugeriría un archivo como `src/features/client/services/client.service.ts` que use `useQuery` de React Query y el cliente Supabase (o el cliente API) para buscar los datos, incluyendo los tipos apropiados.
