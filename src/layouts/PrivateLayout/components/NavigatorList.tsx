import { useAppContext } from '@/context';
import useSidebarConfig from '@/hooks/useSidebarConfig';
import { isNavItemActive } from '@/utils/functions';
import { Tooltip, Divider } from 'antd';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigatorListProps {
  expanded: boolean;
}

const NavigatorList: React.FC<NavigatorListProps> = ({ expanded }) => {
  const { pathname } = useLocation();
  const { user } = useAppContext();
  const sidebarList = useSidebarConfig(user.role, user.permisos || []);

  return (
    <div style={{ width: '100%', paddingLeft: 8, paddingRight: 8, height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: expanded ? 16 : 8 }}>
        {sidebarList.map((section, sectionIndex) => (
          <div key={section.title}>
            {/* Título de sección */}
            {expanded && (
              <span
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  paddingLeft: 16,
                  paddingRight: 16,
                  paddingTop: 8,
                  paddingBottom: 8,
                  display: 'block',
                }}
              >
                {section.title}
              </span>
            )}

            {/* Divider visual para secciones cuando está colapsado */}
            {!expanded && sectionIndex > 0 && (
              <Divider
                style={{
                  borderColor: 'rgba(255,255,255,0.2)',
                  marginTop: 8,
                  marginBottom: 8,
                  marginLeft: 16,
                  marginRight: 16,
                }}
              />
            )}

            {/* Rutas de la sección */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {section.routes.map((route) => (
                <NavIconButton
                  key={route.path}
                  icon={route.icon}
                  to={route.path}
                  name={route.name}
                  active={isNavItemActive({ path: route.path, pathname })}
                  expanded={expanded}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavigatorList;

interface NavIconButtonProps {
  icon: React.ElementType;
  to: string;
  name: string;
  active: boolean;
  expanded: boolean;
}

const NavIconButton: React.FC<NavIconButtonProps> = ({ icon: Icon, to, name, active, expanded }) => {
  const baseStyles: React.CSSProperties = {
    width: '100%',
    padding: expanded ? '12px 16px' : '12px',
    display: 'flex',
    alignItems: 'center',
    gap: expanded ? 16 : 0,
    color: active ? '#FFFFFF' : 'rgba(255,255,255,0.8)',
    backgroundColor: active ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
    borderRadius: 8,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textDecoration: 'none',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: expanded ? 'flex-start' : 'center'
  };

  const content = (
    <>
      <Icon style={{ fontSize: 20 }} />
      {expanded && (
        <span
          style={{
            fontWeight: active ? 600 : 400,
            fontSize: '0.875rem',
            whiteSpace: 'nowrap',
            opacity: expanded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          {name}
        </span>
      )}
    </>
  );

  return expanded ? (
    <Link to={to} style={baseStyles} className="nav-item-link">
      {content}
    </Link>
  ) : (
    <Tooltip title={name} placement="right">
      <Link to={to} style={baseStyles} className="nav-item-link">
        {content}
      </Link>
    </Tooltip>
  );
};
