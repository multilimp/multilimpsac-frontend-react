import { ContactProps } from '../contacts/contacts';
import { TransportProps } from '../transports/transports';
import { Almacen } from '@/types/almacen.types';

export interface TransporteAsignadoProps {
    id: number;
    codigoTransporte: string;
    transporteId: number;
    ordenProveedorId: number;
    contactoTransporteId: number;
    tipoDestino: string;
    region: string;
    provincia: string;
    distrito: string;
    direccion: string;
    notaTransporte: string;
    cotizacionTransporte: string;
    tipoDestino: string;
    numeroFactura: string | null;
    grt: string | null;
    notaPago: string;
    estadoPago: string | null;
    montoFlete: number | null;
    montoFletePagado: number | null;
    guiaRemision: string | null;
    archivoFactura: string | null;
    almacenId: number | null;
    createdAt: string;
    updatedAt: string;
    transporte: TransportProps;
    contactoTransporte: ContactProps;
    almacen?: Almacen | null;
    pagos: any[];
}