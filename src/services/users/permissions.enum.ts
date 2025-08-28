export enum PermissionsEnum {
  // Panel Principal
  DASHBOARD = 'dashboard',

  // Entidades
  COMPANIES = 'companies',
  CLIENTS = 'clients',
  PROVIDERS = 'providers',
  TRANSPORTS = 'transports',

  // Procesos de Negocio
  QUOTES = 'quotes',
  SALES = 'sales',
  PROVIDER_ORDERS = 'provider_orders',
  TRACKING = 'tracking',

  // Gestión Financiera
  TREASURY = 'treasury',
  BILLING = 'billing',
  COLLECTIONS = 'collections',

  // Reportes
  REPORTS = 'reports',

  // Administración
  USERS = 'users', // Solo ADMIN
  PROFILE = 'profile', // Todos
}

export const PERMISSION_LABELS: Record<PermissionsEnum, string> = {
  [PermissionsEnum.DASHBOARD]: 'Dashboard',
  [PermissionsEnum.COMPANIES]: 'Empresas',
  [PermissionsEnum.CLIENTS]: 'Clientes',
  [PermissionsEnum.PROVIDERS]: 'Proveedores',
  [PermissionsEnum.TRANSPORTS]: 'Transportes',
  [PermissionsEnum.QUOTES]: 'Cotizaciones',
  [PermissionsEnum.SALES]: 'Ventas',
  [PermissionsEnum.PROVIDER_ORDERS]: 'Órdenes Proveedores',
  [PermissionsEnum.TRACKING]: 'Seguimiento',
  [PermissionsEnum.TREASURY]: 'Tesorería',
  [PermissionsEnum.BILLING]: 'Facturación',
  [PermissionsEnum.COLLECTIONS]: 'Cobranzas',
  [PermissionsEnum.REPORTS]: 'Reportes',
  [PermissionsEnum.USERS]: 'Usuarios',
  [PermissionsEnum.PROFILE]: 'Perfil',
};

export const DEFAULT_USER_PERMISSIONS: PermissionsEnum[] = [
  PermissionsEnum.DASHBOARD,
  PermissionsEnum.PROFILE,
];

export const ALL_PERMISSIONS: PermissionsEnum[] = Object.values(PermissionsEnum);
