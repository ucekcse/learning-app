import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ProsConsProps {
    pros: string[];
    cons: string[];
    timeComplexity: string;
    spaceComplexity: string;
}

const ProsConsSection: React.FC<ProsConsProps> = ({ pros, cons, timeComplexity, spaceComplexity }) => {
    return (
        <div className="card">
            <h2 className="section-title">Pros & Cons</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                {/* Pros */}
                <div>
                    <h3 className="text-base sm:text-lg font-semibold text-green-600 dark:text-green-400 mb-3 sm:mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Advantages
                    </h3>
                    <ul className="space-y-2">
                        {pros.map((pro, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                <span className="text-green-500 mt-1">✓</span>
                                <span className="text-sm sm:text-base break-words">{pro}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Cons */}
                <div>
                    <h3 className="text-base sm:text-lg font-semibold text-red-600 dark:text-red-400 mb-3 sm:mb-4 flex items-center gap-2">
                        <XCircle className="w-5 h-5" />
                        Limitations
                    </h3>
                    <ul className="space-y-2">
                        {cons.map((con, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                <span className="text-red-500 mt-1">✗</span>
                                <span className="text-sm sm:text-base break-words">{con}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Complexity */}
            <div className="bg-dark-elevated rounded-lg p-3 sm:p-4 border border-dark-border">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Complexity Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Time Complexity:</span>
                        <p className="text-primary-600 dark:text-primary-400 font-mono text-base sm:text-lg font-semibold break-all">{timeComplexity}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Space Complexity:</span>
                        <p className="text-primary-600 dark:text-primary-400 font-mono text-base sm:text-lg font-semibold break-all">{spaceComplexity}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProsConsSection;
