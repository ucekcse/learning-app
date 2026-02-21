import React, { useState, useEffect } from 'react';
import type { AlgorithmData, TreeNode } from '../../types';
import ProsConsSection from '../../components/algorithm/ProsConsSection';
import WorkingSection from '../../components/algorithm/WorkingSection';
import ExampleSection from '../../components/algorithm/ExampleSection';
import CodeEditor from '../../components/algorithm/CodeEditor';
import InputPanel from '../../components/algorithm/InputPanel';
import TreeVisualizer from '../../components/animations/TreeVisualizer';

const BinarySearch: React.FC = () => {
    const defaultInputs = {
        array: [11, 22, 33, 44, 55, 66, 77, 88, 99],
        target: 55
    };

    const [inputs, setInputs] = useState(defaultInputs);
    const [treeRoot, setTreeRoot] = useState<TreeNode | null>(null);
    const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);
    const [message, setMessage] = useState('Click Play to start binary search');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [searchSteps, setSearchSteps] = useState<any[]>([]);

    const algorithmData: AlgorithmData = {
        id: 'binary-search',
        title: 'Recursive Binary Search',
        category: 'Searching & Sorting',
        definition: 'Binary Search is an efficient searching algorithm that finds a target value within a sorted array by repeatedly dividing the search interval in half. It uses a divide-and-conquer approach, comparing the target with the middle element and recursively searching either the left or right half.',
        realWorldUse: 'Binary Search is used in database indexing, searching in sorted datasets, dictionary lookups, finding elements in sorted lists, debugging (finding the commit that introduced a bug), and any scenario where you have sorted data and need fast lookups.',
        pros: [
            'Very efficient with O(log n) time complexity',
            'Much faster than linear search for large datasets',
            'Predictable performance',
            'Simple recursive implementation',
            'Minimal memory usage (O(1) for iterative, O(log n) for recursive)'
        ],
        cons: [
            'Requires the array to be sorted beforehand',
            'Not suitable for unsorted data',
            'Not efficient for small arrays',
            'Recursive version can cause stack overflow for very large arrays',
            'Requires random access to elements (not suitable for linked lists)'
        ],
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(log n) for recursive, O(1) for iterative',
        workingSteps: [
            {
                step: 1,
                title: 'Check base case',
                description: 'If the search space is empty (left > right), the element is not found. Return -1.',
                variables: [
                    { name: 'left', type: 'int', purpose: 'Start index of current search range' },
                    { name: 'right', type: 'int', purpose: 'End index of current search range' }
                ],
                codeSnippet: 'if left > right:\n    return -1  # Element not found'
            },
            {
                step: 2,
                title: 'Find middle element',
                description: 'Calculate the middle index of the current search range. This is where we will compare with the target.',
                variables: [
                    { name: 'mid', type: 'int', purpose: 'Middle index of current range' }
                ],
                codeSnippet: 'mid = (left + right) // 2'
            },
            {
                step: 3,
                title: 'Compare with target',
                description: 'Compare the middle element with the target. If they match, we found the element! If target is smaller, search the left half. If target is larger, search the right half.',
                variables: [
                    { name: 'arr[mid]', type: 'int', purpose: 'Middle element being compared' }
                ],
                codeSnippet: 'if arr[mid] == target:\n    return mid\nelif target < arr[mid]:\n    # Search left half\n    return binary_search(arr, target, left, mid - 1)\nelse:\n    # Search right half\n    return binary_search(arr, target, mid + 1, right)'
            },
            {
                step: 4,
                title: 'Recursive search',
                description: 'Recursively call binary search on the appropriate half. This continues until either the element is found or the search space is exhausted.',
                codeSnippet: '# Recursion continues until base case is reached'
            }
        ],
        defaultInputs,
        pythonCode: `def binary_search(arr, target, left=None, right=None):
    """
    Perform recursive binary search to find target in sorted arr.
    Returns the index if found, -1 otherwise.
    """
    if left is None:
        left = 0
    if right is None:
        right = len(arr) - 1
    
    # Base case: search space is empty
    if left > right:
        return -1
    
    # Find middle
    mid = (left + right) // 2
    
    # Compare with target
    if arr[mid] == target:
        return mid
    elif target < arr[mid]:
        # Search left half
        return binary_search(arr, target, left, mid - 1)
    else:
        # Search right half
        return binary_search(arr, target, mid + 1, right)

# Test the algorithm
arr = ${JSON.stringify(inputs.array)}
target = ${inputs.target}

result = binary_search(arr, target)

if result != -1:
    print(f"Element {target} found at index {result}")
else:
    print(f"Element {target} not found in the array")

# Show the array
print(f"\\nSorted Array: {arr}")
print(f"Target: {target}")`,
        examples: [
            {
                title: 'Example: Finding element in sorted array',
                input: { array: [11, 22, 33, 44, 55, 66, 77, 88, 99], target: 55 },
                output: { index: 4, message: 'Element 55 found at index 4' },
                explanation: 'Start with middle element (55 at index 4). It matches the target, so return index 4. Total comparisons: 1. If we were searching for 77, we would check mid=4 (55), then search right half, find new mid=6 (77), and return 6. Total comparisons: 2.'
            }
        ]
    };

    const buildSearchTree = (arr: number[], target: number): TreeNode[] => {
        const steps: any[] = [];
        const nodes: TreeNode[] = [];
        let nodeId = 0;

        const search = (left: number, right: number, depth: number): TreeNode | undefined => {
            if (left > right) {
                steps.push({ message: `Search space empty (left=${left}, right=${right})`, nodeIds: [] });
                return undefined;
            }

            const mid = Math.floor((left + right) / 2);
            const currentNodeId = `node-${nodeId++}`;
            const value = arr[mid];

            const node: TreeNode = {
                id: currentNodeId,
                value: value
            };

            nodes.push(node);
            steps.push({
                message: `Checking index ${mid}: ${value} ${value === target ? '== ' : value > target ? '> ' : '< '}${target}`,
                nodeIds: [currentNodeId]
            });

            if (value === target) {
                steps.push({ message: `✓ Found ${target} at index ${mid}!`, nodeIds: [currentNodeId] });
                return node;
            } else if (target < value) {
                steps.push({ message: `Target ${target} < ${value}, searching left half`, nodeIds: [currentNodeId] });
                node.left = search(left, mid - 1, depth + 1);
            } else {
                steps.push({ message: `Target ${target} > ${value}, searching right half`, nodeIds: [currentNodeId] });
                node.right = search(mid + 1, right, depth + 1);
            }

            return node;
        };

        const root = search(0, arr.length - 1, 0);
        setSearchSteps(steps);
        return root ? [root] : [];
    };

    useEffect(() => {
        if (inputs.array.length > 0) {
            const [root] = buildSearchTree(inputs.array, inputs.target);
            setTreeRoot(root || null);
        }
    }, [inputs]);

    useEffect(() => {
        if (!isPlaying || searchSteps.length === 0) return;

        const interval = setInterval(() => {
            if (currentStep >= searchSteps.length) {
                setIsPlaying(false);
                return;
            }

            const step = searchSteps[currentStep];
            setMessage(step.message);
            setHighlightedNodes(step.nodeIds);
            setCurrentStep(currentStep + 1);
        }, 1200);

        return () => clearInterval(interval);
    }, [isPlaying, currentStep, searchSteps]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleReset = () => {
        setIsPlaying(false);
        setCurrentStep(0);
        setMessage('Click Play to start binary search');
        setHighlightedNodes([]);
    };

    const handleStep = () => {
        if (currentStep < searchSteps.length) {
            const step = searchSteps[currentStep];
            setMessage(step.message);
            setHighlightedNodes(step.nodeIds);
            setCurrentStep(currentStep + 1);
        }
    };

    const handleInputChange = (newInputs: any) => {
        const parsedArray = typeof newInputs.array === 'string'
            ? newInputs.array.split(',').map((v: string) => parseInt(v.trim())).filter((v: number) => !isNaN(v)).sort((a: number, b: number) => a - b)
            : [...newInputs.array].sort((a, b) => a - b);

        setInputs({ array: parsedArray, target: newInputs.target });
        handleReset();
    };

    return (
        <div className="min-h-screen bg-dark-bg p-3 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-100 mb-2">{algorithmData.title}</h1>
                            <span className="algorithm-badge badge-searching">{algorithmData.category}</span>
                        </div>
                    </div>
                </div>

                {/* Definition */}
                <div className="card">
                    <h2 className="section-title">What is Binary Search?</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">{algorithmData.definition}</p>
                    <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-blue-200 mb-2">Real-World Applications</h3>
                        <p className="text-blue-100 text-sm">{algorithmData.realWorldUse}</p>
                    </div>
                </div>

                {/* Pros & Cons */}
                <ProsConsSection
                    pros={algorithmData.pros}
                    cons={algorithmData.cons}
                    timeComplexity={algorithmData.timeComplexity}
                    spaceComplexity={algorithmData.spaceComplexity}
                />

                {/* How It Works */}
                <WorkingSection steps={algorithmData.workingSteps} />

                {/* Visualization */}
                <div className="card">
                    <h2 className="section-title">Recursion Tree Visualization</h2>
                    <p className="text-gray-400 mb-6">
                        Watch how Binary Search recursively divides the search space. Each node represents a comparison.
                    </p>
                    <TreeVisualizer
                        root={treeRoot}
                        highlightedNodes={highlightedNodes}
                        message={message}
                        isPlaying={isPlaying}
                        onPlayPause={handlePlayPause}
                        onReset={handleReset}
                        onStep={handleStep}
                    />
                </div>

                {/* Input Panel */}
                <InputPanel
                    defaultInputs={defaultInputs}
                    onInputChange={handleInputChange}
                    inputFields={[
                        { key: 'array', label: 'Sorted Array (comma-separated)', type: 'array', placeholder: '11, 22, 33, 44, 55, 66, 77, 88, 99' },
                        { key: 'target', label: 'Target Value', type: 'number', placeholder: '55' }
                    ]}
                />

                {/* Code Editor */}
                <CodeEditor defaultCode={algorithmData.pythonCode} />

                {/* Examples */}
                <ExampleSection examples={algorithmData.examples} />
            </div>
        </div>
    );
};

export default BinarySearch;
