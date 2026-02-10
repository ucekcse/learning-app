import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { algorithmCategories, algorithmMetadata } from '../../data/algorithmData';
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react';

const Sidebar: React.FC = () => {
    const location = useLocation();
    const [expandedCategories, setExpandedCategories] = useState<string[]>([
        'Searching & Sorting',
        'Graph Algorithms',
        'CPU Scheduling'
    ]);

    const toggleCategory = (categoryName: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryName)
                ? prev.filter(c => c !== categoryName)
                : [...prev, categoryName]
        );
    };



    return (
        <div className="w-80 bg-slate-900 border-r border-slate-700 h-screen overflow-y-auto scrollbar-thin flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-700">
                <div className="flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-primary-500" />
                    <div>
                        <h1 className="text-xl font-bold text-gray-50">AlgoLearn</h1>
                        <p className="text-sm text-gray-400">Interactive Algorithm Lab</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <Link
                    to="/"
                    className={`block px-4 py-3 rounded-lg mb-4 transition-colors ${location.pathname === '/'
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:bg-slate-800 hover:text-gray-100'
                        }`}
                >
                    <span className="font-medium">🏠 Home</span>
                </Link>

                {algorithmCategories.map((category) => {
                    const isExpanded = expandedCategories.includes(category.name);

                    return (
                        <div key={category.name} className="mb-3">
                            <button
                                onClick={() => toggleCategory(category.name)}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-100 hover:bg-slate-800 transition-colors"
                            >
                                <span className="font-medium text-sm">{category.name}</span>
                                {isExpanded ? (
                                    <ChevronDown className="w-4 h-4" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                            </button>

                            {isExpanded && (
                                <div className="mt-2 ml-2 space-y-1 animate-fade-in">
                                    {category.algorithms.map((algoId) => {
                                        const algo = algorithmMetadata[algoId];
                                        const isActive = location.pathname === `/algorithm/${algoId}`;

                                        return (
                                            <Link
                                                key={algoId}
                                                to={`/algorithm/${algoId}`}
                                                className={`block px-4 py-2 rounded-lg text-sm transition-all ${isActive
                                                    ? 'bg-primary-600 text-white border-l-4 border-primary-400'
                                                    : 'text-gray-400 hover:text-gray-100 hover:bg-slate-800 border-l-4 border-transparent'
                                                    }`}
                                            >
                                                {algo.title}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-600">
                <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
                    Built for CS Students • 25+ Algorithms
                </p>
            </div>
        </div>
    );
};

export default Sidebar;
