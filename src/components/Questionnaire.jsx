import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import Navigation from './Navigation';
import { questions } from '../data/questions';
import RankingQuestion from './questionnaire/RankingQuestion';
import InputListQuestion from './questionnaire/InputListQuestion';

const Questionnaire = () => {
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [initialCheckDone, setInitialCheckDone] = useState(false);


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

    const handleAnswerUpdate = (questionId, value) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: value
        }));
    };

    const isQuestionnaireComplete = () => {
        // Get all required questions
        const requiredQuestions = questions.filter(q => 
            ['rank', 'hobbies', 'text-multiple'].includes(q.type)
        );

        // Check if each question has a valid answer
        return requiredQuestions.every(question => {
            const answer = answers[question.id];
            
            // Check if answer exists and is not empty
            if (!answer || (Array.isArray(answer) && answer.length === 0)) {
                return false;
            }

            // Additional check for text-multiple (neighborhoods)
            if (question.type === 'text-multiple') {
                return answer.some(item => item.trim() !== '');
            }

            return true;
        });
    };

    const handleSubmit = async () => {
        if (!currentUser) {
            setError("Please sign in to submit the questionnaire");
            return;
        }

        if (!isQuestionnaireComplete()) {
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

            navigate('/persons', { replace: true });
        } catch (err) {
            setError("Failed to save your answers. Please try again.");
            console.error("Error saving questionnaire:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!initialCheckDone || !currentUser) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse text-gray-600">
                    Checking authentication...
                </div>
            </div>
        );
    }


    return (
        <div className="max-w-2xl mx-auto p-6">
            <Navigation />
            <div className="mt-4 text-center">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Find Your Tribe
                </h1>
                <p className="mt-4 text-gray-600">
                    Answer these research-driven questions to discover genuine connections with people near you
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
                    {error}
                </div>
            )}

            <div className="space-y-8">
                {questions.filter(q => ['rank', 'hobbies', 'text-multiple'].includes(q.type)).map((question) => (
                    <div key={question.id} className="bg-white p-8 rounded-2xl shadow-lg border border-purple-100 hover:border-purple-200 transition-all duration-300">
                        <h2 className="text-xl font-semibold mb-3 text-gray-800">
                            {question.question}
                        </h2>
                        <p className="text-gray-500 mb-6 text-sm">
                            {question.description}
                        </p>
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
                ))}
                
                <button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg"
                    onClick={handleSubmit}
                    disabled={loading || !isQuestionnaireComplete()}
                >
                    <div className="flex items-center justify-center gap-2">
                        {loading ? "Saving..." : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Find My Perfect Group
                            </>
                        )}
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Questionnaire;