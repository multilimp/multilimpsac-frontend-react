import React, { useState, useRef, useEffect } from 'react';
import usePopover from '@/hooks/usePopover';
import { Search, Person, Close, KeyboardArrowDown } from '@mui/icons-material';
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  InputBase,
  Popper,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  ClickAwayListener,
  Fade
} from '@mui/material';
import { UserPopover } from './UserPopover';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'client' | 'product' | 'order' | 'quote' | 'provider';
  route: string;
  icon: string;
}

const MainNav = () => {
  const userPopover = usePopover<HTMLDivElement>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPopperRef = useRef<HTMLDivElement>(null);

  const mockSearchResults: SearchResult[] = [
    {
      id: '1',
      title: 'Cliente ABC S.A.',
      subtitle: 'Empresa de tecnología',
      type: 'client',
      route: '/clients',
      icon: '👤'
    },
    {
      id: '2',
      title: 'Producto XYZ-2000',
      subtitle: 'Equipo de cómputo',
      type: 'product',
      route: '/products',
      icon: '📦'
    },
    {
      id: '3',
      title: 'Orden #OC-2024-001',
      subtitle: 'Pendiente de aprobación',
      type: 'order',
      route: '/orders',
      icon: '📋'
    },
    {
      id: '4',
      title: 'Cotización #COT-2024-005',
      subtitle: 'En revisión',
      type: 'quote',
      route: '/quotes',
      icon: '💰'
    },
    {
      id: '5',
      title: 'Proveedor TechCorp',
      subtitle: 'Suministros tecnológicos',
      type: 'provider',
      route: '/providers',
      icon: '🏢'
    },
  ];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const filtered = mockSearchResults.filter(result => {
        const matchesQuery = result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.subtitle.toLowerCase().includes(query.toLowerCase());
        return matchesQuery;
      });
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setIsSearchFocused(false);
    }, 200);
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.route);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
  };



  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    searchInputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setSearchQuery('');
      setSearchResults([]);
      setIsSearchFocused(false);
    }
  };

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: '64px',
            px: 3,
          }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                borderRadius: '12px',
                bgcolor: 'rgba(0, 0, 0, 0.03)',
                p: '8px 16px',
                minWidth: '400px',
                border: isSearchFocused ? '2px solid' : '2px solid transparent',
                borderColor: 'primary.main',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.06)',
                },
              }}
            >
              <Search sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
              <InputBase
                ref={searchInputRef}
                placeholder="Buscar clientes, productos, órdenes..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                onKeyDown={handleKeyDown}
                sx={{
                  flex: 1,
                  fontSize: '0.9rem',
                  '& input': {
                    padding: 0,
                  },
                }}
              />
              {searchQuery && (
                <IconButton
                  size="small"
                  onClick={handleClearSearch}
                  sx={{ p: 0.5 }}
                >
                  <Close sx={{ fontSize: '1rem' }} />
                </IconButton>
              )}
            </Box>


          </Stack>

          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src="/assets/avatar.png"
              sx={{
                cursor: 'pointer',
                border: '2px solid',
                borderColor: 'primary.main',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Person />
            </Avatar>
          </Stack>
        </Stack>
      </Box>

      <Popper
        open={isSearchFocused && searchResults.length > 0}
        anchorEl={searchInputRef.current}
        placement="bottom-start"
        style={{ zIndex: 1300, width: searchInputRef.current?.offsetWidth }}
      >
        <ClickAwayListener onClickAway={() => setIsSearchFocused(false)}>
          <Paper
            elevation={8}
            sx={{
              mt: 1,
              maxHeight: '400px',
              overflow: 'auto',
              borderRadius: '12px',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <List sx={{ p: 0 }}>
              {searchResults.map((result, index) => (
                <ListItem
                  key={result.id}
                  component="div"
                  onClick={() => handleResultClick(result)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    borderBottom: index < searchResults.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Typography variant="h6">{result.icon}</Typography>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={600}>
                        {result.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {result.subtitle}
                      </Typography>
                    }
                  />
                  <Chip
                    label={result.type === 'client' ? 'Cliente' :
                      result.type === 'product' ? 'Producto' :
                        result.type === 'order' ? 'Orden' :
                          result.type === 'quote' ? 'Cotización' :
                            result.type === 'provider' ? 'Proveedor' : 'Otro'}
                    size="small"
                    color={result.type === 'client' ? 'success' :
                      result.type === 'product' ? 'warning' :
                        result.type === 'order' ? 'info' :
                          result.type === 'quote' ? 'secondary' :
                            result.type === 'provider' ? 'error' : 'default' as any}
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: '20px' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </ClickAwayListener>
      </Popper>

      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
    </React.Fragment>
  );
};

export default MainNav;
