import { db } from "../firebase";

import { collection, addDoc, getDoc, doc, getDocs, updateDoc, deleteDoc, onSnapshot, query, orderBy } from "firebase/firestore";

// Adding a group by creating new document in the "groups" collection
export const addGroup = async () => {
    try {
        const docRef = await addDoc(collection(db, "groups"), {
            name: "Team A",
            members: ["user1", "user2", "user3"],
            createdAt: new Date()
        });
        console.log("Group added with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};


// Getting a group by fetching a document from the "groups" collection
export const getGroup = async (groupId) => {
    const docRef = doc(db, "groups", groupId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Group data:", docSnap.data());
    } else {
        console.log("No such document!");
    }
};


// Getting all groups by querrying all documents from the "groups" collection
export const getAllGroups = async () => {
    const querySnapshot = await getDocs(collection(db, "groups"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} =>`, doc.data());
    });
};


// Updating a group by updating a document in the "groups" collection
export const updateGroup = async (groupId) => {
    const docRef = doc(db, "groups", groupId);

    try {
        await updateDoc(docRef, {
            name: "Updated Team A",
            lastMessage: {
                content: "Welcome!",
                sentAt: new Date(),
                senderId: "user1"
            }
        });
        console.log("Group updated successfully!");
    } catch (e) {
        console.error("Error updating document: ", e);
    }
};


// Deleting a group by deleting a document from the "groups" collection
export const deleteGroup = async (groupId) => {
    const docRef = doc(db, "groups", groupId);
    try {
        await deleteDoc(docRef);
        console.log("Group deleted successfully!");
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
};


// Listening to changes in the "groups" collection - groups added, modified, or removed
export const listenToGroups = () => {
    const groupsRef = collection(db, "groups");

    onSnapshot(groupsRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                console.log("New group: ", change.doc.data());
            }
            if (change.type === "modified") {
                console.log("Updated group: ", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("Removed group: ", change.doc.data());
            }
        });
    });
};


// Adding a message to a group by creating a new document in the "messages" subcollection of the group
export const addMessage = async (groupId, message) => {
    try {
        const messagesRef = collection(db, `groups/${groupId}/messages`);
        await addDoc(messagesRef, {
            content: message,
            senderId: "user1",
            sentAt: new Date()
        });
        console.log("Message sent!");
    } catch (e) {
        console.error("Error sending message: ", e);
    }
};


// Getting messages from a group by fetching all documents from the "messages" subcollection of the group
export const getMessages = async (groupId) => {
    const messagesRef = collection(db, `groups/${groupId}/messages`);
    const q = query(messagesRef, orderBy("sentAt"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} =>`, doc.data());
    });
};