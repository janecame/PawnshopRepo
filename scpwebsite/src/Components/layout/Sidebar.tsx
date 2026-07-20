import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { routes, RouteConfig } from '@/config/routes';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions, useGroups } from '@/Hooks/use-security';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { Group } from "@/types/securityInterfaces";

const DRAWER_WIDTH_EXPANDED = 260;
const DRAWER_WIDTH_COLLAPSED = 72;

const AUTO_COLLAPSE_BREAKPOINT = 1024;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { warning } = useSnackbar();

  const { user, logout } = useAuth();
  const { data: prohibitedAccess } = usePermissions(user?.groupCode, !!user);
  const { data: groups } = useGroups(user?.cnCode);

  const [collapsed, setCollapsed] = useState(() => window.innerWidth < AUTO_COLLAPSE_BREAKPOINT);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hoveredCollapse, setHoveredCollapse] = useState<string | null>(null);

  React.useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < AUTO_COLLAPSE_BREAKPOINT);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const drawerWidth = collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_EXPANDED;

  const groupLookup = useMemo(() => {
    const lookup: Record<string, string> = {};
    groups?.forEach((group: Group) => {
      lookup[group.groupCode] = group.groupName;
    });
    return lookup;
  }, [groups]);

  const handleMenuToggle = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isAccessProhibited = (permission?: string): boolean => {
    if (!permission || !prohibitedAccess) return false;
    return prohibitedAccess.includes(permission);
  };

  const handleNavClick = (route: string) => {
    navigate(route);
  };

  const handleAccountClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleAccountClose();
    logout();
    navigate('/login');
  };

  const isRouteActive = (route: string) => {
    return location.pathname === route || location.pathname.startsWith(route + '/');
  };

  const renderNavItem = (item: RouteConfig, depth = 0, isLast = false) => {
    const isActive = isRouteActive(item.route);
    const hasChildren = item.childs && item.childs.length > 0;
    const isOpen = openMenus[item.key] || false;
    const isHovered = hoveredCollapse === item.key;

    if (item.noDisplay && !hasChildren) return null;

    // Adjusting padding for deeper nesting
    const paddingLeft = collapsed ? 2.5 : 2 + depth * 3;
    // Calculate the X position of the vertical guide line
    const lineLeftPos = (depth - 1) * 24 + 32;

    return (
      <Box key={item.key} sx={{ position: 'relative' }}>
        <Tooltip
          title={collapsed ? item.name : ''}
          placement="right"
          arrow
        >
          <ListItemButton
            selected={isActive && !hasChildren}
            onClick={() => {
              if (isAccessProhibited(item.permission)) {
                warning('You do not have permission to access this section.');
                return;
              }
              if (hasChildren) {
                if (collapsed) {
                  setHoveredCollapse(isHovered ? null : item.key);
                } else {
                  handleMenuToggle(item.key);
                }
              } else {
                handleNavClick(item.route);
              }
            }}
            sx={{
              minHeight: 40,
              my: 0,
              px: collapsed ? 2.5 : 2,
              mx: 1,
              justifyContent: collapsed ? 'center' : 'flex-start',
              pl: !collapsed ? paddingLeft : undefined,
              opacity: isAccessProhibited(item.permission) ? 0.5 : 1,
              cursor: isAccessProhibited(item.permission) ? "not-allowed" : "pointer",
              position: 'relative',
              // The Tree Connectors (Only visible when expanded and at depth > 0)
              ...(!collapsed && depth > 0 && {
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: `${lineLeftPos}px`,
                  top: 0,
                  width: '1px',
                  height: '100%', // Shorten line if it's the last child
                  bgcolor: 'primary.light',
                },
              })
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? 0 : 32,
                justifyContent: 'center',
                color: isActive ? 'primary.main' : 'text.secondary',
                zIndex: 2, // Ensure icon stays above lines
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!collapsed && (
              <>
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    fontSize: depth > 0 ? '0.8125rem' : '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'primary.main' : 'text.primary',
                  }}
                />
                {hasChildren && (isOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />)}
              </>
            )}
          </ListItemButton>
        </Tooltip>

        {/* Collapsed Hover Menu */}
        {collapsed && hasChildren && isHovered && (
          <Box
            sx={{
              position: 'fixed',
              left: DRAWER_WIDTH_COLLAPSED,
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 8,
              minWidth: 200,
              py: 1,
              zIndex: 1300,
            }}
            onMouseLeave={() => setHoveredCollapse(null)}
          >
            <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary', display: 'block', fontWeight: 600 }}>
              {item.name}
            </Typography>
            {item.childs?.map((child, index) => renderCollapsedMenuItem(child, 0, index === item.childs!.length - 1))}
          </Box>
        )}

        {/* Recursive Children for Expanded Mode */}
        {!collapsed && hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.childs?.map((child, index) =>
                renderNavItem(child, depth + 1, index === item.childs!.length - 1)
              )}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const renderCollapsedMenuItem = (item: RouteConfig, depth: number, isLast: boolean = false): React.ReactNode => {
    const hasChildren = item.childs && item.childs.length > 0;
    const isOpen = openMenus[`collapsed-${item.key}`] || false;

    if (item.noDisplay && !hasChildren) return null;

    return (
      <Box key={item.key}>
        <ListItemButton
          selected={isRouteActive(item.route)}
          onClick={() => {
            if (isAccessProhibited(item.permission)) {
              warning('You do not have permission to access this section.');
              return;
            }
            if (hasChildren) {
              setOpenMenus((prev) => ({ ...prev, [`collapsed-${item.key}`]: !prev[`collapsed-${item.key}`] }));
            } else {
              handleNavClick(item.route);
              setHoveredCollapse(null);
            }
          }}
          sx={{
            minHeight: 36,
            px: 2,
            pl: 2 + depth * 1.5,
            opacity: isAccessProhibited(item.permission) ? 0.5 : 1,
            cursor: isAccessProhibited(item.permission) ? "not-allowed" : "pointer",
          }}
        >
          <ListItemIcon sx={{ minWidth: 28, color: 'text.secondary' }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.name}
            primaryTypographyProps={{ fontSize: '0.8125rem' }}
          />
          {hasChildren && (isOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />)}
        </ListItemButton>
        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            {item.childs?.map((child, index) => renderCollapsedMenuItem(child, depth + 1, index === item.childs!.length - 1))}
          </Collapse>
        )}
      </Box>
    );
  };

  const getUserInitials = () => {
    if (!user?.userName) return 'U';
    return user.userName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          transition: 'width 0.2s ease-in-out',
          overflowX: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          px: 2,
          py: 2,
          minHeight: 64,
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flex: collapsed ? 0 : 1, minWidth: 0 }}>
          {!collapsed && (
            <Typography
              variant="body1"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                ml: 1.5,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Pawnshop
            </Typography>
          )}
        </Box>
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{ color: 'text.secondary' }}
        >
          {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: 'divider' }} />

      <Box sx={{ flex: 1, py: 2, overflowY: 'auto' }}>
        <List component="nav" disablePadding>
          {routes.map((route, index) => renderNavItem(route, 0, index === routes.length - 1))}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'divider' }} />
      <Box sx={{ p: 2 }}>
        <Tooltip title={collapsed ? 'Account' : ''} placement="right" arrow>
          <ListItemButton
            onClick={handleAccountClick}
            sx={{
              borderRadius: 2,
              px: collapsed ? 1 : 1.5,
              py: 1,
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                fontSize: '0.875rem',
              }}
            >
              {getUserInitials()}
            </Avatar>
            {!collapsed && (
              <Box sx={{ ml: 1.5, overflow: 'hidden' }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, lineHeight: 1.2 }}
                  noWrap
                >
                  {user?.completeName || 'User'}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', lineHeight: 1.2 }}
                  noWrap
                >
                  {groupLookup[user?.groupCode] || user?.groupCode}
                </Typography>
              </Box>
            )}
          </ListItemButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleAccountClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          slotProps={{
            paper: {
              sx: {
                minWidth: 180,
                bgcolor: 'background.paper',
                mt: -1,
              },
            },
          }}
        >
          <MenuItem
            onClick={handleAccountClose}
            component={Link}
            to="/profile"
            disabled
          >
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={handleAccountClose}
            component={Link}
            to="/settings"
            disabled
          >
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </Drawer>
  );
};

export default Sidebar;