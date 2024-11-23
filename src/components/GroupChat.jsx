import React from 'react';
import { Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GroupChat = () => {
  const navigate = useNavigate();

  return (
      <div className="max-w-4xl mx-auto p-6 relative">
        {/* Scheduler Button */}
        <button
            onClick={() => navigate('/whentomeet')}
            className="absolute top-12 right-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300"
        >
          Scheduler
        </button>

        {/* Chat Box */}
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
                <p className="text-gray-700">
                  Welcome to your new group! Why don't you start by introducing yourselves?
                </p>
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
};

export default GroupChat;
