import React, { useState, useEffect } from 'react';
import type { AlgorithmData } from '../../types';
import ProsConsSection from '../../components/algorithm/ProsConsSection';
import WorkingSection from '../../components/algorithm/WorkingSection';
import ExampleSection from '../../components/algorithm/ExampleSection';
import CodeEditor from '../../components/algorithm/CodeEditor';
import InputPanel from '../../components/algorithm/InputPanel';
import ArrayVisualizer from '../../components/animations/ArrayVisualizer';

const MergeSort: React.FC = () => {
    const defaultInputs = {
        array: [38, 27, 43, 3, 9, 82, 10]
    };

    const [inputs, setInputs] = useState(defaultInputs);
    const [animationState, setAnimationState] = useState({
        array: [...defaultInputs.array],
        currentIndex: -1,
        comparingIndices: [] as number[],
        sortedIndices: [] as number[],
        message: 'Click Play to start Merge Sort'
    });
    const [isPlaying, setIsPlaying] = useState(false);

    const algorithmData: AlgorithmData = {
        id: 'merge-sort',
        title: 'Merge Sort',
        category: 'Searching & Sorting',
        definition: 'Merge Sort is an efficient, stable, divide-and-conquer sorting algorithm. It divides the array into two halves, recursively sorts them, and then merges the sorted halves back together. The merge operation compares elements from both halves and places them in the correct order.',
        realWorldUse: 'Merge Sort is used in external sorting (sorting large files that don\'t fit in memory), in databases for sorting large datasets, in version control systems for merging changes, and in applications requiring stable sorting where the relative order of equal elements must be preserved.',
        pros: [
            'Guaranteed O(n log n) time complexity in all cases',
            'Stable sorting algorithm (preserves relative order)',
            'Predictable performance regardless of input',
            'Excellent for sorting linked lists',
            'Works well with external sorting (large datasets)'
        ],
        cons: [
            'Requires O(n) extra space for temporary arrays',
            'Not in-place sorting algorithm',
            'Slower than Quick Sort in practice for arrays',
            'Recursive implementation can cause stack overflow for very large arrays',
            'More complex to implement than simpler algorithms'
        ],
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        workingSteps: [
            {
                step: 1,
                title: 'Divide the array',
                description: 'Split the array into two halves recursively until each subarray contains only one element. A single element is considered sorted by definition.',
                variables: [
                    { name: 'left', type: 'int', purpose: 'Starting index of current subarray' },
                    { name: 'right', type: 'int', purpose: 'Ending index of current subarray' },
                    { name: 'mid', type: 'int', purpose: 'Middle point to divide the array' }
                ],
                codeSnippet: 'mid = (left + right) // 2\nmerge_sort(arr, left, mid)\nmerge_sort(arr, mid + 1, right)'
            },
            {
                step: 2,
                title: 'Conquer (Sort recursively)',
                description: 'Recursively sort the left half and right half of the array. The recursion continues until we reach base case (single element).',
                codeSnippet: '# Recursively sort left and right halves\nif left < right:\n    merge_sort(left_half)\n    merge_sort(right_half)'
            },
            {
                step: 3,
                title: 'Merge sorted halves',
                description: 'Merge the two sorted halves by comparing elements from both halves and placing them in correct order. Use two pointers to track positions in both halves.',
                variables: [
                    { name: 'i', type: 'int', purpose: 'Pointer for left subarray' },
                    { name: 'j', type: 'int', purpose: 'Pointer for right subarray' },
                    { name: 'k', type: 'int', purpose: 'Pointer for merged array' }
                ],
                codeSnippet: 'while i < len(left) and j < len(right):\n    if left[i] <= right[j]:\n        arr[k] = left[i]\n        i += 1\n    else:\n        arr[k] = right[j]\n        j += 1\n    k += 1'
            },
            {
                step: 4,
                title: 'Copy remaining elements',
                description: 'After one half is exhausted, copy all remaining elements from the other half to the merged array.',
                codeSnippet: 'while i < len(left):\n    arr[k] = left[i]\n    i += 1\n    k += 1'
            }
        ],
        defaultInputs,
        pythonCode: `def merge_sort(arr):
    """
    Sorts an array using the Merge Sort algorithm.
    Time Complexity: O(n log n)
    Space Complexity: O(n)
    """
    if len(arr) <= 1:
        return arr
    
    # Divide
    mid = len(arr) // 2
    left = arr[:mid]
    right = arr[mid:]
    
    # Conquer
    left = merge_sort(left)
    right = merge_sort(right)
    
    # Merge
    return merge(left, right)

def merge(left, right):
    """Merge two sorted arrays into one sorted array."""
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Test the algorithm
arr = ${JSON.stringify(inputs.array)}
print(f"Original array: {arr}")

sorted_arr = merge_sort(arr.copy())
print(f"Sorted array: {sorted_arr}")`,
        examples: [
            {
                title: 'Example: Sorting [38, 27, 43, 3, 9, 82, 10]',
                input: { array: [38, 27, 43, 3, 9, 82, 10] },
                output: { array: [3, 9, 10, 27, 38, 43, 82] },
                explanation: 'The array is divided into [38, 27, 43, 3] and [9, 82, 10]. Each half is recursively divided until single elements remain. Then, pairs are merged: [27, 38], [3, 43], [9, 82], [10]. These are merged into [3, 27, 38, 43] and [9, 10, 82], and finally merged into the sorted array [3, 9, 10, 27, 38, 43, 82].'
            }
        ]
    };

    const mergeSort = (arr: number[]): { steps: any[], sorted: number[] } => {
        const steps: any[] = [];
        const sortedArray = [...arr];

        const mergeSortHelper = (arr: number[], left: number, right: number) => {
            if (left >= right) return;

            const mid = Math.floor((left + right) / 2);

            steps.push({
                message: `Dividing array from index ${left} to ${right}`,
                comparingIndices: Array.from({ length: right - left + 1 }, (_, i) => left + i)
            });

            mergeSortHelper(arr, left, mid);
            mergeSortHelper(arr, mid + 1, right);
            merge(arr, left, mid, right);
        };

        const merge = (arr: number[], left: number, mid: number, right: number) => {
            const leftArr = arr.slice(left, mid + 1);
            const rightArr = arr.slice(mid + 1, right + 1);

            let i = 0, j = 0, k = left;

            while (i < leftArr.length && j < rightArr.length) {
                steps.push({
                    message: `Merging: comparing ${leftArr[i]} and ${rightArr[j]}`,
                    comparingIndices: [k]
                });

                if (leftArr[i] <= rightArr[j]) {
                    arr[k++] = leftArr[i++];
                } else {
                    arr[k++] = rightArr[j++];
                }
            }

            while (i < leftArr.length) arr[k++] = leftArr[i++];
            while (j < rightArr.length) arr[k++] = rightArr[j++];

            steps.push({
                message: `Merged subarray from index ${left} to ${right}`,
                sortedIndices: Array.from({ length: right - left + 1 }, (_, i) => left + i)
            });
        };

        mergeSortHelper(sortedArray, 0, sortedArray.length - 1);
        return { steps, sorted: sortedArray };
    };

    const [sortingSteps, setSortingSteps] = useState<any[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const handlePlayPause = () => {
        if (!isPlaying && sortingSteps.length === 0) {
            const { steps } = mergeSort(inputs.array);
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
            message: 'Click Play to start Merge Sort'
        });
    };

    const handleStep = () => {
        if (currentStepIndex < sortingSteps.length) {
            const step = sortingSteps[currentStepIndex];
            setAnimationState(prev => ({
                ...prev,
                comparingIndices: step.comparingIndices || [],
                sortedIndices: step.sortedIndices || prev.sortedIndices,
                message: step.message
            }));
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
        }, 800);

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
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-100 mb-2">{algorithmData.title}</h1>
                            <span className="algorithm-badge badge-sorting">{algorithmData.category}</span>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h2 className="section-title">What is Merge Sort?</h2>
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
                        Watch how Merge Sort divides the array recursively and merges sorted subarrays.
                    </p>
                    <ArrayVisualizer
                        array={inputs.array}
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
                        { key: 'array', label: 'Array (comma-separated)', type: 'array', placeholder: '38, 27, 43, 3, 9, 82, 10' }
                    ]}
                />

                <CodeEditor defaultCode={algorithmData.pythonCode} />
                <ExampleSection examples={algorithmData.examples} />
            </div>
        </div>
    );
};

export default MergeSort;
