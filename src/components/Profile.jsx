import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import SignOut from './auth/SignOut';
import {questions} from '../data/questions';
import RankingQuestion from './questionnaire/RankingQuestion';
import InputListQuestion from './questionnaire/InputListQuestion';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [answers, setAnswers] = useState({});
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
                    const data = userDoc.data();
                    setUserData(data);
                    setAnswers(data.answers || {});
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

    const handleSave = async () => {
        if (!user) {
            console.error('User is not logged in!');
            return;
        }
        try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(
                userRef, {
                    answers,
                    updatedAt: new Date().toISOString(),
                },
                {merge: true}
            );
            setUserData((prev) => ({ ...prev, answers}));
        }
        catch (error) {
            console.error("Error saving user data: ", error);
        }
    };

    const handleAnswerUpdate = (questionId, value) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: value
        }));
    };

    if (loading) {
        return <div>Loading...</div>; // Show a loading message while fetching data
    }

    return (
       <div>
            <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Welcome, {userData?.name}
                </h1>
                <p className="mt-4 text-gray-600">Email: {userData?.email}</p>
                <SignOut />

                <h2 className="text-2xl font-semibold text-gray-800 mt-6">Your Questionnaire Answers:</h2>

                <div className="space-y-8 mt-6">
                    {questions
                        .filter((q) => ['rank', 'hobbies', 'text-multiple'].includes(q.type))
                        .map((question) => (
                            <div
                                key={question.id}
                                className="bg-white p-8 rounded-2xl shadow-lg border border-purple-100 hover:border-purple-200 transition-all duration-300"
                            >
                                <h2 className="text-xl font-semibold mb-3 text-gray-800">{question.question}</h2>
                                <p className="text-gray-500 mb-6 text-sm">{question.description}</p>
                                <div className="text-gray-700">
                                    {question.type === 'rank' ? (
                                        <RankingQuestion
                                            question={question}
                                            currentRanking={answers[question.id]}
                                            onRankingChange={(newRanking) => handleAnswerUpdate(question.id, newRanking)}
                                        />
                                    ) : (
                                        <InputListQuestion
                                            type={question.type}
                                            value={answers[question.id] || []}
                                            onChange={(value) => handleAnswerUpdate(question.id, value)}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                </div>


                <button 
                    className='bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold text-base'
                    onClick={handleSave}
                >
                        Save Changes
                </button>
            </div>
        </div>
    )
}

export default Profile;
