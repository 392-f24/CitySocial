import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Plus, X, GripVertical } from 'lucide-react';  // Make sure GripVertical is included
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { db, auth } from '../firebase';
import Navigation from './Navigation';
import { questions } from '../data/questions';
import { HOBBIES } from '../data/hobbies';

const Questionnaire = () => {
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});
    const [neighborhoods, setNeighborhoods] = useState(['']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [initialCheckDone, setInitialCheckDone] = useState(false);
    const [hobbyInput, setHobbyInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedHobbies, setSelectedHobbies] = useState([]);
    const suggestionsRef = useRef(null);
    const [rankingStates, setRankingStates] = useState({});

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setSuggestions([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        // Initialize ranking states with default values
        const initialRankingStates = {};
        questions.forEach(q => {
            if (q.type === 'rank') {
                initialRankingStates[q.id] = q.options.map(opt => opt.value);
            }
        });
        setRankingStates(initialRankingStates);
    }, []);

    useEffect(() => {
        // When component mounts, initialize the answers state for neighborhoods
        setAnswers(prev => ({
            ...prev,
            9: neighborhoods.filter(n => n.trim() !== '')
        }));
    }, []);

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleRankingChange = (questionId, result) => {
        if (!result.destination) return;

        const currentRanking = rankingStates[questionId] || 
            questions.find(q => q.id === questionId).options.map(opt => opt.value);

        const newRanking = reorder(
            currentRanking,
            result.source.index,
            result.destination.index
        );

        setRankingStates(prev => ({
            ...prev,
            [questionId]: newRanking
        }));

        setAnswers(prev => ({
            ...prev,
            [questionId]: newRanking
        }));
    };

    const handleNeighborhoodChange = (index, value) => {
        const newNeighborhoods = [...neighborhoods];
        newNeighborhoods[index] = value;
        setNeighborhoods(newNeighborhoods);

        const nonEmptyNeighborhoods = newNeighborhoods.filter(n => n.trim() !== '');
    
        console.log('Setting answers with neighborhoods:', nonEmptyNeighborhoods);
        setAnswers(prev => ({
            ...prev,
            9: nonEmptyNeighborhoods
        }));
    };

    const handleHobbyInputChange = (e) => {
        const input = e.target.value;
        setHobbyInput(input);

        if (input.trim()) {
            const filtered = HOBBIES.filter(
                hobby => hobby.toLowerCase().includes(input.toLowerCase()) &&
                !selectedHobbies.includes(hobby)
            ).slice(0, 5); // Limit to 5 suggestions
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const addHobby = (hobby) => {
        if (!selectedHobbies.includes(hobby)) {
            const newHobbies = [...selectedHobbies, hobby].sort();
            setSelectedHobbies(newHobbies);
            setAnswers(prev => ({
                ...prev,
                10: newHobbies
            }));
        }
        setHobbyInput('');
        setSuggestions([]);
    };

    const removeHobby = (hobby) => {
        const newHobbies = selectedHobbies.filter(h => h !== hobby);
        setSelectedHobbies(newHobbies);
        setAnswers(prev => ({
            ...prev,
            10: newHobbies
        }));
    };

    const addNeighborhood = () => {
        setNeighborhoods([...neighborhoods, '']);
    };

    const removeNeighborhood = (index) => {
        const newNeighborhoods = neighborhoods.filter((_, i) => i !== index);
        setNeighborhoods(newNeighborhoods.length ? newNeighborhoods : ['']);
        setAnswers(prev => ({
            ...prev,
            9: newNeighborhoods.filter(n => n.trim() !== '')
        }));
    };

    const renderScaleQuestion = (question) => (
        <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-500 px-2">
                <span>Not Important</span>
                <span>Very Important</span>
            </div>
            <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                    <button
                        key={value}
                        className={`w-12 h-12 rounded-xl transition-all duration-300 ${
                            answers[question.id] === value
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white transform scale-110 shadow-lg'
                                : 'bg-purple-50 hover:bg-purple-100 text-gray-700'
                        }`}
                        onClick={() => handleAnswerChange(question.id, value)}
                    >
                        {value}
                    </button>
                ))}
            </div>
        </div>
    );

    const renderRankQuestion = (question) => {
        return (
            <DragDropContext onDragEnd={(result) => handleRankingChange(question.id, result)}>
                <Droppable droppableId={`ranking-${question.id}`}>
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2"
                        >
                            {(rankingStates[question.id] || question.options.map(opt => opt.value)).map((value, index) => {
                                const option = question.options.find(opt => opt.value === value);
                                return (
                                    <Draggable
                                        key={option.value}
                                        draggableId={`${question.id}-${option.value}`}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={`flex items-center p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors duration-300 ${
                                                    snapshot.isDragging
                                                        ? 'bg-purple-100 shadow-lg'
                                                        : ''
                                                }`}
                                            >
                                                <div
                                                    {...provided.dragHandleProps}
                                                    className="mr-4 text-gray-400 hover:text-purple-600 p-2 -m-2"
                                                >
                                                    <GripVertical className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium flex items-center">
                                                        <span className="w-6 h-6 flex items-center justify-center bg-purple-200 rounded-full mr-3 text-sm">
                                                            {index + 1}
                                                        </span>
                                                        {option.label}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    };

    const renderSelectQuestion = (question) => (
        <div className="grid grid-cols-1 gap-3">
            {question.options.map((option) => (
                <button
                    key={option.value}
                    className={`p-4 rounded-xl transition-all duration-300 text-left ${
                        answers[question.id] === option.value
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white transform scale-102 shadow-lg'
                            : 'bg-purple-50 hover:bg-purple-100 text-gray-700'
                    }`}
                    onClick={() => handleAnswerChange(question.id, option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );

    const renderHobbiesQuestion = () => (
        <div className="space-y-4">
            <div className="relative">
                <input
                    type="text"
                    value={hobbyInput}
                    onChange={handleHobbyInputChange}
                    className="w-full p-3 rounded-lg border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-300"
                    placeholder="Type to search hobbies..."
                />
                {suggestions.length > 0 && (
                    <div ref={suggestionsRef} className="absolute z-10 w-full mt-1 bg-white border border-purple-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.map((hobby) => (
                            <button
                                key={hobby}
                                onClick={() => addHobby(hobby)}
                                className="w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors duration-300"
                            >
                                {hobby}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex flex-wrap gap-2">
                {selectedHobbies.map((hobby) => (
                    <div
                        key={hobby}
                        className="flex items-center gap-2 px-3 py-1 bg-purple-50 rounded-full"
                    >
                        <span>{hobby}</span>
                        <button
                            onClick={() => removeHobby(hobby)}
                            className="text-gray-500 hover:text-red-500 transition-colors duration-300"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderNeighborhoodsQuestion = () => (
        <div className="space-y-4">
            {neighborhoods.map((neighborhood, index) => (
                <div key={index} className="flex gap-2">
                    <input
                        type="text"
                        value={neighborhood}
                        onChange={(e) => handleNeighborhoodChange(index, e.target.value)}
                        className="flex-1 p-3 rounded-lg border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-300"
                        placeholder="Enter neighborhood name"
                    />
                    {neighborhoods.length > 1 && (
                        <button
                            onClick={() => removeNeighborhood(index)}
                            className="p-3 text-gray-500 hover:text-red-500 transition-colors duration-300"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            ))}
            <button
                onClick={addNeighborhood}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors duration-300"
            >
                <Plus className="w-4 h-4" />
                Add another neighborhood
            </button>
        </div>
    );

    const renderQuestion = (question) => {
        switch (question.type) {
            case 'rank':
                return renderRankQuestion(question);
            case 'scale':
                return renderScaleQuestion(question);
            case 'select':
                return renderSelectQuestion(question);
            case 'hobbies':
                return renderHobbiesQuestion();
            case 'text-multiple':
                return renderNeighborhoodsQuestion();
            default:
                return null;
        }
    };

    const isQuestionnaireComplete = () => {
        return questions.every(q => {
            console.log(`Checking question ${q.id}:`, {
                type: q.type,
                answer: answers[q.id],
                rankingState: q.type === 'rank' ? rankingStates[q.id] : undefined
            });

            if (q.type === 'scale' || q.type === 'select') {
                const isComplete = answers[q.id] !== undefined;
                console.log(`Scale/Select question ${q.id} complete:`, isComplete);
                return isComplete;
            }
            if (q.type === 'rank') {
                const isComplete = rankingStates[q.id] !== undefined;
                console.log(`Rank question ${q.id} complete:`, isComplete);
                return isComplete;
            }
            if (q.type === 'text-multiple') {
                console.log('Checking neighborhoods:', {
                    answers: answers[q.id],
                    neighborhoods: neighborhoods,
                    isComplete: answers[q.id] && answers[q.id].length > 0
                });
                return answers[q.id] && answers[q.id].length > 0;
            }
            if (q.type === 'hobbies') {
                const isComplete = answers[q.id].length > 0;
                console.log(`Hobbies question ${q.id} complete:`, isComplete);
                return isComplete;
            }
            console.log(`Unknown question type ${q.type} for question ${q.id}`);
            return false;
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
            
            // Combine regular answers with ranking answers
            const finalAnswers = {
                ...answers,
                ...rankingStates
            };

            await setDoc(userRef, {
                questionnaireCompleted: true,
                answers: finalAnswers,
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
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Find Your Tribe
                </h1>
                <p className="mt-4 text-gray-600">Answer these research-driven questions to discover genuine connections with people near you</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
                    {error}
                </div>
            )}

            <div className="space-y-8">
                {questions.map((question) => (
                    <div key={question.id} className="bg-white p-8 rounded-2xl shadow-lg border border-purple-100 hover:border-purple-200 transition-all duration-300">
                        <h2 className="text-xl font-semibold mb-3 text-gray-800">
                            {question.question}
                        </h2>
                        <p className="text-gray-500 mb-6 text-sm">
                            {question.description}
                        </p>
                        {renderQuestion(question)}
                    </div>
                ))}
                
                <button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg"
                    onClick={handleSubmit}
                    disabled={loading || !isQuestionnaireComplete()}
                >
                    <div className="flex items-center justify-center gap-2">
                        {loading ? (
                            "Saving..."
                        ) : (
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