
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  path: string;
  icon?: React.ElementType;
}

interface SecondaryNavbarProps {
  items: NavItem[];
  title?: string;
}

const SecondaryNavbar: React.FC<SecondaryNavbarProps> = ({ items, title }) => {
  if (items.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-secondary/10 border-b mb-4 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2">
          {title && (
            <h2 className="text-lg font-medium text-secondary-foreground mb-2 sm:mb-0">
              {title}
            </h2>
          )}
          <nav className="flex space-x-1 overflow-x-auto pb-1">
            {items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-200",
                    "hover:bg-secondary/20",
                    isActive
                      ? "bg-secondary text-secondary-foreground"
                      : "text-gray-700"
                  )
                }
              >
                <div className="flex items-center space-x-1">
                  {item.icon && <item.icon className="h-4 w-4 mr-1" />}
                  <span>{item.label}</span>
                </div>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SecondaryNavbar;
