import React, { useState, useEffect } from 'react';
import type { AlgorithmData } from '../../types';
import ProsConsSection from '../../components/algorithm/ProsConsSection';
import WorkingSection from '../../components/algorithm/WorkingSection';
import ExampleSection from '../../components/algorithm/ExampleSection';
import CodeEditor from '../../components/algorithm/CodeEditor';
import InputPanel from '../../components/algorithm/InputPanel';
import ArrayVisualizer from '../../components/animations/ArrayVisualizer';

const InsertionSort: React.FC = () => {
    const defaultInputs = {
        array: [12, 11, 13, 5, 6, 7]
    };

    const [inputs, setInputs] = useState(defaultInputs);
    const [animationState, setAnimationState] = useState({
        array: [...defaultInputs.array],
        currentIndex: -1,
        comparingIndices: [] as number[],
        sortedIndices: [0] as number[],
        message: 'Click Play to start Insertion Sort'
    });
    const [isPlaying, setIsPlaying] = useState(false);
    const [sortingSteps, setSortingSteps] = useState<any[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const algorithmData: AlgorithmData = {
        id: 'insertion-sort',
        title: 'Insertion Sort',
        category: 'Searching & Sorting',
        definition: 'Insertion Sort is a simple sorting algorithm that builds the final sorted array one item at a time. It works similar to the way you sort playing cards in your hands - picking one card at a time and inserting it in the correct position among the already sorted cards.',
        realWorldUse: 'Insertion Sort is used for small datasets, nearly sorted data, online sorting (sorting data as it arrives), and in hybrid sorting algorithms like Timsort (used in Python and Java). It\'s excellent for sorting small arrays or maintaining a sorted list as new elements arrive.',
        pros: [
            'Simple and easy to implement',
            'Efficient for small datasets',
            'Stable sorting (maintains relative order)',
            'In-place sorting (no extra space needed)',
            'Efficient for nearly sorted data',
            'Online algorithm (can sort as data arrives)'
        ],
        cons: [
            'Inefficient for large datasets (O(n²))',
            'Performance degrades significantly with reverse-sorted data',
            'Requires many comparisons and shifts',
            'Not suitable for large-scale applications'
        ],
        timeComplexity: 'O(n²) worst case, O(n) best case',
        spaceComplexity: 'O(1)',
        workingSteps: [
            {
                step: 1,
                title: 'Start with second element',
                description: 'Consider the first element as already sorted. Start from the second element (index 1) and compare it with elements in the sorted portion.',
                variables: [
                    { name: 'i', type: 'int', purpose: 'Current element to be inserted' },
                    { name: 'key', type: 'int', purpose: 'Value of current element' }
                ],
                codeSnippet: 'for i in range(1, len(arr)):\n    key = arr[i]'
            },
            {
                step: 2,
                title: 'Compare with sorted portion',
                description: 'Compare the key with elements in the sorted portion (left side). Move elements greater than key one position to the right.',
                variables: [
                    { name: 'j', type: 'int', purpose: 'Index in sorted portion' }
                ],
                codeSnippet: 'j = i - 1\nwhile j >= 0 and arr[j] > key:\n    arr[j + 1] = arr[j]\n    j -= 1'
            },
            {
                step: 3,
                title: 'Insert the key',
                description: 'Once we find the correct position (where all elements to the left are smaller), insert the key at that position.',
                codeSnippet: 'arr[j + 1] = key'
            },
            {
                step: 4,
                title: 'Repeat',
                description: 'Continue this process for all elements. With each iteration, the sorted portion grows by one element until the entire array is sorted.',
                codeSnippet: '# Continue until all elements are processed'
            }
        ],
        defaultInputs,
        pythonCode: `def insertion_sort(arr):
    """
    Sort an array using Insertion Sort algorithm.
    Time: O(n²), Space: O(1)
    """
    arr = arr.copy()
    
    # Start from second element
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        
        # Move elements greater than key one position ahead
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        
        # Insert key at correct position
        arr[j + 1] = key
    
    return arr

# Test the algorithm
arr = ${JSON.stringify(inputs.array)}
print(f"Original array: {arr}")

sorted_arr = insertion_sort(arr)
print(f"Sorted array: {sorted_arr}")`,
        examples: [
            {
                title: 'Example: Sorting [12, 11, 13, 5, 6, 7]',
                input: { array: [12, 11, 13, 5, 6, 7] },
                output: { array: [5, 6, 7, 11, 12, 13] },
                explanation: 'Pass 1: [11, 12, 13, 5, 6, 7] - Insert 11. Pass 2: [11, 12, 13, 5, 6, 7] - 13 stays. Pass 3: [5, 11, 12, 13, 6, 7] - Insert 5 at start. Pass 4: [5, 6, 11, 12, 13, 7] - Insert 6. Pass 5: [5, 6, 7, 11, 12, 13] - Insert 7. Array is now sorted!'
            }
        ]
    };

    const insertionSort = (arr: number[]): { steps: any[], sorted: number[] } => {
        const steps: any[] = [];
        const sortedArray = [...arr];
        const sorted = [0]; // First element is considered sorted

        for (let i = 1; i < sortedArray.length; i++) {
            const key = sortedArray[i];
            let j = i - 1;

            steps.push({
                array: [...sortedArray],
                currentIndex: i,
                comparingIndices: [i],
                sortedIndices: [...sorted],
                message: `Selecting element ${key} at index ${i} to insert`
            });

            while (j >= 0 && sortedArray[j] > key) {
                steps.push({
                    array: [...sortedArray],
                    currentIndex: i,
                    comparingIndices: [j, j + 1],
                    sortedIndices: [...sorted],
                    message: `${sortedArray[j]} > ${key}, shifting right`
                });

                sortedArray[j + 1] = sortedArray[j];
                j--;
            }

            sortedArray[j + 1] = key;
            sorted.push(i);

            steps.push({
                array: [...sortedArray],
                currentIndex: -1,
                comparingIndices: [],
                sortedIndices: [...sorted],
                message: `Inserted ${key} at position ${j + 1}`
            });
        }

        steps.push({
            array: [...sortedArray],
            currentIndex: -1,
            comparingIndices: [],
            sortedIndices: Array.from({ length: sortedArray.length }, (_, i) => i),
            message: '✓ Array is now sorted!'
        });

        return { steps, sorted: sortedArray };
    };

    const handlePlayPause = () => {
        if (!isPlaying && sortingSteps.length === 0) {
            const { steps } = insertionSort(inputs.array);
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
            sortedIndices: [0],
            message: 'Click Play to start Insertion Sort'
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
        }, 1000);

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
                    <h1 className="text-4xl font-bold text-gray-100 mb-2">{algorithmData.title}</h1>
                    <span className="algorithm-badge badge-sorting">{algorithmData.category}</span>
                </div>

                <div className="card">
                    <h2 className="section-title">What is Insertion Sort?</h2>
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
                        Watch how Insertion Sort builds a sorted array by inserting elements one at a time.
                    </p>
                    <ArrayVisualizer
                        array={animationState.array}
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
                        { key: 'array', label: 'Array (comma-separated)', type: 'array', placeholder: '12, 11, 13, 5, 6, 7' }
                    ]}
                />

                <CodeEditor defaultCode={algorithmData.pythonCode} />
                <ExampleSection examples={algorithmData.examples} />
            </div>
        </div>
    );
};

export default InsertionSort;
