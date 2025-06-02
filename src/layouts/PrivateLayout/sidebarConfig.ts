// src/config/sidebarConfig.ts
import { RolesEnum } from '@/services/users/user.enum';
import { SidebarConfigProps } from '@/types/global';

// Iconos más específicos y modernos para cada ruta
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ApartmentIcon from '@mui/icons-material/Apartment';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import TimelineIcon from '@mui/icons-material/Timeline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentsIcon from '@mui/icons-material/Payments';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonIcon from '@mui/icons-material/Person';

const rolesArr = Object.values(RolesEnum);

const sidebarConfig: SidebarConfigProps[] = [
  {
    title: 'Panel Principal',
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
    title: 'Entidades',
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
    title: 'Procesos de Negocio',
    roles: rolesArr,
    routes: [
      {
        name: 'Cotizaciones',
        path: '/quotes',
        icon: RequestQuoteIcon,
        roles: rolesArr,
      },
      {
        name: 'Ventas',
        path: '/sales',
        icon: ShoppingCartIcon,
        roles: rolesArr,
      },
      {
        name: 'Órdenes Proveedores',
        path: '/provider-orders',
        icon: InventoryIcon,
        roles: rolesArr,
      },
      {
        name: 'Seguimiento',
        path: '/tracking',
        icon: TimelineIcon,
        roles: rolesArr,
      },
    ],
  },
  {
    title: 'Gestión Financiera',
    roles: rolesArr,
    routes: [
      {
        name: 'Tesorería',
        path: '/treasury',
        icon: AccountBalanceWalletIcon,
        roles: rolesArr,
      },
      {
        name: 'Facturación',
        path: '/billing',
        icon: ReceiptLongIcon,
        roles: rolesArr,
      },
      {
        name: 'Cobranzas',
        path: '/collections',
        icon: PaymentsIcon,
        roles: rolesArr,
      },
    ],
  },
  {
    title: 'Administración',
    roles: rolesArr,
    routes: [
      {
        name: 'Usuarios',
        path: '/users',
        icon: ManageAccountsIcon,
        roles: rolesArr,
      },
      {
        name: 'Perfil',
        path: '/profile',
        icon: PersonIcon,
        roles: rolesArr,
      },
    ],
  },
];

export default sidebarConfig;
