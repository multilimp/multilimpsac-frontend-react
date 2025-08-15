
import { Route, Routes } from 'react-router-dom';
import routes from './config';
import Page401 from '@/pages/errors/Page401';
import React from 'react';
import { useAppContext } from '@/context';
import { RolesEnum } from '@/services/users/user.enum';
import { PermissionsEnum } from '@/services/users/permissions.enum';

const ConfigRoutes = () => {
  const { user } = useAppContext();

  const filteredRoutes = routes.filter((item) => item.isPrivate === Boolean(user.id));

  // Función para verificar si el usuario tiene acceso a una ruta
  const hasRouteAccess = (routePath: string, requiredRoles: RolesEnum[]): boolean => {
    // Si es ADMIN, tiene acceso a todo
    if (user.role === RolesEnum.ADMIN) {
      return true;
    }

    // Si la ruta requiere rol ADMIN específicamente, denegar acceso a usuarios normales
    if (requiredRoles.includes(RolesEnum.ADMIN) && !requiredRoles.includes(RolesEnum.USER)) {
      return false;
    }

    // Para usuarios normales, verificar permisos individuales
    const routePermission = getRoutePermission(routePath);
    if (!routePermission) return true; // Si no hay permiso definido, permitir acceso
    
    // Dashboard y Profile siempre están disponibles para usuarios autenticados
    if (routePermission === PermissionsEnum.DASHBOARD || routePermission === PermissionsEnum.PROFILE) {
      return true;
    }
    
    return (user.permisos || []).includes(routePermission);
  };

  // Función auxiliar para mapear rutas a permisos
  const getRoutePermission = (path: string): string | null => {
    const routePermissionMap: Record<string, string> = {
      '/': PermissionsEnum.DASHBOARD,
      'companies': PermissionsEnum.COMPANIES,
      'clients': PermissionsEnum.CLIENTS,
      'providers': PermissionsEnum.PROVIDERS,
      'transports': PermissionsEnum.TRANSPORTS,
      'quotes': PermissionsEnum.QUOTES,
      'sales': PermissionsEnum.SALES,
      'sales/create': PermissionsEnum.SALES,
      'provider-orders': PermissionsEnum.PROVIDER_ORDERS,
      'provider-orders/create': PermissionsEnum.PROVIDER_ORDERS,
      'tracking': PermissionsEnum.TRACKING,
      'treasury': PermissionsEnum.TREASURY,
      'billing': PermissionsEnum.BILLING,
      'collections': PermissionsEnum.COLLECTIONS,
      'users': PermissionsEnum.USERS,
      'profile': PermissionsEnum.PROFILE,
    };

    return routePermissionMap[path] || null;
  };

  return (
    <Routes>
      {filteredRoutes.map((routeList) => {
        const { path, element: Component, children, isPrivate } = routeList;
        return (
          <React.Fragment key={path}>
            {isPrivate ? (
              <Route path={path} element={<Component />}>
                {children.map((el) => {
                  const { path: ruta, element: Element, roles } = el;
                  const hasAccess = hasRouteAccess(ruta, roles);
                  return <Route path={ruta} element={hasAccess ? <Element /> : <Page401 />} key={ruta} />;
                })}
              </Route>
            ) : (
              <Route path={path} element={<Component />}>
                {children?.map((el) => {
                  const { path: ruta, element: Element } = el;
                  return <Route path={ruta} element={<Element />} key={ruta} />;
                })}
              </Route>
            )}
          </React.Fragment>
        );
      })}
    </Routes>
  );
};

export default ConfigRoutes;
