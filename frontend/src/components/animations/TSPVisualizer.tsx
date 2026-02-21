import React, { useRef, useEffect } from 'react';

interface TSPVisualizerProps {
    cities: { x: number; y: number; id: number }[];
    path?: number[];
    bestPath?: number[];
    currentEdge?: { from: number; to: number };
    message?: string;
}

const TSPVisualizer: React.FC<TSPVisualizerProps> = ({
    cities,
    path = [],
    bestPath = [],
    currentEdge,
    message
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw edges connecting all cities (background web)
        ctx.strokeStyle = '#334155'; // zinc-700
        ctx.lineWidth = 1;
        for (let i = 0; i < cities.length; i++) {
            for (let j = i + 1; j < cities.length; j++) {
                ctx.beginPath();
                ctx.moveTo(cities[i].x, cities[i].y);
                ctx.lineTo(cities[j].x, cities[j].y);
                ctx.stroke();
            }
        }

        // Draw Current active edge/path being explored
        if (currentEdge) {
            const fromCity = cities.find(c => c.id === currentEdge.from);
            const toCity = cities.find(c => c.id === currentEdge.to);
            if (fromCity && toCity) {
                ctx.strokeStyle = '#fbbf24'; // yellow-400
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(fromCity.x, fromCity.y);
                ctx.lineTo(toCity.x, toCity.y);
                ctx.stroke();
            }
        }

        // Draw Best Path found
        if (bestPath.length > 0) {
            ctx.strokeStyle = '#22c55e'; // green-500
            ctx.lineWidth = 4;
            ctx.beginPath();
            const startCity = cities.find(c => c.id === bestPath[0]);
            if (startCity) {
                ctx.moveTo(startCity.x, startCity.y);
                for (let i = 1; i < bestPath.length; i++) {
                    const nextCity = cities.find(c => c.id === bestPath[i]);
                    if (nextCity) ctx.lineTo(nextCity.x, nextCity.y);
                }
                // Close loop
                ctx.lineTo(startCity.x, startCity.y);
            }
            ctx.stroke();
        }

        // Draw Current Path (if animating finding a specific path)
        if (path.length > 0) {
            ctx.strokeStyle = '#3b82f6'; // blue-500
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            const startCity = cities.find(c => c.id === path[0]);
            if (startCity) {
                ctx.moveTo(startCity.x, startCity.y);
                for (let i = 1; i < path.length; i++) {
                    const nextCity = cities.find(c => c.id === path[i]);
                    if (nextCity) ctx.lineTo(nextCity.x, nextCity.y);
                }
            }
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Draw Cities
        cities.forEach(city => {
            // Circle
            ctx.beginPath();
            ctx.arc(city.x, city.y, 10, 0, 2 * Math.PI);
            ctx.fillStyle = '#64748b'; // zinc-500
            if (path.includes(city.id)) ctx.fillStyle = '#3b82f6'; // blue-500
            if (bestPath.includes(city.id)) ctx.fillStyle = '#22c55e'; // green-500
            ctx.fill();
            ctx.strokeStyle = '#0f172a'; // zinc-900 border
            ctx.lineWidth = 2;
            ctx.stroke();

            // Label
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(city.id.toString(), city.x, city.y);
        });

    }, [cities, path, bestPath, currentEdge]);

    return (
        <div className="space-y-4">
            {message && (
                <div className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 text-center">
                    <p className="text-gray-600 dark:text-gray-300 font-mono text-sm">{message}</p>
                </div>
            )}
            <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 sm:p-4 overflow-x-auto scrollbar-thin">
                <div className="min-w-[600px] flex justify-center">
                    <canvas
                        ref={canvasRef}
                        width={600}
                        height={400}
                        className="bg-zinc-100 dark:bg-zinc-900 rounded cursor-pointer"
                    />
                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-green-500"></div>
                    <span className="text-gray-600 dark:text-gray-300">Best Path</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-yellow-400"></div>
                    <span className="text-gray-600 dark:text-gray-300">Evaluating Edge</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-1 border-b-2 border-dashed border-blue-500"></div>
                    <span className="text-gray-600 dark:text-gray-300">Current Path</span>
                </div>
            </div>
        </div>
    );
};

export default TSPVisualizer;
