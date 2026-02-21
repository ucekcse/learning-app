import React, { useState } from 'react';
import type { AlgorithmData } from '../../types';
import ProsConsSection from '../../components/algorithm/ProsConsSection';
import WorkingSection from '../../components/algorithm/WorkingSection';
import ExampleSection from '../../components/algorithm/ExampleSection';
import CodeEditor from '../../components/algorithm/CodeEditor';
import InputPanel from '../../components/algorithm/InputPanel';
import ChessboardVisualizer from '../../components/animations/ChessboardVisualizer';

const NQueens: React.FC = () => {
    const defaultInputs = {
        n: 4
    };

    const [inputs, setInputs] = useState(defaultInputs);
    const [queens, setQueens] = useState<{ row: number; col: number }[]>([]);
    const [conflicts, setConflicts] = useState<{ row: number; col: number }[]>([]);
    const [message, setMessage] = useState('Click Play to start visualization');
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);

    // Refs for cancelling animation (since it's recursive/async)
    const isPlayingRef = React.useRef(false);

    const algorithmData: AlgorithmData = {
        id: 'n-queens',
        title: 'N-Queens Problem (Backtracking)',
        category: 'Algorithm Design',
        definition: 'The N-Queens problem is a classic backtracking problem where the goal is to place N chess queens on an N×N chessboard so that no two queens threaten each other.',
        realWorldUse: 'Constraint satisfaction problems, scheduling, resource allocation, circuit board design.',
        pros: [
            'Demonstrates backtracking technique clearly',
            'Finds all possible solutions',
            'Guaranteed to find solution if one exists'
        ],
        cons: [
            'Exponential time complexity O(N!)',
            'Slow for large N',
            'High memory usage for large boards'
        ],
        timeComplexity: 'O(N!)',
        spaceComplexity: 'O(N)',
        workingSteps: [
            {
                step: 1,
                title: 'Start at Row 0',
                description: 'Begin with an empty board and try to place a queen in the first row.',
                codeSnippet: 'solve(board, 0)'
            },
            {
                step: 2,
                title: 'Try Columns',
                description: 'Iterate through all columns in the current row. Check if placing a queen is safe.',
                codeSnippet: 'for col in range(n): if is_safe(...)'
            },
            {
                step: 3,
                title: 'Recurse or Backtrack',
                description: 'If safe, place queen and move to next row. If next row returns False, backtrack (remove queen) and try next column.',
                codeSnippet: 'board[row] = col; if solve(row+1): return True; board[row] = -1;'
            }
        ],
        defaultInputs,
        pythonCode: `def solve_n_queens(n):
    def is_safe(board, row, col):
        for i in range(row):
            if board[i] == col or \\
               abs(board[i] - col) == abs(i - row):
                return False
        return True

    def solve(board, row):
        if row == n:
            return True
        for col in range(n):
            if is_safe(board, row, col):
                board[row] = col
                if solve(board, row + 1):
                    return True
                board[row] = -1
        return False

    board = [-1] * n
    if solve(board, 0):
        return board
    return None`,
        examples: [
            {
                title: 'Example: 4-Queens',
                input: { n: 4 },
                output: { solution: [1, 3, 0, 2] },
                explanation: 'Queens at (0,1), (1,3), (2,0), (3,2)'
            }
        ]
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const isSafe = (board: number[], row: number, col: number) => {
        for (let i = 0; i < row; i++) {
            if (board[i] === col || Math.abs(board[i] - col) === Math.abs(i - row)) {
                return false;
            }
        }
        return true;
    };

    const solveNQueens = async () => {
        setIsPlaying(true);
        isPlayingRef.current = true;
        setQueens([]);
        setConflicts([]);
        setMessage('Starting search...');

        const board = new Array(inputs.n).fill(-1);

        const updateVisuals = async (row: number, col: number, isPlacing: boolean, isConflict: boolean) => {
            const currentQueens = board.slice(0, row).map((c, r) => ({ row: r, col: c }));
            if (isPlacing) {
                currentQueens.push({ row, col });
            }
            setQueens(currentQueens);

            if (isConflict) {
                setConflicts([{ row, col }]);
                setMessage(`Conflict at (${row}, ${col})`);
            } else {
                setConflicts([]);
                setMessage(isPlacing ? `Placed queen at (${row}, ${col})` : `Backtracking from (${row}, ${col})`);
            }

            await sleep(speed);
        };

        const solve = async (row: number): Promise<boolean> => {
            if (!isPlayingRef.current) return false;

            if (row === inputs.n) {
                setMessage(`Solution found!`);
                return true;
            }

            for (let col = 0; col < inputs.n; col++) {
                if (!isPlayingRef.current) return false;

                // Visualize checking
                if (!isSafe(board, row, col)) {
                    await updateVisuals(row, col, true, true);
                    continue;
                }

                // Place Queen
                board[row] = col;
                await updateVisuals(row, col, true, false);

                if (await solve(row + 1)) {
                    return true;
                }

                // Backtrack
                board[row] = -1;
                await updateVisuals(row, col, false, false);
            }

            return false;
        };

        const found = await solve(0);
        if (!found && isPlayingRef.current) {
            setMessage('No solution found.');
        }
        setIsPlaying(false);
        isPlayingRef.current = false;
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            setIsPlaying(false);
            isPlayingRef.current = false;
            setMessage('Paused');
        } else {
            solveNQueens();
        }
    };

    const handleReset = () => {
        setIsPlaying(false);
        isPlayingRef.current = false;
        setQueens([]);
        setConflicts([]);
        setMessage('Click Play to start');
    };

    const handleInputChange = (newInputs: any) => {
        setInputs({ n: parseInt(newInputs.n) });
        handleReset();
    };

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-dark-950 text-gray-900 dark:text-white p-3 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="bg-zinc-800 border-surface-200/70 dark:border-dark-800/80 rounded-lg p-6 border transition-colors">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{algorithmData.title}</h1>
                    <span className="algorithm-badge badge-sorting">{algorithmData.category}</span>
                </div>

                <div className="bg-zinc-800 border-surface-200/70 dark:border-dark-800/80 rounded-lg p-6 border transition-colors">
                    <h2 className="section-title">What is the N-Queens Problem?</h2>
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

                <div className="bg-zinc-800 border-surface-200/70 dark:border-dark-800/80 rounded-lg p-6 border transition-colors">
                    <h2 className="section-title">Interactive Visualization</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Chessboard showing queen placements for the {inputs.n}-Queens problem.
                    </p>

                    <div className="mb-4 flex items-center gap-4">
                        <label className="text-sm text-gray-300">Animation Speed:</label>
                        <input
                            type="range"
                            min="50"
                            max="1000"
                            step="50"
                            value={speed}
                            onChange={(e) => setSpeed(parseInt(e.target.value))}
                            className="w-48 accent-primary-500"
                        />
                        <span className="text-xs text-gray-400">{speed}ms</span>
                    </div>

                    <ChessboardVisualizer
                        size={inputs.n}
                        queens={queens}
                        conflicts={conflicts}
                        message={message}
                        isPlaying={isPlaying}
                        onPlayPause={handlePlayPause}
                        onReset={handleReset}
                    />
                </div>

                <InputPanel
                    defaultInputs={defaultInputs}
                    onInputChange={handleInputChange}
                    inputFields={[
                        { key: 'n', label: 'Board Size (N)', type: 'number', placeholder: '4' }
                    ]}
                />

                <CodeEditor defaultCode={algorithmData.pythonCode} />
                <ExampleSection examples={algorithmData.examples} />
            </div>
        </div>
    );
};

export default NQueens;
