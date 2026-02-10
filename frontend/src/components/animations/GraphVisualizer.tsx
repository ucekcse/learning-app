import React from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

interface GraphNode {
    id: number;
    x: number;
    y: number;
    label: string;
}

interface GraphEdge {
    from: number;
    to: number;
    weight?: number;
}

interface GraphVisualizerProps {
    nodes: GraphNode[];
    edges: GraphEdge[];
    visitedNodes?: number[];
    currentNode?: number;
    activeEdges?: Array<[number, number]>;
    queue?: number[];
    stack?: number[];
    message?: string;
    isPlaying?: boolean;
    onPlayPause?: () => void;
    onReset?: () => void;
    onStep?: () => void;
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
    nodes,
    edges,
    visitedNodes = [],
    currentNode,
    activeEdges = [],
    queue = [],
    stack = [],
    message = '',
    isPlaying = false,
    onPlayPause,
    onReset,
    onStep,
}) => {
    const svgWidth = 800;
    const svgHeight = 500;

    const isEdgeActive = (from: number, to: number) => {
        return activeEdges.some(([f, t]) => (f === from && t === to) || (f === to && t === from));
    };

    return (
        <div className="space-y-4">
            {/* Controls */}
            <div className="flex items-center justify-between bg-dark-elevated rounded-lg p-4 border border-dark-border">
                <div className="flex items-center gap-2">
                    <button
                        onClick={onPlayPause}
                        className="btn btn-primary flex items-center gap-2"
                        disabled={!onPlayPause}
                    >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <button
                        onClick={onStep}
                        className="btn btn-secondary flex items-center gap-2"
                        disabled={!onStep || isPlaying}
                    >
                        <SkipForward className="w-4 h-4" />
                        Step
                    </button>
                    <button
                        onClick={onReset}
                        className="btn btn-secondary flex items-center gap-2"
                        disabled={!onReset}
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </button>
                </div>
            </div>

            {/* Message */}
            {message && (
                <div className="bg-primary-900/30 border border-primary-500 rounded-lg p-3">
                    <p className="text-primary-200 text-sm font-medium">{message}</p>
                </div>
            )}

            {/* Graph Visualization */}
            <div className="bg-dark-elevated rounded-lg p-6 border border-dark-border">
                <svg width={svgWidth} height={svgHeight} className="mx-auto">
                    {/* Edges */}
                    {edges.map((edge, index) => {
                        const fromNode = nodes.find(n => n.id === edge.from);
                        const toNode = nodes.find(n => n.id === edge.to);
                        if (!fromNode || !toNode) return null;

                        const isActive = isEdgeActive(edge.from, edge.to);

                        return (
                            <g key={index}>
                                <line
                                    x1={fromNode.x}
                                    y1={fromNode.y}
                                    x2={toNode.x}
                                    y2={toNode.y}
                                    stroke={isActive ? '#3b82f6' : '#475569'}
                                    strokeWidth={isActive ? 3 : 2}
                                    className="transition-all duration-300"
                                />
                                {edge.weight !== undefined && (
                                    <text
                                        x={(fromNode.x + toNode.x) / 2}
                                        y={(fromNode.y + toNode.y) / 2 - 10}
                                        fill="#94a3b8"
                                        fontSize="12"
                                        textAnchor="middle"
                                    >
                                        {edge.weight}
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {/* Nodes */}
                    {nodes.map((node) => {
                        const isVisited = visitedNodes.includes(node.id);
                        const isCurrent = currentNode === node.id;

                        let fillColor = '#1e293b';
                        let strokeColor = '#475569';
                        let strokeWidth = 2;

                        if (isCurrent) {
                            fillColor = '#3b82f6';
                            strokeColor = '#60a5fa';
                            strokeWidth = 4;
                        } else if (isVisited) {
                            fillColor = '#10b981';
                            strokeColor = '#34d399';
                            strokeWidth = 3;
                        }

                        return (
                            <g key={node.id}>
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={25}
                                    fill={fillColor}
                                    stroke={strokeColor}
                                    strokeWidth={strokeWidth}
                                    className="transition-all duration-300"
                                />
                                <text
                                    x={node.x}
                                    y={node.y + 5}
                                    fill="white"
                                    fontSize="16"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                >
                                    {node.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Data Structures Display */}
            {(queue.length > 0 || stack.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {queue.length > 0 && (
                        <div className="bg-dark-elevated rounded-lg p-4 border border-dark-border">
                            <h3 className="text-sm font-semibold text-gray-400 mb-3">QUEUE</h3>
                            <div className="flex gap-2">
                                {queue.map((nodeId, index) => (
                                    <div
                                        key={index}
                                        className="bg-blue-600 text-white px-4 py-2 rounded font-mono font-bold"
                                    >
                                        {nodes.find(n => n.id === nodeId)?.label || nodeId}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {stack.length > 0 && (
                        <div className="bg-dark-elevated rounded-lg p-4 border border-dark-border">
                            <h3 className="text-sm font-semibold text-gray-400 mb-3">STACK</h3>
                            <div className="flex flex-col gap-2">
                                {stack.slice().reverse().map((nodeId, index) => (
                                    <div
                                        key={index}
                                        className="bg-purple-600 text-white px-4 py-2 rounded font-mono font-bold text-center"
                                    >
                                        {nodes.find(n => n.id === nodeId)?.label || nodeId}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary-600 border-2 border-primary-400"></div>
                    <span className="text-gray-400">Current Node</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-600 border-2 border-green-400"></div>
                    <span className="text-gray-400">Visited</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-dark-surface border-2 border-dark-border"></div>
                    <span className="text-gray-400">Unvisited</span>
                </div>
            </div>
        </div>
    );
};

export default GraphVisualizer;
