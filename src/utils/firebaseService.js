import { db } from '../firebase'; // Import your Firebase setup
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Create a user document in the `users` collection
 * @param {string} uid - The user's UID from Firebase Authentication
 * @param {string} name - The user's name
 * @param {string} email - The user's email
 * @returns {Promise<void>}
 */
export const createUserDocument = async (uid, name, email) => {
    try {
        const userDocRef = doc(db, 'users', uid); // Use the UID as the document ID

        // Default availability structure: all days set to false
        const defaultAvailability = {
            monday: Array(10).fill(false),
            tuesday: Array(10).fill(false),
            wednesday: Array(10).fill(false),
            thursday: Array(10).fill(false),
            friday: Array(10).fill(false),
            saturday: Array(10).fill(false),
            sunday: Array(10).fill(false),
        };

        const userData = {
            name,
            email,
            groupId: [],                   // Default: not in any group, array to hold multiple groups
            groupMatched: false,           // Default value
            questionnaireCompleted: false, // Default value
            answers: {},                   // Empty answers initially
            availability: defaultAvailability, // All false availability
            updatedAt: serverTimestamp(),  // Timestamp for tracking
        };

        // Write to Firestore
        await setDoc(userDocRef, userData);

        console.log(`User document created for UID: ${uid}`);
    } catch (error) {
        console.error('Error creating user document:', error);
        throw new Error('Failed to create user document');
    }
};



/**
 * 2. Add questionnaire answers to a user's document
 * @param {string} userId - The ID of the user
 * @param {object} answers - The user's questionnaire answers
 * @returns {Promise<void>}
 */
export const addQuestionnaireAnswers = async (userId, answers) => {
    try {
        const userRef = doc(db, 'users', userId);

        // Update the user's questionnaire data
        await updateDoc(userRef, {
            questionnaireCompleted: true,
            answers: answers, // Example: { "1": [1, 2, 3, 4, 5], "2": [1, 2, 3, 4, 5], ... }
            updatedAt: serverTimestamp(),
        });

        console.log(`Questionnaire answers added successfully for user ID: ${userId}`);
    } catch (error) {
        console.error('Error adding questionnaire answers:', error);
        throw new Error('Failed to add questionnaire answers');
    }
};

/**
 * 3. Assign a user to a group
 * @param {string} userId - The ID of the user
 * @param {string} groupId - The ID of the group
 * @returns {Promise<void>}
 */
export const assignUserToGroup = async (userId, groupId) => {
    try {
        const userRef = doc(db, 'users', userId);

        // Add the group ID to the user's groupId array
        await updateDoc(userRef, {
            groupMatched: true,
            groupId: firebase.firestore.FieldValue.arrayUnion(groupId), // Append to the groupId array
            updatedAt: serverTimestamp(),
        });

        console.log(`User ID: ${userId} assigned to group ID: ${groupId}`);
    } catch (error) {
        console.error('Error assigning user to group:', error);
        throw new Error('Failed to assign user to group');
    }
};


/**
 * 4. Create a group document in the `groups` collection
 * @param {string} name - The name of the group
 * @param {number} matchScore - The match score for the group
 * @param {Array<string>} members - An array of user IDs for the group members
 * @returns {Promise<void>}
 */
export const createGroup = async (name, matchScore, members) => {
    try {
        const groupId = doc(db, 'groups').id; // Generate a default Firestore document ID

        const groupData = {
            name,
            matchScore,
            members,                      // Array of user IDs
            groupAvailability: {},        // Default availability is empty
            createdAt: serverTimestamp(), // Timestamp when the group is created
            lastActivity: serverTimestamp() // Initialize last activity timestamp to now
        };

        // Write to Firestore
        await setDoc(doc(db, 'groups', groupId), groupData);

        console.log(`Group created successfully with ID: ${groupId}`);
    } catch (error) {
        console.error('Error creating group document:', error);
        throw new Error('Failed to create group document');
    }
};


/**
 * 5. Update group availability
 * @param {string} groupId - The ID of the group
 * @param {object} groupAvailability - The new group availability object
 * @returns {Promise<void>}
 */
export const updateGroupAvailability = async (groupId, groupAvailability) => {
    try {
        const groupRef = doc(db, 'groups', groupId);

        // Update the group's availability and last activity timestamp
        await updateDoc(groupRef, {
            groupAvailability,            // Set the new availability
            lastActivity: serverTimestamp() // Update the last activity timestamp
        });

        console.log(`Group availability updated successfully for group ID: ${groupId}`);
    } catch (error) {
        console.error('Error updating group availability:', error);
        throw new Error('Failed to update group availability');
    }
};


/**
 * 6. Update group name
 * @param {string} groupId - The ID of the group
 * @param {string} name - The new name for the group
 * @returns {Promise<void>}
 */
export const updateGroupName = async (groupId, name) => {
    try {
        const groupRef = doc(db, 'groups', groupId);

        // Update the group's name and last activity timestamp
        await updateDoc(groupRef, {
            name,                         // Set the new group name
            lastActivity: serverTimestamp() // Update the last activity timestamp
        });

        console.log(`Group name updated successfully for group ID: ${groupId}`);
    } catch (error) {
        console.error('Error updating group name:', error);
        throw new Error('Failed to update group name');
    }
};


/**
 * Fetch user availability
 * @param {string} userId - The user's ID
 * @returns {Promise<object>} - The user's availability
 */
export const fetchUserAvailability = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return userDoc.data().availability;
        } else {
            throw new Error(`User with ID ${userId} does not exist.`);
        }
    } catch (error) {
        console.error('Error fetching user availability:', error);
        throw new Error('Failed to fetch user availability.');
    }
};

/**
 * Update a user's availability in Firestore
 * @param {string} userId - The user's Firestore document ID
 * @param {object} availability - The updated availability object
 * @returns {Promise<void>}
 */
export const updateUserAvailability = async (userId, availability) => {
    try {
        const userRef = doc(db, 'users', userId);

        // Update the user's availability and timestamp
        await updateDoc(userRef, {
            availability, // Set the new availability
            updatedAt: serverTimestamp(), // Update the last modified timestamp
        });

        console.log(`User availability updated successfully for user ID: ${userId}`);
    } catch (error) {
        console.error('Error updating user availability:', error);
        throw new Error('Failed to update user availability');
    }
};
