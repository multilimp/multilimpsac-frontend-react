
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { PurchaseOrder } from "@/data/models/purchaseOrder";

interface PurchaseOrderFormProps {
  initialData?: PurchaseOrder;
  onSubmit?: (data: Partial<PurchaseOrder>) => void;
}

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({ 
  initialData,
  onSubmit = () => {} 
}) => {
  // In a real app, you would use react-hook-form here
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({});
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Número de Orden</Label>
              <Input 
                id="orderNumber" 
                defaultValue={initialData?.orderNumber} 
                placeholder="OC-20230001"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientName">Cliente</Label>
              <Select defaultValue={initialData?.clientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client-001">Empresa ABC</SelectItem>
                  <SelectItem value="client-002">Empresa XYZ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input 
                id="date" 
                type="date" 
                defaultValue={initialData?.date} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select defaultValue={initialData?.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="partial">Parcial</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select defaultValue={initialData?.type}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Pública</SelectItem>
                  <SelectItem value="private">Privada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="total">Total</Label>
              <Input 
                id="total" 
                type="number" 
                defaultValue={initialData?.total.toString()} 
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Documentos</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="oce">OCE (Orden de Compra Externa)</Label>
                <Input 
                  id="oce" 
                  defaultValue={initialData?.documents.oce} 
                  placeholder="OC-EXT-001"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ocf">OCF (Orden de Compra Fiscal)</Label>
                <Input 
                  id="ocf" 
                  defaultValue={initialData?.documents.ocf} 
                  placeholder="OC-FIS-001"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline">Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PurchaseOrderForm;
