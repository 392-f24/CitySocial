// Normalize group availability
export const normalizeGroupAvailability = (groupAvailability, groupSize) => {
    for (const day in groupAvailability) {
        groupAvailability[day] = groupAvailability[day].map((count) => count / groupSize);
    }
    return groupAvailability;
};

// Generate RGB color based on availability
export const getColorFromAvailability = (availability) => {
    const red = Math.round(255 * (1 - availability));
    const green = Math.round(255 * availability);
    return `rgb(${red}, ${green}, 0)`;
};
