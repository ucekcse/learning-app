import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  algorithmCategories,
  algorithmMetadata,
} from "../../data/algorithmData";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  X,
  Home,
  Search,
  GitBranch,
  Cpu,
  Puzzle,
  Sparkles,
} from "lucide-react";

// Unique icon per category for a clean collapsed view
const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
  "Searching & Sorting": Search,
  "Graph Algorithms": GitBranch,
  "Algorithm Design": Puzzle,
  "Advanced Algorithms": Sparkles,
  "CPU Scheduling": Cpu,
};

interface SidebarProps {
  isOpen: boolean;
  isDesktopOpen: boolean;
  onClose: () => void;
  onDesktopToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isDesktopOpen,
  onClose,
  onDesktopToggle,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // On mobile, always show expanded sidebar content (full labels, not icon-only)
  const showExpanded = isMobile || isDesktopOpen;

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName],
    );
  };

  const handleCategoryClick = (category: (typeof algorithmCategories)[0]) => {
    if (!showExpanded) {
      if (category.algorithms.length > 0) {
        navigate(`/algorithm/${category.algorithms[0]}`);
      }
    } else {
      toggleCategory(category.name);
    }
  };

  const isCategoryActive = (category: (typeof algorithmCategories)[0]) => {
    return category.algorithms.some(
      (algoId) => location.pathname === `/algorithm/${algoId}`,
    );
  };

  return (
    <div
      className={`
            fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition-all duration-300 ease-in-out flex flex-col
            ${isDesktopOpen ? "md:w-80" : "md:w-[72px]"} w-80 
            glass-panel h-[100dvh] md:h-[calc(100vh-2rem)] md:my-4 md:ml-4 md:rounded-2xl
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
    >
      {/* Header */}
      <div
        className={`border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center shrink-0 transition-all duration-300 ${showExpanded ? "p-5 justify-between" : "p-4 justify-center"}`}
      >
        {showExpanded ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient-primary leading-tight">
                AlgoLearn
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                Algorithm Lab
              </p>
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
          className="md:hidden p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav
        className={`flex-1 overflow-y-auto scrollbar-thin transition-all duration-300 ${showExpanded ? "p-3" : "py-3 px-2"}`}
      >
        {/* Home Link */}
        <Link
          to="/"
          onClick={onClose}
          title="Home"
          className={`flex items-center rounded-xl transition-all duration-200 mb-1 group
                        ${showExpanded ? "px-3 py-2.5 gap-3" : "p-3 justify-center"}
                        ${
                          location.pathname === "/"
                            ? "bg-primary-600/15 text-primary-600 dark:text-primary-400"
                            : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200"
                        }`}
        >
          <Home className="shrink-0 w-5 h-5" />
          {showExpanded && (
            <span className="font-medium text-sm truncate">Home</span>
          )}
        </Link>

        {/* Divider */}
        <div
          className={`border-t border-zinc-200/50 dark:border-zinc-800/50 ${showExpanded ? "my-3 mx-1" : "my-3"}`}
        />

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
                                        ${showExpanded ? "px-3 py-2.5 justify-between" : "p-3 justify-center"}
                                        ${
                                          isActive && !showExpanded
                                            ? "bg-primary-600/15 text-primary-600 dark:text-primary-400"
                                            : "text-gray-500 dark:text-gray-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-gray-200"
                                        }`}
                >
                  <div className="flex items-center gap-3">
                    <CatIcon
                      className={`w-5 h-5 shrink-0 ${isActive ? "text-primary-600 dark:text-primary-400" : ""}`}
                    />
                    {showExpanded && (
                      <span
                        className={`font-medium text-sm truncate ${isActive ? "text-gray-800 dark:text-gray-200" : ""}`}
                      >
                        {category.name}
                      </span>
                    )}
                  </div>
                  {showExpanded && (
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isExpanded ? "" : "-rotate-90"}`}
                    />
                  )}
                </button>

                {/* Expanded Algorithm Links (only when sidebar is open) */}
                {isExpanded && showExpanded && (
                  <div className="mt-1 ml-[1.35rem] pl-4 border-l border-zinc-200/70 dark:border-zinc-800/70 space-y-1 py-1">
                    {category.algorithms.map((algoId) => {
                      const algo = algorithmMetadata[algoId];
                      const isAlgoActive =
                        location.pathname === `/algorithm/${algoId}`;

                      return (
                        <Link
                          key={algoId}
                          to={`/algorithm/${algoId}`}
                          onClick={onClose}
                          className={`block px-3 py-2 rounded-lg text-[13px] transition-all truncate
                                                        ${
                                                          isAlgoActive
                                                            ? "bg-primary-600/10 text-primary-600 dark:text-primary-400 font-medium"
                                                            : "text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
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
      <div className="shrink-0 border-t border-zinc-200/50 dark:border-zinc-800/50 hidden md:block">
        <button
          onClick={onDesktopToggle}
          className={`w-full flex items-center transition-all duration-200 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60
                        ${showExpanded ? "px-4 py-3 gap-3 justify-start" : "p-3 justify-center"}`}
          title={isDesktopOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {showExpanded ? (
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
      <div className="shrink-0 p-3 border-t border-zinc-200/50 dark:border-zinc-800/50 md:hidden flex justify-center">
        <p className="text-xs text-gray-400 dark:text-gray-600">
          AlgoLearn v1.0
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
