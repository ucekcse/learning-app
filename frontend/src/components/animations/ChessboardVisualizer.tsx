import React from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

interface ChessboardVisualizerProps {
    size: number;
    queens: { row: number; col: number }[];
    conflicts?: { row: number; col: number }[];
    message?: string;
    isPlaying?: boolean;
    onPlayPause?: () => void;
    onReset?: () => void;
    onStep?: () => void;
}

const ChessboardVisualizer: React.FC<ChessboardVisualizerProps> = ({
    size,
    queens,
    conflicts = [],
    message = '',
    isPlaying = false,
    onPlayPause,
    onReset,
    onStep
}) => {
    const cellSize = 60;
    const boardSize = size * cellSize;

    const isQueen = (row: number, col: number) => {
        return queens.some(q => q.row === row && q.col === col);
    };

    const isConflict = (row: number, col: number) => {
        return conflicts.some(c => c.row === row && c.col === col);
    };

    return (
        <div className="space-y-4">
            {/* Message Display */}
            <div className="bg-dark-elevated border border-dark-border rounded-lg p-4">
                <p className="text-gray-300 text-center font-medium">{message || `${size}-Queens Problem`}</p>
            </div>

            {/* Chessboard */}
            <div className="overflow-x-auto scrollbar-thin">
                <div className="flex justify-center">
                    <div className="bg-dark-surface border-4 border-dark-border rounded-lg p-2 sm:p-4 inline-block">
                        <svg width={boardSize} height={boardSize}>
                            {/* Draw chessboard squares */}
                            {Array.from({ length: size }).map((_, row) =>
                                Array.from({ length: size }).map((_, col) => {
                                    const isLightSquare = (row + col) % 2 === 0;
                                    const hasQueen = isQueen(row, col);
                                    const hasConflict = isConflict(row, col);

                                    let fillColor = isLightSquare ? '#cbd5e1' : '#64748b';
                                    if (hasConflict) fillColor = '#ef4444';
                                    if (hasQueen && !hasConflict) fillColor = '#22c55e';

                                    return (
                                        <g key={`cell-${row}-${col}`}>
                                            <rect
                                                x={col * cellSize}
                                                y={row * cellSize}
                                                width={cellSize}
                                                height={cellSize}
                                                fill={fillColor}
                                                stroke="#1e293b"
                                                strokeWidth="1"
                                                className="transition-all duration-300"
                                            />
                                            {hasQueen && (
                                                <text
                                                    x={col * cellSize + cellSize / 2}
                                                    y={row * cellSize + cellSize / 2}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    fontSize="32"
                                                    fill="#1e293b"
                                                    fontWeight="bold"
                                                >
                                                    ♛
                                                </text>
                                            )}
                                        </g>
                                    );
                                })
                            )}
                        </svg>

                        {/* Row and column labels */}
                        <div className="flex justify-around mt-2 text-gray-400 text-sm font-mono">
                            {Array.from({ length: size }).map((_, i) => (
                                <div key={i} style={{ width: cellSize }} className="text-center">
                                    {i}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-600 border border-gray-600"></div>
                    <span className="text-gray-300">Valid Queen</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-600 border border-gray-600"></div>
                    <span className="text-gray-300">Conflict</span>
                </div>
            </div>

            {/* Controls */}
            {(onPlayPause || onReset || onStep) && (
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {onPlayPause && (
                        <button onClick={onPlayPause} className="btn btn-primary flex items-center gap-2 text-sm">
                            {isPlaying ? (
                                <>
                                    <Pause className="w-4 h-4" />
                                    Pause
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4" />
                                    Play
                                </>
                            )}
                        </button>
                    )}
                    {onStep && (
                        <button onClick={onStep} className="btn btn-secondary flex items-center gap-2 text-sm">
                            <SkipForward className="w-4 h-4" />
                            Step
                        </button>
                    )}
                    {onReset && (
                        <button onClick={onReset} className="btn btn-secondary flex items-center gap-2 text-sm">
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChessboardVisualizer;
