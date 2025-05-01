import { SidebarConfigProps } from '@/types/global';
import { RolesEnum } from '@/types/global.enum';
import { CompareArrows, Apps } from '@mui/icons-material';

const sidebarConfig: Array<SidebarConfigProps> = [
  {
    title: 'Principal',
    roles: [RolesEnum.ADMIN],
    routes: [
      {
        roles: [RolesEnum.ADMIN],
        path: '/',
        icon: Apps,
        name: 'Dashboard',
      },
    ],
  },
  {
    title: 'Directorio',
    roles: [RolesEnum.ADMIN],
    routes: [
      {
        name: 'Empresas',
        path: '/companies',
        icon: CompareArrows,
        roles: [RolesEnum.ADMIN],
      },
      {
        name: 'Clientes',
        path: '/clients',
        icon: Apps,
        roles: [RolesEnum.ADMIN],
      },
      {
        name: 'Proveedores',
        path: '/providers',
        icon: Apps,
        roles: [RolesEnum.ADMIN],
      },
      {
        name: 'Transportes',
        path: '/transports',
        icon: Apps,
        roles: [RolesEnum.ADMIN],
      },
    ],
  },
  {
    title: 'Procesos',
    roles: [RolesEnum.ADMIN],
    routes: [
      {
        name: 'Cotizaciones',
        path: '/quotes',
        icon: Apps,
        roles: [RolesEnum.ADMIN],
      },
      {
        name: 'Ventas',
        path: '/sales',
        icon: Apps,
        roles: [RolesEnum.ADMIN],
      },
      {
        name: 'Órdenes',
        path: '/orders',
        icon: Apps,
        roles: [RolesEnum.ADMIN],
      },
      {
        name: 'Seguimiento',
        path: '/tracking',
        icon: Apps,
        roles: [RolesEnum.ADMIN],
      },
      {
        name: 'Tesorería',
        path: '/treasury',
        icon: Apps,
        roles: [RolesEnum.ADMIN],
      },
      {
        name: 'Facturación',
        path: '/billing',
        icon: Apps,
        roles: [RolesEnum.ADMIN],
      },
    ],
  },
  {
    title: 'Usuario',
    roles: [RolesEnum.ADMIN],
    routes: [
      {
        name: 'Perfil',
        path: '/profile',
        icon: Apps,
        roles: [RolesEnum.ADMIN],
      },
      {
        name: 'Configuración',
        path: '/settings',
        icon: Apps,
        roles: [RolesEnum.ADMIN],
      },
    ],
  },
];

export default sidebarConfig;
