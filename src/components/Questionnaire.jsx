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
    const [currentSection, setCurrentSection] = useState(0);

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
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const isQuestionnaireComplete = () => {
        const requiredQuestions = questions.filter(q => 
            ['rank', 'hobbies', 'text-multiple'].includes(q.type)
        );

        return requiredQuestions.every(question => {
            const answer = answers[question.id];
            
            if (!answer || (Array.isArray(answer) && answer.length === 0)) {
                return false;
            }

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

    // Reorder questions to show location and hobbies first
    const orderedQuestions = [
        ...questions.filter(q => ['text-multiple', 'hobbies'].includes(q.type)),
        ...questions.filter(q => !['text-multiple', 'hobbies'].includes(q.type))
    ].filter(q => ['rank', 'hobbies', 'text-multiple'].includes(q.type));

    // Split questions into sections of 2
    const sections = [];
    for (let i = 0; i < orderedQuestions.length; i += 2) {
        sections.push(orderedQuestions.slice(i, i + 2));
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
            <Navigation />
            <div className="max-w-6xl mx-auto p-8">
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Find Your Tribe
                    </h1>
                    <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                        Answer these research-driven questions to discover genuine connections with people near you
                    </p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl max-w-2xl mx-auto">
                        {error}
                    </div>
                )}

                <div className="mb-8 flex justify-center gap-2">
                    {sections.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSection(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                currentSection === index 
                                    ? 'bg-purple-600 scale-125' 
                                    : 'bg-purple-200 hover:bg-purple-300'
                            }`}
                        />
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-8">
                    {sections[currentSection]?.map((question) => (
                        <div 
                            key={question.id} 
                            className="bg-white p-8 rounded-2xl shadow-lg border border-purple-100 hover:border-purple-200 transition-all duration-300"
                        >
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                                {question.question}
                            </h2>
                            <p className="text-gray-500 mb-6">
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
                </div>

                <div className="mt-12 flex justify-center gap-4">
                    {currentSection > 0 && (
                        <button
                            onClick={() => setCurrentSection(prev => prev - 1)}
                            className="px-8 py-4 rounded-xl bg-white border border-purple-200 hover:border-purple-300 text-purple-600 font-semibold transition-all duration-300"
                        >
                            Previous
                        </button>
                    )}
                    {currentSection < sections.length - 1 ? (
                        <button
                            onClick={() => setCurrentSection(prev => prev + 1)}
                            className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all duration-300"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default Questionnaire;