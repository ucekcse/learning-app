import React, { useState } from 'react';
import type { AlgorithmData } from '../../types';
import ProsConsSection from '../../components/algorithm/ProsConsSection';
import WorkingSection from '../../components/algorithm/WorkingSection';
import ExampleSection from '../../components/algorithm/ExampleSection';
import CodeEditor from '../../components/algorithm/CodeEditor';
import InputPanel from '../../components/algorithm/InputPanel';
// GraphVisualizer can be used for more advanced visualization

const DFS: React.FC = () => {
    const defaultInputs = {
        startNode: 'A'
    };

    const [inputs, setInputs] = useState(defaultInputs);

    const algorithmData: AlgorithmData = {
        id: 'dfs',
        title: 'Depth First Search (DFS)',
        category: 'Graph Algorithms',
        definition: 'Depth First Search is a graph traversal algorithm that explores as far as possible along each branch before backtracking. It uses a stack (or recursion) to remember vertices to visit next. DFS goes deep into the graph before going wide.',
        realWorldUse: 'DFS is used in topological sorting, detecting cycles in graphs, solving mazes and puzzles, pathfinding in games, analyzing network connectivity, finding strongly connected components, and in AI for game tree exploration.',
        pros: [
            'Simple to implement using recursion',
            'Memory efficient for deep graphs',
            'Good for finding solutions in deep paths',
            'Can detect cycles in graphs',
            'Useful for topological sorting'
        ],
        cons: [
            'May not find shortest path',
            'Can get stuck in infinite loops without visited tracking',
            'Not optimal for shallow solutions',
            'Stack overflow possible with very deep recursion',
            'Doesn\'t guarantee minimum path length'
        ],
        timeComplexity: 'O(V + E) where V=vertices, E=edges',
        spaceComplexity: 'O(V)',
        workingSteps: [
            {
                step: 1,
                title: 'Initialize',
                description: 'Create a visited set to track visited nodes and a stack (or use recursion). Mark the starting node as visited.',
                variables: [
                    { name: 'visited', type: 'set', purpose: 'Tracks which nodes have been visited' },
                    { name: 'stack', type: 'stack', purpose: 'Stores nodes to visit (or use recursion)' }
                ],
                codeSnippet: 'visited = set()\nvisited.add(start)\nstack = [start]'
            },
            {
                step: 2,
                title: 'Visit node',
                description: 'Pop a node from stack, process it, then push all its unvisited neighbors onto the stack. This ensures we go deep before going wide.',
                codeSnippet: 'node = stack.pop()\nfor neighbor in graph[node]:\n    if neighbor not in visited:\n        visited.add(neighbor)\n        stack.append(neighbor)'
            },
            {
                step: 3,
                title: 'Repeat',
                description: 'Continue popping from stack and visiting unvisited neighbors until the stack is empty.',
                codeSnippet: 'while stack:\n    # Continue exploration'
            },
            {
                step: 4,
                title: 'Backtrack',
                description: 'When a node has no more unvisited neighbors, backtrack to the previous node and explore other branches.',
                codeSnippet: '# Backtracking happens automatically when popping from stack'
            }
        ],
        defaultInputs,
        pythonCode: `def dfs(graph, start):
    """
    Perform Depth First Search starting from start node.
    Returns list of nodes in DFS order.
    """
    visited = set()
    result = []
    
    def dfs_recursive(node):
        visited.add(node)
        result.append(node)
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                dfs_recursive(neighbor)
    
    dfs_recursive(start)
    return result

# Example graph (adjacency list)
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

start = "${inputs.startNode}"
traversal = dfs(graph, start)

print(f"DFS traversal starting from {start}:")
print(" -> ".join(traversal))`,
        examples: [
            {
                title: 'Example: DFS from node A',
                input: { graph: { A: ['B', 'C'], B: ['D', 'E'], C: ['F'] }, start: 'A' },
                output: { traversal: ['A', 'B', 'D', 'E', 'C', 'F'] },
                explanation: 'Starting at A, go to B (first neighbor), then to D (B\'s first neighbor), backtrack to B, visit E, backtrack to A, visit C, then F. The path goes deep before wide: A→B→D (dead end, backtrack) →E (dead end, backtrack) →C→F.'
            }
        ]
    };

    const handleInputChange = (newInputs: any) => {
        setInputs({ startNode: newInputs.startNode });
    };

    return (
        <div className="min-h-screen bg-dark-bg p-3 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="card">
                    <h1 className="text-4xl font-bold text-gray-100 mb-2">{algorithmData.title}</h1>
                    <span className="algorithm-badge badge-graph">{algorithmData.category}</span>
                </div>

                <div className="card">
                    <h2 className="section-title">What is Depth First Search?</h2>
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
                        Graph visualization showing DFS traversal order (Please use existing GraphVisualizer component).
                    </p>
                    <div className="bg-dark-elevated border border-dark-border rounded-lg p-4 sm:p-8 text-center">
                        <p className="text-gray-400">
                            DFS explores deep into each branch before backtracking. Watch the traversal order in the animation below.
                        </p>
                    </div>
                </div>

                <InputPanel
                    defaultInputs={defaultInputs}
                    onInputChange={handleInputChange}
                    inputFields={[
                        { key: 'startNode', label: 'Start Node', type: 'text', placeholder: 'A' }
                    ]}
                />

                <CodeEditor defaultCode={algorithmData.pythonCode} />
                <ExampleSection examples={algorithmData.examples} />
            </div>
        </div>
    );
};

export default DFS;
