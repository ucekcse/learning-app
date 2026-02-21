import React from "react";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";

interface Process {
  id: number;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
}

interface GanttBlock {
  processName: string;
  startTime: number;
  endTime: number;
  processId: number;
}

interface GanttChartProps {
  processes: Process[];
  ganttBlocks: GanttBlock[];
  currentTime?: number;
  waitingTimes?: Record<number, number>;
  turnaroundTimes?: Record<number, number>;
  message?: string;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onReset?: () => void;
  onStep?: () => void;
}

const GanttChart: React.FC<GanttChartProps> = ({
  processes,
  ganttBlocks,
  currentTime = 0,
  waitingTimes = {},
  turnaroundTimes = {},
  message = "",
  isPlaying = false,
  onPlayPause,
  onReset,
  onStep,
}) => {
  const maxTime =
    ganttBlocks.length > 0
      ? Math.max(...ganttBlocks.map((b) => b.endTime))
      : 10;

  const colors = [
    "bg-blue-600",
    "bg-green-600",
    "bg-purple-600",
    "bg-orange-600",
    "bg-pink-600",
    "bg-cyan-600",
    "bg-yellow-600",
    "bg-red-600",
  ];

  const getProcessColor = (processId: number) => {
    return colors[processId % colors.length];
  };

  const avgWaitingTime =
    Object.values(waitingTimes).length > 0
      ? (
          Object.values(waitingTimes).reduce((a, b) => a + b, 0) /
          Object.values(waitingTimes).length
        ).toFixed(2)
      : "0.00";

  const avgTurnaroundTime =
    Object.values(turnaroundTimes).length > 0
      ? (
          Object.values(turnaroundTimes).reduce((a, b) => a + b, 0) /
          Object.values(turnaroundTimes).length
        ).toFixed(2)
      : "0.00";

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 sm:p-4 border border-zinc-200 dark:border-zinc-600 gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onPlayPause}
            className="btn btn-primary flex items-center gap-2 text-sm flex-1 sm:flex-none justify-center"
            disabled={!onPlayPause}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={onStep}
            className="btn btn-secondary flex items-center gap-2 text-sm flex-1 sm:flex-none justify-center"
            disabled={!onStep || isPlaying}
          >
            <SkipForward className="w-4 h-4" />
            Step
          </button>
          <button
            onClick={onReset}
            className="btn btn-secondary flex items-center gap-2 text-sm flex-1 sm:flex-none justify-center"
            disabled={!onReset}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          Current Time:{" "}
          <span className="text-primary-600 dark:text-primary-400 font-bold">
            {currentTime}
          </span>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="bg-primary-100 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-500 rounded-lg p-3">
          <p className="text-primary-800 dark:text-primary-200 text-sm font-medium">
            {message}
          </p>
        </div>
      )}

      {/* Gantt Chart */}
      <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 sm:p-6 border border-zinc-200 dark:border-zinc-600 overflow-x-auto scrollbar-thin">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">
          Gantt Chart
        </h3>

        <div className="relative h-24 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-600">
          {ganttBlocks.map((block, index) => {
            const left = (block.startTime / maxTime) * 100;
            const width = ((block.endTime - block.startTime) / maxTime) * 100;

            return (
              <div
                key={index}
                className={`absolute h-full ${getProcessColor(block.processId)} border-r-2 border-zinc-200 dark:border-zinc-900 flex items-center justify-center transition-all duration-300`}
                style={{ left: `${left}%`, width: `${width}%` }}
              >
                <span className="text-white font-bold text-sm">
                  {block.processName}
                </span>
              </div>
            );
          })}

          {/* Current time indicator */}
          {currentTime > 0 && (
            <div
              className="absolute top-0 h-full w-1 bg-red-500 z-10 transition-all duration-300"
              style={{ left: `${(currentTime / maxTime) * 100}%` }}
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                {currentTime}
              </div>
            </div>
          )}
        </div>

        {/* Time scale */}
        <div className="relative h-6 mt-2">
          {Array.from({ length: maxTime + 1 }, (_, i) => (
            <div
              key={i}
              className="absolute text-xs text-gray-600 dark:text-gray-500"
              style={{ left: `${(i / maxTime) * 100}%` }}
            >
              {i}
            </div>
          ))}
        </div>
      </div>

      {/* Process Table */}
      <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 sm:p-6 border border-zinc-200 dark:border-zinc-600 overflow-x-auto scrollbar-thin">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">
          Process Details
        </h3>
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-600">
              <th className="text-left py-2 px-4 text-zinc-700 dark:text-gray-400">
                Process
              </th>
              <th className="text-left py-2 px-4 text-zinc-700 dark:text-gray-400">
                Arrival Time
              </th>
              <th className="text-left py-2 px-4 text-zinc-700 dark:text-gray-400">
                Burst Time
              </th>
              {processes &&
                processes.length > 0 &&
                processes[0]?.priority !== undefined && (
                  <th className="text-left py-2 px-4 text-gray-600 dark:text-gray-400">
                    Priority
                  </th>
                )}
              <th className="text-left py-2 px-4 text-gray-600 dark:text-gray-400">
                Waiting Time
              </th>
              <th className="text-left py-2 px-4 text-gray-600 dark:text-gray-400">
                Turnaround Time
              </th>
            </tr>
          </thead>
          <tbody>
            {processes &&
              processes.map((process) => (
                <tr
                  key={process.id}
                  className="border-b border-zinc-200/50 dark:border-zinc-600/50"
                >
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded ${getProcessColor(process.id)}`}
                      ></div>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {process.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-4 text-gray-700 dark:text-gray-300">
                    {process.arrivalTime}
                  </td>
                  <td className="py-2 px-4 text-gray-700 dark:text-gray-300">
                    {process.burstTime}
                  </td>
                  {process.priority !== undefined && (
                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">
                      {process.priority}
                    </td>
                  )}
                  <td className="py-2 px-4 text-primary-600 dark:text-primary-400 font-semibold">
                    {waitingTimes[process.id] !== undefined
                      ? waitingTimes[process.id]
                      : "-"}
                  </td>
                  <td className="py-2 px-4 text-green-600 dark:text-green-400 font-semibold">
                    {turnaroundTimes[process.id] !== undefined
                      ? turnaroundTimes[process.id]
                      : "-"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Averages */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-3 border border-zinc-200 dark:border-zinc-600">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Average Waiting Time
            </span>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {avgWaitingTime}
            </p>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-3 border border-zinc-200 dark:border-zinc-600">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Average Turnaround Time
            </span>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {avgTurnaroundTime}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
