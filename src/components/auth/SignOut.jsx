import React from 'react';
import { signOut } from "firebase/auth";
import { db, auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const SignOut = () => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        // Handle user signing out and redirect to sign in page
        signOut(auth)
            .then(() => {
                console.log("User signed out");
                navigate('/');
            })
            .catch((error) => {
                console.error("Error signing out:", error);
            });
    };
    return (
        <div>
            <button 
                onClick={handleSignOut}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold text-base"
                style={{ whiteSpace: 'nowrap'}}
            >
                Sign Out
            </button>
        </div>
    );
}

export default SignOut

