import React from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

interface City {
    id: string;
    name: string;
    x: number;
    y: number;
}

interface PathVisualizerProps {
    cities: City[];
    path: string[];
    totalDistance?: number;
    message?: string;
    isPlaying?: boolean;
    onPlayPause?: () => void;
    onReset?: () => void;
    onStep?: () => void;
}

const PathVisualizer: React.FC<PathVisualizerProps> = ({
    cities,
    path,
    totalDistance,
    message = '',
    isPlaying = false,
    onPlayPause,
    onReset,
    onStep
}) => {
    const calculateDistance = (city1: City, city2: City): number => {
        const dx = city2.x - city1.x;
        const dy = city2.y - city1.y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    return (
        <div className="space-y-4">
            {/* Message Display */}
            <div className="bg-dark-elevated border border-dark-border rounded-lg p-4">
                <div className="flex justify-between items-center">
                    <p className="text-gray-300 font-medium">{message || 'Traveling Salesperson Problem'}</p>
                    {totalDistance !== undefined && (
                        <p className="text-primary-400 font-bold">
                            Total Distance: {totalDistance.toFixed(2)}
                        </p>
                    )}
                </div>
            </div>

            {/* Path Canvas */}
            <div className="bg-dark-surface border border-dark-border rounded-lg p-2 sm:p-6 overflow-x-auto scrollbar-thin">
                <div className="min-w-max flex justify-center py-4">
                    <svg width="700" height="500" className="mx-auto block">
                        {/* Draw path edges */}
                        {path.length > 1 && path.map((cityId, idx) => {
                            if (idx === path.length - 1) return null;

                            const city1 = cities.find(c => c.id === cityId);
                            const city2 = cities.find(c => c.id === path[idx + 1]);

                            if (!city1 || !city2) return null;

                            const distance = calculateDistance(city1, city2);

                            return (
                                <g key={`edge-${idx}`}>
                                    <line
                                        x1={city1.x}
                                        y1={city1.y}
                                        x2={city2.x}
                                        y2={city2.y}
                                        stroke="#3b82f6"
                                        strokeWidth="3"
                                        className="transition-all duration-300"
                                    />
                                    {/* Distance label */}
                                    <text
                                        x={(city1.x + city2.x) / 2}
                                        y={(city1.y + city2.y) / 2 - 10}
                                        fill="#60a5fa"
                                        fontSize="12"
                                        fontWeight="bold"
                                        textAnchor="middle"
                                    >
                                        {distance.toFixed(1)}
                                    </text>
                                    {/* Arrow */}
                                    <marker
                                        id={`arrow-${idx}`}
                                        markerWidth="10"
                                        markerHeight="10"
                                        refX="8"
                                        refY="3"
                                        orient="auto"
                                        markerUnits="strokeWidth"
                                    >
                                        <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
                                    </marker>
                                </g>
                            );
                        })}

                        {/* Draw cities */}
                        {cities.map((city) => {
                            const isInPath = path.includes(city.id);
                            const pathIndex = path.indexOf(city.id);

                            return (
                                <g key={city.id}>
                                    <circle
                                        cx={city.x}
                                        cy={city.y}
                                        r="20"
                                        fill={isInPath ? '#22c55e' : '#1e293b'}
                                        stroke={isInPath ? '#4ade80' : '#475569'}
                                        strokeWidth="3"
                                        className="transition-all duration-300"
                                    />
                                    <text
                                        x={city.x}
                                        y={city.y}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill="#fff"
                                        fontSize="14"
                                        fontWeight="bold"
                                    >
                                        {city.name}
                                    </text>
                                    {isInPath && pathIndex !== -1 && (
                                        <text
                                            x={city.x}
                                            y={city.y - 35}
                                            textAnchor="middle"
                                            fill="#22c55e"
                                            fontSize="12"
                                            fontWeight="bold"
                                        >
                                            #{pathIndex + 1}
                                        </text>
                                    )}
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>

            {/* Path Sequence */}
            {path.length > 0 && (
                <div className="bg-dark-elevated border border-dark-border rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-2">Path Sequence:</p>
                    <div className="flex items-center gap-2 flex-wrap">
                        {path.map((cityId, idx) => {
                            const city = cities.find(c => c.id === cityId);
                            return (
                                <React.Fragment key={idx}>
                                    <span className="px-3 py-1 bg-primary-600 text-white rounded-lg font-medium">
                                        {city?.name || cityId}
                                    </span>
                                    {idx < path.length - 1 && (
                                        <span className="text-gray-500">→</span>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Controls */}
            {(onPlayPause || onReset || onStep) && (
                <div className="flex items-center justify-center gap-4">
                    {onPlayPause && (
                        <button onClick={onPlayPause} className="btn btn-primary flex items-center gap-2">
                            {isPlaying ? (
                                <>
                                    <Pause className="w-5 h-5" />
                                    Pause
                                </>
                            ) : (
                                <>
                                    <Play className="w-5 h-5" />
                                    Play
                                </>
                            )}
                        </button>
                    )}
                    {onStep && (
                        <button onClick={onStep} className="btn btn-secondary flex items-center gap-2">
                            <SkipForward className="w-5 h-5" />
                            Step
                        </button>
                    )}
                    {onReset && (
                        <button onClick={onReset} className="btn btn-secondary flex items-center gap-2">
                            <RotateCcw className="w-5 h-5" />
                            Reset
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default PathVisualizer;
