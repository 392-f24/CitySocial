import React from 'react';
import SignOut from './auth/SignOut';

const Navigation = () => (
    <nav style={{
      padding: '12px 20px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        {/* Add your logo or site name here if needed */}
        <span style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333'
        }}>
          CitySocial
        </span>
      </div>
      <SignOut />
    </nav>
);

export default Navigation