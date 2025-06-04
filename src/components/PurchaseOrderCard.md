# PurchaseOrderCard Component

Un componente reutilizable para mostrar la información de una orden de compra OCGRU660.

## Características

- **Reutilizable**: Se puede usar en múltiples partes de la aplicación
- **Configurable**: Permite personalizar datos, mostrar/ocultar secciones y estilos
- **Tipado**: Incluye tipos TypeScript para mayor seguridad
- **Flexible**: Soporta datos personalizados o usa datos por defecto

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `data` | `PurchaseOrderData` | `defaultData` | Datos de la orden de compra |
| `showAccordions` | `boolean` | `true` | Mostrar/ocultar secciones expandibles |
| `elevation` | `number` | `2` | Elevación de la tarjeta Material-UI |
| `sx` | `object` | `{}` | Estilos personalizados |

## Ejemplos de uso

### Uso básico (datos por defecto)
```tsx
import PurchaseOrderCard from '@/components/PurchaseOrderCard';

<PurchaseOrderCard />
```

### Con datos personalizados
```tsx
import PurchaseOrderCard from '@/components/PurchaseOrderCard';

const customData = {
  codigo: 'OCGRU123',
  fecha: '15/12/2025',
  fechaMaxima: 'Dec 25, 2025',
  opImporteTotal: 'S/ 15000.00',
  ocImporteTotal: 'S/ 15000.00'
};

<PurchaseOrderCard 
  data={customData}
  showAccordions={true}
  elevation={3}
/>
```

### Sin secciones expandibles
```tsx
<PurchaseOrderCard 
  showAccordions={false}
  elevation={1}
/>
```

### Con estilos personalizados
```tsx
<PurchaseOrderCard 
  sx={{ 
    maxWidth: 400, 
    margin: 'auto',
    borderRadius: 3
  }}
/>
```

## Ubicaciones de uso

1. **ProviderOrderFormContent**: Formulario de creación/edición de órdenes de proveedor
2. **TrackingsOrdersPage**: Página de seguimiento de órdenes
3. **Cualquier otra página**: Donde se necesite mostrar información de órdenes de compra

## Tipos

```typescript
interface PurchaseOrderData {
  codigo: string;
  fecha: string;
  fechaMaxima: string;
  opImporteTotal: string;
  ocImporteTotal: string;
}

interface PurchaseOrderCardProps {
  data?: PurchaseOrderData;
  showAccordions?: boolean;
  elevation?: number;
  sx?: any;
}
```
