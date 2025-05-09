import { Component, JSX } from 'react';
import { ModalStateEnum } from './global.enum';
import { RolesEnum } from '@/services/users/user.enum';

export interface PropsRoutes {
  path: string;
  element: (props: object) => JSX.Element;
  isPrivate: boolean;
  roles: Array<RolesEnum>;
  children: Array<{
    path: string;
    roles: Array<RolesEnum>;
    element: (props: object) => JSX.Element;
  }>;
}

export interface SidebarConfigProps {
  title: string;
  roles: Array<RolesEnum>;
  routes: Array<SidebarItemProps>;
}

export interface SidebarItemProps {
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string };
  name: string;
  roles: Array<RolesEnum>;
  path: string;
}

export type ModalStateProps<T> = null | {
  mode: ModalStateEnum;
  data?: T;
};
