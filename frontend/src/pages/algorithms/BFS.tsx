import React, { useState, useEffect } from 'react';
import type { AlgorithmData } from '../../types';
import ProsConsSection from '../../components/algorithm/ProsConsSection';
import WorkingSection from '../../components/algorithm/WorkingSection';
import ExampleSection from '../../components/algorithm/ExampleSection';
import CodeEditor from '../../components/algorithm/CodeEditor';
import GraphVisualizer from '../../components/animations/GraphVisualizer';

const BFS: React.FC = () => {
    const defaultGraph = {
        nodes: [
            { id: 0, x: 400, y: 50, label: 'A' },
            { id: 1, x: 250, y: 150, label: 'B' },
            { id: 2, x: 550, y: 150, label: 'C' },
            { id: 3, x: 150, y: 250, label: 'D' },
            { id: 4, x: 350, y: 250, label: 'E' },
            { id: 5, x: 650, y: 250, label: 'F' },
        ],
        edges: [
            { from: 0, to: 1 },
            { from: 0, to: 2 },
            { from: 1, to: 3 },
            { from: 1, to: 4 },
            { from: 2, to: 5 },
        ]
    };

    const [animationState, setAnimationState] = useState({
        visitedNodes: [] as number[],
        currentNode: -1,
        queue: [] as number[],
        activeEdges: [] as Array<[number, number]>,
        message: 'Click Play to start BFS traversal'
    });
    const [isPlaying, setIsPlaying] = useState(false);

    const algorithmData: AlgorithmData = {
        id: 'bfs',
        title: 'Breadth First Search (BFS)',
        category: 'Graph Algorithms',
        definition: 'Breadth First Search (BFS) is a graph traversal algorithm that explores vertices level by level, starting from a source vertex. It visits all neighbors at the current depth before moving to vertices at the next depth level. BFS uses a queue data structure to keep track of vertices to visit.',
        realWorldUse: 'BFS is used in social networking sites to find connections (friends of friends), in GPS navigation to find the shortest path, in web crawlers to index web pages, in peer-to-peer networks, and in solving puzzles like finding the shortest solution in a Rubik\'s cube.',
        pros: [
            'Finds shortest path in unweighted graphs',
            'Guarantees finding a solution if one exists',
            'Explores nodes level by level systematically',
            'Optimal for finding minimum spanning tree',
            'Simple to implement using a queue'
        ],
        cons: [
            'Requires O(V) space to store queue and visited nodes',
            'Not suitable for very large graphs (memory intensive)',
            'Slower than DFS for deep graphs',
            'May visit many unnecessary nodes in dense graphs',
            'Cannot handle weighted graphs optimally'
        ],
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
        workingSteps: [
            {
                step: 1,
                title: 'Initialize data structures',
                description: 'Create a queue to store vertices to visit and a set to track visited vertices. Add the starting vertex to the queue and mark it as visited.',
                variables: [
                    { name: 'queue', type: 'Queue', purpose: 'Stores vertices to be explored' },
                    { name: 'visited', type: 'Set', purpose: 'Tracks which vertices have been visited' },
                    { name: 'start', type: 'int', purpose: 'Starting vertex for traversal' }
                ],
                codeSnippet: 'queue = [start]\nvisited = {start}'
            },
            {
                step: 2,
                title: 'Dequeue and process vertex',
                description: 'Remove the front vertex from the queue and process it (e.g., print it, check if it\'s the goal, etc.).',
                codeSnippet: 'current = queue.pop(0)\nprint(current)  # Process the vertex'
            },
            {
                step: 3,
                title: 'Explore neighbors',
                description: 'For each unvisited neighbor of the current vertex, mark it as visited and add it to the queue. This ensures we explore all vertices at the current level before moving deeper.',
                variables: [
                    { name: 'neighbor', type: 'int', purpose: 'Adjacent vertex being examined' }
                ],
                codeSnippet: 'for neighbor in graph[current]:\n    if neighbor not in visited:\n        visited.add(neighbor)\n        queue.append(neighbor)'
            },
            {
                step: 4,
                title: 'Repeat until queue is empty',
                description: 'Continue steps 2-3 until the queue is empty, meaning all reachable vertices have been visited.',
                codeSnippet: 'while queue:\n    # Repeat steps 2-3'
            }
        ],
        defaultInputs: {},
        pythonCode: `from collections import deque

def bfs(graph, start):
    """
    Perform Breadth First Search on a graph.
    graph: adjacency list representation
    start: starting vertex
    """
    visited = set()
    queue = deque([start])
    visited.add(start)
    traversal_order = []
    
    while queue:
        vertex = queue.popleft()
        traversal_order.append(vertex)
        print(f"Visiting: {vertex}")
        
        # Explore neighbors
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
                print(f"  Added {neighbor} to queue")
    
    return traversal_order

# Example graph (adjacency list)
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B'],
    'F': ['C']
}

print("BFS Traversal starting from A:")
result = bfs(graph, 'A')
print(f"\\nTraversal order: {' -> '.join(result)}")`,
        examples: [
            {
                title: 'Example: BFS from vertex A',
                input: { graph: 'A-B, A-C, B-D, B-E, C-F', start: 'A' },
                output: { traversal: ['A', 'B', 'C', 'D', 'E', 'F'] },
                explanation: 'Starting from A, we visit A first. Then we visit all neighbors of A (B and C) at level 1. Next, we visit all unvisited neighbors of B and C (D, E, F) at level 2. The traversal order is: A → B → C → D → E → F.'
            }
        ]
    };

    const bfsSteps = () => {
        const steps: any[] = [];
        const visited = new Set<number>();
        const queue: number[] = [0];
        visited.add(0);

        steps.push({
            visitedNodes: [0],
            currentNode: 0,
            queue: [0],
            activeEdges: [],
            message: 'Starting BFS from node A (0)'
        });

        while (queue.length > 0) {
            const current = queue.shift()!;

            const neighbors = defaultGraph.edges
                .filter(e => e.from === current || e.to === current)
                .map(e => e.from === current ? e.to : e.from);

            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);

                    steps.push({
                        visitedNodes: Array.from(visited),
                        currentNode: neighbor,
                        queue: [...queue],
                        activeEdges: [[current, neighbor]],
                        message: `Exploring edge from ${defaultGraph.nodes[current].label} to ${defaultGraph.nodes[neighbor].label}`
                    });
                }
            }
        }

        steps.push({
            visitedNodes: Array.from(visited),
            currentNode: -1,
            queue: [],
            activeEdges: [],
            message: 'BFS traversal complete!'
        });

        return steps;
    };

    const [steps, setSteps] = useState<any[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const handlePlayPause = () => {
        if (!isPlaying && steps.length === 0) {
            const bfsStepsList = bfsSteps();
            setSteps(bfsStepsList);
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
            queue: [],
            activeEdges: [],
            message: 'Click Play to start BFS traversal'
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
        }, 1200);

        return () => clearInterval(interval);
    }, [isPlaying, currentStepIndex, steps]);

    return (
        <div className="min-h-screen bg-dark-bg p-3 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-100 mb-2">{algorithmData.title}</h1>
                            <span className="algorithm-badge badge-graph">{algorithmData.category}</span>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h2 className="section-title">What is BFS?</h2>
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
                    <h2 className="section-title">Interactive Visualization</h2>
                    <p className="text-gray-400 mb-6">
                        Watch how BFS explores the graph level by level using a queue data structure.
                    </p>
                    <GraphVisualizer
                        nodes={defaultGraph.nodes}
                        edges={defaultGraph.edges}
                        visitedNodes={animationState.visitedNodes}
                        currentNode={animationState.currentNode}
                        activeEdges={animationState.activeEdges}
                        queue={animationState.queue}
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

export default BFS;
