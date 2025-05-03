import { lazy } from 'react';
import Loadable from './Loadable';
import { RolesEnum } from '@/types/global.enum';
import { PropsRoutes } from '@/types/global';

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
const Quotes = Loadable(lazy(() => import('@/pages/private/Quotes'))); 
const Sales = Loadable(lazy(() => import('@/pages/private/Sales')));    
const Orders = Loadable(lazy(() => import('@/pages/private/Orders')));  
const Clients = Loadable(lazy(() => import('@/pages/private/Clients')));  
const Providers = Loadable(lazy(() => import('@/pages/private/Providers')));  
const Transports = Loadable(lazy(() => import('@/pages/private/Transports')));  

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
    roles: Object.values(RolesEnum),
    element: PrivateLayout,
    isPrivate: true,
    children: [
      {
        path: '',
        element: Dashboard,
        roles: Object.values(RolesEnum),
      },
      {
        path: 'profile',
        element: Profile,
        roles: Object.values(RolesEnum),
      },
      {
        path: 'companies',
        element: Companies,
        roles: Object.values(RolesEnum),
      },
      {
        path: 'quotes',  // Corregido typo (de 'quates' a 'quotes')
        element: Quotes,  // Actualizado a PascalCase
        roles: Object.values(RolesEnum),
      },
      {
        path: 'sales',
        element: Sales,   // Actualizado a PascalCase
        roles: Object.values(RolesEnum),
      },
      {
        path: 'orders',
        element: Orders,  // Actualizado a PascalCase
        roles: Object.values(RolesEnum),
      },
      {
        path: 'clients',
        element: Clients,  // Actualizado a PascalCase
        roles: Object.values(RolesEnum),
      },
      {
        path: 'providers',
        element: Providers,  // Actualizado a PascalCase
        roles: Object.values(RolesEnum),
      },
      {
        path: 'transports',
        element: Transports,  // Actualizado a PascalCase
        roles: Object.values(RolesEnum),
      },
      // EXCEPT
      {
        path: '*',
        element: Page404,
        roles: Object.values(RolesEnum),
      },
    ],
  },
];

export default routes;