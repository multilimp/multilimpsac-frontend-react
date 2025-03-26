
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";
import { RequirePermission } from "@/core/utils/permissions";

interface MenuItem {
  title: string;
  path: string;
  icon: React.ElementType;
  permission: string;
}

interface SubNavGroupProps {
  label: string;
  icon: React.ElementType;
  items: MenuItem[];
  isOpen: boolean;
  onToggle: (label: string) => void;
}

const SubNavGroup: React.FC<SubNavGroupProps> = ({
  label,
  icon: Icon,
  items,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="mb-2">
      <button
        onClick={() => onToggle(label)}
        className="flex items-center justify-between w-full p-2 rounded-md hover:bg-sidebar-accent transition-colors"
      >
        <div className="flex items-center">
          <Icon className="h-4 w-4 mr-2" />
          <span>{label}</span>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      
      {isOpen && (
        <div className="pl-6 pt-1 space-y-1">
          {items.map((item) => (
            <RequirePermission key={item.path} permission={item.permission}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-2 py-1 rounded-md text-sm ${
                    isActive ? "bg-sidebar-accent text-white" : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`
                }
              >
                <item.icon className="h-4 w-4 mr-2" />
                <span>{item.title}</span>
              </NavLink>
            </RequirePermission>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubNavGroup;
