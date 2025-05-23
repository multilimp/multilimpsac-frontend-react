// src/services/trackings/trackings.request.ts

import { TrackingProps } from './trackings.d';

// ——— Datos de prueba ———
const mockTrackings: TrackingProps[] = [
  {
    id: 1,
    saleId: 101,
    clientRuc: '12345678901',
    companyRuc: '10987654321',
    companyBusinessName: 'Acme S.A.',
    clientName: 'Juan Pérez',
    maxDeliveryDate: '2025-06-01T00:00:00.000Z',
    saleAmount: 1500.5,
    cue: 'CUE-001',
    department: 'Lima',
    oce: 'http://localhost:4000/files/oce-1.pdf',
    ocf: undefined,
    peruPurchases: false,
    grr: 'GRR-123',
    invoiceNumber: 'F001-0001',
    isRefact: false,
    peruPurchasesDate: undefined,
    deliveryDateOC: '2025-06-05T00:00:00.000Z',
    utility: 12,
    status: 'pending',
  },
  {
    id: 2,
    saleId: 102,
    clientRuc: '10987654321',
    companyRuc: '11223344556',
    companyBusinessName: 'Widgets SAC',
    clientName: 'María Gómez',
    maxDeliveryDate: '2025-05-25T00:00:00.000Z',
    saleAmount: 800,
    cue: 'CUE-002',
    department: 'Arequipa',
    oce: undefined,
    ocf: 'http://localhost:4000/files/ocf-2.pdf',
    peruPurchases: true,
    grr: undefined,
    invoiceNumber: 'F002-0002',
    isRefact: true,
    peruPurchasesDate: '2025-05-18T00:00:00.000Z',
    deliveryDateOC: undefined,
    utility: 5,
    status: 'in_progress',
  },
];

// ——— Servicios mock para desarrollo ———
export const getTrackings = async (): Promise<TrackingProps[]> => {
  // Simular retardo de red
  await new Promise((res) => setTimeout(res, 300));
  return mockTrackings;
};

export const createTracking = async (
  payload: Omit<TrackingProps, 'id'>
): Promise<TrackingProps> => {
  // Opcional: simular la creación y asignar un ID incremental
  const next: TrackingProps = { id: mockTrackings.length + 1, ...payload };
  mockTrackings.push(next);
  return new Promise((res) => setTimeout(() => res(next), 300));
};

export const updateTracking = async (
  id: number,
  payload: Partial<TrackingProps>
): Promise<TrackingProps> => {
  const idx = mockTrackings.findIndex((t) => t.id === id);
  if (idx !== -1) {
    mockTrackings[idx] = { ...mockTrackings[idx], ...payload };
    return new Promise((res) => setTimeout(() => res(mockTrackings[idx]), 300));
  }
  return Promise.reject(new Error('Tracking no encontrado'));
};

export const deleteTracking = async (id: number): Promise<void> => {
  const idx = mockTrackings.findIndex((t) => t.id === id);
  if (idx !== -1) {
    mockTrackings.splice(idx, 1);
    return new Promise((res) => setTimeout(res, 300));
  }
  return Promise.reject(new Error('Tracking no encontrado'));
};
