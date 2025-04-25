
import React from "react";
import { useLocation } from "react-router-dom";
import { NavigationLink } from "./NavigationLink";
import { MenuItem, MenuGroup } from "../types/navigationTypes";

interface SidebarSectionProps {
  group: MenuGroup;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ group }) => {
  const location = useLocation();
  const items = group.items || [];

  return (
    <div className="py-2">
      {group.label && (
        <h2 className="px-2 mb-2 text-xs font-semibold text-white/70 uppercase">
          {group.label}
        </h2>
      )}
      <nav className="space-y-1">
        {items.map((item) => (
          <NavigationLink
            key={item.path}
            to={item.path}
            icon={item.icon}
            active={location.pathname === item.path}
          >
            {item.title}
          </NavigationLink>
        ))}
      </nav>
    </div>
  );
};

export default SidebarSection;
