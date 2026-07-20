import React, { createContext, useContext, ReactNode } from 'react';
import {
    SnackbarProvider as NotistackProvider,
    enqueueSnackbar,
    closeSnackbar,
    SnackbarKey,
    VariantType
} from 'notistack';
import { IconButton, Button, Box, Typography, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// --- Types (Preserved from your original code) ---
interface ConfirmOptions {
    title?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    severity?: 'success' | 'error' | 'warning' | 'info';
}

interface SnackbarContextType {
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
    loading: (message: string, title?: string) => () => void;
    confirm: (message: string, options: ConfirmOptions) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    // Logic for standard toasts
    const success = (message: string, title?: string) =>
        showStandard('success', message, title || 'Success');

    const error = (message: string, title?: string) =>
        showStandard('error', message, title || 'Error');

    const warning = (message: string, title?: string) =>
        showStandard('warning', message, title || 'Warning');

    const info = (message: string, title?: string) =>
        showStandard('info', message, title || 'Info');

    // Shared renderer for standard notifications
    const showStandard = (variant: VariantType, message: string, title?: string) => {
        enqueueSnackbar(message, {
            variant,
            content: (key) => (
                <Box sx={{
                    bgcolor: 'background.paper',
                    p: 1.5,
                    borderRadius: 1,
                    boxShadow: 3,
                    borderLeft: 6,
                    borderColor: `${variant}.main`,
                    minWidth: 300,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start'
                }}>
                    <Box>
                        {title && <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{title}</Typography>}
                        <Typography variant="body2">{message}</Typography>
                    </Box>
                    <IconButton size="small" onClick={() => closeSnackbar(key)}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            )
        });
    };

    const loading = (message: string, title?: string) => {
        const key = enqueueSnackbar(message, {
            variant: 'info',
            persist: true,
            content: () => (
                <Box sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 1, boxShadow: 3, display: 'flex', alignItems: 'center', gap: 2, minWidth: 300 }}>
                    <CircularProgress size={20} />
                    <Box>
                        {title && <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{title}</Typography>}
                        <Typography variant="body2">{message}</Typography>
                    </Box>
                </Box>
            )
        });
        // Return the cleanup function as expected by your project
        return () => closeSnackbar(key);
    };

    const confirm = (message: string, options: ConfirmOptions) => {
        enqueueSnackbar(message, {
            variant: options.severity || 'warning',
            persist: true, // Don't auto-hide confirm dialogs
            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
            content: (key) => (
                <Box sx={{
                    bgcolor: 'background.paper',
                    p: 2,
                    borderRadius: 1,
                    boxShadow: 6,
                    border: '1px solid',
                    borderColor: 'divider',
                    minWidth: 320
                }}>
                    {options.title && <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>{options.title}</Typography>}
                    <Typography variant="body2" sx={{ mb: 2 }}>{message}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button size="small" onClick={() => { options.onCancel?.(); closeSnackbar(key); }}>
                            {options.cancelLabel || 'Cancel'}
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            color={options.severity === 'error' ? 'error' : 'primary'}
                            onClick={() => { options.onConfirm(); closeSnackbar(key); }}
                        >
                            {options.confirmLabel || 'Confirm'}
                        </Button>
                    </Box>
                </Box>
            )
        });
    };

    const contextValue = { success, error, warning, info, loading, confirm };

    return (
        <NotistackProvider maxSnack={5} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <SnackbarContext.Provider value={contextValue}>
                {children}
            </SnackbarContext.Provider>
        </NotistackProvider>
    );
};

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) throw new Error('useSnackbar must be used within a SnackbarProvider');
    return context;
};