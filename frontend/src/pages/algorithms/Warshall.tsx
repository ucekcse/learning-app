import React, { useState, useEffect } from "react";
import type { AlgorithmData } from "../../types";
import ProsConsSection from "../../components/algorithm/ProsConsSection";
import WorkingSection from "../../components/algorithm/WorkingSection";
import ExampleSection from "../../components/algorithm/ExampleSection";
import CodeEditor from "../../components/algorithm/CodeEditor";
import { RotateCcw, Play, Pause, SkipForward } from "lucide-react";

const Warshall: React.FC = () => {
  // Initial Reachability Matrix (1 if edge exists, 0 otherwise)
  const initialMatrix = [
    [0, 1, 0, 1],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
    [0, 0, 0, 0],
  ];

  const [matrix, setMatrix] = useState<number[][]>(
    JSON.parse(JSON.stringify(initialMatrix)),
  );
  const [k, setK] = useState(-1);
  const [i, setI] = useState(-1);
  const [j, setJ] = useState(-1);
  const [message, setMessage] = useState(
    "Click Play to start Warshall's Algorithm",
  );
  const [isPlaying, setIsPlaying] = useState(false);

  // Animation steps
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const algorithmData: AlgorithmData = {
    id: "warshall",
    title: "Warshall's Algorithm",
    category: "Graph Algorithms",
    definition:
      "Warshall's algorithm is used to determine the transitive closure of a directed graph. It computes a boolean reachability matrix, determining whether there is a path from vertex i to vertex j.",
    realWorldUse:
      "Used to find connected components in a graph, solve reachability problems in networks, and in compiler optimization to find data dependencies.",
    pros: [
      "Finds path existence between all pairs",
      "Works on directed and undirected graphs",
      "Simple implementation",
    ],
    cons: [
      "High time complexity O(V³)",
      "Space complexity O(V²)",
      "Only tells reachability, not distance",
    ],
    timeComplexity: "O(V³)",
    spaceComplexity: "O(V²)",
    workingSteps: [
      {
        step: 1,
        title: "Initialization",
        description:
          "Initialize reachability matrix R where R[i][j] = 1 if there is a direct edge from i to j, else 0.",
        codeSnippet: "R = adjacency_matrix",
      },
      {
        step: 2,
        title: "Triple Loop",
        description:
          "For each intermediate vertex k, check if a path exists from i to j via k.",
        codeSnippet:
          "for k in range(N):\n  for i in range(N):\n    for j in range(N):",
      },
      {
        step: 3,
        title: "Update Reachability",
        description: "Update R[i][j] = R[i][j] OR (R[i][k] AND R[k][j])",
        codeSnippet: "R[i][j] = R[i][j] or (R[i][k] and R[k][j])",
      },
    ],
    defaultInputs: {},
    pythonCode: `def warshall(matrix):
    """
    Warshall's Algorithm for Transitive Closure.
    matrix: NxN boolean matrix (0/1)
    """
    V = len(matrix)
    reach = [row[:] for row in matrix]
    
    for k in range(V):
        for i in range(V):
            for j in range(V):
                reach[i][j] = reach[i][j] or (reach[i][k] and reach[k][j])
                        
    return reach

graph = [
    [0, 1, 0, 1],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
    [0, 0, 0, 0]
]

closure = warshall(graph)
print("Transitive Closure Matrix:")
for row in closure:
    print(row)`,
    examples: [
      {
        title: "Reachability Matrix",
        input: { matrix: "4x4 adjacency matrix" },
        output: { result: "4x4 boolean matrix" },
        explanation:
          "Computes if node j is reachable from node i directly or indirectly.",
      },
    ],
  };

  const generateSteps = () => {
    const newSteps = [];
    const reach = JSON.parse(JSON.stringify(initialMatrix));
    const N = 4;

    newSteps.push({
      matrix: JSON.parse(JSON.stringify(reach)),
      k: -1,
      i: -1,
      j: -1,
      message: "Initialized Reachability Matrix",
    });

    for (let k = 0; k < N; k++) {
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          newSteps.push({
            matrix: JSON.parse(JSON.stringify(reach)),
            k,
            i,
            j,
            message: `Checking reachability ${i}->${j} via ${k}`,
          });

          if (!reach[i][j] && reach[i][k] && reach[k][j]) {
            reach[i][j] = 1;
            newSteps.push({
              matrix: JSON.parse(JSON.stringify(reach)),
              k,
              i,
              j,
              message: `Path found! ${i}->${j} is reachable via ${k}`,
            });
          }
        }
      }
    }

    newSteps.push({
      matrix: JSON.parse(JSON.stringify(reach)),
      k: -1,
      i: -1,
      j: -1,
      message: "Transitive Closure Computed!",
    });

    return newSteps;
  };

  const handlePlayPause = () => {
    if (!isPlaying && steps.length === 0) {
      setSteps(generateSteps());
      setCurrentStepIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setSteps([]);
    setMatrix(JSON.parse(JSON.stringify(initialMatrix)));
    setK(-1);
    setI(-1);
    setJ(-1);
    setMessage("Click Play to start");
  };

  const handleStep = () => {
    if (currentStepIndex < steps.length) {
      const step = steps[currentStepIndex];
      setMatrix(step.matrix);
      setK(step.k);
      setI(step.i);
      setJ(step.j);
      setMessage(step.message);
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        handleStep();
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStepIndex]);

  return (
    <div className="min-h-screen bg-dark-bg p-3 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="card">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {algorithmData.title}
          </h1>
          <span className="algorithm-badge badge-graph">
            {algorithmData.category}
          </span>
        </div>

        <div className="card">
          <h2 className="section-title">What is Warshall's Algorithm?</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            {algorithmData.definition}
          </p>
          <div className="bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-primary-600 dark:text-primary-300 mb-2">
              Real-World Applications
            </h3>
            <p className="text-primary-600 dark:text-primary-300 text-sm">
              {algorithmData.realWorldUse}
            </p>
          </div>
        </div>

        <ProsConsSection
          pros={algorithmData.pros}
          cons={algorithmData.cons}
          timeComplexity={algorithmData.timeComplexity}
          spaceComplexity={algorithmData.spaceComplexity}
        />

        <WorkingSection steps={algorithmData.workingSteps} />

        <div className="card">
          <h2 className="section-title">Reachability Matrix Visualization</h2>
          <div className="flex flex-col items-center gap-6">
            {/* Controls */}
            <div className="flex items-center gap-4 bg-dark-elevated p-2 rounded-lg border border-dark-border">
              <button
                onClick={handlePlayPause}
                className="btn btn-primary flex items-center gap-2"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button
                onClick={handleStep}
                className="btn btn-secondary flex items-center gap-2"
                disabled={isPlaying}
              >
                <SkipForward className="w-4 h-4" />
                Step
              </button>
              <button
                onClick={handleReset}
                className="btn btn-secondary flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>

            {/* Message */}
            <div className="bg-primary-50 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-500 rounded-lg p-3 w-full max-w-lg text-center">
              <p className="text-primary-700 dark:text-primary-200 text-sm font-medium">
                {message}
              </p>
            </div>

            {/* Grid */}
            <div className="bg-dark-elevated p-6 rounded-xl border border-dark-border shadow-2xl">
              <div className="grid grid-cols-[auto_repeat(4,1fr)] gap-2">
                {/* Header Row */}
                <div className="w-10 h-10"></div>
                {[0, 1, 2, 3].map((col) => (
                  <div
                    key={`col-${col}`}
                    className={`
                                        w-12 h-12 flex items-center justify-center font-bold rounded
                                        ${j === col ? "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300" : "text-zinc-500 dark:text-gray-400"}
                                    `}
                  >
                    {col}
                  </div>
                ))}

                {/* Rows */}
                {matrix.map((row, rowIdx) => (
                  <React.Fragment key={`row-${rowIdx}`}>
                    {/* Row Label */}
                    <div
                      className={`
                                            w-10 h-12 flex items-center justify-center font-bold rounded
                                            ${i === rowIdx ? "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300" : "text-zinc-500 dark:text-gray-400"}
                                        `}
                    >
                      {rowIdx}
                    </div>

                    {/* Cells */}
                    {row.map((val, colIdx) => {
                      const isCurrent = i === rowIdx && j === colIdx;
                      const isIntermediate1 = i === rowIdx && k === colIdx;
                      const isIntermediate2 = k === rowIdx && j === colIdx;

                      return (
                        <div
                          key={`${rowIdx}-${colIdx}`}
                          className={`
                                                        w-12 h-12 flex items-center justify-center border rounded font-mono transition-all duration-300
                                                        ${isCurrent ? "border-primary-500 bg-primary-100 dark:bg-primary-900/50 scale-110 shadow-lg z-10" : "border-zinc-300 dark:border-gray-700 bg-white dark:bg-zinc-900"}
                                                        ${isIntermediate1 || isIntermediate2 ? "!border-green-500 !bg-green-100 dark:!bg-green-900/30" : ""}
                                                    `}
                        >
                          <span
                            className={
                              val === 1
                                ? "text-green-600 dark:text-green-400 font-bold"
                                : "text-zinc-500 dark:text-gray-500"
                            }
                          >
                            {val}
                          </span>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary-100 dark:bg-primary-900/50 border border-primary-500"></div>
                <span>Target Cell (i, j)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400 font-bold">
                  1
                </span>
                <span>Reachable</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 dark:text-gray-500">0</span>
                <span>Not Reachable</span>
              </div>
            </div>
          </div>
        </div>

        <CodeEditor defaultCode={algorithmData.pythonCode} />
        <ExampleSection examples={algorithmData.examples} />
      </div>
    </div>
  );
};

export default Warshall;
