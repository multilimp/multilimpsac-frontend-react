import { SupplierOrder, SupplierOrderItem, SupplierOrderFormInput } from '../models/supplier-order.model';
import { createEntityId, createDateVO, createMoney, createStatus, EntityId } from '@/core/domain/types/value-objects';
import { v4 as uuidv4 } from 'uuid';

export class SupplierOrderMapper {
  public static toDomain(raw: any): SupplierOrder {
    return {
      id: { value: raw.id.toString(), isValid: () => true },
      number: raw.codigo_op || '',
      supplierId: { value: raw.proveedor_id?.toString() || '', isValid: () => true },
      supplierName: raw.proveedores?.razon_social || '',
      date: { 
        value: raw.fecha_entrega || new Date().toISOString(),
        isValid: () => true
      },
      deliveryDate: raw.fecha_programada ? {
        value: raw.fecha_programada,
        isValid: () => true
      } : null,
      total: {
        amount: Number(raw.total_proveedor) || 0,
        currency: 'PEN'
      },
      status: {
        value: raw.estado_op || 'draft',
        isValid: () => ['draft', 'sent', 'confirmed', 'received', 'cancelled'].includes(raw.estado_op)
      },
      items: raw.items?.map(SupplierOrderMapper.itemToDomain) || [],
      paymentStatus: {
        value: 'pending',
        isValid: () => true
      },
      paymentTerms: raw.tipo_pago || '',
      notes: raw.nota_pedido || '',
      deliveryAddress: raw.direccion_entrega || '',
      createdAt: {
        value: raw.created_at || new Date().toISOString(),
        isValid: () => true
      },
      updatedAt: {
        value: raw.updated_at || new Date().toISOString(),
        isValid: () => true
      }
    };
  }

  private static itemToDomain(rawItem: any): SupplierOrderItem {
    return {
      id: createEntityId(rawItem.id.toString()),
      productId: createEntityId(rawItem.producto_id?.toString() || '0'),
      productName: rawItem.descripcion || '',
      description: rawItem.descripcion || '',
      quantity: Number(rawItem.cantidad) || 0,
      unitPrice: createMoney(Number(rawItem.precio_unitario) || 0),
      total: createMoney(Number(rawItem.total) || 0),
      unitMeasure: rawItem.unidad_medida || '',
      expectedDeliveryDate: createDateVO(rawItem.fecha_entrega || new Date().toISOString())
    };
  }

  public static toRepository(domain: Partial<SupplierOrder>): any {
    const result: any = {};
    
    if (domain.id) result.id = parseInt(domain.id.value);
    if (domain.number) result.codigo_op = domain.number;
    if (domain.supplierId) result.proveedor_id = parseInt(domain.supplierId.value);
    if (domain.date) result.fecha_entrega = domain.date.value;
    if (domain.deliveryDate) result.fecha_programada = domain.deliveryDate.value;
    if (domain.total) result.total_proveedor = domain.total.amount;
    if (domain.status) result.estado_op = domain.status.value;
    if (domain.paymentTerms) result.tipo_pago = domain.paymentTerms;
    if (domain.notes) result.nota_pedido = domain.notes;
    
    return result;
  }

  public static fromFormInput(input: SupplierOrderFormInput): SupplierOrder {
    return {
      id: createEntityId(uuidv4()),
      number: "",
      supplierId: createEntityId(input.supplierId),
      supplierName: "",
      date: createDateVO(input.date),
      deliveryDate: input.deliveryDate ? createDateVO(input.deliveryDate) : null,
      total: createMoney(input.total || 0),
      status: createStatus("draft"),
      paymentStatus: createStatus("pending"),
      paymentTerms: input.paymentTerms || "",
      notes: input.notes || "",
      deliveryAddress: input.deliveryAddress || "",
      items: input.items?.map(item => ({
        id: createEntityId(uuidv4()),
        productId: createEntityId(item.productId.value || ""),
        productName: item.productName,
        description: item.description,
        quantity: item.quantity,
        unitPrice: createMoney(item.unitPrice.amount),
        total: createMoney(item.quantity * item.unitPrice.amount),
        unitMeasure: item.unitMeasure,
        expectedDeliveryDate: createDateVO(item.expectedDeliveryDate ? 
          typeof item.expectedDeliveryDate === 'string' ? 
            item.expectedDeliveryDate : 
            item.expectedDeliveryDate.value 
          : new Date().toISOString())
      })) || [],
      createdAt: createDateVO(new Date().toISOString()),
      updatedAt: createDateVO(new Date().toISOString())
    };
  }

  public static updateFromFormInput(existingOrder: SupplierOrder, input: Partial<SupplierOrderFormInput>): SupplierOrder {
    const updated: SupplierOrder = { ...existingOrder };
    
    if (input.supplierId) updated.supplierId = createEntityId(input.supplierId);
    if (input.date) updated.date = createDateVO(input.date);
    if (input.deliveryDate) updated.deliveryDate = createDateVO(input.deliveryDate);
    if (input.paymentTerms) updated.paymentTerms = input.paymentTerms;
    if (input.notes) updated.notes = input.notes;
    if (input.deliveryAddress) updated.deliveryAddress = input.deliveryAddress;
    if (input.total !== undefined) updated.total = createMoney(input.total);
    
    if (input.items) {
      updated.items = input.items.map(item => ({
        id: createEntityId(uuidv4()),
        productId: createEntityId(typeof item.productId === 'string' ? item.productId : item.productId.value),
        productName: item.productName,
        description: item.description,
        quantity: item.quantity,
        unitPrice: createMoney(typeof item.unitPrice === 'number' ? item.unitPrice : item.unitPrice.amount),
        total: createMoney(item.quantity * (typeof item.unitPrice === 'number' ? item.unitPrice : item.unitPrice.amount)),
        unitMeasure: item.unitMeasure,
        expectedDeliveryDate: createDateVO(
          item.expectedDeliveryDate 
            ? typeof item.expectedDeliveryDate === 'string'
              ? item.expectedDeliveryDate
              : item.expectedDeliveryDate.value
            : new Date().toISOString()
        )
      }));
    }
    
    updated.updatedAt = createDateVO(new Date().toISOString());
    
    return updated;
  }
}
