import React, { useState } from 'react';
import type { AlgorithmData } from '../../types';
import ProsConsSection from '../../components/algorithm/ProsConsSection';
import WorkingSection from '../../components/algorithm/WorkingSection';
import CodeEditor from '../../components/algorithm/CodeEditor';
import InputPanel from '../../components/algorithm/InputPanel';
import KthSmallestVisualizer from '../../components/animations/KthSmallestVisualizer';

const KthSmallest: React.FC = () => {
    const defaultInputs = {
        array: [7, 10, 4, 3, 20, 15, 1, 30, 25],
        k: 3
    };
    const [inputs, setInputs] = useState(defaultInputs);

    // Visualization State
    const [visArray, setVisArray] = useState<number[]>([...defaultInputs.array]);
    const [pivotIndex, setPivotIndex] = useState<number | null>(null);
    const [left, setLeft] = useState<number>(0);
    const [right, setRight] = useState<number>(defaultInputs.array.length - 1);
    const [foundIndex, setFoundIndex] = useState<number | null>(null);
    const [message, setMessage] = useState('Click Play to start QuickSelect algorithm');
    const [isPlaying, setIsPlaying] = useState(false);

    const isPlayingRef = React.useRef(false);

    const handleInputChange = (newInputs: any) => {
        const parsedArray = typeof newInputs.array === 'string'
            ? newInputs.array.split(',').map((v: string) => parseInt(v.trim())).filter((v: number) => !isNaN(v))
            : newInputs.array;

        const kVal = parseInt(newInputs.k);
        setInputs({ array: parsedArray, k: kVal });
        resetVisualizer(parsedArray);
    };

    const resetVisualizer = (arr: number[]) => {
        setVisArray([...arr]);
        setPivotIndex(null);
        setLeft(0);
        setRight(arr.length - 1);
        setFoundIndex(null);
        setIsPlaying(false);
        isPlayingRef.current = false;
        setMessage('Click Play to start');
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const quickSelect = async () => {
        if (isPlaying) return;
        setIsPlaying(true);
        isPlayingRef.current = true;
        setFoundIndex(null);

        let arr = [...visArray];
        let l = 0;
        let r = arr.length - 1;
        const k = inputs.k;

        setMessage(`Looking for ${k}-th smallest (Index ${k - 1})`);

        while (l <= r && isPlayingRef.current) {
            setLeft(l);
            setRight(r);
            await sleep(500);

            // Partition
            const pivot = arr[r];
            setPivotIndex(r);
            setMessage(`Partitioning with Pivot: ${pivot} (Index ${r})`);
            await sleep(500);

            let i = l;
            for (let j = l; j < r; j++) {
                if (!isPlayingRef.current) return;

                // Highlight comparing
                if (arr[j] <= pivot) {
                    // Swap i and j
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    setVisArray([...arr]);
                    i++;
                    await sleep(300);
                }
            }
            // Swap pivot to correct position
            [arr[i], arr[r]] = [arr[r], arr[i]];
            setVisArray([...arr]);
            const pIndex = i;
            setPivotIndex(pIndex);

            setMessage(`Pivot placed at Index ${pIndex}`);
            await sleep(500);

            if (pIndex === k - 1) {
                setFoundIndex(pIndex);
                setMessage(`Found ${k}-th smallest element: ${arr[pIndex]}`);
                break;
            } else if (pIndex > k - 1) {
                setMessage(`Index ${pIndex} > ${k - 1}, recurse Left`);
                r = pIndex - 1;
            } else {
                setMessage(`Index ${pIndex} < ${k - 1}, recurse Right`);
                l = pIndex + 1;
            }
        }

        setIsPlaying(false);
        isPlayingRef.current = false;
    };

    const algorithmData: AlgorithmData = {
        id: 'kth-smallest',
        title: 'Kth Smallest Element',
        category: 'Advanced Algorithms',
        definition: 'The Kth Smallest Element algorithm finds the k-th smallest element in an unordered list. While sorting the list takes O(N log N), this can be solved more efficiently using QuickSelect (similar to QuickSort) in O(N) average time.',
        realWorldUse: 'Median finding, order statistics, deciles/percentiles in data analysis.',
        pros: [
            'O(N) average time complexity (faster than sorting)',
            'In-place algorithm (O(1) extra space)',
            'Can be randomized to avoid worst-case scenarios'
        ],
        cons: [
            'Worst-case time complexity is O(N^2) if pivot selection is poor',
            'Modifies the original array (reorders elements)',
            'Not stable'
        ],
        timeComplexity: 'O(N) average, O(N^2) worst',
        spaceComplexity: 'O(1) (recursion stack O(log N))',
        workingSteps: [
            {
                step: 1,
                title: 'Choose Pivot',
                description: 'Select a pivot element (e.g., last element, random element, or median-of-medians).',
                codeSnippet: 'pivot = arr[high]'
            },
            {
                step: 2,
                title: 'Partition',
                description: 'Rearrange the array such that elements smaller than pivot are on the left, and elements greater are on the right.',
                codeSnippet: 'partition(arr, low, high)'
            },
            {
                step: 3,
                title: 'Check Pivot Index',
                description: 'If the pivot index matches k-1, we found the element. If it is greater than k-1, recurse on the left subarray. Otherwise, recurse on the right.',
                codeSnippet: 'if pivot_index == k-1: return arr[pivot_index]'
            }
        ],
        defaultInputs: { array: [7, 10, 4, 3, 20, 15], k: 3 },
        pythonCode: `import random

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def kth_smallest(arr, l, r, k):
    # If k is smaller than number of elements in array
    if k > 0 and k <= r - l + 1:
        # Partition the array around a pivot
        pos = partition(arr, l, r)

        # If position is same as k
        if pos - l == k - 1:
            return arr[pos]
        
        # If position is more, recur for left subarray
        if pos - l > k - 1:
            return kth_smallest(arr, l, pos - 1, k)

        # Else recur for right subarray
        return kth_smallest(arr, pos + 1, r, k - pos + l - 1)
 
    return float('inf')

# Test
arr = ${JSON.stringify(inputs.array)}
k = ${inputs.k}
print(f"The {k}-th smallest element is {kth_smallest(arr, 0, len(arr) - 1, k)}")`,
        examples: []
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-50 p-3 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="card bg-slate-800 border-slate-700">
                    <h1 className="text-4xl font-bold text-gray-100 mb-2">{algorithmData.title}</h1>
                    <span className="algorithm-badge badge-advanced">{algorithmData.category}</span>
                </div>

                <div className="card bg-slate-800 border-slate-700">
                    <h2 className="section-title">Overview</h2>
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

                <div className="card bg-slate-800 border-slate-700">
                    <h2 className="section-title">Interactive Visualization</h2>
                    <p className="text-gray-400 mb-4">QuickSelect Visualization (Partitioning logic).</p>

                    <div className="flex gap-4 mb-4">
                        <button onClick={() => resetVisualizer(inputs.array)} className="btn btn-secondary text-sm">
                            Reset
                        </button>
                        <button onClick={quickSelect} disabled={isPlaying} className="btn btn-primary text-sm">
                            {isPlaying ? 'Running...' : 'Find Kth Smallest'}
                        </button>
                    </div>

                    <div className="bg-slate-950 p-4 rounded border border-slate-700 min-h-[300px]">
                        <KthSmallestVisualizer
                            array={visArray}
                            pivotIndex={pivotIndex}
                            left={left}
                            right={right}
                            k={inputs.k}
                            foundIndex={foundIndex}
                            message={message}
                        />
                    </div>
                </div>

                <InputPanel
                    defaultInputs={defaultInputs}
                    onInputChange={handleInputChange}
                    inputFields={[
                        { key: 'array', label: 'Array (comma-separated)', type: 'array', placeholder: '7, 10, 4, 3, 20, 15' },
                        { key: 'k', label: 'K', type: 'number', placeholder: '3' }
                    ]}
                />

                <CodeEditor defaultCode={algorithmData.pythonCode} />
            </div>
        </div>
    );
};

export default KthSmallest;
