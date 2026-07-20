import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, Typography } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Sidebar from './Sidebar';
import muiTheme from '@/theme/muiTheme';
import { useAuth } from '@/contexts/AuthContext';
import { useBranchName } from '@/Hooks/useUtilityQueries';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const { data: branch } = useBranchName(user?.cnCode);

  // GetBranchName returns { CNCode, CName, CAddress }; fall back gracefully.
  const branchName = branch?.CName || '858 Jewelry & Pawnshop';

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            color: 'text.primary',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
          }}
        >
          {/* Fixed branch header shown on every authenticated page */}
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1100,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 3,
              minHeight: 56,
              bgcolor: 'background.paper',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <StorefrontIcon sx={{ color: 'primary.main' }} />
            <Typography
              variant="h6"
              noWrap
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              {branchName}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;
