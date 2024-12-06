import React from 'react';
import SignOut from './auth/SignOut';
import Profile from './Profile';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();

  const goProfile = () => {
    navigate('/profile');
  };

  return (
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

      <button
            onClick={goProfile}
            style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
            }}
            aria-label="Go to profile"
        >
            <i className="fa-solid fa-user bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold text-base"
            ></i>
      </button>

    </nav>
  )
}
    

export default Navigation