import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { addGroup, getGroup, getAllGroups, updateGroup, deleteGroup, listenToGroups, addMessage, getMessages } from '../functions/database';

// const GroupChat = () => (
//   <div className="max-w-4xl mx-auto p-6">
//     <div className="bg-white rounded-2xl shadow-lg h-[600px] flex flex-col border border-purple-100">
//       <div className="p-6 border-b border-purple-100">
//         <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//           Your New Tribe
//         </h2>
//       </div>
//       <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-purple-50 to-pink-50">
//         <div className="space-y-4">
//           <div className="bg-white rounded-2xl p-4 max-w-[80%] shadow-sm border border-purple-100">
//             <p className="text-sm font-semibold text-purple-600 mb-1">System</p>
//             <p className="text-gray-700">Welcome to your new group! Why don't you start by introducing yourselves?</p>
//           </div>
//         </div>
//       </div>
//       <div className="p-4 border-t border-purple-100">
//         <div className="flex gap-3">
//           <input
//             type="text"
//             placeholder="Type a message..."
//             className="flex-1 p-4 border border-purple-100 rounded-xl focus:outline-none focus:border-purple-300 transition-all duration-300"
//           />
//           <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-xl hover:shadow-lg transition-all duration-300">
//             <Send className="w-6 h-6" />
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// const GroupChat = ({ groupId, userId }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [groupName, setGroupName] = useState("");

//   // Fetch messages on component mount and set up a listener for new messages
//   useEffect(() => {
//     const fetchMessages = async () => {
//       const messages = [];
//       const querySnapshot = await getMessages(groupId);
//       querySnapshot.forEach((doc) => {
//         messages.push({ id: doc.id, ...doc.data() });
//       });
//       setMessages(messages);
//     };

//     fetchMessages();

//     const unsubscribe = listenToGroups(groupId, (change) => {
//       if (change.type === "added") {
//         setMessages((prev) => [...prev, { id: change.doc.id, ...change.doc.data() }]);
//       }
//     });

//     return () => unsubscribe();
//   }, [groupId]);

//   // Handle sending a new message
//   const handleSendMessage = async () => {
//     if (newMessage.trim() === "") return;

//     try {
//       await addMessage(groupId, {
//         text: newMessage,
//         sentBy: userId,
//         sentAt: new Date(),
//       });
//       setNewMessage(""); // Clear the input field
//     } catch (error) {
//       console.error("Error sending message: ", error);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       {/* Header */}
//       <header className="bg-blue-500 text-white text-center py-4">
//         <h1 className="text-xl font-bold">{groupName || "Group Chat"}</h1>
//       </header>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex ${
//               message.sentBy === userId ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`px-4 py-2 rounded-lg ${
//                 message.sentBy === userId
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-300 text-black"
//               }`}
//             >
//               <p className="text-sm">{message.text}</p>
//               <span className="text-xs text-gray-500">
//                 {new Date(message.sentAt.toDate()).toLocaleTimeString()}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Input */}
//       <div className="p-4 bg-white flex items-center border-t border-gray-300">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type your message"
//           className="flex-1 border rounded-lg px-4 py-2 mr-4 focus:outline-none"
//         />
//         <button
//           onClick={handleSendMessage}
//           className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };


// export default GroupChat;

const GroupChat = ({ groupId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);

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
      <header className="bg-blue-500 text-white text-center py-4">
        <h1 className="text-xl font-bold">{groupName || "Group Chat"}</h1>
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
