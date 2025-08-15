import { SidebarConfigProps } from '@/types/global';
import sidebarConfig from '@/layouts/PrivateLayout/sidebarConfig';
import { RolesEnum } from '@/services/users/user.enum';
import { PermissionsEnum } from '@/services/users/permissions.enum';

const useSidebarConfig = (rol: RolesEnum, userPermissions: string[] = []) => {
  const listSidebar: Array<SidebarConfigProps> = [];

  // Si es ADMIN, tiene acceso a todo
  if (rol === RolesEnum.ADMIN) {
    return sidebarConfig;
  }

  // Para usuarios normales, filtrar por permisos individuales
  sidebarConfig.forEach((section) => {
    const filteredSection = { ...section, routes: [] };
    let hasVisibleRoutes = false;

    section.routes.forEach((route) => {
      // Mapear rutas a permisos
      const routePermission = getRoutePermission(route.path);
      
      // Dashboard y Profile siempre están disponibles para usuarios autenticados
      if (routePermission === PermissionsEnum.DASHBOARD || routePermission === PermissionsEnum.PROFILE) {
        filteredSection.routes.push(route);
        hasVisibleRoutes = true;
        return;
      }
      
      if (routePermission && userPermissions.includes(routePermission)) {
        filteredSection.routes.push(route);
        hasVisibleRoutes = true;
      }
    });

    if (hasVisibleRoutes) {
      listSidebar.push(filteredSection);
    }
  });

  return listSidebar;
};

// Función auxiliar para mapear rutas a permisos
const getRoutePermission = (path: string): string | null => {
  const routePermissionMap: Record<string, string> = {
    '/': PermissionsEnum.DASHBOARD,
    '/companies': PermissionsEnum.COMPANIES,
    '/clients': PermissionsEnum.CLIENTS,
    '/providers': PermissionsEnum.PROVIDERS,
    '/transports': PermissionsEnum.TRANSPORTS,
    '/quotes': PermissionsEnum.QUOTES,
    '/sales': PermissionsEnum.SALES,
    '/provider-orders': PermissionsEnum.PROVIDER_ORDERS,
    '/tracking': PermissionsEnum.TRACKING,
    '/treasury': PermissionsEnum.TREASURY,
    '/billing': PermissionsEnum.BILLING,
    '/collections': PermissionsEnum.COLLECTIONS,
    '/users': PermissionsEnum.USERS,
    '/profile': PermissionsEnum.PROFILE,
  };

  return routePermissionMap[path] || null;
};

export default useSidebarConfig;
