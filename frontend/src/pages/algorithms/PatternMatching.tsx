import React, { useState, useEffect } from 'react';
import type { AlgorithmData } from '../../types';
import ProsConsSection from '../../components/algorithm/ProsConsSection';
import WorkingSection from '../../components/algorithm/WorkingSection';
import ExampleSection from '../../components/algorithm/ExampleSection';
import CodeEditor from '../../components/algorithm/CodeEditor';
import InputPanel from '../../components/algorithm/InputPanel';
import ArrayVisualizer from '../../components/animations/ArrayVisualizer';

const PatternMatching: React.FC = () => {
    const defaultInputs = {
        text: 'AABAACAADAABAABA',
        pattern: 'AABA'
    };

    const [inputs, setInputs] = useState(defaultInputs);
    const [animationState, setAnimationState] = useState({
        textIndex: -1,
        patternIndex: -1,
        matches: [] as number[],
        message: 'Click Play to start pattern matching'
    });
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const algorithmData: AlgorithmData = {
        id: 'pattern-matching',
        title: 'Naive Pattern Matching',
        category: 'Searching & Sorting',
        definition: 'Naive Pattern Matching is a simple string searching algorithm that checks for all possible positions in the text where the pattern might occur. It slides the pattern over the text one by one and checks for a match at each position.',
        realWorldUse: 'Pattern matching is used in text editors (Find feature), DNA sequence analysis, plagiarism detection, spam email filtering, virus signature detection, and search engines. While naive approach is simple, more efficient algorithms like KMP or Boyer-Moore are used in production.',
        pros: [
            'Very simple to understand and implement',
            'No preprocessing required',
            'Works well for small texts and patterns',
            'Requires no extra space',
            'Good for teaching string searching concepts'
        ],
        cons: [
            'Inefficient with O(m*n) time complexity',
            'Performs unnecessary comparisons',
            'Not suitable for large texts',
            'Doesn\'t learn from previous comparisons',
            'Much slower than advanced algorithms like KMP'
        ],
        timeComplexity: 'O(m * n) where m is text length, n is pattern length',
        spaceComplexity: 'O(1)',
        workingSteps: [
            {
                step: 1,
                title: 'Initialize search',
                description: 'Start from the beginning of the text. We will check each position to see if the pattern matches starting from that position.',
                variables: [
                    { name: 'text', type: 'string', purpose: 'The text to search in' },
                    { name: 'pattern', type: 'string', purpose: 'The pattern to find' },
                    { name: 'i', type: 'int', purpose: 'Current position in text' }
                ],
                codeSnippet: 'for i in range(len(text) - len(pattern) + 1):'
            },
            {
                step: 2,
                title: 'Compare characters',
                description: 'At each position, compare the pattern with the substring of text starting at that position. Check character by character.',
                variables: [
                    { name: 'j', type: 'int', purpose: 'Current position in pattern' }
                ],
                codeSnippet: 'for j in range(len(pattern)):\n    if text[i + j] != pattern[j]:\n        break  # Mismatch found'
            },
            {
                step: 3,
                title: 'Check for complete match',
                description: 'If all characters of the pattern matched, record the starting position. Then continue searching for more occurrences.',
                codeSnippet: 'if j == len(pattern) - 1:\n    matches.append(i)  # Pattern found at position i'
            },
            {
                step: 4,
                title: 'Slide pattern',
                description: 'Move to the next position in the text and repeat. This continues until we have checked all possible positions.',
                codeSnippet: '# Move to next position in text\n# i increments automatically in the loop'
            }
        ],
        defaultInputs,
        pythonCode: `def naive_pattern_matching(text, pattern):
    """
    Find all occurrences of pattern in text using naive approach.
    Returns a list of starting positions where pattern is found.
    """
    matches = []
    n = len(text)
    m = len(pattern)
    
    # Check each position in text
    for i in range(n - m + 1):
        # Check if pattern matches at position i
        j = 0
        while j < m and text[i + j] == pattern[j]:
            j += 1
        
        # If we matched all characters
        if j == m:
            matches.append(i)
    
    return matches

# Test the algorithm
text = "${inputs.text}"
pattern = "${inputs.pattern}"

matches = naive_pattern_matching(text, pattern)

print(f"Text: {text}")
print(f"Pattern: {pattern}")
print(f"\\nPattern found at positions: {matches}")
print(f"Total matches: {len(matches)}")

# Show matches in context
for pos in matches:
    print(f"\\nMatch at index {pos}: ...{text[max(0, pos-3):pos+len(pattern)+3]}...")`,
        examples: [
            {
                title: 'Example: Finding pattern in text',
                input: { text: 'AABAACAADAABAABA', pattern: 'AABA' },
                output: { matches: [0, 9, 12], message: 'Pattern found at positions 0, 9, 12' },
                explanation: 'The pattern "AABA" appears 3 times in the text. First at index 0 (AABA...), then at index 9 (...AABA...), and finally at index 12 (...AABA). The algorithm checks each position: At i=0, it matches completely. At i=1-8, no match. At i=9 and i=12, it matches again.'
            }
        ]
    };

    const performPatternMatching = (): any[] => {
        const steps: any[] = [];
        const text = inputs.text;
        const pattern = inputs.pattern;
        const matches: number[] = [];

        for (let i = 0; i <= text.length - pattern.length; i++) {
            steps.push({
                textIndex: i,
                patternIndex: 0,
                matches: [...matches],
                message: `Checking position ${i} in text...`
            });

            let j = 0;
            while (j < pattern.length && text[i + j] === pattern[j]) {
                steps.push({
                    textIndex: i + j,
                    patternIndex: j,
                    matches: [...matches],
                    message: `Match: text[${i + j}]='${text[i + j]}' == pattern[${j}]='${pattern[j]}'`
                });
                j++;
            }

            if (j < pattern.length) {
                steps.push({
                    textIndex: i + j,
                    patternIndex: j,
                    matches: [...matches],
                    message: `Mismatch at text[${i + j}]='${text[i + j]}' != pattern[${j}]='${pattern[j]}'`
                });
            } else {
                matches.push(i);
                steps.push({
                    textIndex: i,
                    patternIndex: -1,
                    matches: [...matches],
                    message: `✓ Pattern found at position ${i}!`
                });
            }
        }

        steps.push({
            textIndex: -1,
            patternIndex: -1,
            matches: [...matches],
            message: `Search complete! Found ${matches.length} match(es)`
        });

        return steps;
    };

    const [matchingSteps, setMatchingSteps] = useState<any[]>([]);

    useEffect(() => {
        const steps = performPatternMatching();
        setMatchingSteps(steps);
    }, [inputs]);

    useEffect(() => {
        if (!isPlaying || matchingSteps.length === 0) return;

        const interval = setInterval(() => {
            if (currentStep >= matchingSteps.length) {
                setIsPlaying(false);
                return;
            }

            const step = matchingSteps[currentStep];
            setAnimationState(step);
            setCurrentStep(currentStep + 1);
        }, 800);

        return () => clearInterval(interval);
    }, [isPlaying, currentStep, matchingSteps]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleReset = () => {
        setIsPlaying(false);
        setCurrentStep(0);
        setAnimationState({
            textIndex: -1,
            patternIndex: -1,
            matches: [],
            message: 'Click Play to start pattern matching'
        });
    };

    const handleStep = () => {
        if (currentStep < matchingSteps.length) {
            const step = matchingSteps[currentStep];
            setAnimationState(step);
            setCurrentStep(currentStep + 1);
        }
    };

    const handleInputChange = (newInputs: any) => {
        setInputs({ text: newInputs.text, pattern: newInputs.pattern });
        handleReset();
    };

    // Convert text to array for visualization
    const textArray = inputs.text.split('');

    return (
        <div className="min-h-screen bg-dark-bg p-3 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="card">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{algorithmData.title}</h1>
                    <span className="algorithm-badge badge-searching">{algorithmData.category}</span>
                </div>

                <div className="card">
                    <h2 className="section-title">What is Naive Pattern Matching?</h2>
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
                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                        <strong>Text:</strong> {inputs.text}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        <strong>Pattern:</strong> {inputs.pattern}
                    </p>
                    <ArrayVisualizer
                        array={textArray}
                        currentIndex={animationState.textIndex}
                        sortedIndices={animationState.matches}
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
                        { key: 'text', label: 'Text to search in', type: 'text', placeholder: 'AABAACAADAABAABA' },
                        { key: 'pattern', label: 'Pattern to find', type: 'text', placeholder: 'AABA' }
                    ]}
                />

                <CodeEditor defaultCode={algorithmData.pythonCode} />
                <ExampleSection examples={algorithmData.examples} />
            </div>
        </div>
    );
};

export default PatternMatching;
