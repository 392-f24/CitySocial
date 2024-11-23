import React, { useState, useEffect } from "react";
import { fetchMemberAvailability, saveMemberAvailability, fetchGroupAvailability, updateGroupAvailability } from "../services/firestoreService";
import { normalizeGroupAvailability, getColorFromAvailability } from "../utils/availabilityUtils";
import DayColumn from "./DayColumn";

const Scheduler = () => {
    const [availability, setAvailability] = useState({
        monday: Array(10).fill(false),
        tuesday: Array(10).fill(false),
        // Other days...
    });
    const [groupAvailability, setGroupAvailability] = useState(null);

    useEffect(() => {
        const loadAvailability = async () => {
            const data = await fetchMemberAvailability("group1", "alice");
            if (data) setAvailability(data);
        };

        loadAvailability();
    }, []);

    const toggleAvailability = (day, index) => {
        setAvailability((prev) => {
            const updated = {
                ...prev,
                [day]: prev[day].map((slot, i) => (i === index ? !slot : slot)),
            };
            saveMemberAvailability("group1", "alice", updated);
            return updated;
        });
    };

    const calculateGroupAvailability = async () => {
        const scheduleDocs = await fetchGroupAvailability("group1");
        const groupSize = scheduleDocs.size;

        let groupAvailability = {
            monday: Array(10).fill(0),
            tuesday: Array(10).fill(0),
            // Other days...
        };

        scheduleDocs.forEach((doc) => {
            const userAvailability = doc.data().availability;
            for (const day in userAvailability) {
                userAvailability[day].forEach((isAvailable, index) => {
                    if (isAvailable) groupAvailability[day][index]++;
                });
            }
        });

        const normalized = normalizeGroupAvailability(groupAvailability, groupSize);
        setGroupAvailability(normalized);
        updateGroupAvailability("group1", normalized);
    };

    return (
        <div className="p-4">
            <h1>Scheduler</h1>
            <button onClick={calculateGroupAvailability}>Group Availability</button>
            <div className="grid grid-cols-7">
                {Object.keys(availability).map((day) => (
                    <DayColumn
                        key={day}
                        day={day}
                        slots={groupAvailability ? groupAvailability[day] : availability[day]}
                        groupAvailability={groupAvailability}
                        toggleAvailability={toggleAvailability}
                        getColorFromAvailability={getColorFromAvailability}
                    />
                ))}
            </div>
        </div>
    );
};

export default Scheduler;
