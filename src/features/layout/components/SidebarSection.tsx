
import React from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import SidebarMenu from "./SidebarMenu";

interface MenuItem {
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
  permission?: string;
}

interface MenuGroup {
  label: string;
  routes: MenuItem[];
}

interface SidebarSectionProps {
  group: MenuGroup;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ group }) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu items={group.routes} />
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarSection;
