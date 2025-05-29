// src/config/sidebarConfig.ts
import { RolesEnum } from '@/services/users/user.enum';
import { SidebarConfigProps } from '@/types/global';

// Iconos más específicos para cada ruta
import DashboardIcon from '@mui/icons-material/Dashboard';
import ApartmentIcon from '@mui/icons-material/Apartment';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonIcon from '@mui/icons-material/Person';

const rolesArr = Object.values(RolesEnum);

const sidebarConfig: SidebarConfigProps[] = [
  {
    title: 'Principal',
    roles: rolesArr,
    routes: [
      {
        name: 'Dashboard',
        path: '/',
        icon: DashboardIcon,
        roles: rolesArr,
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
        icon: ApartmentIcon,
        roles: rolesArr,
      },
      {
        name: 'Clientes',
        path: '/clients',
        icon: GroupIcon,
        roles: rolesArr,
      },
      {
        name: 'Proveedores',
        path: '/providers',
        icon: BusinessIcon,
        roles: rolesArr,
      },
      {
        name: 'Transportes',
        path: '/transports',
        icon: LocalShippingIcon,
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
        icon: FormatQuoteIcon,
        roles: rolesArr,
      },
      {
        name: 'Ventas',
        path: '/sales',
        icon: ShoppingCartIcon,
        roles: rolesArr,
      },
      {
        name: 'Órdenes',
        path: '/orders',
        icon: ListAltIcon,
        roles: rolesArr,
      },
      {
        name: 'Órdenes de Proveedores',
        path: '/provider-orders',
        icon: LocalShippingIcon,
        roles: rolesArr,
      },
      {
        name: 'Seguimiento',
        path: '/tracking',
        icon: TrackChangesIcon,
        roles: rolesArr,
      },
      {
        name: 'Tesorería',
        path: '/treasury',
        icon: AccountBalanceWalletIcon,
        roles: rolesArr,
      },
      {
        name: 'Facturación',
        path: '/billing',
        icon: ReceiptIcon,
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
        icon: PersonIcon,
        roles: rolesArr,
      },
    ],
  },
];

export default sidebarConfig;
