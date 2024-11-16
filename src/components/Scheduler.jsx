// Import necessary Firebase Firestore functions
import { db } from "../firebase";
import { collection, doc, setDoc, getDocs, updateDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";


const Scheduler = () => {
    const [availability, setAvailability] = useState({
        monday: Array(10).fill(false),
        tuesday: Array(10).fill(false),
        wednesday: Array(10).fill(false),
        thursday: Array(10).fill(false),
        friday: Array(10).fill(false),
        saturday: Array(10).fill(false),
        sunday: Array(10).fill(false),
    });
    const [groupAvailability, setGroupAvailability] = useState(null);


    // Load Alice's availability from Firestore for group1 when component mounts
    useEffect(() => {
        const loadAvailability = async () => {
            try {
                const memberAvailabilityRef = doc(db, `groups/group1/membersAndAvailability/alice`);
                const memberDoc = await getDoc(memberAvailabilityRef);
                if (memberDoc.exists()) {
                    setAvailability(memberDoc.data().availability);
                }
            } catch (error) {
                console.error("Error loading member availability: ", error);
            }
        };


        loadAvailability();
    }, []);


    const addMockGroups = async () => {
        const mockGroups = [
            {
                id: "group1",
                name: "Mock Group 1",
                members: ["alice", "bob", "charlie"],
            }
        ];


        try {
            // Iterate over mockGroups to add each group document to Firestore
            for (const group of mockGroups) {
                // Reference to the group document
                const groupRef = doc(db, "groups", group.id);


                // Add group data to Firestore
                await setDoc(groupRef, {
                    name: group.name,
                });


                // Add a membersAndAvailability sub-collection for each group
                for (const member of group.members) {
                    const memberAvailabilityRef = doc(collection(db, `groups/${group.id}/membersAndAvailability`), member);


                    // Initialize default availability (all set to false)
                    const defaultAvailability = {
                        monday: Array(10).fill(false),
                        tuesday: Array(10).fill(false),
                        wednesday: Array(10).fill(false),
                        thursday: Array(10).fill(false),
                        friday: Array(10).fill(false),
                        saturday: Array(10).fill(false),
                        sunday: Array(10).fill(false),
                    };


                    // Add member availability to Firestore
                    await setDoc(memberAvailabilityRef, { availability: defaultAvailability });
                }
            }


            console.log("Mock groups and member availabilities added successfully!");
        } catch (error) {
            console.error("Error adding mock groups: ", error);
        }
    };


    // Function to calculate group availability based on individual member availability
    const calculateGroupAvailability = async () => {
        try {
            const schedulesRef = collection(db, `groups/group1/membersAndAvailability`);
            const scheduleDocs = await getDocs(schedulesRef);


            // Initialize a structure to track the group's availability count
            let groupAvailability = {
                monday: Array(10).fill(0),
                tuesday: Array(10).fill(0),
                wednesday: Array(10).fill(0),
                thursday: Array(10).fill(0),
                friday: Array(10).fill(0),
                saturday: Array(10).fill(0),
                sunday: Array(10).fill(0),
            };


            // Loop through each user's availability and calculate group availability
            scheduleDocs.forEach((doc) => {
                const userAvailability = doc.data().availability;


                for (const day in userAvailability) {
                    userAvailability[day].forEach((isAvailable, index) => {
                        if (isAvailable) {
                            groupAvailability[day][index] += 1; // Increment count if user is available
                        }
                    });
                }
            });


            // Normalize group availability to calculate the proportion of members available at each slot
            const groupSize = scheduleDocs.size;
            const normalizedAvailability = normalizeGroupAvailability(groupAvailability, groupSize);


            // Update the group availability state
            setGroupAvailability(normalizedAvailability);


            // Update group availability in Firestore
            const groupRef = doc(db, "groups", "group1");
            await updateDoc(groupRef, { groupAvailability: normalizedAvailability });
            console.log("Group availability updated successfully in Firestore!");
        } catch (error) {
            console.error("Error calculating group availability:", error);
        }
    };


    // Function to normalize the group availability count
    const normalizeGroupAvailability = (groupAvailability, groupSize) => {
        for (const day in groupAvailability) {
            groupAvailability[day] = groupAvailability[day].map((count) => count / groupSize);
        }
        return groupAvailability;
    };


    const toggleAvailability = (day, index) => {
        setAvailability((prevAvailability) => {
            const updatedAvailability = {
                ...prevAvailability,
                [day]: prevAvailability[day].map((slot, i) => (i === index ? !slot : slot)),
            };


            // Save the updated availability to Firestore
            saveMemberAvailability(updatedAvailability);
            return updatedAvailability;
        });
    };


    const saveMemberAvailability = async (updatedAvailability) => {
        try {
            const memberAvailabilityRef = doc(db, `groups/group1/membersAndAvailability/alice`);
            await setDoc(memberAvailabilityRef, { availability: updatedAvailability });
            console.log("Availability updated successfully for Alice.");
        } catch (error) {
            console.error("Error updating member availability:", error);
        }
    };


    const getColorFromAvailability = (availability) => {
        const red = Math.round(255 * (1 - availability));
        const green = Math.round(255 * availability);
        return `rgb(${red}, ${green}, 0)`;
    };


    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Scheduler</h1>
            <div className="mb-4 space-x-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => { addMockGroups(); setGroupAvailability(null); }}>My Availability</button>
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={calculateGroupAvailability}>Group Availability</button>
            </div>
            <div className="grid grid-cols-7 gap-4">
                {Object.keys(availability).map((day) => (
                    <div key={day} className="day-column p-2 border rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
                        {(groupAvailability ? groupAvailability[day] : availability[day]).map((value, index) => (
                            <div
                                key={index}
                                className="time-slot cursor-pointer p-2 mb-1 rounded"
                                style={{ backgroundColor: getColorFromAvailability(groupAvailability ? value : (availability[day][index] ? 1 : 0)) }}
                                onClick={() => !groupAvailability && toggleAvailability(day, index)}
                            >
                                {10 + index}:00 - {11 + index}:00
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};


export default Scheduler;

