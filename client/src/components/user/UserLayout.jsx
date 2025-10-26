import React from 'react';
import {
    Box
} from '@mui/material';

function UserLayout({ children }) {


    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    minHeight: '100vh',
                    backgroundColor: 'background.default',
                    position: 'relative'
                }}
            >
                {/* Page Content */}
                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

export default UserLayout;

