import React from 'react';

interface Process {
    id: number;
    name: string;
    arrivalTime: number;
    burstTime: number;
    priority?: number;
}

interface InputPanelProps {
    processes: Process[];
    onProcessesChange: (processes: Process[]) => void;
    algorithmType: 'fcfs' | 'sjf' | 'srtf' | 'round-robin' | 'priority';
    timeQuantum?: number;
    onTimeQuantumChange?: (value: number) => void;
}

const InputPanel: React.FC<InputPanelProps> = ({
    processes,
    onProcessesChange,
    algorithmType,
    timeQuantum,
    onTimeQuantumChange
}) => {
    const showPriority = algorithmType === 'priority';
    const showTimeQuantum = algorithmType === 'round-robin';

    const handleProcessChange = (index: number, field: keyof Process, value: string | number) => {
        const updated = [...processes];
        updated[index] = { ...updated[index], [field]: value };
        onProcessesChange(updated);
    };

    const addProcess = () => {
        const newId = processes.length;
        const newProcess: Process = {
            id: newId,
            name: `P${newId + 1}`,
            arrivalTime: 0,
            burstTime: 1,
            ...(showPriority && { priority: 1 })
        };
        onProcessesChange([...processes, newProcess]);
    };

    const removeProcess = (index: number) => {
        if (processes.length > 1) {
            onProcessesChange(processes.filter((_, i) => i !== index));
        }
    };

    const resetToDefault = () => {
        const defaultProcesses: Process[] = [
            { id: 0, name: 'P1', arrivalTime: 0, burstTime: 4, ...(showPriority && { priority: 2 }) },
            { id: 1, name: 'P2', arrivalTime: 1, burstTime: 3, ...(showPriority && { priority: 1 }) },
            { id: 2, name: 'P3', arrivalTime: 2, burstTime: 1, ...(showPriority && { priority: 4 }) },
            { id: 3, name: 'P4', arrivalTime: 3, burstTime: 5, ...(showPriority && { priority: 3 }) },
        ];
        onProcessesChange(defaultProcesses);
    };

    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-l-4 border-primary-500 pl-3">
                        Interactive Input Panel
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 pl-3">
                        Modify the input values below and click "Apply Changes" to update the visualization
                    </p>
                </div>
                <button
                    onClick={resetToDefault}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset to Default
                </button>
            </div>

            {/* Time Quantum for Round Robin */}
            {showTimeQuantum && onTimeQuantumChange && (
                <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Time Quantum: {timeQuantum} time units
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={timeQuantum}
                        onChange={(e) => onTimeQuantumChange(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>1</span>
                        <span>10</span>
                    </div>
                </div>
            )}

            {/* Process Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-600">
                            <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-semibold">Process</th>
                            <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-semibold">Arrival Time</th>
                            <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-semibold">Burst Time</th>
                            {showPriority && (
                                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-semibold">Priority</th>
                            )}
                            <th className="text-center py-3 px-4 text-gray-600 dark:text-gray-300 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processes.map((process, index) => (
                            <tr key={process.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                <td className="py-3 px-4">
                                    <input
                                        type="text"
                                        value={process.name}
                                        onChange={(e) => handleProcessChange(index, 'name', e.target.value)}
                                        className="w-20 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary-500 transition-colors"
                                    />
                                </td>
                                <td className="py-3 px-4">
                                    <input
                                        type="number"
                                        min="0"
                                        value={process.arrivalTime}
                                        onChange={(e) => handleProcessChange(index, 'arrivalTime', parseInt(e.target.value) || 0)}
                                        className="w-24 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary-500 transition-colors"
                                    />
                                </td>
                                <td className="py-3 px-4">
                                    <input
                                        type="number"
                                        min="1"
                                        value={process.burstTime}
                                        onChange={(e) => handleProcessChange(index, 'burstTime', parseInt(e.target.value) || 1)}
                                        className="w-24 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary-500 transition-colors"
                                    />
                                </td>
                                {showPriority && (
                                    <td className="py-3 px-4">
                                        <input
                                            type="number"
                                            min="1"
                                            value={process.priority || 1}
                                            onChange={(e) => handleProcessChange(index, 'priority', parseInt(e.target.value) || 1)}
                                            className="w-24 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary-500 transition-colors"
                                        />
                                    </td>
                                )}
                                <td className="py-3 px-4 text-center">
                                    <button
                                        onClick={() => removeProcess(index)}
                                        disabled={processes.length === 1}
                                        className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded transition-colors"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Process Button */}
            <div className="mt-4 flex gap-3">
                <button
                    onClick={addProcess}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Process
                </button>
            </div>
        </div>
    );
};

export default InputPanel;
