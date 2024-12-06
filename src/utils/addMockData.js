import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

// Mock data for users
const mockUsers = [
    {
        name: 'John Doe',
        email: 'john.doe@example.com',
        availability: {
            monday: [true, false, true, false, true, false, false, false, true, false],
            tuesday: [false, true, true, false, false, true, false, true, true, false],
            wednesday: [true, false, false, true, true, false, false, true, false, true],
            thursday: [false, true, false, false, true, true, false, false, true, false],
            friday: [true, true, false, false, true, true, false, false, false, true],
            saturday: [false, false, true, true, false, false, true, false, true, true],
            sunday: [true, false, true, true, false, true, false, true, true, false],
        },
        answers: {
            "1": [1, 2, 3, 4, 5],
            "2": [5, 4, 3, 2, 1],
            "3": [3, 3, 3, 3, 3],
            "4": [4, 4, 4, 4, 4],
            "5": [2, 2, 2, 2, 2],
            "6": [1, 1, 1, 1, 1],
            "7": [5, 5, 5, 5, 5],
            "8": [4, 4, 4, 4, 4],
            "9": ['Evanston'],
            "10": ['Soccer'],
        },
    },
    {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        availability: {
            monday: [false, true, true, false, false, false, true, true, false, true],
            tuesday: [true, false, false, true, true, false, false, false, true, true],
            wednesday: [false, true, true, false, false, true, true, false, false, true],
            thursday: [true, true, false, true, true, false, true, true, false, false],
            friday: [false, false, true, true, false, false, true, true, false, true],
            saturday: [true, true, false, false, true, true, false, false, true, true],
            sunday: [false, false, false, true, true, false, false, true, true, false],
        },
        answers: {
            "1": [2, 4, 5, 3, 1],
            "2": [5, 3, 2, 4, 1],
            "3": [4, 4, 4, 4, 4],
            "4": [1, 1, 1, 1, 1],
            "5": [3, 3, 3, 3, 3],
            "6": [2, 2, 2, 2, 2],
            "7": [5, 4, 3, 2, 1],
            "8": [1, 5, 2, 3, 4],
            "9": ['Chicago'],
            "10": ['Basketball'],
        },
    },
    {
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        availability: {
            monday: [true, true, false, false, true, true, false, true, false, false],
            tuesday: [false, false, true, true, false, false, true, true, false, false],
            wednesday: [true, false, true, true, true, false, false, true, true, true],
            thursday: [false, false, true, false, true, false, true, false, true, false],
            friday: [true, true, true, true, false, true, false, true, true, true],
            saturday: [false, true, false, true, true, false, true, false, true, false],
            sunday: [true, false, true, false, false, true, false, true, false, false],
        },
        answers: {
            "1": [5, 4, 3, 2, 1],
            "2": [1, 2, 3, 4, 5],
            "3": [2, 2, 2, 2, 2],
            "4": [3, 3, 3, 3, 3],
            "5": [4, 4, 4, 4, 4],
            "6": [5, 5, 5, 5, 5],
            "7": [1, 1, 1, 1, 1],
            "8": [2, 3, 4, 5, 1],
            "9": ['Naperville'],
            "10": ['Tennis'],
        },
    },
];

// Function to add a single user
const addUser = async ({ name, email, availability, answers }) => {
    try {
        const userDocRef = doc(collection(db, 'users')); // Generate a document reference with Firestore ID
        const userId = userDocRef.id;

        const userData = {
            name,
            email,
            groupId: null,
            groupMatched: false,
            questionnaireCompleted: true, // Answers are provided, so completed is true
            answers,
            availability,
            updatedAt: serverTimestamp(),
        };

        // Set user data
        await setDoc(userDocRef, userData);

        console.log(`User created: ${name} (ID: ${userId})`);
        return userId;
    } catch (error) {
        console.error(`Error creating user ${name}:`, error);
        throw new Error('Failed to create user');
    }
};

// Function to add all users
export const addMockUsers = async () => {
    try {
        console.log('Adding mock users...');
        const userIds = [];

        for (const user of mockUsers) {
            const userId = await addUser(user);
            userIds.push(userId);
        }

        console.log('Mock users added successfully:', userIds);
    } catch (error) {
        console.error('Error adding mock users:', error);
    }
};

// Run this function to add the users
addMockUsers();
