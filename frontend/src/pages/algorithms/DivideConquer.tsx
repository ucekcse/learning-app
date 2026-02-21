import React, { useState } from 'react';
import type { AlgorithmData } from '../../types';
import ProsConsSection from '../../components/algorithm/ProsConsSection';
import WorkingSection from '../../components/algorithm/WorkingSection';
import CodeEditor from '../../components/algorithm/CodeEditor';
import InputPanel from '../../components/algorithm/InputPanel';
import MinMaxVisualizer from '../../components/animations/MinMaxVisualizer';

const DivideConquer: React.FC = () => {
    const defaultInputs = {
        array: [1000, 11, 445, 1, 330, 3000]
    };
    const [inputs, setInputs] = useState(defaultInputs);

    // Viz State
    const [low, setLow] = useState(0);
    const [high, setHigh] = useState(defaultInputs.array.length - 1);
    const [mid, setMid] = useState<number | undefined>(undefined);
    const [minVal, setMinVal] = useState<number | undefined>(undefined);
    const [maxVal, setMaxVal] = useState<number | undefined>(undefined);
    const [message, setMessage] = useState('Click Play to start');
    const [isPlaying, setIsPlaying] = useState(false);

    const isPlayingRef = React.useRef(false);

    const handleInputChange = (newInputs: any) => {
        const parsedArray = typeof newInputs.array === 'string'
            ? newInputs.array.split(',').map((v: string) => parseInt(v.trim())).filter((v: number) => !isNaN(v))
            : newInputs.array;

        setInputs({ array: parsedArray });
        resetVisualizer(parsedArray);
    };

    const resetVisualizer = (arr: number[]) => {
        setLow(0);
        setHigh(arr.length - 1);
        setMid(undefined);
        setMinVal(undefined);
        setMaxVal(undefined);
        setIsPlaying(false);
        isPlayingRef.current = false;
        setMessage('Click Play to start');
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const findMinMaxViz = async () => {
        if (isPlaying) return;
        setIsPlaying(true);
        isPlayingRef.current = true;

        const arr = inputs.array;

        const solve = async (l: number, h: number): Promise<[number, number]> => {
            if (!isPlayingRef.current) return [Infinity, -Infinity];

            setLow(l);
            setHigh(h);
            setMid(undefined);
            setMessage(`Processing range [${l}, ${h}]`);
            await sleep(800);

            // Base Case 1
            if (l === h) {
                setMessage(`Base case: Single element ${arr[l]}`);
                await sleep(500);
                return [arr[l], arr[l]];
            }

            // Base Case 2
            if (h === l + 1) {
                setMessage(`Base case: Two elements ${arr[l]}, ${arr[h]}`);
                await sleep(500);
                if (arr[l] < arr[h]) return [arr[l], arr[h]];
                else return [arr[h], arr[l]];
            }

            // Divide
            const m = Math.floor((l + h) / 2);
            setMid(m);
            setMessage(`Dividing at index ${m}`);
            await sleep(800);

            // Conquer Left
            const [min1, max1] = await solve(l, m);
            if (!isPlayingRef.current) return [Infinity, -Infinity];

            // Conquer Right
            const [min2, max2] = await solve(m + 1, h);
            if (!isPlayingRef.current) return [Infinity, -Infinity];

            // Combine
            setLow(l);
            setHigh(h);
            setMid(m); // Show split again for combine context
            const finalMin = Math.min(min1, min2);
            const finalMax = Math.max(max1, max2);

            setMinVal(finalMin);
            setMaxVal(finalMax);
            setMessage(`Combining: Left[${min1}, ${max1}] vs Right[${min2}, ${max2}] -> Min: ${finalMin}, Max: ${finalMax}`);
            await sleep(1000);

            return [finalMin, finalMax];
        };

        const [finalMin, finalMax] = await solve(0, arr.length - 1);

        if (isPlayingRef.current) {
            setMessage(`Done! Global Minimum: ${finalMin}, Global Maximum: ${finalMax}`);
            setMinVal(finalMin);
            setMaxVal(finalMax);
        }
        setIsPlaying(false);
        isPlayingRef.current = false;
    };

    const algorithmData: AlgorithmData = {
        id: 'divide-conquer',
        title: 'Divide & Conquer (Max/Min)',
        category: 'Algorithm Design',
        definition: 'Divide and Conquer is a paradigm where the problem is divided into subproblems, solved recursively, and then combined. For finding the Maximum and Minimum in an array, this approach compares pairs of elements recursively, which is efficient for tournament-like comparisons.',
        realWorldUse: 'Merge Sort, Quick Sort, Strassen\'s Matrix Multiplication, Fast Fourier Transform (FFT).',
        pros: [
            'Parallelizable (subproblems are independent)',
            'Efficient memory cache usage',
            'Reduced number of comparisons in some cases (e.g., Min/Max tournament)'
        ],
        cons: [
            'Recursive overhead (stack space)',
            'Can be more complex to implement than iterative solutions',
            'Base cases must be handled carefully'
        ],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(log n) (recursion stack)',
        workingSteps: [
            {
                step: 1,
                title: 'Divide',
                description: 'Split the array into two equal halves until the base case is reached (1 or 2 elements).',
                codeSnippet: 'mid = (low + high) // 2'
            },
            {
                step: 2,
                title: 'Conquer',
                description: 'Solve the problem for the two halves recursively. Find local min/max.',
                codeSnippet: 'min1, max1 = find_min_max(arr, low, mid)\nmin2, max2 = find_min_max(arr, mid + 1, high)'
            },
            {
                step: 3,
                title: 'Combine',
                description: 'Compare results from the two halves to get the global min and max.',
                codeSnippet: 'final_min = min(min1, min2)\nfinal_max = max(max1, max2)'
            }
        ],
        defaultInputs: { array: [1000, 11, 445, 1, 330, 3000] },
        pythonCode: `def find_min_max(arr, low, high):
    # Base Case: 1 element
    if low == high:
        return (arr[low], arr[low])
    
    # Base Case: 2 elements
    if high == low + 1:
        if arr[low] < arr[high]:
            return (arr[low], arr[high])
        else:
            return (arr[high], arr[low])
    
    # Divide
    mid = (low + high) // 2
    
    # Conquer
    min1, max1 = find_min_max(arr, low, mid)
    min2, max2 = find_min_max(arr, mid + 1, high)
    
    # Combine
    final_min = min(min1, min2)
    final_max = max(max1, max2)
    
    return (final_min, final_max)

# Test
arr = ${JSON.stringify(inputs.array)}
min_val, max_val = find_min_max(arr, 0, len(arr) - 1)

print(f"Array: {arr}")
print(f"Minimum: {min_val}")
print(f"Maximum: {max_val}")`,
        examples: []
    };

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-dark-950 text-gray-900 dark:text-white p-3 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="bg-slate-800 border-surface-200/70 dark:border-dark-800/80 rounded-lg p-6 border transition-colors">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{algorithmData.title}</h1>
                    <span className="algorithm-badge bg-teal-600 text-white">{algorithmData.category}</span>
                </div>

                <div className="bg-slate-800 border-surface-200/70 dark:border-dark-800/80 rounded-lg p-6 border transition-colors">
                    <h2 className="section-title">Overview</h2>
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

                <div className="bg-slate-800 border-surface-200/70 dark:border-dark-800/80 rounded-lg p-6 border transition-colors">
                    <h2 className="section-title">Interactive Visualization</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Recursive Min/Max finding visualization.</p>

                    <div className="flex gap-4 mb-4">
                        <button onClick={() => resetVisualizer(inputs.array)} className="btn btn-secondary text-sm">
                            Reset
                        </button>
                        <button onClick={findMinMaxViz} disabled={isPlaying} className="btn btn-primary text-sm">
                            {isPlaying ? 'Running...' : 'Find Min/Max'}
                        </button>
                    </div>

                    <div className="bg-slate-950 p-4 rounded border border-surface-200/70 dark:border-dark-800/80 min-h-[300px]">
                        <MinMaxVisualizer
                            array={inputs.array}
                            low={low}
                            high={high}
                            mid={mid}
                            min={minVal}
                            max={maxVal}
                            message={message}
                        />
                    </div>
                </div>

                <InputPanel
                    defaultInputs={defaultInputs}
                    onInputChange={handleInputChange}
                    inputFields={[
                        { key: 'array', label: 'Array (comma-separated)', type: 'array', placeholder: '1000, 11, 445, 1, 330, 3000' }
                    ]}
                />

                <CodeEditor defaultCode={algorithmData.pythonCode} />
            </div>
        </div>
    );
};

export default DivideConquer;
