import { useState } from 'react';
import { Button, Tooltip } from 'antd';
import { MenuOutlined, MenuFoldOutlined } from '@ant-design/icons';
import Logo from '@/components/Logo';
import NavigatorList from './NavigatorList';
import '../../../styles/sidebar.css';

const SideNavbar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <nav
      style={{
        width: expanded ? 240 : 72,
        backgroundColor: '#01a76a',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxHeight: '100vh',
        boxShadow: '2px 0 20px rgba(0,0,0,0.12)',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {/* Header con logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          minHeight: 64,
        }}
      >
        <Logo
          size={expanded ? 40 : 36}
          variant="light"
          style={{ transition: 'height 0.3s ease' }}
        />
        {expanded && (
          <span
            style={{
              marginLeft: 16,
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'white',
              whiteSpace: 'nowrap',
            }}
          >
            MULTILIMPSAC
          </span>
        )}
      </div>

      {/* Lista de navegación */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          paddingTop: 8,
          paddingBottom: 8,
        }}
        className="sidebar-scroll"
      >
        <NavigatorList expanded={expanded} />
      </div>

      {/* Botón de toggle en la parte inferior */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: 16,
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Tooltip title={expanded ? 'Contraer menú' : 'Expandir menú'} placement="right">
          <Button
            type="text"
            icon={expanded ? <MenuFoldOutlined /> : <MenuOutlined />}
            onClick={toggleExpanded}
            style={{
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </Tooltip>
      </div>
    </nav>
  );
};

export default SideNavbar;
