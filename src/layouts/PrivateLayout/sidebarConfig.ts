import { RolesEnum } from '@/services/users/user.enum';
import { SidebarConfigProps } from '@/types/global';
import { Person, Apps, Apartment, People, Diversity3, LocalShipping } from '@mui/icons-material';

const rolesArr = Object.values(RolesEnum);

const sidebarConfig: Array<SidebarConfigProps> = [
  {
    title: 'Principal',
    roles: rolesArr,
    routes: [
      {
        roles: rolesArr,
        path: '/',
        icon: Apps,
        name: 'Dashboard',
      },
    ],
  },
  {
    title: 'Directorio',
    roles: rolesArr,
    routes: [
      {
        name: 'Empresas',
        path: '/companies',
        icon: Apartment,
        roles: rolesArr,
      },
      {
        name: 'Clientes',
        path: '/clients',
        icon: People,
        roles: rolesArr,
      },
      {
        name: 'Proveedores',
        path: '/providers',
        icon: Diversity3,
        roles: rolesArr,
      },
      {
        name: 'Transportes',
        path: '/transports',
        icon: LocalShipping,
        roles: rolesArr,
      },
    ],
  },
  {
    title: 'Procesos',
    roles: rolesArr,
    routes: [
      {
        name: 'Cotizaciones',
        path: '/quotes',
        icon: Apps,
        roles: rolesArr,
      },
      {
        name: 'Ventas',
        path: '/sales',
        icon: Apps,
        roles: rolesArr,
      },
      {
        name: 'Órdenes',
        path: '/orders',
        icon: Apps,
        roles: rolesArr,
      },
      {
        name: 'Seguimiento',
        path: '/tracking',
        icon: Apps,
        roles: rolesArr,
      },
      {
        name: 'Tesorería',
        path: '/treasury',
        icon: Apps,
        roles: rolesArr,
      },
      {
        name: 'Facturación',
        path: '/billing',
        icon: Apps,
        roles: rolesArr,
      },
    ],
  },
  {
    title: 'Configuraciones',
    roles: rolesArr,
    routes: [
      {
        name: 'Usuarios',
        path: '/users',
        icon: Person,
        roles: rolesArr,
      },
    ],
  },
];

export default sidebarConfig;
