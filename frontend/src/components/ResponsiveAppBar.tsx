import React from 'react';
import { AppBar, Toolbar, Box, Typography } from '@mui/material';
import logo from '../assets/education.png';

const ResponsiveAppBar: React.FC = () => {
    return (
        <AppBar position="fixed" sx={{ 
          background: "linear-gradient(135deg, #1C1E22, #181A1F)", 
          color: "white", 
          padding: '8px 0',
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.3)"
        }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}> 
                {/* Logo & Brand Name */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', ml: 3 }}>
                    <img 
                        src={logo} 
                        alt="App Logo"
                        style={{ height: '40px' }} // Reduced size slightly for balance
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}> 
                        <Typography 
                            variant="h6" 
                            sx={{ fontSize: '1.4rem', color: 'white', fontFamily: 'Playfair Display, sans-serif', fontWeight: 'bold' }}
                        >
                            TempoLearn
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ fontSize: '0.75rem', color: '#8FBC8F', fontFamily: 'sans-serif', fontWeight: 'bold', marginTop: '-2px' }}
                        >
                            An Adaptive Study Management Tool
                        </Typography>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default ResponsiveAppBar;
