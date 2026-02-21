import React from 'react';
import type { Example } from '../../types';
import { FileText } from 'lucide-react';

interface ExampleSectionProps {
    examples: Example[];
}

const formatValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
        return <span className="text-gray-400 dark:text-gray-500">null</span>;
    }

    if (typeof value === 'boolean') {
        return <span className="text-purple-600 dark:text-purple-400">{value ? 'true' : 'false'}</span>;
    }

    if (typeof value === 'number') {
        return <span className="text-blue-600 dark:text-blue-400">{value}</span>;
    }

    if (typeof value === 'string') {
        return <span className="text-green-600 dark:text-green-400">"{value}"</span>;
    }

    if (Array.isArray(value)) {
        if (value.length === 0) {
            return <span className="text-gray-400 dark:text-gray-500">Empty array</span>;
        }

        // Check if array of objects (like processes)
        if (typeof value[0] === 'object' && value[0] !== null) {
            return (
                <div className="space-y-2">
                    {value.map((item, idx) => (
                        <div key={idx} className="bg-slate-50 dark:bg-slate-900 rounded p-2 border border-slate-200 dark:border-slate-700">
                            {Object.entries(item).map(([key, val]) => (
                                <div key={key} className="text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">{key}:</span>{' '}
                                    <span className="text-primary-600 dark:text-primary-400">{String(val)}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            );
        }

        // Simple array
        return (
            <span className="text-primary-600 dark:text-primary-400">
                [{value.map((v, i) => (
                    <React.Fragment key={i}>
                        {i > 0 && ', '}
                        {typeof v === 'string' ? `"${v}"` : v}
                    </React.Fragment>
                ))}]
            </span>
        );
    }

    if (typeof value === 'object') {
        return (
            <div className="space-y-1">
                {Object.entries(value).map(([key, val]) => (
                    <div key={key} className="text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{key}:</span>{' '}
                        {typeof val === 'object' ? formatValue(val) : (
                            <span className="text-primary-600 dark:text-primary-400">{String(val)}</span>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    return <span className="text-gray-600 dark:text-gray-300">{String(value)}</span>;
};

const ExampleSection: React.FC<ExampleSectionProps> = ({ examples }) => {
    return (
        <div className="card">
            <h2 className="section-title">Worked Examples</h2>

            <div className="space-y-6">
                {examples.map((example, index) => (
                    <div key={index} className="bg-dark-elevated rounded-lg p-3 sm:p-6 border border-dark-border">
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 shrink-0" />
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{example.title}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <div>
                                <span className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase block mb-2">📥 Input</span>
                                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 sm:p-4 overflow-x-auto scrollbar-thin">
                                    <div className="text-xs sm:text-sm break-words">
                                        {formatValue(example.input)}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <span className="text-xs sm:text-sm font-semibold text-green-600 dark:text-green-400 uppercase block mb-2">📤 Output</span>
                                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 sm:p-4 overflow-x-auto scrollbar-thin">
                                    <div className="text-xs sm:text-sm break-words">
                                        {formatValue(example.output)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4 border border-blue-200 dark:border-blue-500/30">
                            <span className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase block mb-2">💡 Explanation</span>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base break-words">{example.explanation}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExampleSection;
