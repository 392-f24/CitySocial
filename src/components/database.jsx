import { db } from "../firebase";

import { collection, addDoc, getDoc, doc, getDocs, updateDoc, deleteDoc, onSnapshot, query, orderBy } from "firebase/firestore";

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


export const getGroup = async (groupId) => {
    const docRef = doc(db, "groups", groupId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Group data:", docSnap.data());
    } else {
        console.log("No such document!");
    }
};


export const getAllGroups = async () => {
    const querySnapshot = await getDocs(collection(db, "groups"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} =>`, doc.data());
    });
};


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


export const deleteGroup = async (groupId) => {
    const docRef = doc(db, "groups", groupId);
    try {
        await deleteDoc(docRef);
        console.log("Group deleted successfully!");
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
};


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


export const getMessages = async (groupId) => {
    const messagesRef = collection(db, `groups/${groupId}/messages`);
    const q = query(messagesRef, orderBy("sentAt"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} =>`, doc.data());
    });
};