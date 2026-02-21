import React from "react";

interface MinMaxVisualizerProps {
  array: number[];
  low: number;
  high: number;
  mid?: number;
  min?: number;
  max?: number;
  message: string;
  depth?: number;
}

const MinMaxVisualizer: React.FC<MinMaxVisualizerProps> = ({
  array,
  low,
  high,
  mid,
  min,
  max,
  message,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 text-center">
        <p className="text-gray-600 dark:text-gray-300 font-mono text-sm">
          {message}
        </p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-8 mt-2 text-xs text-zinc-500 dark:text-gray-400">
          <span>
            Range: [{low}, {high}]
          </span>
          {min !== undefined && (
            <span className="text-green-600 dark:text-green-400">
              Current Min: {min}
            </span>
          )}
          {max !== undefined && (
            <span className="text-red-600 dark:text-red-400">
              Current Max: {max}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-center items-end gap-1 sm:gap-2 h-48 sm:h-64 bg-zinc-100 dark:bg-zinc-900/50 p-2 sm:p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-x-auto scrollbar-thin">
        {array.map((value, idx) => {
          let bgColor = "bg-zinc-400 dark:bg-zinc-700"; // Default inactive
          let borderColor = "border-zinc-300 dark:border-zinc-600";
          let height = Math.max(20, (value / Math.max(...array)) * 100);

          // Visualize state
          if (idx >= low && idx <= high) {
            bgColor = "bg-blue-500";
            borderColor = "border-blue-400";

            // Left/Right split visualization
            if (mid !== undefined) {
              if (idx <= mid) {
                bgColor = "bg-indigo-500"; // Left half
              } else {
                bgColor = "bg-violet-500"; // Right half
              }
            }
          }

          return (
            <div
              key={idx}
              className="flex flex-col items-center gap-2 group relative"
            >
              <span className="text-xs text-gray-500 font-mono">{idx}</span>
              <div
                className={`w-8 sm:w-12 rounded-t-lg border-2 transition-all duration-300 ${bgColor} ${borderColor} flex items-end justify-center`}
                style={{ height: `${height}%` }}
              >
                <span className="mb-1 sm:mb-2 text-xs sm:text-base text-white font-bold shadow-black drop-shadow-md">
                  {value}
                </span>
              </div>

              {/* Helpers */}
              <div className="absolute -bottom-6 flex flex-col items-center">
                {idx === low && (
                  <span className="text-[10px] text-cyan-400">L</span>
                )}
                {idx === high && (
                  <span className="text-[10px] text-cyan-400">H</span>
                )}
                {idx === mid && (
                  <span className="text-[10px] text-yellow-400">M</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-indigo-500 rounded"></div>
          <span className="text-gray-500 dark:text-gray-400">Left Half</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-violet-500 rounded"></div>
          <span className="text-gray-500 dark:text-gray-400">Right Half</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-zinc-400 dark:bg-zinc-700 rounded"></div>
          <span className="text-gray-500 dark:text-gray-400">Inactive</span>
        </div>
      </div>
    </div>
  );
};

export default MinMaxVisualizer;
