import React, { useState, useEffect } from 'react';
import type { AlgorithmData } from '../../types';
import ProsConsSection from '../../components/algorithm/ProsConsSection';
import WorkingSection from '../../components/algorithm/WorkingSection';
import ExampleSection from '../../components/algorithm/ExampleSection';
import CodeEditor from '../../components/algorithm/CodeEditor';
import { RotateCcw, Play, Pause, SkipForward } from 'lucide-react';

const Floyd: React.FC = () => {
    const INF = 999;

    // Initial Graph Matrix
    const initialMatrix = [
        [0, 3, INF, 7],
        [8, 0, 2, INF],
        [5, INF, 0, 1],
        [2, INF, INF, 0]
    ];

    const [matrix, setMatrix] = useState<number[][]>(JSON.parse(JSON.stringify(initialMatrix)));
    const [k, setK] = useState(-1);
    const [i, setI] = useState(-1);
    const [j, setJ] = useState(-1);
    const [message, setMessage] = useState('Click Play to start Floyd-Warshall');
    const [isPlaying, setIsPlaying] = useState(false);

    // Animation steps
    const [steps, setSteps] = useState<any[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const algorithmData: AlgorithmData = {
        id: 'floyd',
        title: "Floyd-Warshall Algorithm",
        category: 'Graph Algorithms',
        definition: "The Floyd-Warshall algorithm is a dynamic programming algorithm for finding shortest paths in a weighted graph with positive or negative edge weights (but no negative cycles). It computes the shortest path distances between every pair of vertices.",
        realWorldUse: 'Used in dense graphs, networking (routing tables), transitive closure of a relation, inversion of real matrices, and finding the widest path problem.',
        pros: [
            'Finds all-pairs shortest paths',
            'Works with negative edge weights',
            'Simple implementation (3 nested loops)',
            'Detects negative cycles'
        ],
        cons: [
            'High time complexity O(V³)',
            'Not suitable for large graphs',
            'Space complexity O(V²)'
        ],
        timeComplexity: 'O(V³)',
        spaceComplexity: 'O(V²)',
        workingSteps: [
            {
                step: 1,
                title: 'Initialization',
                description: 'Initialize distance matrix D where D[i][j] is weight of edge (i,j) if it exists, 0 if i=j, and infinity otherwise.',
                codeSnippet: 'D = graph_matrix'
            },
            {
                step: 2,
                title: 'Triple Loop',
                description: 'Iterate through all intermediate nodes k, and for each pair (i, j), check if path going through k is shorter.',
                codeSnippet: 'for k in range(N):\n  for i in range(N):\n    for j in range(N):'
            },
            {
                step: 3,
                title: 'Relaxation',
                description: 'Update distance: D[i][j] = min(D[i][j], D[i][k] + D[k][j])',
                codeSnippet: 'if D[i][k] + D[k][j] < D[i][j]:\n  D[i][j] = D[i][k] + D[k][j]'
            }
        ],
        defaultInputs: {},
        pythonCode: `def floyd_warshall(graph):
    """
    Floyd-Warshall Algorithm for All-Pairs Shortest Paths.
    graph: NxN matrix
    """
    V = len(graph)
    dist = [row[:] for row in graph]
    
    for k in range(V):
        for i in range(V):
            for j in range(V):
                # If path through k is shorter
                if dist[i][k] != float('inf') and dist[k][j] != float('inf'):
                    if dist[i][k] + dist[k][j] < dist[i][j]:
                        dist[i][j] = dist[i][k] + dist[k][j]
                        
    return dist

INF = float('inf')
graph = [
    [0, 3, INF, 7],
    [8, 0, 2, INF],
    [5, INF, 0, 1],
    [2, INF, INF, 0]
]

result = floyd_warshall(graph)
print("Shortest Distance Matrix:")
for row in result:
    print(row)`,
        examples: [
            {
                title: 'Distance Matrix Example',
                input: { matrix: '4x4 adjacency matrix' },
                output: { result: '4x4 shortest path matrix' },
                explanation: 'Iteratively updates distances using intermediate nodes 0, 1, 2, 3.'
            }
        ]
    };

    const generateSteps = () => {
        const newSteps = [];
        const dist = JSON.parse(JSON.stringify(initialMatrix));
        const N = 4;

        newSteps.push({
            matrix: JSON.parse(JSON.stringify(dist)),
            k: -1, i: -1, j: -1,
            message: 'Initialized Distance Matrix'
        });

        for (let k = 0; k < N; k++) {
            for (let i = 0; i < N; i++) {
                for (let j = 0; j < N; j++) {
                    // Visual check
                    newSteps.push({
                        matrix: JSON.parse(JSON.stringify(dist)),
                        k, i, j,
                        message: `Comparing dist[${i}][${j}] (${dist[i][j] === INF ? '∞' : dist[i][j]}) with dist[${i}][${k}] + dist[${k}][${j}]`
                    });

                    if (dist[i][k] !== INF && dist[k][j] !== INF) {
                        if (dist[i][k] + dist[k][j] < dist[i][j]) {
                            dist[i][j] = dist[i][k] + dist[k][j];
                            newSteps.push({
                                matrix: JSON.parse(JSON.stringify(dist)),
                                k, i, j,
                                message: `Update! dist[${i}][${j}] is now ${dist[i][j]}`
                            });
                        }
                    }
                }
            }
        }

        newSteps.push({
            matrix: JSON.parse(JSON.stringify(dist)),
            k: -1, i: -1, j: -1,
            message: 'All-Pairs Shortest Paths Computed!'
        });

        return newSteps;
    };

    const handlePlayPause = () => {
        if (!isPlaying && steps.length === 0) {
            const calculatedSteps = generateSteps();
            setSteps(calculatedSteps);
            setCurrentStepIndex(0);
        }
        setIsPlaying(!isPlaying);
    };

    const handleReset = () => {
        setIsPlaying(false);
        setCurrentStepIndex(0);
        setSteps([]);
        setMatrix(JSON.parse(JSON.stringify(initialMatrix)));
        setK(-1); setI(-1); setJ(-1);
        setMessage('Click Play to start');
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
            }, 100); // Fast speed
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentStepIndex]); // Depend on currentStepIndex to trigger next step

    return (
        <div className="min-h-screen bg-dark-bg p-3 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="card">
                    <h1 className="text-4xl font-bold text-gray-100 mb-2">{algorithmData.title}</h1>
                    <span className="algorithm-badge badge-graph">{algorithmData.category}</span>
                </div>

                <div className="card">
                    <h2 className="section-title">What is Floyd-Warshall?</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">{algorithmData.definition}</p>
                    <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-blue-200 mb-2">Real-World Applications</h3>
                        <p className="text-blue-100 text-sm">{algorithmData.realWorldUse}</p>
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
                    <h2 className="section-title">Matrix Visualization</h2>
                    <div className="flex flex-col items-center gap-6">

                        {/* Controls */}
                        <div className="flex items-center gap-4 bg-dark-elevated p-2 rounded-lg border border-dark-border">
                            <button
                                onClick={handlePlayPause}
                                className="btn btn-primary flex items-center gap-2"
                            >
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                {isPlaying ? 'Pause' : 'Play'}
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
                        <div className="bg-primary-900/30 border border-primary-500 rounded-lg p-3 w-full max-w-lg text-center">
                            <p className="text-primary-200 text-sm font-medium">{message}</p>
                        </div>

                        {/* Grid */}
                        <div className="bg-dark-elevated p-6 rounded-xl border border-dark-border shadow-2xl">
                            <div className="grid grid-cols-[auto_repeat(4,1fr)] gap-2">
                                {/* Header Row */}
                                <div className="w-10 h-10"></div> {/* Empty corner */}
                                {[0, 1, 2, 3].map(col => (
                                    <div key={`col-${col}`} className={`
                                        w-12 h-12 flex items-center justify-center font-bold rounded
                                        ${j === col ? 'bg-yellow-500/20 text-yellow-300' : 'text-gray-400'}
                                    `}>
                                        {col}
                                    </div>
                                ))}

                                {/* Rows */}
                                {matrix.map((row, rowIdx) => (
                                    <React.Fragment key={`row-${rowIdx}`}>
                                        {/* Row Label */}
                                        <div className={`
                                            w-10 h-12 flex items-center justify-center font-bold rounded
                                            ${i === rowIdx ? 'bg-yellow-500/20 text-yellow-300' : 'text-gray-400'}
                                        `}>
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
                                                        ${isCurrent ? 'border-primary-500 bg-primary-900/50 scale-110 shadow-lg z-10' : 'border-gray-700 bg-dark-bg'}
                                                        ${(isIntermediate1 || isIntermediate2) ? 'border-green-500 bg-green-900/30' : ''}
                                                    `}
                                                >
                                                    <span className={val === INF ? 'text-gray-600' : 'text-gray-200'}>
                                                        {val === INF ? '∞' : val}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-primary-900/50 border border-primary-500"></div>
                                <span>Target Cell (i, j)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-green-900/30 border border-green-500"></div>
                                <span>Intermediate (i, k) & (k, j)</span>
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

export default Floyd;
