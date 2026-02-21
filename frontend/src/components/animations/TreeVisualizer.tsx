import React from "react";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";

interface TreeNode {
  id: string;
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  x?: number;
  y?: number;
}

interface TreeVisualizerProps {
  root: TreeNode | null;
  highlightedNodes?: string[];
  message?: string;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onReset?: () => void;
  onStep?: () => void;
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({
  root,
  highlightedNodes = [],
  message = "",
  isPlaying = false,
  onPlayPause,
  onReset,
  onStep,
}) => {
  const calculatePositions = (
    node: TreeNode | null,
    x: number,
    y: number,
    offset: number,
  ): TreeNode | undefined => {
    if (!node) return undefined;

    const newNode = { ...node, x, y };

    if (node.left) {
      newNode.left = calculatePositions(
        node.left,
        x - offset,
        y + 80,
        offset / 2,
      );
    }
    if (node.right) {
      newNode.right = calculatePositions(
        node.right,
        x + offset,
        y + 80,
        offset / 2,
      );
    }

    return newNode;
  };

  const renderTree = (node: TreeNode | null): React.ReactElement[] => {
    if (!node) return [];

    const elements: React.ReactElement[] = [];
    const isHighlighted = highlightedNodes.includes(node.id);

    // Draw edges to children
    if (node.left && node.x !== undefined && node.y !== undefined) {
      elements.push(
        <line
          key={`edge-left-${node.id}`}
          x1={node.x}
          y1={node.y}
          x2={node.left.x!}
          y2={node.left.y!}
          stroke="#475569"
          strokeWidth="2"
        />,
      );
    }

    if (node.right && node.x !== undefined && node.y !== undefined) {
      elements.push(
        <line
          key={`edge-right-${node.id}`}
          x1={node.x}
          y1={node.y}
          x2={node.right.x!}
          y2={node.right.y!}
          stroke="#475569"
          strokeWidth="2"
        />,
      );
    }

    // Draw children first (so nodes appear on top)
    if (node.left) elements.push(...renderTree(node.left));
    if (node.right) elements.push(...renderTree(node.right));

    // Draw current node
    if (node.x !== undefined && node.y !== undefined) {
      elements.push(
        <g key={`node-${node.id}`}>
          <circle
            cx={node.x}
            cy={node.y}
            r="25"
            fill={isHighlighted ? "#3b82f6" : "#1e293b"}
            stroke={isHighlighted ? "#60a5fa" : "#475569"}
            strokeWidth="3"
            className="transition-all duration-300"
          />
          <text
            x={node.x}
            y={node.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={isHighlighted ? "#fff" : "#e5e7eb"}
            fontSize="16"
            fontWeight="bold"
          >
            {node.value}
          </text>
        </g>,
      );
    }

    return elements;
  };

  const positionedRoot = root ? calculatePositions(root, 400, 50, 100) : null;

  return (
    <div className="space-y-4">
      {/* Message Display */}
      <div className="bg-dark-elevated border border-dark-border rounded-lg p-4">
        <p className="text-zinc-700 dark:text-gray-300 text-center font-medium">
          {message || "Tree visualization"}
        </p>
      </div>

      {/* Tree Canvas */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-6 overflow-x-auto">
        <svg width="800" height="400" className="mx-auto">
          {positionedRoot && renderTree(positionedRoot)}
        </svg>
      </div>

      {/* Controls */}
      {(onPlayPause || onReset || onStep) && (
        <div className="flex items-center justify-center gap-4">
          {onPlayPause && (
            <button
              onClick={onPlayPause}
              className="btn btn-primary flex items-center gap-2"
            >
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
            <button
              onClick={onStep}
              className="btn btn-secondary flex items-center gap-2"
            >
              <SkipForward className="w-5 h-5" />
              Step
            </button>
          )}
          {onReset && (
            <button
              onClick={onReset}
              className="btn btn-secondary flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TreeVisualizer;
