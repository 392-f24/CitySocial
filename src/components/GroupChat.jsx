import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GroupChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Add the user's message to the state
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: Date.now(), text: newMessage, sentBy: "You" },
    ]);

    setNewMessage(""); // Clear the input field
  };

  // Detect "hello" and make Bella respond
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage && lastMessage.text.toLowerCase().includes("hello") && lastMessage.sentBy === "You") {
      const timer = setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: Date.now(), text: "Hi there!", sentBy: "Bella" },
        ]);
      }, 10000); // 10 seconds delay

      // Cleanup timer on unmount or message change
      return () => clearTimeout(timer);
    }
  }, [messages]);

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
          {/* Chat Header */}
          <div className="p-6 border-b border-purple-100">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your New Tribe
            </h2>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-purple-50 to-pink-50">
            <div className="space-y-4">
              {messages.map((message) => (
                  <div
                      key={message.id}
                      className={`bg-white rounded-2xl p-4 max-w-[80%] shadow-sm border border-purple-100 ${
                          message.sentBy === "Bella" ? "self-start" : "self-end"
                      }`}
                  >
                    <p className="text-sm font-semibold text-purple-600 mb-1">
                      {message.sentBy}
                    </p>
                    <p className="text-gray-700">{message.text}</p>
                  </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-purple-100">
            <div className="flex gap-3">
              <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 p-4 border border-purple-100 rounded-xl focus:outline-none focus:border-purple-300 transition-all duration-300"
              />
              <button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default GroupChat;
