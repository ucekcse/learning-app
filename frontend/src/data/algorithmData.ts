

export const algorithmCategories = [
    {
        name: 'Searching & Sorting',
        algorithms: ['linear-search', 'binary-search', 'pattern-matching', 'insertion-sort', 'heap-sort', 'merge-sort', 'quick-sort']
    },
    {
        name: 'Graph Algorithms',
        algorithms: ['bfs', 'dfs', 'dijkstra', 'prim', 'floyd', 'warshall']
    },
    {
        name: 'Algorithm Design',
        algorithms: ['divide-conquer', 'n-queens']
    },
    {
        name: 'Advanced Algorithms',
        algorithms: ['tsp-exact', 'tsp-approx', 'kth-smallest']
    },
    {
        name: 'CPU Scheduling',
        algorithms: ['fcfs', 'sjf', 'srtf', 'round-robin', 'priority-aging']
    }
];

export const algorithmMetadata: Record<string, { title: string; category: string }> = {
    'linear-search': { title: 'Linear Search', category: 'Searching & Sorting' },
    'binary-search': { title: 'Recursive Binary Search', category: 'Searching & Sorting' },
    'pattern-matching': { title: 'Naive Pattern Matching', category: 'Searching & Sorting' },
    'insertion-sort': { title: 'Insertion Sort', category: 'Searching & Sorting' },
    'heap-sort': { title: 'Heap Sort', category: 'Searching & Sorting' },
    'merge-sort': { title: 'Merge Sort', category: 'Searching & Sorting' },
    'quick-sort': { title: 'Quick Sort', category: 'Searching & Sorting' },
    'bfs': { title: 'Breadth First Search', category: 'Graph Algorithms' },
    'dfs': { title: 'Depth First Search', category: 'Graph Algorithms' },
    'dijkstra': { title: "Dijkstra's Algorithm", category: 'Graph Algorithms' },
    'prim': { title: "Prim's Algorithm", category: 'Graph Algorithms' },
    'floyd': { title: "Floyd's Algorithm", category: 'Graph Algorithms' },
    'warshall': { title: "Warshall's Algorithm", category: 'Graph Algorithms' },
    'divide-conquer': { title: 'Divide & Conquer (Max/Min)', category: 'Algorithm Design' },
    'n-queens': { title: 'N-Queens Problem', category: 'Algorithm Design' },
    'tsp-exact': { title: 'TSP - Exact Solution', category: 'Advanced Algorithms' },
    'tsp-approx': { title: 'TSP - Approximation', category: 'Advanced Algorithms' },
    'kth-smallest': { title: 'Kth Smallest Element', category: 'Advanced Algorithms' },
    'fcfs': { title: 'First Come First Served', category: 'CPU Scheduling' },
    'sjf': { title: 'Shortest Job First', category: 'CPU Scheduling' },
    'srtf': { title: 'Shortest Remaining Time First', category: 'CPU Scheduling' },
    'round-robin': { title: 'Round Robin', category: 'CPU Scheduling' },
    'priority-aging': { title: 'Priority Scheduling with Aging', category: 'CPU Scheduling' },
};
