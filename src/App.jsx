import React, { useState } from 'react';
import { Loader2, Heart, Send, Sparkles, Users } from 'lucide-react';

const matchedGroup = [
  {
    name: "Alex Chen",
    age: 24,
    bio: "Coffee enthusiast, amateur photographer",
    interests: ["Photography", "Hiking", "Coffee"],
    compatibility: 89
  },
  {
    name: "Sarah Johnson",
    age: 26,
    bio: "Travel blogger, yoga instructor",
    interests: ["Travel", "Yoga", "Writing"],
    compatibility: 85
  },
  {
    name: "Mike Rodriguez",
    age: 23,
    bio: "Game developer, music producer",
    interests: ["Gaming", "Music", "Technology"],
    compatibility: 82
  }
];

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

const App = () => {
  const [step, setStep] = useState('questionnaire');
  const [answers, setAnswers] = useState({});
  const [acceptedMatches, setAcceptedMatches] = useState(false);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmitQuestionnaire = () => {
    setStep('loading');
    setTimeout(() => setStep('matches'), 3000);
  };

  const handleAcceptMatches = () => {
    setAcceptedMatches(true);
    setStep('chat');
  };

  const Questionnaire = () => (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Find Your Tribe
          </h1>
          <p className="mt-4 text-gray-600">Discover genuine connections with like-minded people</p>
        </div>
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
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold text-lg"
              onClick={handleSubmitQuestionnaire}
          >
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Find My Perfect Group
            </div>
          </button>
        </div>
      </div>
  );

  const Loading = () => (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-xl opacity-20 animate-pulse rounded-full" />
          <Loader2 className="w-20 h-20 animate-spin text-purple-600 relative" />
        </div>
        <h2 className="text-3xl font-bold mt-8 mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Finding Your Perfect Match
        </h2>
        <p className="text-gray-600">Analyzing personalities and connections...</p>
      </div>
  );

  const Matches = () => (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Your Perfect Match Found!
          </h1>
          <p className="text-gray-600">We've found a group that shares your interests and values</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {matchedGroup.map((person, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 hover:border-purple-200 transition-all duration-300">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-center mb-2 text-gray-800">{person.name}</h2>
                <p className="text-gray-500 text-center mb-4">{person.age} years old</p>
                <p className="text-gray-600 mb-4 text-center">{person.bio}</p>
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  {person.interests.map((interest, i) => (
                      <span key={i} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                  {interest}
                </span>
                  ))}
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold text-lg">
                    <Heart className="w-5 h-5 text-pink-600" />
                    {person.compatibility}% Match
                  </div>
                </div>
              </div>
          ))}
        </div>
        <div className="flex justify-center gap-4 mt-12">
          <button
              className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold"
              onClick={() => setStep('questionnaire')}
          >
            Try Again
          </button>
          <button
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
              onClick={handleAcceptMatches}
          >
            Join Group Chat
          </button>
        </div>
      </div>
  );

  const Chat = () => (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg h-[600px] flex flex-col border border-purple-100">
          <div className="p-6 border-b border-purple-100">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your New Tribe
            </h2>
          </div>
          <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-purple-50 to-pink-50">
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 max-w-[80%] shadow-sm border border-purple-100">
                <p className="text-sm font-semibold text-purple-600 mb-1">System</p>
                <p className="text-gray-700">Welcome to your new group! Why don't you start by introducing yourselves?</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-purple-100">
            <div className="flex gap-3">
              <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 p-4 border border-purple-100 rounded-xl focus:outline-none focus:border-purple-300 transition-all duration-300"
              />
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-xl hover:shadow-lg transition-all duration-300">
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
  );

  return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
        {step === 'questionnaire' && <Questionnaire />}
        {step === 'loading' && <Loading />}
        {step === 'matches' && <Matches />}
        {step === 'chat' && <Chat />}
      </div>
  );
};

export default App;