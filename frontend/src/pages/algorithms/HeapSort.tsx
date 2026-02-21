import React, { useState, useEffect } from 'react';
import type { AlgorithmData } from '../../types';
import ProsConsSection from '../../components/algorithm/ProsConsSection';
import WorkingSection from '../../components/algorithm/WorkingSection';
import ExampleSection from '../../components/algorithm/ExampleSection';
import CodeEditor from '../../components/algorithm/CodeEditor';
import InputPanel from '../../components/algorithm/InputPanel';
import TreeVisualizer from '../../components/animations/TreeVisualizer';
import type { TreeNode } from '../../types';

const HeapSort: React.FC = () => {
    const defaultInputs = {
        array: [12, 11, 13, 5, 6, 7]
    };

    const [inputs, setInputs] = useState(defaultInputs);
    const [heapTree, setHeapTree] = useState<TreeNode | null>(null);
    const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);
    const [message, setMessage] = useState('Click Play to start Heap Sort');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const algorithmData: AlgorithmData = {
        id: 'heap-sort',
        title: 'Heap Sort',
        category: 'Searching & Sorting',
        definition: 'Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure. It divides the input into sorted and unsorted regions, iteratively extracting the maximum element from the unsorted region and placing it in the sorted region. It first builds a max heap, then repeatedly extracts the maximum.',
        realWorldUse: 'Heap Sort is used in systems requiring guaranteed O(n log n) performance, embedded systems with memory constraints, priority queue implementations, and when worst-case performance is critical. It\'s also used in hybrid sorting algorithms.',
        pros: [
            'Guaranteed O(n log n) time complexity',
            'In-place sorting (O(1) extra space)',
            'No worst-case degradation like Quick Sort',
            'Not affected by input distribution',
            'Good for large datasets'
        ],
        cons: [
            'Not stable (doesn\'t preserve order)',
            'Poor cache locality compared to Quick Sort',
            'Slower than Quick Sort in practice',
            'More complex to understand than simpler algorithms',
            'Constant factors are larger'
        ],
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(1)',
        workingSteps: [
            {
                step: 1,
                title: 'Build Max Heap',
                description: 'Convert the array into a max heap structure where each parent node is greater than its children. Start from the last non-leaf node and heapify upwards.',
                variables: [
                    { name: 'n', type: 'int', purpose: 'Size of heap' },
                    { name: 'i', type: 'int', purpose: 'Current node index' }
                ],
                codeSnippet: 'for i in range(n // 2 - 1, -1, -1):\n    heapify(arr, n, i)'
            },
            {
                step: 2,
                title: 'Heapify',
                description: 'Ensure the max heap property holds: parent is larger than children. If violated, swap parent with larger child and recursively heapify the affected subtree.',
                variables: [
                    { name: 'largest', type: 'int', purpose: 'Index of largest element among node and children' },
                    { name: 'left', type: 'int', purpose: 'Left child index = 2*i + 1' },
                    { name: 'right', type: 'int', purpose: 'Right child index = 2*i + 2' }
                ],
                codeSnippet: 'left = 2 * i + 1\nright = 2 * i + 2\nlargest = i\nif left < n and arr[left] > arr[largest]:\n    largest = left\nif right < n and arr[right] > arr[largest]:\n    largest = right\nif largest != i:\n    swap(arr[i], arr[largest])\n    heapify(arr, n, largest)'
            },
            {
                step: 3,
                title: 'Extract Maximum',
                description: 'The root of max heap is the largest element. Swap it with the last element, reduce heap size, and heapify the root.',
                codeSnippet: 'for i in range(n - 1, 0, -1):\n    swap(arr[0], arr[i])\n    heapify(arr, i, 0)'
            },
            {
                step: 4,
                title: 'Repeat',
                description: 'Repeat extraction until heap size becomes 1. Each extracted element is placed in its final sorted position.',
                codeSnippet: '# Continue until entire array is sorted'
            }
        ],
        defaultInputs,
        pythonCode: `def heap_sort(arr):
    """
    Sort an array using Heap Sort algorithm.
    Time: O(n log n), Space: O(1)
    """
    arr = arr.copy()
    n = len(arr)
    
    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    
    # Extract elements one by one
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]  # Swap
        heapify(arr, i, 0)
    
    return arr

def heapify(arr, n, i):
    """Heapify subtree rooted at index i"""
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    
    if left < n and arr[left] > arr[largest]:
        largest = left
    
    if right < n and arr[right] > arr[largest]:
        largest = right
    
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

# Test the algorithm
arr = ${JSON.stringify(inputs.array)}
print(f"Original array: {arr}")

sorted_arr = heap_sort(arr)
print(f"Sorted array: {sorted_arr}")`,
        examples: [
            {
                title: 'Example: Heap Sort [12, 11, 13, 5, 6, 7]',
                input: { array: [12, 11, 13, 5, 6, 7] },
                output: { array: [5, 6, 7, 11, 12, 13] },
                explanation: 'Build max heap: [13, 11, 12, 5, 6, 7]. Extract 13, heapify: [12, 11, 7, 5, 6]. Extract 12, heapify: [11, 6, 7, 5]. Extract 11, heapify: [7, 6, 5]. Extract 7, heapify: [6, 5]. Extract 6: [5]. Result: [5, 6, 7, 11, 12, 13].'
            }
        ]
    };

    const arrayToTree = (arr: number[]): TreeNode | null => {
        if (arr.length === 0) return null;

        const buildTree = (index: number): TreeNode | null => {
            if (index >= arr.length) return null;

            return {
                id: `node-${index}`,
                value: arr[index],
                left: buildTree(2 * index + 1) || undefined,
                right: buildTree(2 * index + 2) || undefined
            };
        };

        return buildTree(0);
    };

    useEffect(() => {
        const tree = arrayToTree(inputs.array);
        setHeapTree(tree);
    }, [inputs]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleReset = () => {
        setIsPlaying(false);
        setCurrentStep(0);
        setMessage('Click Play to start Heap Sort');
        setHighlightedNodes([]);
    };

    const handleStep = () => {
        // Simplified step logic
        setMessage(`Heap Sort step ${currentStep + 1}`);
        setCurrentStep(currentStep + 1);
    };

    const handleInputChange = (newInputs: any) => {
        const parsedArray = typeof newInputs.array === 'string'
            ? newInputs.array.split(',').map((v: string) => parseInt(v.trim())).filter((v: number) => !isNaN(v))
            : newInputs.array;

        setInputs({ array: parsedArray });
        handleReset();
    };

    return (
        <div className="min-h-screen bg-dark-bg p-3 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="card">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{algorithmData.title}</h1>
                    <span className="algorithm-badge badge-sorting">{algorithmData.category}</span>
                </div>

                <div className="card">
                    <h2 className="section-title">What is Heap Sort?</h2>
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
                    <h2 className="section-title">Heap Tree Visualization</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Heap Sort uses a binary heap structure. The array is visualized as a tree where each parent is larger than its children.
                    </p>
                    <TreeVisualizer
                        root={heapTree}
                        highlightedNodes={highlightedNodes}
                        message={message}
                        isPlaying={isPlaying}
                        onPlayPause={handlePlayPause}
                        onReset={handleReset}
                        onStep={handleStep}
                    />
                </div>

                <InputPanel
                    defaultInputs={defaultInputs}
                    onInputChange={handleInputChange}
                    inputFields={[
                        { key: 'array', label: 'Array (comma-separated)', type: 'array', placeholder: '12, 11, 13, 5, 6, 7' }
                    ]}
                />

                <CodeEditor defaultCode={algorithmData.pythonCode} />
                <ExampleSection examples={algorithmData.examples} />
            </div>
        </div>
    );
};

export default HeapSort;
