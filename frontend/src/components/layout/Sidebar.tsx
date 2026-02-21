import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { algorithmCategories, algorithmMetadata } from '../../data/algorithmData';
import { ChevronDown, ChevronRight, ChevronLeft, BookOpen, X, Home, Search, GitBranch, Cpu, Puzzle, Sparkles } from 'lucide-react';

// Unique icon per category for a clean collapsed view
const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
    'Searching & Sorting': Search,
    'Graph Algorithms': GitBranch,
    'Algorithm Design': Puzzle,
    'Advanced Algorithms': Sparkles,
    'CPU Scheduling': Cpu,
};

interface SidebarProps {
    isOpen: boolean;
    isDesktopOpen: boolean;
    onClose: () => void;
    onDesktopToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isDesktopOpen, onClose, onDesktopToggle }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    const toggleCategory = (categoryName: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryName)
                ? prev.filter(c => c !== categoryName)
                : [...prev, categoryName]
        );
    };

    const handleCategoryClick = (category: typeof algorithmCategories[0]) => {
        if (!isDesktopOpen) {
            // In collapsed mode: navigate to the first algorithm of this category
            if (category.algorithms.length > 0) {
                navigate(`/algorithm/${category.algorithms[0]}`);
            }
        } else {
            toggleCategory(category.name);
        }
    };

    // Check if any algorithm in a category is currently active
    const isCategoryActive = (category: typeof algorithmCategories[0]) => {
        return category.algorithms.some(algoId => location.pathname === `/algorithm/${algoId}`);
    };

    return (
        <div className={`
            fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition-all duration-300 ease-in-out flex flex-col
            ${isDesktopOpen ? 'md:w-80' : 'md:w-[72px]'} w-80 
            bg-slate-900 border-r border-slate-700/80 h-[100dvh]
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            {/* Header */}
            <div className={`border-b border-slate-700/80 flex items-center shrink-0 transition-all duration-300 ${isDesktopOpen ? 'p-5 justify-between' : 'p-4 justify-center'}`}>
                {isDesktopOpen ? (
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-50 leading-tight">AlgoLearn</h1>
                            <p className="text-xs text-gray-500">Algorithm Lab</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                )}
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="md:hidden p-2 text-gray-400 hover:text-gray-100 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className={`flex-1 overflow-y-auto scrollbar-thin transition-all duration-300 ${isDesktopOpen ? 'p-3' : 'py-3 px-2'}`}>
                {/* Home Link */}
                <Link
                    to="/"
                    onClick={onClose}
                    title="Home"
                    className={`flex items-center rounded-xl transition-all duration-200 mb-1 group
                        ${isDesktopOpen ? 'px-3 py-2.5 gap-3' : 'p-3 justify-center'}
                        ${location.pathname === '/'
                            ? 'bg-primary-600/15 text-primary-400'
                            : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
                        }`}
                >
                    <Home className={`shrink-0 ${isDesktopOpen ? 'w-5 h-5' : 'w-5 h-5'}`} />
                    {isDesktopOpen && <span className="font-medium text-sm truncate">Home</span>}
                </Link>

                {/* Divider */}
                <div className={`border-t border-slate-800 ${isDesktopOpen ? 'my-3 mx-1' : 'my-3'}`} />

                {/* Category Navigation */}
                <div className="space-y-1">
                    {algorithmCategories.map((category) => {
                        const isExpanded = expandedCategories.includes(category.name);
                        const CatIcon = categoryIcons[category.name] || Search;
                        const isActive = isCategoryActive(category);

                        return (
                            <div key={category.name}>
                                {/* Category Header */}
                                <button
                                    onClick={() => handleCategoryClick(category)}
                                    title={category.name}
                                    className={`w-full flex items-center rounded-xl transition-all duration-200 group
                                        ${isDesktopOpen ? 'px-3 py-2.5 justify-between' : 'p-3 justify-center'}
                                        ${isActive && !isDesktopOpen
                                            ? 'bg-primary-600/15 text-primary-400'
                                            : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <CatIcon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary-400' : ''}`} />
                                        {isDesktopOpen && (
                                            <span className={`font-medium text-sm truncate ${isActive ? 'text-gray-200' : ''}`}>
                                                {category.name}
                                            </span>
                                        )}
                                    </div>
                                    {isDesktopOpen && (
                                        <ChevronDown className={`w-4 h-4 shrink-0 text-gray-500 transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`} />
                                    )}
                                </button>

                                {/* Expanded Algorithm Links (only when sidebar is open) */}
                                {isExpanded && isDesktopOpen && (
                                    <div className="mt-0.5 ml-5 pl-3 border-l border-slate-800 space-y-0.5 py-1">
                                        {category.algorithms.map((algoId) => {
                                            const algo = algorithmMetadata[algoId];
                                            const isAlgoActive = location.pathname === `/algorithm/${algoId}`;

                                            return (
                                                <Link
                                                    key={algoId}
                                                    to={`/algorithm/${algoId}`}
                                                    onClick={onClose}
                                                    className={`block px-3 py-2 rounded-lg text-[13px] transition-all truncate
                                                        ${isAlgoActive
                                                            ? 'bg-primary-600/10 text-primary-400 font-medium'
                                                            : 'text-gray-500 hover:text-gray-300 hover:bg-slate-800/60'
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
                </div>
            </nav>

            {/* Desktop Toggle Button */}
            <div className="shrink-0 border-t border-slate-800 hidden md:block">
                <button
                    onClick={onDesktopToggle}
                    className={`w-full flex items-center transition-all duration-200 text-gray-500 hover:text-gray-300 hover:bg-slate-800/60
                        ${isDesktopOpen ? 'px-4 py-3 gap-3 justify-start' : 'p-3 justify-center'}`}
                    title={isDesktopOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
                >
                    {isDesktopOpen ? (
                        <>
                            <ChevronLeft className="w-5 h-5 shrink-0" />
                            <span className="text-sm font-medium">Collapse</span>
                        </>
                    ) : (
                        <ChevronRight className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Mobile Footer */}
            <div className="shrink-0 p-3 border-t border-slate-800 md:hidden flex justify-center">
                <p className="text-xs text-gray-600">AlgoLearn v1.0</p>
            </div>
        </div>
    );
};

export default Sidebar;
