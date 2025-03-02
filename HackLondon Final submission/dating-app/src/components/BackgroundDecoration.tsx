import React from 'react';
import { Box } from '@mui/material';

const BackgroundDecoration: React.FC = () => {
  return (
    <>
      {/* Top right corner decoration */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: { xs: '180px', sm: '250px', md: '300px', lg: '400px' },
          height: { xs: '180px', sm: '250px', md: '300px', lg: '400px' },
          backgroundImage: 'url("https://www.imghippo.com/i/DKh3761uE.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.9,
          zIndex: 0,
          borderBottomLeftRadius: '100%',
          pointerEvents: 'none', // Ensures it doesn't interfere with clicks
          mixBlendMode: 'normal',
          boxShadow: 'inset 0 0 30px rgba(255,255,255,0.5)',
          filter: 'saturate(1.8) brightness(1.2)',
          transform: 'rotate(-5deg) scale(1.05)',
          transformOrigin: 'top right',
        }}
      />

      {/* Bottom left corner decoration */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: { xs: '180px', sm: '250px', md: '300px', lg: '400px' },
          height: { xs: '180px', sm: '250px', md: '300px', lg: '400px' },
          backgroundImage: 'url("https://www.imghippo.com/i/DKh3761uE.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.9,
          zIndex: 0,
          borderTopRightRadius: '100%',
          pointerEvents: 'none', // Ensures it doesn't interfere with clicks
          mixBlendMode: 'normal',
          boxShadow: 'inset 0 0 30px rgba(255,255,255,0.5)',
          filter: 'saturate(1.8) brightness(1.2)',
          transform: 'rotate(5deg) scale(1.05)',
          transformOrigin: 'bottom left',
        }}
      />
    </>
  );
};

export default BackgroundDecoration; 
