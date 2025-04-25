
import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  title: string;
  path: string;
  icon: LucideIcon;
  permission: string;
}

export interface MenuGroup {
  label: string;
  items: MenuItem[];
}
