import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import SignOut from './auth/SignOut';
import Questionnaire from './Questionnaire';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // fetch user Data
    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser;
            setUser(currentUser);

            if (!currentUser) {
                navigate('/signin');
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                    console.log(userData);
                }
                else {
                    console.error('No user data found');
                }
            }
            catch (error) {
                console.error('Error fetching user data: ', error)
            }
            finally {
                setLoading(false); // Set loading to false after data fetch
            }
        };
        fetchUserData();
    }, [navigate]);

    const handleSave = async (updatedAnswers) => {
        if (!user) {
            console.error('User is not logged in!');
            return;
        }
        try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(
                userRef, {
                    answers: updatedAnswers,
                    updatedAt: new Date().toISOString(),
                },
                {merge: true}
            );
            setUserData((prev) => ({ ...prev, answers: updatedAnswers}));
            setIsEditing(false);
        }
        catch (error) {
            console.error("Error saving user data: ", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Show a loading message while fetching data
    }

    return (
       <div>
            {userData?.questionnaireCompleted && !isEditing ? (
               <div>
                    <h1>Welcome, {userData?.name}</h1>
                    <p>Email: {userData?.email}</p>
                    <SignOut />

                    <h2>Your Questionnaire Answers:</h2>
                    <pre>{JSON.stringify(userData.answers, null, 2)}</pre>
                    <button 
                        className='bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold text-base'
                        onClick={() => setIsEditing(true)}>
                            Edit Profile
                    </button>
               </div>
            ) : (
                <Questionnaire 
                    onSubmit={handleSave}
                    intialAnswers={userData?.answers || {}}
                />
            )}
        </div>
    )
}

export default Profile;
