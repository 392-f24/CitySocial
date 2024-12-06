import React, { useState, useRef } from 'react';
import { Plus, X } from 'lucide-react';
import { HOBBIES } from '../../data/hobbies';

const InputListQuestion = ({ type, value = [], onChange }) => {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const suggestionsRef = useRef(null);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setInput(inputValue);

        if (type === 'hobbies') {
            if (inputValue.trim()) {
                const filtered = HOBBIES.filter(
                    hobby => hobby.toLowerCase().includes(inputValue.toLowerCase()) &&
                    !value.includes(hobby)
                ).slice(0, 5);
                setSuggestions(filtered);
            } else {
                setSuggestions([]);
            }
        }
    };

    const addItem = (item) => {
        if (type === 'hobbies') {
            if (!value.includes(item)) {
                const newItems = [...value, item].sort();
                onChange(newItems);
            }
        } else {
            onChange([...value, item]);
        }
        setInput('');
        setSuggestions([]);
    };

    const removeItem = (index) => {
        const newItems = value.filter((_, i) => i !== index);
        onChange(newItems.length ? newItems : []);
    };

    if (type === 'hobbies') {
        return (
            <div className="space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-300"
                        placeholder="Type to search hobbies..."
                    />
                    {suggestions.length > 0 && (
                        <div ref={suggestionsRef} className="absolute z-10 w-full mt-1 bg-white border border-purple-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {suggestions.map((hobby) => (
                                <button
                                    key={hobby}
                                    onClick={() => addItem(hobby)}
                                    className="w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors duration-300"
                                >
                                    {hobby}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    {value.map((item, index) => (
                        <div
                            key={item}
                            className="flex items-center gap-2 px-3 py-1 bg-purple-50 rounded-full"
                        >
                            <span>{item}</span>
                            <button
                                onClick={() => removeItem(index)}
                                className="text-gray-500 hover:text-red-500 transition-colors duration-300"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Neighborhoods input
    return (
        <div className="space-y-4">
            {value.map((item, index) => (
                <div key={index} className="flex gap-2">
                    <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                            const newItems = [...value];
                            newItems[index] = e.target.value;
                            onChange(newItems.filter(i => i.trim() !== ''));
                        }}
                        className="flex-1 p-3 rounded-lg border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-300"
                        placeholder="Enter neighborhood name"
                    />
                    {value.length > 1 && (
                        <button
                            onClick={() => removeItem(index)}
                            className="p-3 text-gray-500 hover:text-red-500 transition-colors duration-300"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            ))}
            <button
                onClick={() => onChange([...value, ''])}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors duration-300"
            >
                <Plus className="w-4 h-4" />
                Add another neighborhood
            </button>
        </div>
    );
};

export default InputListQuestion;