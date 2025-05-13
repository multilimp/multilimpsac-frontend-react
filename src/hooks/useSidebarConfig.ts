import { SidebarConfigProps } from '@/types/global';
import sidebarConfig from '@/layouts/PrivateLayout/sidebarConfig';
import { RolesEnum } from '@/services/users/user.enum';

const useSidebarConfig = (rol: RolesEnum) => {
  const listSidebar: Array<SidebarConfigProps> = [];

  sidebarConfig.forEach((rOne) => {
    if (rOne.roles.includes(rol)) {
      listSidebar.push({ ...rOne, routes: [] });

      rOne.routes.forEach((rTwo) => {
        if (rTwo.roles.includes(rol)) {
          const idx = listSidebar[listSidebar.length - 1];
          idx.routes.push(rTwo);
        }
      });
    }
  });

  return listSidebar;
};

export default useSidebarConfig;
