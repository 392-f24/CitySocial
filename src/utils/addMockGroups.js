import { doc, setDoc, updateDoc, serverTimestamp, collection, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Group details
const mockGroupName = 'Test Group';
const matchScore = 90; // Example match score
const userUids = [
    'HYOmSp5Zg8f8RQaggvCU',
    'KGxSTViQS3qu4ku5oEuR',
    'PjAhtv5aJqTDxWfIPLf8',
    'TPRuLwtCgog9yTynUys5',
    'V1I58iSB1zSvJ09CYjTc', // This UID is problematic
    'hKC54xK0UfCVQfjxphaL',
    'mWqz6WKAeVh9aNins55A',
    'nH9hYekLPWOdZfEJ4PMq',
    'qAxluGSzTmPYqJfSqnDm',
];

export const addMockGroups = async () => {
    try {
        // Step 1: Create a new group document
        const groupDocRef = doc(collection(db, 'groups')); // Generate a new group ID
        const groupId = groupDocRef.id;

        // Create the group document
        await setDoc(groupDocRef, {
            name: mockGroupName,
            matchScore,
            members: [], // Add valid members later
            groupAvailability: {}, // Default empty availability
            createdAt: serverTimestamp(),
            lastActivity: serverTimestamp(),
        });

        console.log(`Group created successfully with ID: ${groupId}`);

        // Step 2: Process and update valid users
        const validUsers = [];
        for (const userId of userUids) {
            const userDocRef = doc(db, 'users', userId);

            // Check if the user document exists
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                // Update the user document
                await updateDoc(userDocRef, {
                    groupId,
                    groupMatched: true,
                    updatedAt: serverTimestamp(),
                });

                console.log(`User ${userId} updated with groupId = ${groupId} and groupMatched = true`);
                validUsers.push(userId);
            } else {
                console.warn(`User ${userId} does not exist. Skipping.`);
            }
        }

        // Step 3: Update group members
        if (validUsers.length > 0) {
            await updateDoc(groupDocRef, {
                members: validUsers,
            });
            console.log(`Group updated with valid members: ${validUsers}`);
        } else {
            console.warn('No valid users found to add to the group.');
        }
    } catch (error) {
        console.error('Error creating group or updating users:', error);
    }
};
