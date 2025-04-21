
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Temporary mock implementation until real data is available
export const SupplierOrderList = () => {
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Órdenes de Proveedor</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">No hay órdenes de proveedor disponibles.</p>
      </CardContent>
    </Card>
  );
};
