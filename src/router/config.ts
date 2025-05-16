import { lazy } from 'react';
import Loadable from './Loadable';
import { PropsRoutes } from '@/types/global';
import { RolesEnum } from '@/services/users/user.enum';

// ERRORS -------------------------------------------------------------------------------
const Page404 = Loadable(lazy(() => import('@/pages/errors/Page404')));
// LAYOUTS ------------------------------------------------------------------------------
const PrivateLayout = Loadable(lazy(() => import('@/layouts/PrivateLayout')));
const PublicLayout = Loadable(lazy(() => import('@/layouts/PublicLayout')));
// PUBLIC ROUTES ------------------------------------------------------------------------
const Login = Loadable(lazy(() => import('@/pages/public/Login')));
const Home = Loadable(lazy(() => import('@/pages/public/Home')));
const RecoveryPassword = Loadable(lazy(() => import('@/pages/public/RecoveryPassword')));
// PRIVATE ROUTES ----------------------------------------------------------------------
const Dashboard = Loadable(lazy(() => import('@/pages/private/Dashboard')));
const Profile = Loadable(lazy(() => import('@/pages/private/Profile')));
const Companies = Loadable(lazy(() => import('@/pages/private/Companies')));
const Users = Loadable(lazy(() => import('@/pages/private/Users')));
const Quotes = Loadable(lazy(() => import('@/pages/private/Quotes')));
const Sales = Loadable(lazy(() => import('@/pages/private/Sales')));
const Orders = Loadable(lazy(() => import('@/pages/private/Orders')));
const Clients = Loadable(lazy(() => import('@/pages/private/Clients')));
const Providers = Loadable(lazy(() => import('@/pages/private/Providers')));
const Transports = Loadable(lazy(() => import('@/pages/private/Transports')));
const Treasurys = Loadable(lazy(() => import('@/pages/private/Treasurys')));
const Billings = Loadable(lazy(() => import('@/pages/private/Billings')));
const Trackings = Loadable(lazy(() => import('@/pages/private/Trackings')));
const ProviderOrders = Loadable(lazy(() => import('@/pages/private/ProviderOrders')));
const ProviderOrderForm = Loadable(lazy(() => import('@/pages/private/ProviderOrders/ProviderOrderForm')));

const rolesArr = Object.values(RolesEnum);

const routes: Array<PropsRoutes> = [
  {
    path: '/',
    element: PublicLayout,
    isPrivate: false,
    roles: [],
    children: [
      {
        path: '',
        roles: [],
        element: Home,
      },
      {
        path: 'login',
        roles: [],
        element: Login,
      },
      {
        path: 'recovery-password',
        element: RecoveryPassword,
        roles: [],
      },
      {
        path: '*',
        roles: [],
        element: Page404,
      },
    ],
  },
  {
    path: '/',
    roles: rolesArr,
    element: PrivateLayout,
    isPrivate: true,
    children: [
      {
        path: '',
        element: Dashboard,
        roles: rolesArr,
      },
      {
        path: 'profile',
        element: Profile,
        roles: rolesArr,
      },
      {
        path: 'companies',
        element: Companies,
        roles: rolesArr,
      },
      {
        path: 'quotes', // Corregido typo (de 'quates' a 'quotes')
        element: Quotes, // Actualizado a PascalCase
        roles: rolesArr,
      },
      {
        path: 'sales',
        element: Sales, // Actualizado a PascalCase
        roles: rolesArr,
      },
      {
        path: 'orders',
        element: Orders,
        roles: rolesArr,
      },
      {
        path: 'provider-orders',
        element: ProviderOrders,
        roles: rolesArr,
      },
      {
        path: 'provider-orders/:saleId',
        element: ProviderOrderForm,
        roles: rolesArr,
      },
      {
        path: 'clients',
        element: Clients, // Actualizado a PascalCase
        roles: rolesArr,
      },
      {
        path: 'providers',
        element: Providers, // Actualizado a PascalCase
        roles: rolesArr,
      },
      {
        path: 'transports',
        element: Transports, // Actualizado a PascalCase
        roles: rolesArr,
      },
      {
        path: 'treasury',
        element: Treasurys, // Actualizado a PascalCase
        roles: rolesArr,
      },
      {
        path: 'billing',
        element: Billings, // Actualizado a PascalCase
        roles: rolesArr,
      },
      {
        path: 'tracking',
        element: Trackings, // Actualizado a PascalCase
        roles: rolesArr,
      },
      {
        path: 'users',
        element: Users, // Actualizado a PascalCase
        roles: Object.values(RolesEnum),
      },
      // EXCEPT
      {
        path: '*',
        element: Page404,
        roles: rolesArr,
      },
    ],
  },
];

export default routes;
