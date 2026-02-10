import React, { useState } from 'react';
import { Play, Loader } from 'lucide-react';


interface CodeEditorProps {
    defaultCode?: string;
    cCode?: string;
    pythonCode?: string;
    onCodeChange?: (code: string) => void;
    language?: 'python' | 'c' | 'cpp' | 'java';
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    defaultCode = '',
    cCode,
    pythonCode,
    onCodeChange,
    language: initialLanguage = 'python'
}) => {
    // Determine initial mode based on props
    const [activeLanguage, setActiveLanguage] = useState<'python' | 'c'>(
        cCode ? 'c' : (initialLanguage === 'c' ? 'c' : 'python')
    );

    // State for code content
    const [code, setCode] = useState(
        activeLanguage === 'c' ? (cCode || defaultCode) : (pythonCode || defaultCode)
    );

    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Update code when active language changes
    React.useEffect(() => {
        if (activeLanguage === 'c' && cCode) {
            setCode(cCode);
        } else if (activeLanguage === 'python' && pythonCode) {
            setCode(pythonCode);
        } else {
            setCode(defaultCode);
        }
    }, [activeLanguage, cCode, pythonCode, defaultCode]);

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
        if (onCodeChange) {
            onCodeChange(newCode);
        }
    };

    const executeCode = async () => {
        setIsRunning(true);
        setOutput(activeLanguage === 'c' ? 'Running simulation...' : 'Running code...');
        setHasError(false);

        // For C, we execute the Python code as a simulation
        // For Python, we execute the current code in the editor
        const codeToExecute = activeLanguage === 'c' ? (pythonCode || '') : code;

        const { runPythonCode } = await import('../../utils/pyodideRunner');
        const result = await runPythonCode(codeToExecute);

        setIsRunning(false);

        if (result.success) {
            setOutput(result.output || '');
            setHasError(false);
        } else {
            setOutput(result.error || 'Unknown error occurred');
            setHasError(true);
        }
    };

    return (
        <div className="card">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                <div>
                    <h2 className="section-title mb-1">
                        {activeLanguage === 'python' ? 'Live Execution' : 'C Implementation'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {activeLanguage === 'python'
                            ? 'Run and modify Python simulation code.'
                            : 'View reference C code. Run simulation to see output.'}
                    </p>
                </div>

                {/* Language Toggle */}
                {(cCode && pythonCode) && (
                    <div className="bg-slate-800 p-1 rounded-lg flex items-center">
                        <button
                            onClick={() => setActiveLanguage('c')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeLanguage === 'c'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            C Code
                        </button>
                        <button
                            onClick={() => setActiveLanguage('python')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeLanguage === 'python'
                                ? 'bg-green-600 text-white'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Python (Run)
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Code Editor */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase">{activeLanguage} Source</h3>
                        <button
                            onClick={executeCode}
                            disabled={isRunning}
                            className="btn btn-success flex items-center gap-2 text-sm"
                        >
                            {isRunning ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Running...
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4" />
                                    {activeLanguage === 'c' ? 'Run Simulation' : 'Run Code'}
                                </>
                            )}
                        </button>
                    </div>
                    <textarea
                        value={code}
                        onChange={(e) => handleCodeChange(e.target.value)}
                        className={`w-full h-96 bg-slate-950 border border-slate-700 rounded-lg p-4 font-mono text-sm text-gray-50 focus:outline-none focus:border-primary-500 resize-none scrollbar-thin placeholder-gray-500 ${activeLanguage !== 'python' ? 'opacity-90' : ''
                            }`}
                        spellCheck={false}
                        readOnly={activeLanguage !== 'python'}
                    />
                    {activeLanguage !== 'python' && (
                        <p className="text-xs text-gray-500 mt-2 text-right opacity-70">
                            * C code is read-only. "Run Simulation" executes the equivalent Python logic.
                        </p>
                    )}
                </div>

                {/* Output Display */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Output</h3>
                    <div
                        className={`w-full h-96 bg-slate-950 border rounded-lg p-4 font-mono text-sm overflow-y-auto scrollbar-thin ${hasError ? 'border-red-500 text-red-400' : 'border-slate-700 text-green-400'
                            }`}
                    >
                        {output ? (
                            <pre className="whitespace-pre-wrap">{output}</pre>
                        ) : (
                            <span className="text-gray-500 italic">Hit "{activeLanguage === 'c' ? 'Run Simulation' : 'Run Code'}" to see output...</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
