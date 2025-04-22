
import React from "react";
import { MenuGroup } from "@/components/layout/DynamicSidebar";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import SidebarMenu from "./SidebarMenu";

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
