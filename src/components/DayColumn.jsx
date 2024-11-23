import React from 'react';

const DayColumn = ({ day, slots, groupAvailability, toggleAvailability, getColorFromAvailability }) => {
    return (
        <div className="day-column p-4 border border-purple-100 rounded-xl shadow-sm bg-white">
            <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {day.charAt(0).toUpperCase() + day.slice(1)}
            </h3>
            {slots.map((value, index) => (
                <div
                    key={index}
                    className="time-slot cursor-pointer p-3 mb-2 rounded-lg text-sm text-center shadow-sm transition-all duration-300"
                    style={{
                        backgroundColor: getColorFromAvailability(
                            groupAvailability ? value : slots[index] ? 1 : 0
                        ),
                        color: "white",
                    }}
                    onClick={() => !groupAvailability && toggleAvailability(day, index)}
                >
                    {10 + index}:00 - {11 + index}:00
                </div>
            ))}
        </div>
    );
};

export default DayColumn;
