import React, { useState } from 'react';
import { RotateCcw, Plus, Trash2 } from 'lucide-react';

interface InputPanelProps {
    defaultInputs: any;
    onInputChange: (inputs: any) => void;
    inputFields: Array<{
        key: string;
        label: string;
        type: 'array' | 'number' | 'text' | 'processes';
        placeholder?: string;
    }>;
}

interface Process {
    id: string;
    arrivalTime: number;
    burstTime: number;
    priority?: number;
}

const InputPanel: React.FC<InputPanelProps> = ({ defaultInputs, onInputChange, inputFields }) => {
    const [inputs, setInputs] = useState(defaultInputs);

    const handleChange = (key: string, value: any) => {
        const newInputs = { ...inputs, [key]: value };
        setInputs(newInputs);
    };

    const handleApply = () => {
        onInputChange(inputs);
    };

    const handleReset = () => {
        setInputs(defaultInputs);
        onInputChange(defaultInputs);
    };

    // Process management functions
    const addProcess = (key: string) => {
        const currentProcesses = inputs[key] || [];
        const newProcess: Process = {
            id: `P${currentProcesses.length + 1}`,
            arrivalTime: 0,
            burstTime: 1,
            priority: 0
        };
        handleChange(key, [...currentProcesses, newProcess]);
    };

    const removeProcess = (key: string, index: number) => {
        const currentProcesses = [...(inputs[key] || [])];
        currentProcesses.splice(index, 1);
        handleChange(key, currentProcesses);
    };

    const updateProcess = (key: string, index: number, field: keyof Process, value: any) => {
        const currentProcesses = [...(inputs[key] || [])];
        currentProcesses[index] = { ...currentProcesses[index], [field]: value };
        handleChange(key, currentProcesses);
    };

    return (
        <div className="card">
            <h2 className="section-title">Interactive Input Panel</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm sm:text-base">
                Modify the input values below and click "Apply Changes" to update the visualization.
            </p>

            <div className="space-y-4">
                {inputFields.map((field) => (
                    <div key={field.key}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {field.label}
                        </label>

                        {field.type === 'processes' ? (
                            <div className="space-y-3">
                                {(inputs[field.key] || []).map((process: Process, index: number) => (
                                    <div key={index} className="bg-dark-elevated border border-dark-border rounded-lg p-3 sm:p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-primary-600 dark:text-primary-400 font-semibold">{process.id}</span>
                                            <button
                                                onClick={() => removeProcess(field.key, index)}
                                                className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                                                title="Remove process"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Arrival Time</label>
                                                <input
                                                    type="number"
                                                    value={process.arrivalTime}
                                                    onChange={(e) => updateProcess(field.key, index, 'arrivalTime', parseInt(e.target.value) || 0)}
                                                    className="input-field text-sm"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Burst Time</label>
                                                <input
                                                    type="number"
                                                    value={process.burstTime}
                                                    onChange={(e) => updateProcess(field.key, index, 'burstTime', parseInt(e.target.value) || 1)}
                                                    className="input-field text-sm"
                                                    min="1"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Priority</label>
                                                <input
                                                    type="number"
                                                    value={process.priority || 0}
                                                    onChange={(e) => updateProcess(field.key, index, 'priority', parseInt(e.target.value) || 0)}
                                                    className="input-field text-sm"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addProcess(field.key)}
                                    className="btn btn-secondary w-full flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Process
                                </button>
                            </div>
                        ) : field.type === 'array' ? (
                            <input
                                type="text"
                                value={Array.isArray(inputs[field.key]) ? inputs[field.key].join(', ') : inputs[field.key]}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                placeholder={field.placeholder || 'e.g., 64, 34, 25, 12, 22'}
                                className="input-field"
                            />
                        ) : field.type === 'number' ? (
                            <input
                                type="number"
                                value={inputs[field.key]}
                                onChange={(e) => handleChange(field.key, parseInt(e.target.value) || 0)}
                                placeholder={field.placeholder}
                                className="input-field"
                            />
                        ) : (
                            <input
                                type="text"
                                value={inputs[field.key]}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className="input-field"
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button onClick={handleApply} className="btn btn-primary flex-1">
                    Apply Changes
                </button>
                <button onClick={handleReset} className="btn btn-secondary flex items-center justify-center gap-2 flex-1 sm:flex-none">
                    <RotateCcw className="w-4 h-4" />
                    Reset to Default
                </button>
            </div>
        </div>
    );
};

export default InputPanel;
