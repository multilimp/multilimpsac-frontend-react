import { Component, JSX } from 'react';
import { RolesEnum } from './global.enum';

export interface PropsRoutes {
  path: string;
  element: (props: object) => JSX.Element;
  isPrivate: boolean;
  roles: Array<SystemRolesEnum>;
  children: Array<{ path: string; roles: Array<RolesEnum>; element: (props: object) => JSX.Element }>;
}

export interface SidebarConfigProps {
  title: string;
  roles: Array<SystemRolesEnum>;
  routes: Array<SidebarItemProps>;
}

export interface SidebarItemProps {
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string };
  name: string;
  roles: Array<SystemRolesEnum>;
  path: string;
}
