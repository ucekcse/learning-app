import React from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

interface ArrayVisualizerProps {
    array: number[] | string[];
    currentIndex?: number;
    comparingIndices?: number[];
    sortedIndices?: number[];
    swappingIndices?: number[];
    message?: string;
    isPlaying?: boolean;
    onPlayPause?: () => void;
    onReset?: () => void;
    onStep?: () => void;
    speed?: number;
    onSpeedChange?: (speed: number) => void;
}

const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({
    array,
    currentIndex,
    comparingIndices = [],
    sortedIndices = [],
    swappingIndices = [],
    message = '',
    isPlaying = false,
    onPlayPause,
    onReset,
    onStep,
    speed = 1,
    onSpeedChange,
}) => {
    const getElementClass = (index: number) => {
        if (swappingIndices.includes(index)) return 'array-element swapping';
        if (sortedIndices.includes(index)) return 'array-element sorted';
        if (comparingIndices.includes(index)) return 'array-element comparing';
        if (currentIndex === index) return 'array-element active';
        return 'array-element';
    };

    const maxValue = array.length > 0 && typeof array[0] === 'number'
        ? Math.max(...(array as number[]))
        : 0;

    return (
        <div className="space-y-4">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-dark-elevated rounded-lg p-4 border border-dark-border gap-4">
                <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
                    <button
                        onClick={onPlayPause}
                        className="btn btn-primary flex items-center gap-2 flex-1 sm:flex-none justify-center"
                        disabled={!onPlayPause}
                    >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <button
                        onClick={onStep}
                        className="btn btn-secondary flex items-center gap-2 flex-1 sm:flex-none justify-center"
                        disabled={!onStep || isPlaying}
                    >
                        <SkipForward className="w-4 h-4" />
                        Step
                    </button>
                    <button
                        onClick={onReset}
                        className="btn btn-secondary flex items-center gap-2 flex-1 sm:flex-none justify-center"
                        disabled={!onReset}
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </button>
                </div>

                {onSpeedChange && (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Speed:</span>
                        <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.5"
                            value={speed}
                            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                            className="w-32"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 w-8">{speed}x</span>
                    </div>
                )}
            </div>

            {/* Message Display */}
            {message && (
                <div className="bg-primary-50 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-500 rounded-lg p-3">
                    <p className="text-primary-700 dark:text-primary-200 text-sm font-medium">{message}</p>
                </div>
            )}

            {/* Array Visualization */}
            <div className="bg-dark-elevated rounded-lg p-4 sm:p-8 border border-dark-border overflow-x-auto scrollbar-thin">
                <div className="flex items-end justify-center min-w-max gap-2 min-h-[300px] px-2">
                    {array.map((value, index) => {
                        const height = typeof value === 'number' && maxValue > 0
                            ? (value / maxValue) * 250
                            : 50; // Fixed height for non-numbers
                        return (
                            <div key={index} className="flex flex-col items-center gap-2">
                                {/* Bar */}
                                <div
                                    className={`${getElementClass(index)} w-16 flex items-end justify-center rounded-t-lg transition-all duration-300`}
                                    style={{ height: `${height}px` }}
                                >
                                    <span className="text-white font-bold mb-2">{value}</span>
                                </div>
                                {/* Index */}
                                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">i={index}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-500 bg-primary-100 dark:bg-primary-900/30 rounded"></div>
                    <span className="text-gray-500 dark:text-gray-400">Current</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 rounded"></div>
                    <span className="text-gray-500 dark:text-gray-400">Comparing</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-red-500 bg-red-100 dark:bg-red-900/30 rounded"></div>
                    <span className="text-gray-500 dark:text-gray-400">Swapping</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-green-500 bg-green-100 dark:bg-green-900/30 rounded"></div>
                    <span className="text-gray-500 dark:text-gray-400">Sorted</span>
                </div>
            </div>
        </div>
    );
};

export default ArrayVisualizer;
