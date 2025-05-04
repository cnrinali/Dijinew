import React, { createContext, useState, useContext, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const NotificationContext = createContext(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null); // { message: string, severity: 'success' | 'error' | 'warning' | 'info' }

    const showNotification = useCallback((message, severity = 'success') => {
        setNotification({ message, severity, key: new Date().getTime() }); // key ekleyerek aynı mesajın tekrar gösterilmesini sağlıyoruz
    }, []);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotification(null);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notification && (
                <Snackbar
                    key={notification.key}
                    open={!!notification}
                    autoHideDuration={6000} // 6 saniye sonra otomatik kapanır
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Konum
                >
                    {/* Snackbar içeriğini Alert ile oluşturuyoruz */}
                    <Alert onClose={handleClose} severity={notification.severity} sx={{ width: '100%' }} variant="filled"> {/* variant="filled" eklendi */}
                        {notification.message}
                    </Alert>
                </Snackbar>
            )}
        </NotificationContext.Provider>
    );
};

// Opsiyonel: Default export ekleyerek bazı import sorunlarını önleyebiliriz
// export default NotificationContext; // Genellikle Provider'ı export etmek yeterli olur 