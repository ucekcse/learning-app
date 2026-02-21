import React from 'react';

interface KthSmallestVisualizerProps {
    array: number[];
    pivotIndex: number | null;
    left: number;
    right: number;
    k: number;
    foundIndex: number | null;
    message: string;
}

const KthSmallestVisualizer: React.FC<KthSmallestVisualizerProps> = ({
    array,
    pivotIndex,
    left,
    right,
    k,
    foundIndex,
    message
}) => {
    return (
        <div className="space-y-6">
            <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-center">
                <p className="text-gray-600 dark:text-gray-300 font-mono text-sm">{message}</p>
                <p className="text-xs text-gray-500 mt-2">Looking for {k}-th smallest element (Index {k - 1})</p>
            </div>

            <div className="flex justify-center items-end gap-1 sm:gap-2 h-48 sm:h-64 bg-slate-100 dark:bg-slate-900/50 p-2 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-thin">
                {array.map((value, idx) => {
                    let bgColor = 'bg-blue-500'; // Default
                    let borderColor = 'border-blue-600';
                    let height = Math.max(20, (value / Math.max(...array)) * 100);

                    // Visualize state
                    if (foundIndex === idx) {
                        bgColor = 'bg-green-500';
                        borderColor = 'border-green-400';
                    } else if (idx === pivotIndex) {
                        bgColor = 'bg-yellow-500';
                        borderColor = 'border-yellow-400';
                    } else if (idx >= left && idx <= right) {
                        // Active range
                        bgColor = 'bg-blue-400';
                        borderColor = 'border-blue-300';
                    } else {
                        // Inactive
                        bgColor = 'bg-slate-700';
                        borderColor = 'border-slate-600';
                    }

                    return (
                        <div key={idx} className="flex flex-col items-center gap-2 group relative">
                            <span className="text-xs text-gray-400 font-mono">{idx}</span>
                            <div
                                className={`w-8 sm:w-12 rounded-t-lg border-2 transition-all duration-300 ${bgColor} ${borderColor} flex items-end justify-center`}
                                style={{ height: `${height}%` }}
                            >
                                <span className="mb-1 sm:mb-2 text-xs sm:text-base text-white font-bold shadow-black drop-shadow-md">{value}</span>
                            </div>

                            {/* Helpers/Pointers */}
                            <div className="absolute -bottom-8 flex flex-col items-center">
                                {idx === left && <span className="text-xs text-cyan-400 font-bold">L</span>}
                                {idx === right && <span className="text-xs text-cyan-400 font-bold">R</span>}
                                {idx === pivotIndex && <span className="text-xs text-yellow-400 font-bold">P</span>}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-gray-500 dark:text-gray-400">Pivot</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-gray-500 dark:text-gray-400">Found Element</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-slate-700 rounded"></div>
                    <span className="text-gray-500 dark:text-gray-400">Inactive Range</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">L / R</span>
                    <span className="text-gray-500 dark:text-gray-400">Search Range</span>
                </div>
            </div>
        </div>
    );
};

export default KthSmallestVisualizer;
