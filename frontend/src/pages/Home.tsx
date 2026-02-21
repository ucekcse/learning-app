import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Code, Play, Zap } from 'lucide-react';

const Home: React.FC = () => {
    const features = [
        {
            icon: <BookOpen className="w-8 h-8" />,
            title: 'Comprehensive Learning',
            description: '25+ algorithms with detailed explanations, pros & cons, and real-world applications'
        },
        {
            icon: <Play className="w-8 h-8" />,
            title: 'Interactive Animations',
            description: 'Watch algorithms execute step-by-step with synchronized visualizations'
        },
        {
            icon: <Code className="w-8 h-8" />,
            title: 'Live Code Execution',
            description: 'Run Python code directly in your browser and see instant results'
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: 'Hands-On Learning',
            description: 'Modify inputs, experiment with values, and understand algorithm behavior'
        }
    ];

    const categories = [
        { name: 'Searching & Sorting', count: 7, color: 'bg-blue-600', link: '/algorithm/linear-search' },
        { name: 'Graph Algorithms', count: 6, color: 'bg-green-600', link: '/algorithm/bfs' },
        { name: 'Algorithm Design', count: 2, color: 'bg-purple-600', link: '/algorithm/divide-conquer' },
        { name: 'Advanced Algorithms', count: 3, color: 'bg-pink-600', link: '/algorithm/tsp-exact' },
        { name: 'CPU Scheduling', count: 5, color: 'bg-orange-600', link: '/algorithm/fcfs' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Hero Section */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 leading-tight">
                            Master Algorithms Through <br className="hidden sm:block" />
                            <span className="text-primary-500"> Interactive Learning</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 mb-8 max-w-3xl mx-auto px-2">
                            A comprehensive platform for computer science students to understand algorithms deeply through visualizations, live code execution, and hands-on experimentation.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link to="/algorithm/linear-search" className="btn btn-primary w-full sm:w-auto text-lg px-8 py-3">
                                Start Learning
                            </Link>
                            <a href="#categories" className="btn btn-secondary w-full sm:w-auto text-lg px-8 py-3">
                                Explore Topics
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 sm:mb-12 text-center">
                    Why Choose AlgoLearn?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div key={index} className="card hover:border-primary-500 transition-all">
                            <div className="text-primary-500 mb-4">{feature.icon}</div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Categories Section */}
            <div id="categories" className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 sm:mb-12 text-center">
                    Algorithm Categories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, index) => (
                        <Link
                            key={index}
                            to={category.link}
                            className="card hover:border-primary-500 transition-all group cursor-pointer"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-white font-bold text-xl`}>
                                    {category.count}
                                </div>
                                <span className="text-gray-400 group-hover:text-primary-500 transition-colors">→</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{category.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{category.count} algorithms to master</p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Ready to Master Algorithms?
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                        Start your journey with Linear Search and progress through 25+ algorithms with interactive visualizations and live code execution.
                    </p>
                    <Link to="/algorithm/linear-search" className="btn btn-primary text-lg px-8 py-3">
                        Begin Your Journey
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
