/* import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e5e5e5',
      light: '#f5f5f5',
      dark: '#a3a3a3',
    },
    secondary: {
      main: '#525252',
    },
    background: {
      default: '#121212',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#f5f5f5',
      secondary: '#a3a3a3',
    },
    divider: '#333333',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 13,
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.8125rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 4,
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1a1a',
          borderRight: '1px solid #333333',
        },
      },
    },
  },
});

export default muiTheme;
 */

import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      // Professional Navy/Indigo Blue
      main: '#2563EB',      // Primary Blue (Modern & Accessible)
      light: '#DBEAFE',     // Light Wash for selection/hover
      dark: '#1E40AF',      // Deep Blue for active states
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#475569',      // Slate Gray for secondary utility
    },
    // Crucial for accounting status updates
    success: {
      main: '#059669',      // Emerald Green (Credits/Paid)
      light: '#D1FAE5',
    },
    error: {
      main: '#DC2626',      // Red (Debits/Overdue)
      light: '#FEE2E2',
    },
    warning: {
      main: '#D97706',      // Amber (Pending/Review)
    },
    background: {
      default: '#F1F5F9',   // Very light blue-gray tint (easier on eyes than pure white)
      paper: '#FFFFFF',     // Pure white for data containers
    },
    text: {
      primary: '#0F172A',   // Deep Navy-Black for high legibility
      secondary: '#64748B', // Muted Slate for subtitles
    },
    divider: '#E2E8F0',     // Clean separators for large tables
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 13,
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.8125rem' },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 6, // Sharp enough for business, rounded enough for modern UI
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '10px 16px', // Compact for high-density accounting data
          borderBottom: '1px solid #E2E8F0',
        },
        head: {
          fontWeight: 700,
          backgroundColor: '#F8FAFC',
          color: '#475569',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          marginBottom: 4,
          '&.Mui-selected': {
            backgroundColor: '#DBEAFE', // Using the light blue wash
            color: '#1E40AF',          // Darker blue text when selected
            fontWeight: 600,
            '& .MuiListItemIcon-root': {
              color: '#1E40AF',
            },
            '&:hover': {
              backgroundColor: '#BFDBFE',
            },
          },
          '&:hover': {
            backgroundColor: '#F1F5F9',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E2E8F0',
          width: 260, // Standard professional width
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: 'rgba(37, 99, 235, 0.04)',
          },
        },
        contained: {
          '&:hover': {
            backgroundColor: '#1E40AF',
          },
        },
      },
    },
  },
});

export default muiTheme;



