import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    // fetch user Data
    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;

            if (!user) {
                navigate('/signin');
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
                else {
                    console.error('No user data found');
                }
            }
            catch (error) {
                console.error('Error fetching user data: ', error)
            }
        };
        fetchUserData();
    }, [navigate]);

    return (
       <div>
            <h1>Welcome, {userData?.name}</h1>
            <p>Email: {userData?.email}</p>
        </div>
    )
}

export default Profile
