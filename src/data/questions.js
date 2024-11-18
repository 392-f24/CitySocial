// src/data/questions.js

export const questions = [
    {
        id: 1,
        question: "How do you prefer to maintain close friendships? Consider your ideal friendship pattern.",
        description: "Think about your most successful friendships and how you typically interact with them",
        type: "rank",  // Changed to rank for more nuanced preference data
        weight: 1.4,
        options: [
            {
                value: 1,
                label: "Regular short check-ins (15-30 min calls/texts several times a week)",
                category: "frequency"
            },
            {
                value: 2,
                label: "Deep conversations (1-2 hour focused talks weekly)",
                category: "depth"
            },
            {
                value: 3,
                label: "Shared activities (doing things together regularly)",
                category: "activity"
            },
            {
                value: 4,
                label: "Concentrated quality time (longer occasional hangouts)",
                category: "intensity"
            },
            {
                value: 5,
                label: "Consistent scheduled meetups (regular weekly/monthly routine)",
                category: "routine"
            }
        ],
        compatibilityScoring: (ranking1, ranking2) => {
            // Get top 3 preferences from each ranking
            const top3_1 = ranking1.slice(0, 3);
            const top3_2 = ranking2.slice(0, 3);
            
            // Calculate primary style match (top choice alignment)
            const primaryMatch = top3_1[0] === top3_2[0] ? 3 : 
                               top3_2.includes(top3_1[0]) ? 2 : 0;
            
            // Calculate flexibility score (shared preferences in top 3)
            const sharedPreferences = top3_1.filter(v => top3_2.includes(v)).length;
            const flexibilityScore = sharedPreferences * 0.5;
            
            // Calculate style compatibility
            const complementaryStyles = {
                'frequency': ['depth', 'routine'],
                'depth': ['frequency', 'intensity'],
                'activity': ['routine', 'intensity'],
                'intensity': ['depth', 'activity'],
                'routine': ['frequency', 'activity']
            };
            
            const style1 = ranking1[0];
            const style2 = ranking2[0];
            const styleMatch = complementaryStyles[style1]?.includes(style2) ? 1 : 0;
            
            return Math.min(3, primaryMatch + flexibilityScore + styleMatch);
        },
        validationMetrics: {
            successThresholds: {
                minimalMaintenance: "4 hours/month",
                optimalGrowth: "12-15 hours/month",
                formationPeriod: "80-100 hours within first 3 months"
            },
            interactionBalance: {
                shortInteractions: "60% of total interactions",
                longSessions: "40% of total interactions"
            }
        }
    },
    {
        id: 2,
        question: "When disagreeing with a friend, how do you typically handle it?",
        description: "Understanding conflict resolution styles helps create more harmonious friendships",
        type: "select",
        weight: 1.2,
        options: [
            { value: 1, label: "Address it immediately" },
            { value: 2, label: "Wait to calm down first" },
            { value: 3, label: "Avoid confrontation" },
            { value: 4, label: "Seek external advice" }
        ],
        compatibilityScoring: (value1, value2) => {
            const complementaryPairs = {
                1: [2, 4],
                2: [1, 4],
                4: [1, 2]
            };
            if (value1 === value2) return 2;
            if (complementaryPairs[value1]?.includes(value2)) return 3;
            if (value1 === 3 || value2 === 3) return 0; // Avoid confrontation is generally incompatible
            return 1;
        }
    },
    {
        id: 3,
        question: "In social situations, what role do you prefer?",
        description: "This helps match you with complementary social interaction styles",
        type: "select",
        weight: 1.0,
        options: [
            { value: 1, label: "Lead conversations" },
            { value: 2, label: "Listen and observe" },
            { value: 3, label: "Balance both equally" }
        ],
        compatibilityScoring: (value1, value2) => {
            if (value1 === 3 || value2 === 3) return 3;
            if ((value1 === 1 && value2 === 2) || (value1 === 2 && value2 === 1)) return 3;
            if (value1 === value2) return 1;
            return 0;
        }
    },
    {
        id: 4,
        question: "How do you prefer to spend time with friends? Rank these from most to least preferred",
        description: "Drag to reorder these options based on your preferences",
        type: "rank",
        weight: 1.2,
        options: [
            { value: 1, label: "Active outdoor activities" },
            { value: 2, label: "Quiet indoor activities" },
            { value: 3, label: "Social gatherings" },
            { value: 4, label: "Deep conversations" }
        ],
        compatibilityScoring: (ranking1, ranking2) => {
            // Calculate Kendall Tau distance between rankings
            let score = 0;
            const topChoicesMatch = ranking1[0] === ranking2[0];
            const topTwoOverlap = ranking1.slice(0, 2).some(v => ranking2.slice(0, 2).includes(v));
            
            if (topChoicesMatch) score += 2;
            if (topTwoOverlap) score += 1;
            
            return score;
        }
    },
    {
        id: 5,
        question: "When supporting friends through difficulties, rank your preferred approaches",
        description: "Drag to reorder these options based on your natural helping style",
        type: "rank",
        weight: 1.1,
        options: [
            { value: 1, label: "Offering practical solutions" },
            { value: 2, label: "Listening without judgment" },
            { value: 3, label: "Sharing similar experiences" },
            { value: 4, label: "Giving space when needed" }
        ],
        compatibilityScoring: (ranking1, ranking2) => {
            let score = 0;
            // Higher score for complementary top choices
            const complementaryPairs = {
                1: [2], // Solutions pairs well with listening
                2: [1, 3], // Listening pairs well with solutions or sharing
                3: [2], // Sharing pairs well with listening
                4: [4] // Space preference matches with space preference
            };
            
            if (complementaryPairs[ranking1[0]]?.includes(ranking2[0])) score += 3;
            if (ranking1[0] === ranking2[0]) score += 2;
            
            return score;
        }
    },
    {
        id: 6,
        question: "Rank these friendship qualities in order of importance to you",
        description: "Drag to reorder based on what you value most in friendships",
        type: "rank",
        weight: 1.1,
        options: [
            { value: 1, label: "Loyalty and reliability" },
            { value: 2, label: "Open communication" },
            { value: 3, label: "Shared interests and activities" },
            { value: 4, label: "Emotional support" }
        ],
        compatibilityScoring: (ranking1, ranking2) => {
            let score = 0;
            // Calculate similarity based on top two choices
            const top2_1 = ranking1.slice(0, 2);
            const top2_2 = ranking2.slice(0, 2);
            
            // Count matching values in top 2
            const matchCount = top2_1.filter(v => top2_2.includes(v)).length;
            return matchCount * 1.5;
        }
    },
    {
        id: 7,
        question: "How do you approach personal boundaries in friendships?",
        description: "Understanding boundary preferences helps create comfortable relationships",
        type: "select",
        weight: 1.0,
        options: [
            { value: 1, label: "Very firm boundaries" },
            { value: 2, label: "Somewhat firm" },
            { value: 3, label: "Flexible" },
            { value: 4, label: "Very open" }
        ],
        compatibilityScoring: (value1, value2) => {
            const diff = Math.abs(value1 - value2);
            if (diff <= 1) return 3;
            if (diff === 2) return 1;
            return 0;
        }
    },
    {
        id: 8,
        question: "How do you typically develop trust with new friends?",
        description: "This helps match you with people who have compatible trust-building approaches",
        type: "select",
        weight: 1.0,
        options: [
            { value: 1, label: "Trust immediately" },
            { value: 2, label: "Gradually over time" },
            { value: 3, label: "After specific proof" }
        ],
        compatibilityScoring: (value1, value2) => {
            const diff = Math.abs(value1 - value2);
            if (diff === 0) return 3;
            if (diff === 1) return 1;
            return 0;
        }
    },
    {
        id: 9,
        question: "What neighborhood(s) do you frequent?",
        description: "Add one or more neighborhoods you usually visit",
        type: "text-multiple"
    },
    {
        id: 10,
        question: "What are your hobbies and interests?",
        description: "Start typing to see suggestions and select your interests",
        type: "hobbies"
    }
];

export const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

export const calculateCompatibilityScore = (userAnswers1, userAnswers2) => {
    let totalScore = 0;
    let totalWeight = 0;
    let crucialAreasFailed = false;

    // Only process questions 1-10 for compatibility scoring
    const scoringQuestions = questions.slice(0, 10);

    for (const question of scoringQuestions) {
        const answer1 = userAnswers1[question.id];
        const answer2 = userAnswers2[question.id];
        
        if (answer1 === undefined || answer2 === undefined) continue;

        const score = question.compatibilityScoring(answer1, answer2);
        const weightedScore = score * (question.weight || 1);
        
        totalScore += weightedScore;
        totalWeight += (question.weight || 1);

        // Check crucial areas (questions 1, 2, and 7)
        if ([1, 2, 7].includes(question.id) && score === 0) {
            crucialAreasFailed = true;
        }
    }

    const normalizedScore = (totalScore / (totalWeight * 3)) * 100;

    return {
        score: normalizedScore,
        failed: crucialAreasFailed,
        compatibility: normalizedScore >= 80 ? 'High' :
                      normalizedScore >= 53 ? 'Moderate' : 'Low'
    };
};