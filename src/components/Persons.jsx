import React from 'react';
import { Heart, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const Persons = () => {
  const navigate = useNavigate();

  const handleAcceptMatches = () => {
    navigate('/chat');
  };
  return (
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
    <button
      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold mt-8"
      onClick={handleAcceptMatches}
    >
      Join Group Chat
    </button>
  </div>
  )
};

export default Persons;
