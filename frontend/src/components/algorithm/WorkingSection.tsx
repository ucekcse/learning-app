import React from 'react';
import { Lightbulb } from 'lucide-react';
import type { WorkingStep } from '../../types';

interface WorkingSectionProps {
    steps: WorkingStep[];
}

const WorkingSection: React.FC<WorkingSectionProps> = ({ steps }) => {
    return (
        <div className="card">
            <h2 className="section-title">How It Works</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                Follow these steps to understand the algorithm's execution flow:
            </p>

            <div className="space-y-4 sm:space-y-6">
                {steps.map((step) => (
                    <div key={step.step} className="border-l-4 border-primary-500 pl-3 sm:pl-6 py-2">
                        <div className="flex items-start gap-2 sm:gap-3">
                            <div className="bg-primary-600 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-bold flex-shrink-0 text-sm sm:text-base">
                                {step.step}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">{step.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-2 sm:mb-3 text-sm sm:text-base break-words">{step.description}</p>

                                {step.variables && step.variables.length > 0 && (
                                    <div className="bg-dark-elevated rounded-lg p-3 sm:p-4 mb-2 sm:mb-3 overflow-hidden">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0" />
                                            <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200">Variables Used:</span>
                                        </div>
                                        <div className="space-y-1 sm:space-y-2">
                                            {step.variables.map((variable, idx) => (
                                                <div key={idx} className="text-xs sm:text-sm break-words">
                                                    <code className="text-primary-600 dark:text-primary-400 text-xs">{variable.name}</code>
                                                    <span className="text-gray-400 dark:text-gray-500"> ({variable.type})</span>
                                                    <span className="text-gray-500 dark:text-gray-400"> - {variable.purpose}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {step.codeSnippet && (
                                    <pre className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 sm:p-4 overflow-x-auto scrollbar-thin">
                                        <code className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all sm:break-normal sm:whitespace-pre">{step.codeSnippet}</code>
                                    </pre>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkingSection;
