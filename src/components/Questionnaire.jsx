import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import Navigation from './Navigation';

const questions = [
    {
    id: 1,
    question: "How important is trying new experiences to you?",
    description: "1 = Not important at all, 7 = Extremely important"
    },
    {
    id: 2,
    question: "How much do you value deep conversations?",
    description: "1 = Prefer light chat, 7 = Love philosophical discussions"
    },
    {
    id: 3,
    question: "How adventurous are you with food?",
    description: "1 = Stick to familiar foods, 7 = Always trying new cuisines"
    }
];

const Questionnaire = () => {
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [initialCheckDone, setInitialCheckDone] = useState(false);

    // Check if user is authenticated
    useEffect(() => {
        const checkAuth = async (user) => {
            if (user) {
                setCurrentUser(user);
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists() && userDoc.data().questionnaireCompleted && !window.location.hash.includes('force-questionnaire')) {
                    navigate('/persons');
                }
            } else {
                navigate('/signin');
            }
            setInitialCheckDone(true);
        };

        const unsubscribe = auth.onAuthStateChanged(checkAuth);
        return () => unsubscribe();
    }, [navigate]);


    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
        console.log("Current answers:", {...answers, [questionId]: value});
    };

    const isQuestionnaireComplete = () => {
        return questions.every(q => answers[q.id] !== undefined);
    };

    const handleSubmitQuestionnaire = async () => {
        if (!currentUser) {
            setError("Please sign in to submit the questionnaire");
            return;
        }

        const isComplete = isQuestionnaireComplete();
        console.log(isComplete);
        if (!isComplete) {
            setError("Please answer all questions before submitting");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const userRef = doc(db, 'users', currentUser.uid);
            
            await setDoc(userRef, {
                questionnaireCompleted: true,
                answers: answers,
                updatedAt: new Date().toISOString()
            }, { merge: true });

            // Navigate immediately after successful update
            navigate('/persons', { replace: true });

        } catch (err) {
            setError("Failed to save your answers. Please try again.");
            console.error("Error saving questionnaire:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!initialCheckDone || !currentUser) {
        return <div className="text-center p-6">Checking authentication...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <Navigation/>
        <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Find Your Tribe
            </h1>
            <p className="mt-4 text-gray-600">Discover genuine connections with like-minded people</p>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
                {error}
            </div>
        )}

        <div className="space-y-8">
            {questions.map((q) => (
            <div key={q.id} className="bg-white p-8 rounded-2xl shadow-lg border border-purple-100 hover:border-purple-200 transition-all duration-300">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">{q.question}</h2>
                <p className="text-gray-500 mb-6 text-sm">{q.description}</p>
                <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                    <button
                    key={value}
                    className={`w-12 h-12 rounded-xl transition-all duration-300 ${
                        answers[q.id] === value
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white transform scale-110 shadow-lg'
                        : 'bg-purple-50 hover:bg-purple-100 text-gray-700'
                    }`}
                    onClick={() => handleAnswerChange(q.id, value)}
                    >
                    {value}
                    </button>
                ))}
                </div>
            </div>
            ))}
            <button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg"
                onClick={handleSubmitQuestionnaire}
                disabled={loading || !isQuestionnaireComplete()}
            >
                {loading ? (
                        "Saving..."
                ) : (
                    <>
                        <Sparkles className="w-5 h-5" />
                        Find My Perfect Group
                    </>
                )}
            </button>
        </div>
        </div>
    );
};

export default Questionnaire;
