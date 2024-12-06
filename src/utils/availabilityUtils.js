import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Normalize group availability
 * @param {object} groupAvailability - The raw availability counts for the group
 * @param {number} groupSize - The total number of members in the group
 * @returns {object} - The normalized group availability (values between 0 and 1)
 */
export const normalizeGroupAvailability = (groupAvailability, groupSize) => {
    for (const day in groupAvailability) {
        groupAvailability[day] = groupAvailability[day].map((count) => count / groupSize);
    }
    return groupAvailability;
};

/**
 * Generate RGB color based on availability
 * @param {number} availability - The proportion of members available (0 to 1)
 * @returns {string} - The RGB color representing availability
 */
export const getColorFromAvailability = (availability) => {
    const red = Math.round(255 * (1 - availability));
    const green = Math.round(255 * availability);
    return `rgb(${red}, ${green}, 0)`;
};

/**
 * Calculate group availability
 * @param {string} groupId - The ID of the group
 * @returns {Promise<object>} - The calculated group availability
 */
export const calculateGroupAvailability = async (groupId) => {
    try {
        const groupRef = doc(db, 'groups', groupId);
        const groupDoc = await getDoc(groupRef);

        if (!groupDoc.exists()) {
            throw new Error(`Group with ID ${groupId} does not exist.`);
        }

        const groupData = groupDoc.data();
        const memberIds = groupData.members;

        // Initialize group availability structure
        const groupAvailability = {
            monday: Array(10).fill(0),
            tuesday: Array(10).fill(0),
            wednesday: Array(10).fill(0),
            thursday: Array(10).fill(0),
            friday: Array(10).fill(0),
            saturday: Array(10).fill(0),
            sunday: Array(10).fill(0),
        };

        // Fetch each member's availability and aggregate it
        for (const memberId of memberIds) {
            const memberRef = doc(db, 'users', memberId);
            const memberDoc = await getDoc(memberRef);

            if (memberDoc.exists()) {
                const memberData = memberDoc.data();
                const memberAvailability = memberData.availability;

                for (const day in memberAvailability) {
                    memberAvailability[day].forEach((isAvailable, index) => {
                        if (isAvailable) {
                            groupAvailability[day][index] += 1;
                        }
                    });
                }
            } else {
                console.warn(`Member with ID ${memberId} does not exist.`);
            }
        }

        // Normalize group availability
        const groupSize = memberIds.length;
        const normalizedAvailability = normalizeGroupAvailability(groupAvailability, groupSize);

        console.log('Group availability calculated successfully:', normalizedAvailability);
        return normalizedAvailability;
    } catch (error) {
        console.error('Error calculating group availability:', error);
        throw new Error('Failed to calculate group availability.');
    }
};

/**
 * Update user availability
 * @param {string} userId - The user's ID
 * @param {object} availability - Updated availability object
 * @returns {Promise<void>}
 */
export const updateUserAvailability = async (userId, availability) => {
    try {
        const userRef = doc(db, 'users', userId);

        await updateDoc(userRef, {
            availability,
            updatedAt: serverTimestamp(),
        });

        console.log('User availability updated successfully:', userId);
    } catch (error) {
        console.error('Error updating user availability:', error);
        throw new Error('Failed to update user availability.');
    }
};

/**
 * Update group availability
 * @param {string} groupId - The ID of the group
 * @param {object} groupAvailability - The new group availability object
 * @returns {Promise<void>}
 */
export const updateGroupAvailability = async (groupId, groupAvailability) => {
    try {
        const groupRef = doc(db, 'groups', groupId);

        // Update the group's availability and last activity timestamp
        await updateDoc(groupRef, {
            groupAvailability, // Set the new availability
            lastActivity: serverTimestamp(), // Update the last activity timestamp
        });

        console.log(`Group availability updated successfully for group ID: ${groupId}`);
    } catch (error) {
        console.error('Error updating group availability:', error);
        throw new Error('Failed to update group availability.');
    }
};
