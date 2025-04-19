
import { Quotation, QuotationFormInput, QuotationStatus, QuotationItem } from '../models/quotation.model';
import { createDateVO, createEntityId, createMoney } from '@/core/domain/types/value-objects';
import { v4 as uuidv4 } from 'uuid';

export class QuotationMapper {
  static toDTO(domain: Quotation) {
    return {
      id: domain.id.value,
      number: domain.number,
      clientId: domain.clientId.value,
      clientName: domain.clientName,
      date: domain.date.value,
      expiryDate: domain.expiryDate.value,
      total: domain.total.amount,
      status: domain.status,
      items: domain.items.map(item => ({
        ...item,
        unitPrice: item.unitPrice.amount,
        total: item.total.amount
      })),
      paymentType: domain.paymentType,
      paymentNote: domain.paymentNote,
      orderNote: domain.orderNote,
      deliveryAddress: domain.deliveryAddress,
      deliveryDistrict: domain.deliveryDistrict,
      deliveryProvince: domain.deliveryProvince,
      deliveryDepartment: domain.deliveryDepartment,
      deliveryReference: domain.deliveryReference,
      notes: domain.notes,
      createdBy: domain.createdBy
    };
  }

  static fromDTO(dto: any): Quotation {
    return {
      id: createEntityId(dto.id),
      number: dto.number,
      clientId: createEntityId(dto.client_id || dto.clientId),
      clientName: dto.client_name || dto.clientName || dto.clientes?.razon_social || "",
      date: createDateVO(dto.date || dto.fecha_cotizacion),
      expiryDate: createDateVO(dto.expiryDate || dto.fecha_entrega),
      total: createMoney(dto.total || dto.monto_total || 0),
      status: dto.status || dto.estado,
      items: (dto.items || []).map(item => ({
        id: item.id || uuidv4(),
        productId: item.productId || item.producto_id,
        productName: item.productName || item.descripcion,
        description: item.description || item.descripcion,
        quantity: item.quantity || item.cantidad,
        unitPrice: createMoney(item.unitPrice || item.precio_unitario),
        total: createMoney(item.total),
        taxRate: item.taxRate || item.tasa_impuesto,
        unitMeasure: item.unitMeasure || item.unidad_medida,
        code: item.code || item.codigo
      })),
      createdBy: dto.createdBy || dto.created_by || "",
      notes: dto.notes || dto.nota_pedido,
      paymentType: dto.paymentType || dto.tipo_pago,
      paymentNote: dto.paymentNote || dto.nota_pago,
      orderNote: dto.orderNote || dto.nota_pedido,
      deliveryAddress: dto.deliveryAddress || dto.direccion_entrega,
      deliveryDistrict: dto.deliveryDistrict || dto.distrito_entrega,
      deliveryProvince: dto.deliveryProvince || dto.provincia_entrega,
      deliveryDepartment: dto.deliveryDepartment || dto.departamento_entrega,
      deliveryReference: dto.deliveryReference || dto.referencia_entrega
    };
  }

  static toRepository(domain: Partial<Quotation>): any {
    const result: any = {};
    
    if (domain.clientId) result.cliente_id = Number(domain.clientId.value);
    if (domain.date) result.fecha_cotizacion = domain.date.value;
    if (domain.expiryDate) result.fecha_entrega = domain.expiryDate.value;
    if (domain.total) result.monto_total = domain.total.amount;
    if (domain.status) result.estado = domain.status;
    if (domain.notes) result.nota_pedido = domain.notes;
    if (domain.paymentType) result.tipo_pago = domain.paymentType;
    if (domain.paymentNote) result.nota_pago = domain.paymentNote;
    if (domain.deliveryAddress) result.direccion_entrega = domain.deliveryAddress;
    if (domain.deliveryDistrict) result.distrito_entrega = domain.deliveryDistrict;
    if (domain.deliveryProvince) result.provincia_entrega = domain.deliveryProvince;
    if (domain.deliveryDepartment) result.departamento_entrega = domain.deliveryDepartment;
    if (domain.deliveryReference) result.referencia_entrega = domain.deliveryReference;
    
    return result;
  }

  static fromFormInput(input: QuotationFormInput): Partial<Quotation> {
    const totalAmount = input.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice, 
      0
    );

    return {
      clientId: createEntityId(input.clientId),
      date: createDateVO(input.date),
      expiryDate: createDateVO(input.expiryDate),
      status: input.status,
      notes: input.notes,
      total: createMoney(totalAmount),
      paymentType: input.paymentType,
      paymentNote: input.paymentNote,
      orderNote: input.orderNote,
      deliveryAddress: input.deliveryAddress,
      deliveryDistrict: input.deliveryDistrict,
      deliveryProvince: input.deliveryProvince,
      deliveryDepartment: input.deliveryDepartment,
      deliveryReference: input.deliveryReference,
      items: input.items.map(item => ({
        id: uuidv4(),
        productId: item.productId,
        productName: item.productName,
        description: item.description,
        quantity: item.quantity,
        unitPrice: createMoney(item.unitPrice),
        total: createMoney(item.quantity * item.unitPrice),
        unitMeasure: item.unitMeasure,
        code: item.code
      }))
    };
  }

  static toDomain = QuotationMapper.fromDTO; // Alias for clarity
}
