import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Navigation: React.FC = () => {
  return (
    <AppBar position="static" elevation={2} sx={{ 
      borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 10
    }}>
      <Toolbar>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.7) 100%)',
            py: 1,
            px: 2,
            borderRadius: 4,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <FavoriteIcon sx={{ 
              fontSize: 32, 
              color: 'primary.main', 
              mr: 1,
              filter: 'drop-shadow(0 2px 4px rgba(255,64,129,0.3))',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1) rotate(10deg)'
              }
            }} />
            <Typography variant="h6" component="div" sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #ff4081, #9c27b0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              letterSpacing: '0.5px'
            }}>
              AI Match
            </Typography>
          </Box>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 