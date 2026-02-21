import React, { useState, useEffect } from 'react';
import type { AlgorithmData } from '../../types';
import ProsConsSection from '../../components/algorithm/ProsConsSection';
import WorkingSection from '../../components/algorithm/WorkingSection';
import ExampleSection from '../../components/algorithm/ExampleSection';
import CodeEditor from '../../components/algorithm/CodeEditor';
import GraphVisualizer from '../../components/animations/GraphVisualizer';

const Dijkstra: React.FC = () => {
    const defaultGraph = {
        nodes: [
            { id: 0, x: 100, y: 250, label: 'A' },
            { id: 1, x: 300, y: 100, label: 'B' },
            { id: 2, x: 300, y: 400, label: 'C' },
            { id: 3, x: 500, y: 100, label: 'D' },
            { id: 4, x: 500, y: 400, label: 'E' },
            { id: 5, x: 700, y: 250, label: 'F' },
        ],
        edges: [
            { from: 0, to: 1, weight: 4 },
            { from: 0, to: 2, weight: 2 },
            { from: 1, to: 2, weight: 1 },
            { from: 1, to: 3, weight: 5 },
            { from: 2, to: 3, weight: 8 },
            { from: 2, to: 4, weight: 10 },
            { from: 3, to: 4, weight: 2 },
            { from: 3, to: 5, weight: 6 },
            { from: 4, to: 5, weight: 3 },
        ]
    };

    const [animationState, setAnimationState] = useState({
        visitedNodes: [] as number[],
        currentNode: -1,
        activeEdges: [] as Array<[number, number]>,
        message: 'Click Play to start Dijkstra\'s Algorithm',
        distances: {} as Record<number, number | string> // Store current distances
    });
    const [isPlaying, setIsPlaying] = useState(false);

    // Initial distances for visualization
    const initialDistances: Record<number, number | string> = {};
    defaultGraph.nodes.forEach(n => initialDistances[n.id] = (n.id === 0 ? 0 : '∞'));

    const algorithmData: AlgorithmData = {
        id: 'dijkstra',
        title: "Dijkstra's Algorithm",
        category: 'Graph Algorithms',
        definition: "Dijkstra's algorithm is a graph search algorithm that solves the single-source shortest path problem for a graph with non-negative edge path costs, producing a shortest path tree. It maintains a set of visited vertices and a set of unvisited vertices. It starts at the source vertex and iteratively selects the unvisited vertex with the smallest tentative distance from the source.",
        realWorldUse: 'Dijkstra\'s algorithm is widely used in network routing protocols (like OSPF), GPS navigation systems (Google Maps) to find the shortest route between two locations, IP routing, and solving problems in social network analysis.',
        pros: [
            'Guarantees the shortest path in non-negative weighted graphs',
            'More efficient than Bellman-Ford for non-negative weights',
            'Can vary constraints (e.g., shortest time, lowest cost)',
            'Standard algorithm for routing protocols'
        ],
        cons: [
            'Does not work with negative edge weights',
            'Can be slow in dense graphs without optimization (O(E log V))',
            'Blind search (doesn\'t use heuristics like A*)',
            'Might process many unnecessary nodes'
        ],
        timeComplexity: 'O((V + E) log V) with priority queue',
        spaceComplexity: 'O(V + E)',
        workingSteps: [
            {
                step: 1,
                title: 'Initialization',
                description: 'Set distance to source vertex to 0 and all other vertices to infinity. Mark all vertices as unvisited. Create a priority queue and add the source vertex.',
                variables: [
                    { name: 'dist', type: 'Map', purpose: 'Stores shortest distance from source to each vertex' },
                    { name: 'pq', type: 'PriorityQueue', purpose: 'Stores vertices to visit, ordered by distance' }
                ],
                codeSnippet: 'dist = {v: float("inf") for v in graph}\ndist[start] = 0\npq = [(0, start)]'
            },
            {
                step: 2,
                title: 'Select vertex with min distance',
                description: 'Extract the vertex with the minimum distance from the priority queue. This vertex is now "visited" (finalized).',
                codeSnippet: 'current_dist, u = heapq.heappop(pq)\nif current_dist > dist[u]: continue'
            },
            {
                step: 3,
                title: 'Relax edges',
                description: 'For each neighbor of the current vertex, calculate the distance through the current vertex. If this new distance is shorter than the previously known distance, update the distance and add to priority queue.',
                variables: [
                    { name: 'v', type: 'Vertex', purpose: 'Neighboring vertex' },
                    { name: 'weight', type: 'int', purpose: 'Weight of edge u-v' }
                ],
                codeSnippet: 'new_dist = dist[u] + weight\nif new_dist < dist[v]:\n    dist[v] = new_dist\n    heapq.heappush(pq, (new_dist, v))'
            },
            {
                step: 4,
                title: 'Repeat',
                description: 'Repeat steps 2-3 until the priority queue is empty or the destination is reached.',
                codeSnippet: 'while pq:\n    # Process next min vertex'
            }
        ],
        defaultInputs: {},
        pythonCode: `import heapq

def dijkstra(graph, start):
    """
    Dijkstra's Algorithm for shortest paths.
    graph: dict of dicts (adjacency list with weights)
    start: starting vertex
    """
    # Initialize distances
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    
    # Priority queue: (distance, node)
    pq = [(0, start)]
    
    # Path reconstruction
    previous = {node: None for node in graph}
    
    while pq:
        current_dist, current_node = heapq.heappop(pq)
        
        # Skip if we found a shorter path already
        if current_dist > distances[current_node]:
            continue
            
        print(f"Visiting {current_node} (Dist: {current_dist})")
        
        for neighbor, weight in graph[current_node].items():
            distance = current_dist + weight
            
            # Implementation of Relaxation
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                previous[neighbor] = current_node
                heapq.heappush(pq, (distance, neighbor))
                print(f"  Updated {neighbor}: {distances[neighbor]}")
                
    return distances, previous

# Example Graph
graph = {
    'A': {'B': 4, 'C': 2},
    'B': {'C': 1, 'D': 5},
    'C': {'B': 1, 'D': 8, 'E': 10},
    'D': {'E': 2, 'F': 6},
    'E': {'F': 3},
    'F': {}
}

dists, prev = dijkstra(graph, 'A')
print("\\nShortest Distances:")
for node, dist in dists.items():
    print(f"{node}: {dist}")`,
        examples: [
            {
                title: 'Shortest Path from A',
                input: { graph: 'See visualization', start: 'A' },
                output: {
                    'A': 0, 'B': 3, 'C': 2,
                    'D': 8, 'E': 10, 'F': 13
                },
                explanation: 'A->C (2), C->B (2+1=3), B->D (3+5=8) [Wait! Path A->C->D is 2+8=10, but A->C->B->D is 3+5=8, simpler? No. A->B is 4. A->C->B is 3. So B is 3. B->D is 3+5=8. D->E is 8+2=10. E->F is 10+3=13. ]'
            }
        ]
    };

    const dijkstraSteps = () => {
        const steps: any[] = [];
        const nodes = defaultGraph.nodes;
        // Adjacency list
        const adj: Record<number, Array<{ to: number, weight: number }>> = {};
        defaultGraph.nodes.forEach(n => adj[n.id] = []);
        defaultGraph.edges.forEach(e => {
            adj[e.from].push({ to: e.to, weight: e.weight || 0 });
            // Undirected graph assumption for this visual? Or Directed? 
            // The edges in defaultGraph look directed (from->to). 
            // Standard Dijkstra usually directed. Let's assume directed as per code.
            // But wait, graph visualizer often treats as undirected unless specified.
            // Let's treat as Undirected for typical textbook example behavior if edges imply that?
            // "from: 0, to: 1" usually implies directed in code, but undirected in many simple visualizations.
            // Let's add reverse edges for undirected behavior if desired, OR stick to directed.
            // Let's Stick to DIRECTED based on arrowheads usually, but GraphVisualizer edges don't show arrows by default unless 'directed' prop?
            // GraphVisualizer doesn't seem to draw arrows. It draws lines. 
            // To make it clear, let's treat edges as Directed in logic.
        });

        const dist: Record<number, number> = {};
        const visited = new Set<number>();
        const pq: { id: number, dist: number }[] = [];

        nodes.forEach(n => dist[n.id] = Infinity);
        dist[0] = 0;
        pq.push({ id: 0, dist: 0 });

        // Initial step
        steps.push({
            visitedNodes: [],
            currentNode: -1,
            activeEdges: [],
            message: 'Initialized distances: A=0, others=∞',
            distances: { ...dist, 0: 0 } // Copy and explicit 0
        });

        while (pq.length > 0) {
            // Sort to simulate priority queue
            pq.sort((a, b) => a.dist - b.dist);
            const { id: u, dist: d } = pq.shift()!;

            if (d > dist[u]) continue;

            // Mark as visited (finalized)
            visited.add(u);

            steps.push({
                visitedNodes: Array.from(visited),
                currentNode: u,
                activeEdges: [],
                message: `dShortest distance to ${nodes[u].label} finalized as ${d}`,
                distances: { ...dist }
            });

            // Explore neighbors
            const neighbors = adj[u] || [];
            for (const edge of neighbors) {
                const v = edge.to;
                const weight = edge.weight;

                // Visualization of relaxation attempt
                steps.push({
                    visitedNodes: Array.from(visited),
                    currentNode: u,
                    activeEdges: [[u, v]],
                    message: `Checking neighbor ${nodes[v].label} (dist: ${dist[v] === Infinity ? '∞' : dist[v]}) via ${nodes[u].label}`,
                    distances: { ...dist }
                });

                if (dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                    pq.push({ id: v, dist: dist[v] });

                    steps.push({
                        visitedNodes: Array.from(visited),
                        currentNode: u,
                        activeEdges: [[u, v]],
                        message: `Relaxed edge ${nodes[u].label}->${nodes[v].label}. Updated ${nodes[v].label} distance to ${dist[v]}`,
                        distances: { ...dist }
                    });
                }
            }
        }

        steps.push({
            visitedNodes: Array.from(visited),
            currentNode: -1,
            activeEdges: [],
            message: 'Dijkstra initialized and all reachable nodes finalized.',
            distances: { ...dist }
        });

        return steps;
    };

    const [steps, setSteps] = useState<any[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const handlePlayPause = () => {
        if (!isPlaying && steps.length === 0) {
            const calculatedSteps = dijkstraSteps();
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
            message: 'Click Play to start Dijkstra\'s Algorithm',
            distances: initialDistances
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

        const interval = setInterval(() => {
            if (currentStepIndex >= steps.length) {
                setIsPlaying(false);
                return;
            }
            handleStep();
        }, 1500);

        return () => clearInterval(interval);
    }, [isPlaying, currentStepIndex, steps]);

    // Enhanced nodes with distance labels for visualization
    const visualNodes = defaultGraph.nodes.map(node => ({
        ...node,
        label: `${node.label} (${animationState.distances[node.id] === Infinity ? '∞' : animationState.distances[node.id] ?? (node.id === 0 ? 0 : '∞')})`
    }));

    return (
        <div className="min-h-screen bg-dark-bg p-3 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="card">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{algorithmData.title}</h1>
                    <span className="algorithm-badge badge-graph">{algorithmData.category}</span>
                </div>

                <div className="card">
                    <h2 className="section-title">What is Dijkstra's Algorithm?</h2>
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
                        See how distances are updated and shortest paths are found. Nodes show "Label (Distance)".
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

export default Dijkstra;
