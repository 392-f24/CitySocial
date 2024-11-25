import React, { useEffect } from 'react';
import { GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const RankingQuestion = ({ question, currentRanking, onRankingChange }) => {
    // Initialize the ranking if it doesn't exist
    useEffect(() => {
        if (!currentRanking) {
            const initialRanking = question.options.map(opt => opt.value);
            onRankingChange(initialRanking);
        }
    }, [question, currentRanking, onRankingChange]);

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = currentRanking || question.options.map(opt => opt.value);
        const newRanking = reorder(
            items,
            result.source.index,
            result.destination.index
        );

        onRankingChange(newRanking);
    };

    const rankingItems = currentRanking || question.options.map(opt => opt.value);

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId={`ranking-${question.id}`}>
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                    >
                        {rankingItems.map((value, index) => {
                            const option = question.options.find(opt => opt.value === value);
                            return (
                                <Draggable
                                    key={option.value}
                                    draggableId={`${question.id}-${option.value}`}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`flex items-center p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors duration-300 ${
                                                snapshot.isDragging ? 'bg-purple-100 shadow-lg' : ''
                                            }`}
                                        >
                                            <div
                                                {...provided.dragHandleProps}
                                                className="mr-4 text-gray-400 hover:text-purple-600 p-2 -m-2"
                                            >
                                                <GripVertical className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium flex items-center">
                                                    <span className="w-6 h-6 flex items-center justify-center bg-purple-200 rounded-full mr-3 text-sm">
                                                        {index + 1}
                                                    </span>
                                                    {option.label}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            );
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default RankingQuestion;