import React, { useState, useEffect } from 'react';
import type { AlgorithmData } from '../../types';
import ProsConsSection from '../../components/algorithm/ProsConsSection';
import WorkingSection from '../../components/algorithm/WorkingSection';
import ExampleSection from '../../components/algorithm/ExampleSection';
import CodeEditor from '../../components/algorithm/CodeEditor';
import GanttChart from '../../components/animations/GanttChart';
import InputPanel from '../../components/cpu/InputPanel';

interface Process {
    id: number;
    name: string;
    arrivalTime: number;
    burstTime: number;
}

const FCFS: React.FC = () => {
    const defaultInputs = {
        processes: [
            { id: 0, name: 'P1', arrivalTime: 0, burstTime: 4 },
            { id: 1, name: 'P2', arrivalTime: 1, burstTime: 3 },
            { id: 2, name: 'P3', arrivalTime: 2, burstTime: 1 },
            { id: 3, name: 'P4', arrivalTime: 3, burstTime: 2 },
        ]
    };

    const [inputs, setInputs] = useState(defaultInputs);
    const [animationState, setAnimationState] = useState({
        ganttBlocks: [] as any[],
        currentTime: 0,
        waitingTimes: {} as Record<number, number>,
        turnaroundTimes: {} as Record<number, number>,
        message: 'Click Play to start FCFS scheduling'
    });
    const [isPlaying, setIsPlaying] = useState(false);

    const algorithmData: AlgorithmData = {
        id: 'fcfs',
        title: 'First Come First Served (FCFS)',
        category: 'CPU Scheduling',
        definition: 'First Come First Served (FCFS) is the simplest CPU scheduling algorithm where processes are executed in the order they arrive in the ready queue. The process that requests the CPU first is allocated the CPU first. It is a non-preemptive scheduling algorithm, meaning once a process starts execution, it runs to completion.',
        realWorldUse: 'FCFS is used in batch processing systems, print job scheduling, ticket booking systems (first come first served basis), and simple embedded systems where fairness and simplicity are more important than efficiency. It\'s also used in scenarios where all processes have similar execution times.',
        pros: [
            'Simple and easy to understand and implement',
            'Fair - processes are served in arrival order',
            'No starvation - every process will eventually execute',
            'Low overhead - minimal scheduling decisions required',
            'Predictable behavior for users'
        ],
        cons: [
            'Convoy effect - short processes wait for long processes',
            'Poor average waiting time, especially with varying burst times',
            'Not suitable for time-sharing systems',
            'Cannot prioritize important processes',
            'Inefficient CPU utilization with I/O bound processes'
        ],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        workingSteps: [
            {
                step: 1,
                title: 'Process Arrival',
                description: 'Processes arrive and are put in a line (Ready Queue), just like people waiting in a queue to buy tickets.',
                variables: [
                    { name: 'processes', type: 'list', purpose: 'List of waiting processes' },
                    { name: 'ready_queue', type: 'queue', purpose: 'Line of processes waiting for CPU' }
                ],
                codeSnippet: 'sort(processes, by arrival_time)'
            },
            {
                step: 2,
                title: 'Serve First Process',
                description: 'The CPU selects the process at the front of the line. It runs this process until it is completely finished.',
                variables: [
                    { name: 'current_time', type: 'int', purpose: 'Current clock time' },
                    { name: 'running_process', type: 'Process', purpose: 'Process currently using the CPU' }
                ],
                codeSnippet: 'running_process = ready_queue.front()\nexecute(running_process)'
            },
            {
                step: 3,
                title: 'Calculate Times',
                description: 'After the process finishes, we calculate how long it waited (Waiting Time) and total time spent (Turnaround Time).',
                variables: [
                    { name: 'waiting_time', type: 'int', purpose: 'start_time - arrival_time' },
                    { name: 'turnaround_time', type: 'int', purpose: 'completion_time - arrival_time' }
                ],
                codeSnippet: 'waiting_time = start_time - arrival_time\nturnaround_time = completion_time - arrival_time'
            },
            {
                step: 4,
                title: 'Next Process',
                description: 'The CPU moves to the next process in line. This repeats until everyone is served.',
                codeSnippet: 'repeat until ready_queue is empty'
            }
        ],
        defaultInputs,
        pythonCode: `#include <stdio.h>

// Process Structure
struct Process {
    int id;
    int arrivalTime;
    int burstTime;
    int completionTime;
    int waitingTime;
    int turnaroundTime;
};

void calculateTimes(struct Process p[], int n) {
    int currentTime = 0;

    for (int i = 0; i < n; i++) {
        // If CPU is idle before process arrives
        if (currentTime < p[i].arrivalTime) {
            currentTime = p[i].arrivalTime;
        }

        // Process starts execution
        // Completion Time = Start Time + Burst Time
        p[i].completionTime = currentTime + p[i].burstTime;
        
        // Turnaround Time = Completion Time - Arrival Time
        p[i].turnaroundTime = p[i].completionTime - p[i].arrivalTime;
        
        // Waiting Time = Turnaround Time - Burst Time
        p[i].waitingTime = p[i].turnaroundTime - p[i].burstTime;

        // Update current time to completion time of this process
        currentTime = p[i].completionTime;
    }
}

void printTable(struct Process p[], int n) {
    printf("PID\\tArrival\\tBurst\\tCompletion\\tWaiting\\tTurnaround\\n");
    for (int i = 0; i < n; i++) {
        printf("%d\\t%d\\t%d\\t%d\\t\\t%d\\t%d\\n", 
            p[i].id, p[i].arrivalTime, p[i].burstTime, 
            p[i].completionTime, p[i].waitingTime, p[i].turnaroundTime);
    }
}

int main() {
    // Example Processes
    struct Process p[] = {
        {1, 0, 4},
        {2, 1, 3},
        {3, 2, 1},
        {4, 3, 2}
    };
    int n = sizeof(p) / sizeof(p[0]);

    // Sorting by arrival time would happen here if not already sorted

    calculateTimes(p, n);
    printTable(p, n);

    return 0;
}`,
        examples: [
            {
                title: 'Example: FCFS with 4 processes',
                input: {
                    processes: [
                        { name: 'P1', arrival: 0, burst: 4 },
                        { name: 'P2', arrival: 1, burst: 3 },
                        { name: 'P3', arrival: 2, burst: 1 },
                        { name: 'P4', arrival: 3, burst: 2 }
                    ]
                },
                output: {
                    gantt: 'P1(0-4) → P2(4-7) → P3(7-8) → P4(8-10)',
                    avgWaitingTime: 3.25,
                    avgTurnaroundTime: 5.75
                },
                explanation: 'P1 arrives first at time 0 and executes from 0-4. P2 arrives at 1 but waits until P1 completes, executing from 4-7 (waiting time = 3). P3 arrives at 2, waits until 7, executes from 7-8 (waiting time = 5). P4 arrives at 3, waits until 8, executes from 8-10 (waiting time = 5). Average waiting time = (0+3+5+5)/4 = 3.25.'
            }
        ]
    };

    const calculateFCFS = (processes: Process[]) => {
        const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
        let currentTime = 0;
        const ganttBlocks: any[] = [];
        const waitingTimes: Record<number, number> = {};
        const turnaroundTimes: Record<number, number> = {};
        const steps: any[] = [];

        for (const process of sorted) {
            if (currentTime < process.arrivalTime) {
                currentTime = process.arrivalTime;
            }

            const startTime = currentTime;
            const completionTime = currentTime + process.burstTime;

            ganttBlocks.push({
                processName: process.name,
                startTime,
                endTime: completionTime,
                processId: process.id
            });

            waitingTimes[process.id] = startTime - process.arrivalTime;
            turnaroundTimes[process.id] = completionTime - process.arrivalTime;

            steps.push({
                ganttBlocks: [...ganttBlocks],
                currentTime: completionTime,
                waitingTimes: { ...waitingTimes },
                turnaroundTimes: { ...turnaroundTimes },
                message: `Executing ${process.name} from time ${startTime} to ${completionTime}`
            });

            currentTime = completionTime;
        }

        return { steps, ganttBlocks, waitingTimes, turnaroundTimes };
    };

    const [steps, setSteps] = useState<any[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const handlePlayPause = () => {
        if (!isPlaying && steps.length === 0) {
            const { steps: fcfsSteps } = calculateFCFS(inputs.processes);
            setSteps(fcfsSteps);
            setCurrentStepIndex(0);
        }
        setIsPlaying(!isPlaying);
    };

    const handleReset = () => {
        setIsPlaying(false);
        setCurrentStepIndex(0);
        setSteps([]);
        setAnimationState({
            ganttBlocks: [],
            currentTime: 0,
            waitingTimes: {},
            turnaroundTimes: {},
            message: 'Click Play to start FCFS scheduling'
        });
    };

    const handleStep = () => {
        if (currentStepIndex < steps.length) {
            setAnimationState(steps[currentStepIndex]);
            setCurrentStepIndex(currentStepIndex + 1);
        }
    };

    useEffect(() => {
        if (!isPlaying || steps.length === 0) return;

        const interval = setInterval(() => {
            if (currentStepIndex >= steps.length) {
                setIsPlaying(false);
                return;
            }
            handleStep();
        }, 1500);

        return () => clearInterval(interval);
    }, [isPlaying, currentStepIndex, steps]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-3 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-2">{algorithmData.title}</h1>
                            <span className="algorithm-badge badge-cpu">{algorithmData.category}</span>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h2 className="section-title">What is FCFS Scheduling?</h2>
                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-4">{algorithmData.definition}</p>
                    <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-500 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">Real-World Applications</h3>
                        <p className="text-blue-900 dark:text-blue-50 text-sm">{algorithmData.realWorldUse}</p>
                    </div>
                </div>

                {/* Interactive Input Panel */}
                <InputPanel
                    processes={inputs.processes}
                    onProcessesChange={(newProcesses) => setInputs({ processes: newProcesses })}
                    algorithmType="fcfs"
                />

                <ProsConsSection
                    pros={algorithmData.pros}
                    cons={algorithmData.cons}
                    timeComplexity={algorithmData.timeComplexity}
                    spaceComplexity={algorithmData.spaceComplexity}
                />

                <WorkingSection steps={algorithmData.workingSteps} />

                <div className="card">
                    <h2 className="section-title">Interactive Visualization</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Watch how FCFS schedules processes in arrival order with the Gantt chart showing execution timeline.
                    </p>
                    <GanttChart
                        processes={inputs.processes}
                        ganttBlocks={animationState.ganttBlocks}
                        currentTime={animationState.currentTime}
                        waitingTimes={animationState.waitingTimes}
                        turnaroundTimes={animationState.turnaroundTimes}
                        message={animationState.message}
                        isPlaying={isPlaying}
                        onPlayPause={handlePlayPause}
                        onReset={handleReset}
                        onStep={handleStep}
                    />
                </div>

                <CodeEditor defaultCode={algorithmData.pythonCode} language="c" />
                <ExampleSection examples={algorithmData.examples} />
            </div>
        </div>
    );
};

export default FCFS;
