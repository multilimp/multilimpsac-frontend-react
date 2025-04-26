
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/app/core/utils';

interface NavigationLinkProps {
  to: string;
  icon?: LucideIcon;
  active?: boolean;
  children: React.ReactNode;
}

export const NavigationLink: React.FC<NavigationLinkProps> = ({
  to,
  icon: Icon,
  active = false,
  children
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-2 py-2 rounded-md text-sm transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
      )}
    >
      {Icon && <Icon className="h-4 w-4 mr-2" />}
      <span>{children}</span>
    </Link>
  );
};
