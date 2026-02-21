import React, { useState, useEffect } from 'react';
import type { AlgorithmData } from '../../types';
import ProsConsSection from '../../components/algorithm/ProsConsSection';
import WorkingSection from '../../components/algorithm/WorkingSection';
import ExampleSection from '../../components/algorithm/ExampleSection';
import CodeEditor from '../../components/algorithm/CodeEditor';
import InputPanel from '../../components/algorithm/InputPanel';
import ArrayVisualizer from '../../components/animations/ArrayVisualizer';

const QuickSort: React.FC = () => {
    const defaultInputs = {
        array: [10, 7, 8, 9, 1, 5]
    };

    const [inputs, setInputs] = useState(defaultInputs);
    const [animationState, setAnimationState] = useState({
        array: [...defaultInputs.array],
        currentIndex: -1,
        comparingIndices: [] as number[],
        sortedIndices: [] as number[],
        pivotIndex: -1,
        message: 'Click Play to start Quick Sort'
    });
    const [isPlaying, setIsPlaying] = useState(false);
    const [sortingSteps, setSortingSteps] = useState<any[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const algorithmData: AlgorithmData = {
        id: 'quick-sort',
        title: 'Quick Sort',
        category: 'Searching & Sorting',
        definition: 'Quick Sort is a highly efficient divide-and-conquer sorting algorithm. It works by selecting a \'pivot\' element and partitioning the array so that all elements smaller than the pivot come before it and all elements greater come after it. This process is recursively applied to the sub-arrays.',
        realWorldUse: 'Quick Sort is used in programming language libraries (like C++ STL sort), databases for sorting operations, numerical computations, and anywhere fast sorting is needed. It\'s one of the fastest sorting algorithms in practice, often faster than Merge Sort due to better cache performance.',
        pros: [
            'Very fast average performance O(n log n)',
            'In-place sorting (low memory usage)',
            'Cache-efficient due to good locality of reference',
            'Generally faster than Merge Sort in practice',
            'Widely used in production systems'
        ],
        cons: [
            'Worst case O(n²) with bad pivot selection',
            'Not stable (doesn\'t preserve relative order)',
            'Recursive implementation uses O(log n) stack space',
            'Performance depends on pivot selection strategy',
            'Can degrade to O(n²) on already sorted arrays'
        ],
        timeComplexity: 'O(n log n) average, O(n²) worst case',
        spaceComplexity: 'O(log n)',
        workingSteps: [
            {
                step: 1,
                title: 'Choose pivot',
                description: 'Select a pivot element from the array. Common strategies include: last element, first element, middle element, or random element. We\'ll use the last element.',
                variables: [
                    { name: 'pivot', type: 'int', purpose: 'The element used for partitioning' },
                    { name: 'low', type: 'int', purpose: 'Starting index of current partition' },
                    { name: 'high', type: 'int', purpose: 'Ending index of current partition' }
                ],
                codeSnippet: 'pivot = arr[high]'
            },
            {
                step: 2,
                title: 'Partition the array',
                description: 'Rearrange elements so that all elements smaller than pivot are on the left, and all larger elements are on the right. Keep track of partition index.',
                variables: [
                    { name: 'i', type: 'int', purpose: 'Partition index (position of last small element)' },
                    { name: 'j', type: 'int', purpose: 'Current element being examined' }
                ],
                codeSnippet: 'i = low - 1\nfor j in range(low, high):\n    if arr[j] < pivot:\n        i += 1\n        swap(arr[i], arr[j])'
            },
            {
                step: 3,
                title: 'Place pivot in correct position',
                description: 'After partitioning, place the pivot in its final sorted position (between smaller and larger elements).',
                codeSnippet: 'swap(arr[i + 1], arr[high])\npivot_index = i + 1\nreturn pivot_index'
            },
            {
                step: 4,
                title: 'Recursively sort sub-arrays',
                description: 'Apply Quick Sort recursively to the left sub-array (elements smaller than pivot) and right sub-array (elements larger than pivot).',
                codeSnippet: 'quick_sort(arr, low, pivot_index - 1)\nquick_sort(arr, pivot_index + 1, high)'
            }
        ],
        defaultInputs,
        pythonCode: `def quick_sort(arr, low=None, high=None):
    """
    Sort an array using Quick Sort algorithm.
    Time: O(n log n) average, O(n²) worst
    Space: O(log n)
    """
    if low is None:
        low = 0
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        # Partition and get pivot index
        pivot_index = partition(arr, low, high)
        
        # Recursively sort left and right sub-arrays
        quick_sort(arr, low, pivot_index - 1)
        quick_sort(arr, pivot_index + 1, high)
    
    return arr

def partition(arr, low, high):
    """Partition the array around pivot (last element)"""
    pivot = arr[high]
    i = low - 1
    
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

# Test the algorithm
arr = ${JSON.stringify(inputs.array)}
print(f"Original array: {arr}")

sorted_arr = quick_sort(arr.copy(), 0, len(arr) - 1)
print(f"Sorted array: {sorted_arr}")`,
        examples: [
            {
                title: 'Example: Sorting [10, 7, 8, 9, 1, 5]',
                input: { array: [10, 7, 8, 9, 1, 5] },
                output: { array: [1, 5, 7, 8, 9, 10] },
                explanation: 'Pivot=5 (last element). Partition: [1, 5, 10, 9, 7, 8]. Now 5 is at correct position. Recursively sort [1] (already sorted) and [10, 9, 7, 8]. For [10, 9, 7, 8], pivot=8, partition to [7, 8, 10, 9]. Continue recursively until entire array is sorted: [1, 5, 7, 8, 9, 10].'
            }
        ]
    };

    const quickSort = (arr: number[]): { steps: any[] } => {
        const steps: any[] = [];
        const sortedArray = [...arr];
        const sorted = new Set<number>();

        const partition = (low: number, high: number): number => {
            const pivot = sortedArray[high];
            steps.push({
                array: [...sortedArray],
                pivotIndex: high,
                comparingIndices: [high],
                sortedIndices: Array.from(sorted),
                message: `Pivot = ${pivot} (index ${high})`
            });

            let i = low - 1;

            for (let j = low; j < high; j++) {
                steps.push({
                    array: [...sortedArray],
                    pivotIndex: high,
                    comparingIndices: [j, high],
                    sortedIndices: Array.from(sorted),
                    message: `Comparing ${sortedArray[j]} with pivot ${pivot}`
                });

                if (sortedArray[j] < pivot) {
                    i++;
                    [sortedArray[i], sortedArray[j]] = [sortedArray[j], sortedArray[i]];

                    steps.push({
                        array: [...sortedArray],
                        pivotIndex: high,
                        comparingIndices: [i, j],
                        sortedIndices: Array.from(sorted),
                        message: `Swapped ${sortedArray[j]} and ${sortedArray[i]}`
                    });
                }
            }

            [sortedArray[i + 1], sortedArray[high]] = [sortedArray[high], sortedArray[i + 1]];
            sorted.add(i + 1);

            steps.push({
                array: [...sortedArray],
                pivotIndex: i + 1,
                comparingIndices: [],
                sortedIndices: Array.from(sorted),
                message: `Pivot ${pivot} placed at correct position ${i + 1}`
            });

            return i + 1;
        };

        const sort = (low: number, high: number) => {
            if (low < high) {
                const pi = partition(low, high);
                sort(low, pi - 1);
                sort(pi + 1, high);
            } else if (low === high) {
                sorted.add(low);
            }
        };

        sort(0, sortedArray.length - 1);

        steps.push({
            array: [...sortedArray],
            pivotIndex: -1,
            comparingIndices: [],
            sortedIndices: Array.from({ length: sortedArray.length }, (_, i) => i),
            message: '✓ Array is now sorted!'
        });

        return { steps };
    };

    const handlePlayPause = () => {
        if (!isPlaying && sortingSteps.length === 0) {
            const { steps } = quickSort(inputs.array);
            setSortingSteps(steps);
            setCurrentStepIndex(0);
        }
        setIsPlaying(!isPlaying);
    };

    const handleReset = () => {
        setIsPlaying(false);
        setCurrentStepIndex(0);
        setSortingSteps([]);
        setAnimationState({
            array: [...inputs.array],
            currentIndex: -1,
            comparingIndices: [],
            sortedIndices: [],
            pivotIndex: -1,
            message: 'Click Play to start Quick Sort'
        });
    };

    const handleStep = () => {
        if (currentStepIndex < sortingSteps.length) {
            const step = sortingSteps[currentStepIndex];
            setAnimationState(step);
            setCurrentStepIndex(currentStepIndex + 1);
        }
    };

    useEffect(() => {
        if (!isPlaying || sortingSteps.length === 0) return;

        const interval = setInterval(() => {
            if (currentStepIndex >= sortingSteps.length) {
                setIsPlaying(false);
                return;
            }
            handleStep();
        }, 900);

        return () => clearInterval(interval);
    }, [isPlaying, currentStepIndex, sortingSteps]);

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
                    <h2 className="section-title">What is Quick Sort?</h2>
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
                        Watch Quick Sort partition the array around pivot elements.
                    </p>
                    <ArrayVisualizer
                        array={animationState.array}
                        currentIndex={animationState.pivotIndex}
                        comparingIndices={animationState.comparingIndices}
                        sortedIndices={animationState.sortedIndices}
                        message={animationState.message}
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
                        { key: 'array', label: 'Array (comma-separated)', type: 'array', placeholder: '10, 7, 8, 9, 1, 5' }
                    ]}
                />

                <CodeEditor defaultCode={algorithmData.pythonCode} />
                <ExampleSection examples={algorithmData.examples} />
            </div>
        </div>
    );
};

export default QuickSort;
