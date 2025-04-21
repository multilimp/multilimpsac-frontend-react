
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transporte } from "../models/transport.model";

interface TransportInfoProps {
  transport: Transporte;
}

const TransportInfo = ({ transport }: TransportInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información General</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">RUC</p>
          <p>{transport.ruc}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Dirección</p>
          <p>{transport.direccion || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Ubicación</p>
          <p>
            {[transport.departamento, transport.provincia, transport.distrito]
              .filter(Boolean)
              .join(', ') || '-'}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Cobertura</p>
          <p>{transport.cobertura || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Estado</p>
          <p>{transport.estado ? 'Activo' : 'Inactivo'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransportInfo;
