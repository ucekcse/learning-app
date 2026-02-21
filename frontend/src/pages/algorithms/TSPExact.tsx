import React, { useState, useEffect } from 'react';
import type { AlgorithmData } from '../../types';
import ProsConsSection from '../../components/algorithm/ProsConsSection';
import WorkingSection from '../../components/algorithm/WorkingSection';
import CodeEditor from '../../components/algorithm/CodeEditor';
import TSPVisualizer from '../../components/animations/TSPVisualizer';

const TSPExact: React.FC = () => {
    const [cities, setCities] = useState<{ x: number; y: number; id: number }[]>([]);
    const [bestPath, setBestPath] = useState<number[]>([]);
    const [currentPath, setCurrentPath] = useState<number[]>([]);
    const [currentEdge, setCurrentEdge] = useState<{ from: number; to: number } | undefined>();
    const [message, setMessage] = useState('Click Re-generate to create cities');
    const [isPlaying, setIsPlaying] = useState(false);
    const [, setMinDist] = useState(Infinity);

    // Refs for animation loop
    const isPlayingRef = React.useRef(false);

    const generateCities = (n: number) => {
        const newCities = [];
        for (let i = 0; i < n; i++) {
            newCities.push({
                id: i,
                x: Math.random() * 500 + 50,
                y: Math.random() * 300 + 50
            });
        }
        setCities(newCities);
        setBestPath([]);
        setCurrentPath([]);
        setMinDist(Infinity);
        setMessage('Cities generated. Click Play to find shortest path.');
    };

    useEffect(() => {
        generateCities(4);
    }, []);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const dist = (c1: any, c2: any) => Math.sqrt((c1.x - c2.x) ** 2 + (c1.y - c2.y) ** 2);

    const calculatePathCost = (path: number[], citiesList: any[]) => {
        let cost = 0;
        for (let i = 0; i < path.length - 1; i++) {
            cost += dist(citiesList[path[i]], citiesList[path[i + 1]]);
        }
        cost += dist(citiesList[path[path.length - 1]], citiesList[path[0]]);
        return cost;
    };

    const solveTSP = async () => {
        if (isPlayingRef.current) return;
        setIsPlaying(true);
        isPlayingRef.current = true;
        setCurrentPath([]);
        setBestPath([]);
        let localMinDist = Infinity;
        let localBestPath: number[] = [];

        // Simple permutation generation for visualization (brute force, manageable for N=4,5)
        const cityIndices = cities.map(c => c.id).slice(1); // Keep 0 fixed

        const permute = async (arr: number[], m: number[] = []) => {
            if (!isPlayingRef.current) return;
            if (arr.length === 0) {
                const fullPath = [0, ...m];
                const currentCost = calculatePathCost(fullPath, cities);

                // Animate tracing this path
                setCurrentPath(fullPath);

                for (let i = 0; i < fullPath.length - 1; i++) {
                    setCurrentEdge({ from: fullPath[i], to: fullPath[i + 1] });
                    // await sleep(50); // Faster without sleep for edge tracing
                }
                setCurrentEdge({ from: fullPath[fullPath.length - 1], to: fullPath[0] });
                await sleep(20);

                setMessage(`Evaluating path cost: ${Math.round(currentCost)}`);

                if (currentCost < localMinDist) {
                    localMinDist = currentCost;
                    setMinDist(currentCost);
                    localBestPath = [...fullPath];
                    setBestPath(localBestPath);
                }
            } else {
                for (let i = 0; i < arr.length; i++) {
                    const curr = arr.slice();
                    const next = curr.splice(i, 1);
                    await permute(curr.slice(), m.concat(next));
                }
            }
        };

        await permute(cityIndices);

        setIsPlaying(false);
        isPlayingRef.current = false;
        setMessage(`Optimal Path Found! Cost: ${Math.round(localMinDist)}`);
        setCurrentEdge(undefined);
    };

    const algorithmData: AlgorithmData = {
        id: 'tsp-exact',
        title: 'TSP - Exact Solution',
        category: 'Advanced Algorithms',
        definition: 'The Travelling Salesperson Problem (TSP) asks the following question: "Given a list of cities and the distances between each pair of cities, what is the shortest possible route that visits each city exactly once and returns to the origin city?" The exact solution finds the absolute optimal path, usually using Dynamic Programming (Held-Karp algorithm).',
        realWorldUse: 'Route planning for logistics/delivery, circuit board drilling, DNA sequencing, telescope scheduling.',
        pros: [
            'Guarantees the absolute shortest path',
            'Optimal for small number of cities',
            'Provides a benchmark for approximation algorithms'
        ],
        cons: [
            'NP-Hard problem',
            'Factorial time complexity O(n!) for brute force',
            'Exponential time complexity O(n^2 * 2^n) for dynamic programming',
            'Impractical for large number of cities (n > 20)'
        ],
        timeComplexity: 'O(n^2 * 2^n)',
        spaceComplexity: 'O(n * 2^n)',
        workingSteps: [
            {
                step: 1,
                title: 'Define the Cost Matrix',
                description: 'Create a matrix representing distances between every pair of cities.',
                codeSnippet: 'dist = [[0, 10, 15, 20], [10, 0, 35, 25], ...]'
            },
            {
                step: 2,
                title: 'Apply Dynamic Programming (Held-Karp)',
                description: 'Use a recursive approach with memoization. The state is defined by (mask, current_city), where mask represents the set of visited cities.',
                codeSnippet: 'dp[mask][i] = min(dp[mask][i], dp[prev_mask][j] + dist[j][i])'
            },
            {
                step: 3,
                title: 'Reconstruct Path',
                description: 'Backtrack effectively to find the sequence of cities that led to the minimum cost.'
            }
        ],
        defaultInputs: { cities: 4 },
        pythonCode: `import sys

def tsp_exact(dist):
    n = len(dist)
    # limit for exact solution
    if n > 20: return "Too many cities for exact solution"

    # dp[mask][i] stores min cost to visit set of cities 'mask' ending at 'i'
    dp = [[float('inf')] * n for _ in range(1 << n)]
    dp[1][0] = 0  # Start at city 0

    for mask in range(1, 1 << n):
        for i in range(n):
            if (mask >> i) & 1:
                prev_mask = mask ^ (1 << i)
                if prev_mask == 0: continue
                for j in range(n):
                    if (prev_mask >> j) & 1:
                        dp[mask][i] = min(dp[mask][i], dp[prev_mask][j] + dist[j][i])

    # Return to start
    ans = float('inf')
    full_mask = (1 << n) - 1
    for i in range(1, n):
        ans = min(ans, dp[full_mask][i] + dist[i][0])

    return ans if ans != float('inf') else -1

# Example Distance Matrix (4 cities)
dist = [
    [0, 10, 15, 20],
    [10, 0, 35, 25],
    [15, 35, 0, 30],
    [20, 25, 30, 0]
]

print(f"Minimum Cost: {tsp_exact(dist)}")`,
        examples: []
    };

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-dark-950 text-gray-900 dark:text-white p-3 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="card bg-slate-800 border-surface-200/70 dark:border-dark-800/80">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{algorithmData.title}</h1>
                    <span className="algorithm-badge badge-advanced">{algorithmData.category}</span>
                </div>

                <div className="card bg-slate-800 border-surface-200/70 dark:border-dark-800/80">
                    <h2 className="section-title">Overview</h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{algorithmData.definition}</p>
                    <div className="bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-primary-600 dark:text-primary-300 mb-2">Real-World Applications</h3>
                        <p className="text-primary-600 dark:text-primary-300 text-sm">{algorithmData.realWorldUse}</p>
                    </div>
                </div>

                <ProsConsSection
                    pros={algorithmData.pros}
                    cons={algorithmData.cons}
                    timeComplexity={algorithmData.timeComplexity}
                    spaceComplexity={algorithmData.spaceComplexity}
                />

                <WorkingSection steps={algorithmData.workingSteps} />

                <div className="card bg-slate-800 border-surface-200/70 dark:border-dark-800/80">
                    <h2 className="section-title">Interactive Visualization</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Brute force visualization for small N (checks all permutations).</p>

                    <div className="flex gap-4 mb-4">
                        <button onClick={() => generateCities(5)} className="btn btn-secondary text-sm">
                            Re-generate Cities
                        </button>
                        <button onClick={solveTSP} disabled={isPlaying} className="btn btn-primary text-sm">
                            {isPlaying ? 'Running...' : 'Find Exact Solution'}
                        </button>
                    </div>

                    <div className="bg-slate-950 p-4 rounded border border-surface-200/70 dark:border-dark-800/80">
                        {/* Visualizer Component Here */}
                        <div style={{ minHeight: '400px' }}>
                            <TSPVisualizer
                                cities={cities}
                                path={currentPath}
                                bestPath={bestPath}
                                currentEdge={currentEdge}
                                message={message}
                            />
                        </div>
                    </div>
                </div>

                <CodeEditor defaultCode={algorithmData.pythonCode} />
            </div>
        </div>
    );
};

export default TSPExact;
