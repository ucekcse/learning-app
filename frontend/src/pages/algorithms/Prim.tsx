import React, { useState, useEffect } from 'react';
import type { AlgorithmData } from '../../types';
import ProsConsSection from '../../components/algorithm/ProsConsSection';
import WorkingSection from '../../components/algorithm/WorkingSection';
import ExampleSection from '../../components/algorithm/ExampleSection';
import CodeEditor from '../../components/algorithm/CodeEditor';
import GraphVisualizer from '../../components/animations/GraphVisualizer';

const Prim: React.FC = () => {
    const defaultGraph = {
        nodes: [
            { id: 0, x: 200, y: 100, label: '0' },
            { id: 1, x: 400, y: 100, label: '1' },
            { id: 2, x: 200, y: 300, label: '2' },
            { id: 3, x: 400, y: 300, label: '3' },
            { id: 4, x: 600, y: 200, label: '4' },
        ],
        edges: [
            { from: 0, to: 1, weight: 2 },
            { from: 0, to: 2, weight: 6 },
            { from: 1, to: 2, weight: 8 },
            { from: 1, to: 3, weight: 5 },
            { from: 1, to: 4, weight: 10 },
            { from: 2, to: 3, weight: 8 },
            { from: 3, to: 4, weight: 15 },
        ]
    };

    const [animationState, setAnimationState] = useState({
        visitedNodes: [] as number[],
        currentNode: -1,
        activeEdges: [] as Array<[number, number]>, // Edges in MST
        message: 'Click Play to start Prim\'s Algorithm',
        keys: {} as Record<number, number | string>, // Min weight to connect to MST
        parents: {} as Record<number, number | null>
    });
    const [isPlaying, setIsPlaying] = useState(false);

    // Initial keys
    const initialKeys: Record<number, number | string> = {};
    defaultGraph.nodes.forEach(n => initialKeys[n.id] = (n.id === 0 ? 0 : '∞'));

    const algorithmData: AlgorithmData = {
        id: 'prim',
        title: "Prim's Algorithm (MST)",
        category: 'Graph Algorithms',
        definition: "Prim's algorithm is a greedy algorithm that finds a Minimum Spanning Tree (MST) for a weighted undirected graph. It starts with an arbitrary node and repeatedly adds the minimum weight edge connecting a vertex in the MST to a vertex outside the MST.",
        realWorldUse: 'Prim\'s algorithm is used in network design (connecting computers with min cable), constructing power grids, clustering algorithms, and maze generation.',
        pros: [
            'Guarantees minimum total weight for spanning tree',
            'Efficient for dense graphs (O(V²) or O(E log V))',
            'Simple greedy approach',
            'Works on graphs with negative weights (unlike Dijkstra)'
        ],
        cons: [
            'Requires connected graph',
            'Slower than Kruskal\'s for sparse graphs',
            'More complex to implement with binary heap'
        ],
        timeComplexity: 'O(E log V)',
        spaceComplexity: 'O(V + E)',
        workingSteps: [
            {
                step: 1,
                title: 'Initialization',
                description: 'Pick a start node and set its key to 0, others to infinity. MST set is empty.',
                codeSnippet: 'key = {v: infinity}\nkey[start] = 0\nmstSet = set()'
            },
            {
                step: 2,
                title: 'Select Min Key Vertex',
                description: 'Pick the vertex u not in MST Set that has the minimum key value.',
                codeSnippet: 'u = min((v for v in V if v not in mstSet), key=lambda x: key[x])'
            },
            {
                step: 3,
                title: 'Add to MST and Update Neighbors',
                description: 'Add u to MST Set. For every neighbor v of u, if weight(u,v) < key[v], update key[v] = weight(u,v).',
                codeSnippet: 'mstSet.add(u)\nfor v, weight in adj[u]:\n    if v not in mstSet and weight < key[v]:\n        key[v] = weight\n        parent[v] = u'
            },
            {
                step: 4,
                title: 'Repeat',
                description: 'Repeat until all vertices are included in MST.',
                codeSnippet: 'while len(mstSet) < V:\n    # Repeat steps'
            }
        ],
        defaultInputs: {},
        pythonCode: `import heapq

def prim_mst(graph, start_node):
    """
    Prim's Algorithm for Minimum Spanning Tree.
    """
    mst = []
    visited = set()
    
    # Priority Queue: (weight, from_node, to_node)
    min_heap = [(0, -1, start_node)]
    
    total_cost = 0
    
    while min_heap and len(visited) < len(graph):
        weight, u, v = heapq.heappop(min_heap)
        
        if v in visited:
            continue
            
        visited.add(v)
        total_cost += weight
        if u != -1:
            mst.append((u, v, weight))
            print(f"Added edge {u}-{v} (Weight: {weight})")
            
        # Add neighbors
        for neighbor, edge_weight in graph[v]:
            if neighbor not in visited:
                heapq.heappush(min_heap, (edge_weight, v, neighbor))
                
    return mst, total_cost

# Adjacency list: node -> [(neighbor, weight)]
graph = {
    0: [(1, 2), (2, 6)],
    1: [(0, 2), (2, 8), (3, 5), (4, 10)],
    2: [(0, 6), (1, 8), (3, 8)],
    3: [(1, 5), (2, 8), (4, 15)],
    4: [(1, 10), (3, 15)]
}

mst_edges, cost = prim_mst(graph, 0)
print(f"\\nTotal MST Cost: {cost}")`,
        examples: [
            {
                title: 'MST Calculation',
                input: { graph: 'See visualization', start: '0' },
                output: { mst_edges: ['0-1 (2)', '1-3 (5)', '0-2 (6)', '1-4 (10)'], total_cost: 23 },
                explanation: '1. Start 0. Unions 0-1 (wt 2). MST: {0,1}\n2. From {0,1}, min edge is 1-3 (5). MST: {0,1,3}\n3. From {0,1,3}, min edge is 0-2 (6). MST: {0,1,3,2}\n4. From {0,1,3,2}, min edge is 1-4 (10). MST: {0,1,3,2,4}'
            }
        ]
    };

    const primSteps = () => {
        const steps: any[] = [];
        const nodes = defaultGraph.nodes;
        const n = nodes.length;

        const adj: Record<number, Array<{ to: number, weight: number }>> = {};
        nodes.forEach(node => adj[node.id] = []);
        // Undirected graph population
        defaultGraph.edges.forEach(e => {
            adj[e.from].push({ to: e.to, weight: e.weight || 0 });
            adj[e.to].push({ to: e.from, weight: e.weight || 0 });
        });

        const key: Record<number, number> = {};
        const parent: Record<number, number | null> = {};
        const mstSet = new Set<number>();

        nodes.forEach(node => {
            key[node.id] = Infinity;
            parent[node.id] = null;
        });

        key[0] = 0;

        steps.push({
            visitedNodes: [],
            currentNode: -1,
            activeEdges: [],
            message: 'Initialized keys: 0=0, others=∞',
            keys: { ...key, 0: 0 }
        });

        for (let i = 0; i < n; i++) {
            // Find min key vertex not in mstSet
            let u = -1;
            let minKey = Infinity;

            for (let v = 0; v < n; v++) {
                if (!mstSet.has(v) && key[v] < minKey) {
                    minKey = key[v];
                    u = v;
                }
            }

            if (u === -1) break;

            mstSet.add(u);

            // Reconstruct current MST edges for visualization
            const currentMSTEdges: [number, number][] = [];
            for (let v = 0; v < n; v++) {
                if (parent[v] !== null) {
                    currentMSTEdges.push([parent[v]!, v]);
                }
            }

            steps.push({
                visitedNodes: Array.from(mstSet),
                currentNode: u,
                activeEdges: currentMSTEdges,
                message: `Added node ${u} to MST.`,
                keys: { ...key }
            });

            // Update neighbors
            const neighbors = adj[u];
            for (const edge of neighbors) {
                const v = edge.to;
                const weight = edge.weight;

                if (!mstSet.has(v) && weight < key[v]) {
                    key[v] = weight;
                    parent[v] = u;

                    steps.push({
                        visitedNodes: Array.from(mstSet),
                        currentNode: u,
                        activeEdges: currentMSTEdges,
                        message: `Updated key of node ${v} to ${weight} (via ${u})`,
                        keys: { ...key }
                    });
                }
            }
        }

        steps.push({
            visitedNodes: Array.from(mstSet),
            currentNode: -1,
            activeEdges: Object.entries(parent).filter(([_, p]) => p !== null).map(([c, p]) => [p!, parseInt(c)]),
            message: 'Prim\'s Algorithm complete. MST formed.',
            keys: { ...key }
        });

        return steps;
    };

    const [steps, setSteps] = useState<any[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const handlePlayPause = () => {
        if (!isPlaying && steps.length === 0) {
            const calculatedSteps = primSteps();
            setSteps(calculatedSteps);
            setCurrentStepIndex(0);
        }
        setIsPlaying(!isPlaying);
    };

    const handleReset = () => {
        setIsPlaying(false);
        setCurrentStepIndex(0);
        setSteps([]);
        setAnimationState({
            visitedNodes: [],
            currentNode: -1,
            activeEdges: [],
            message: 'Click Play to start Prim\'s Algorithm',
            keys: initialKeys,
            parents: {}
        });
    };

    const handleStep = () => {
        if (currentStepIndex < steps.length) {
            setAnimationState(steps[currentStepIndex]);
            setCurrentStepIndex(currentStepIndex + 1);
        }
    };

    useEffect(() => {
        if (!isPlaying || steps.length === 0) return;
        const interval = setInterval(handleStep, 1500);
        return () => clearInterval(interval);
    }, [isPlaying, currentStepIndex]);

    const visualNodes = defaultGraph.nodes.map(node => ({
        ...node,
        label: `${node.label} (k:${animationState.keys[node.id] === Infinity ? '∞' : animationState.keys[node.id]})`
    }));

    return (
        <div className="min-h-screen bg-dark-bg p-3 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="card">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{algorithmData.title}</h1>
                    <span className="algorithm-badge badge-graph">{algorithmData.category}</span>
                </div>
                <div className="card">
                    <h2 className="section-title">What is Prim's Algorithm?</h2>
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
                <div className="card">
                    <h2 className="section-title">Interactive Visualization</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Nodes in Green are in MST. Labels show minimum weight key to connect to MST.
                    </p>
                    <GraphVisualizer
                        nodes={visualNodes}
                        edges={defaultGraph.edges}
                        visitedNodes={animationState.visitedNodes}
                        currentNode={animationState.currentNode}
                        activeEdges={animationState.activeEdges}
                        message={animationState.message}
                        isPlaying={isPlaying}
                        onPlayPause={handlePlayPause}
                        onReset={handleReset}
                        onStep={handleStep}
                    />
                </div>
                <CodeEditor defaultCode={algorithmData.pythonCode} />
                <ExampleSection examples={algorithmData.examples} />
            </div>
        </div>
    );
};

export default Prim;
