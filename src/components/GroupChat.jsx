import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { addGroup, getGroup, getAllGroups, updateGroup, deleteGroup, listenToGroups, addMessage, getMessages } from '../functions/database';
import {useNavigate} from "react-router-dom";

const GroupChat = ({ groupId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  // Fetch messages on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messages = [];
        const querySnapshot = await getMessages(groupId);
        querySnapshot.forEach((doc) => {
          messages.push({ id: doc.id, ...doc.data() });
        });
        setMessages(messages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Set up a real-time listener for new messages
    const unsubscribe = listenToGroups(groupId, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          setMessages((prevMessages) => [
            ...prevMessages,
            { id: change.doc.id, ...change.doc.data() },
          ]);
        }
      });
    });

    // Cleanup listener on component unmount
    return () => unsubscribe && unsubscribe();
  }, [groupId]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await addMessage(groupId, {
        text: newMessage,
        sentBy: userId,
        sentAt: new Date(),
      });
      setNewMessage(""); // Clear the input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
      <div className="flex flex-col h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-blue-500 text-white py-4 relative flex items-center justify-between px-4">
          <h1 className="text-xl font-bold">{groupName || "Group Chat"}</h1>
          <button
              onClick={() => navigate('/whentomeet')}
              className="bg-blue-700 px-4 py-2 rounded-lg hover:bg-blue-800 text-sm"
          >
            Scheduler
          </button>
        </header>


        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
              <p className="text-gray-500 text-center">Loading messages...</p>
          ) : (
              messages.map((message) => (
                  <div
                      key={message.id}
                      className={`flex ${
                          message.sentBy === userId ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div
                        className={`px-4 py-2 rounded-lg ${
                            message.sentBy === userId
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300 text-black"
                        }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <span className="text-xs text-gray-500">
                  {new Date(message.sentAt.toDate()).toLocaleTimeString()}
                </span>
                    </div>
                  </div>
              ))
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-white flex items-center border-t border-gray-300">
          <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message"
              className="flex-1 border rounded-lg px-4 py-2 mr-4 focus:outline-none"
          />
          <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
  );
};

export default GroupChat;
