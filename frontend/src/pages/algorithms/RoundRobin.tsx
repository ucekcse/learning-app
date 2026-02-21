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

const RoundRobin: React.FC = () => {
    const defaultInputs = {
        processes: [
            { id: 0, name: 'P1', arrivalTime: 0, burstTime: 5 },
            { id: 1, name: 'P2', arrivalTime: 1, burstTime: 3 },
            { id: 2, name: 'P3', arrivalTime: 2, burstTime: 8 },
            { id: 3, name: 'P4', arrivalTime: 3, burstTime: 6 },
        ]
    };

    const [inputs, setInputs] = useState(defaultInputs);
    const [timeQuantum, setTimeQuantum] = useState(2);
    const [animationState, setAnimationState] = useState({
        ganttBlocks: [] as any[],
        currentTime: 0,
        waitingTimes: {} as Record<number, number>,
        turnaroundTimes: {} as Record<number, number>,
        message: 'Click Play to start Round Robin scheduling'
    });
    const [isPlaying, setIsPlaying] = useState(false);

    const algorithmData: AlgorithmData = {
        id: 'round-robin',
        title: 'Round Robin (RR)',
        category: 'CPU Scheduling',
        definition: 'Round Robin is a preemptive CPU scheduling algorithm where each process is assigned a fixed time slice (time quantum) in a cyclic order. When a process\'s time quantum expires, it is preempted and moved to the back of the ready queue. This ensures fair CPU allocation among all processes and prevents starvation.',
        realWorldUse: 'Round Robin is extensively used in time-sharing systems, interactive operating systems (Windows, Linux, macOS), network routers for fair bandwidth allocation, and task scheduling in real-time systems. It\'s ideal when equal priority and response time are important.',
        pros: [
            'Fair CPU allocation - every process gets equal time',
            'No starvation - all processes execute eventually',
            'Good response time for interactive systems',
            'Simple and easy to implement',
            'Works well for processes with similar execution times'
        ],
        cons: [
            'Higher average waiting time compared to SJF',
            'Performance depends heavily on time quantum choice',
            'More context switches increase overhead',
            'Not optimal for processes with varying burst times',
            'Can lead to poor utilization if quantum is too small or too large'
        ],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        workingSteps: [
            {
                step: 1,
                title: 'Fixed Time Slices',
                description: 'We give every process a small, fixed amount of time (Quantum) to run. For example, 2 seconds.',
                variables: [
                    { name: 'time_quantum', type: 'int', purpose: 'Max time allowed at once' },
                    { name: 'ready_queue', type: 'queue', purpose: 'Circular line of processes' }
                ],
                codeSnippet: 'set time_quantum = 2'
            },
            {
                step: 2,
                title: 'Take Turns',
                description: 'The CPU picks the first process. It runs for the Time Quantum OR until it finishes, whichever comes first.',
                codeSnippet: 'run(process, duration=min(quantum, burst_time))'
            },
            {
                step: 3,
                title: 'Back of the Line',
                description: 'If the process isn\'t done after its turn, it goes to the back of the line to wait for its next turn.',
                codeSnippet: 'if not done: ready_queue.push(process)'
            },
            {
                step: 4,
                title: 'Round and Round',
                description: 'This cycle continues "round robin" style until all tasks are completed.',
                codeSnippet: 'repeat until ready_queue is empty'
            }
        ],
        defaultInputs,
        cCode: `#include <stdio.h>
#include <stdbool.h>

struct Process {
    int id;
    int arrivalTime;
    int burstTime;
    int remainingTime;
    int completionTime;
    int waitingTime;
    int turnaroundTime;
};

void calculateTimes(struct Process p[], int n, int quantum) {
    int currentTime = 0;
    int completedCount = 0;
    
    // Initialize remaining time
    for (int i = 0; i < n; i++) {
        p[i].remainingTime = p[i].burstTime;
    }

    // Simple Round Robin Simulation (assuming all arrived at 0 for simplicity or handled in queue)
    // In a real implementation, we'd use a Queue data structure.
    // For this simulation, we'll iterate repeatedly.

    while (completedCount < n) {
        bool done = true;
        
        for (int i = 0; i < n; i++) {
            if (p[i].remainingTime > 0) {
                done = false; // There is a pending process
                
                if (p[i].remainingTime > quantum) {
                    currentTime += quantum;
                    p[i].remainingTime -= quantum;
                } else {
                    // Process moves to completion
                    currentTime += p[i].remainingTime;
                    p[i].waitingTime = currentTime - p[i].burstTime - p[i].arrivalTime; 
                    // Note: Simplified Waiting Time Calc: FinishTime - BurstTime - ArrivalTime
                    
                    p[i].remainingTime = 0;
                    p[i].completionTime = currentTime;
                    p[i].turnaroundTime = p[i].completionTime - p[i].arrivalTime;
                    completedCount++;
                }
            }
        }
        if (done) break;
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
    struct Process p[] = {
        {1, 0, 5, 0, 0, 0, 0},
        {2, 1, 3, 0, 0, 0, 0},
        {3, 2, 8, 0, 0, 0, 0},
        {4, 3, 6, 0, 0, 0, 0}
    };
    int n = sizeof(p) / sizeof(p[0]);
    int time_quantum = 2; // Fixed time slice

    calculateTimes(p, n, time_quantum);
    printTable(p, n);

    return 0;
}`,
        pythonCode: `def round_robin(processes, time_quantum):
    # processes: list of dicts {id, arrival, burst}
    
    n = len(processes)
    # Using a list as a queue for simplicity
    queue = []
    current_time = 0
    completed = []
    
    # Track remaining burst times
    remaining = {p['id']: p['burst'] for p in processes}
    # Track which processes are in queue/completed
    in_queue = set()
    
    # Sort by arrival
    processes.sort(key=lambda x: x['arrival'])
    
    # Add first process
    if processes[0]['arrival'] <= 0:
        queue.append(processes[0])
        in_queue.add(processes[0]['id'])
        
    idx = 1 # Index for next process arrival
    
    print(f"Time Quantum: {time_quantum}")
    print(f"{'Time':<10}{'Process':<10}{'Action':<30}")
    print("-" * 50)
    
    while queue:
        p = queue.pop(0)
        in_queue.remove(p['id'])
        
        # Execute
        exec_time = min(time_quantum, remaining[p['id']])
        
        print(f"{current_time:<10}{p['id']:<10}Runs for {exec_time} units")
        
        current_time += exec_time
        remaining[p['id']] -= exec_time
        
        # Check for new arrivals during execution
        while idx < n and processes[idx]['arrival'] <= current_time:
            if processes[idx]['id'] not in in_queue and processes[idx] not in completed:
                queue.append(processes[idx])
                in_queue.add(processes[idx]['id'])
            idx += 1
            
        # If not finished, re-add to queue
        if remaining[p['id']] > 0:
            queue.append(p)
            in_queue.add(p['id'])
        else:
            completed.append(p)
            print(f"{current_time:<10}{p['id']:<10}Finished!")
            
    print("-" * 50)
    print("Execution Completed")

# Example
processes = [
    {'id': 'P1', 'arrival': 0, 'burst': 5},
    {'id': 'P2', 'arrival': 1, 'burst': 3},
    {'id': 'P3', 'arrival': 2, 'burst': 8},
    {'id': 'P4', 'arrival': 3, 'burst': 6}
]

round_robin(processes, time_quantum=2)`,
        examples: [
            {
                title: 'Round Robin with Time Quantum = 2',
                input: {
                    processes: [
                        { name: 'P1', arrival: 0, burst: 5 },
                        { name: 'P2', arrival: 1, burst: 3 },
                        { name: 'P3', arrival: 2, burst: 8 },
                        { name: 'P4', arrival: 3, burst: 6 }
                    ],
                    timeQuantum: 2
                },
                output: {
                    gantt: 'P1(0-2) → P2(2-4) → P3(4-6) → P4(6-8) → P1(8-10) → P2(10-11) → P3(11-13) → P4(13-15) → P1(15-16) → P3(16-18) → P4(18-19) → P3(19-21) → P3(21-22)',
                    avgWaitingTime: 7.75,
                    avgTurnaroundTime: 13.25
                },
                explanation: 'With time quantum = 2, each process executes for 2 time units before preemption. P1 starts at 0, executes for 2 units (0-2). P2 then executes (2-4), P3 (4-6), P4 (6-8). P1 resumes with 3 units remaining, executes for 2 more (8-10). This cycling continues until all processes complete. Notice how processes with longer burst times like P3 (8 units) get multiple time slices.'
            },
            {
                title: 'Impact of Time Quantum',
                input: {
                    processes: [
                        { name: 'P1', arrival: 0, burst: 6 },
                        { name: 'P2', arrival: 0, burst: 4 }
                    ],
                    timeQuantum: 1
                },
                output: {
                    contextSwitches: 9,
                    note: 'Small quantum increases context switches'
                },
                explanation: 'Choosing the right time quantum is critical. Too small (e.g., 1) causes excessive context switching overhead. Too large makes RR behave like FCFS, losing its fairness advantage. Optimal quantum is typically 10-100ms in real systems.'
            }
        ]
    };

    const calculateRoundRobin = (processes: Process[], quantum: number) => {
        // ... (existing implementation)
        const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
        const n = sorted.length;
        const readyQueue: number[] = [];
        const remainingTime: Record<number, number> = {};
        const completionTime: Record<number, number> = {};

        sorted.forEach(p => {
            remainingTime[p.id] = p.burstTime;
        });

        let currentTime = 0;
        const ganttBlocks: any[] = [];
        const waitingTimes: Record<number, number> = {};
        const turnaroundTimes: Record<number, number> = {};
        const steps: any[] = [];
        let completed = 0;
        let idx = 0;

        // Add first arrived process
        if (sorted[0].arrivalTime <= 0) {
            readyQueue.push(0);
            idx = 1;
        }

        while (completed < n) {
            if (readyQueue.length === 0) {
                // If queue is empty but process not done, jump to next arrival
                if (idx < n) {
                    currentTime = Math.max(currentTime, sorted[idx].arrivalTime);
                    readyQueue.push(idx);
                    idx++;
                } else {
                    break;
                }
                continue;
            }

            const processIdx = readyQueue.shift()!;
            const process = sorted[processIdx];

            const execTime = Math.min(quantum, remainingTime[process.id]);
            const startTime = currentTime;
            currentTime += execTime;
            remainingTime[process.id] -= execTime;

            ganttBlocks.push({
                processName: process.name,
                startTime,
                endTime: currentTime,
                processId: process.id
            });

            // Add newly arrived processes
            while (idx < n && sorted[idx].arrivalTime <= currentTime) {
                readyQueue.push(idx);
                idx++;
            }

            // Re-add if not completed
            if (remainingTime[process.id] > 0) {
                readyQueue.push(processIdx);
                steps.push({
                    ganttBlocks: [...ganttBlocks],
                    currentTime,
                    waitingTimes: { ...waitingTimes },
                    turnaroundTimes: { ...turnaroundTimes },
                    message: `${process.name} executed for ${execTime} units (${startTime}-${currentTime}), ${remainingTime[process.id]} units remaining. Re-added to queue.`
                });
            } else {
                completed++;
                completionTime[process.id] = currentTime;
                turnaroundTimes[process.id] = currentTime - process.arrivalTime;
                waitingTimes[process.id] = turnaroundTimes[process.id] - process.burstTime;

                steps.push({
                    ganttBlocks: [...ganttBlocks],
                    currentTime,
                    waitingTimes: { ...waitingTimes },
                    turnaroundTimes: { ...turnaroundTimes },
                    message: `${process.name} completed at time ${currentTime}. Turnaround: ${turnaroundTimes[process.id]}, Waiting: ${waitingTimes[process.id]}`
                });
            }
        }

        return { steps, ganttBlocks, waitingTimes, turnaroundTimes };
    };

    const [steps, setSteps] = useState<any[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const handlePlayPause = () => {
        if (!isPlaying && steps.length === 0) {
            const { steps: rrSteps } = calculateRoundRobin(inputs.processes, timeQuantum);
            setSteps(rrSteps);
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
            message: 'Click Play to start Round Robin scheduling'
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
                    <h2 className="section-title">What is Round Robin?</h2>
                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-4">{algorithmData.definition}</p>
                    <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-500 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">Real-World Applications</h3>
                        <p className="text-blue-900 dark:text-blue-50 text-sm">{algorithmData.realWorldUse}</p>
                    </div>

                    {/* Brief Summary for Presentations */}
                    <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">How It Works (Brief)</h3>
                        <ul className="space-y-2 text-gray-800 dark:text-gray-200">
                            <li className="flex items-start">
                                <span className="text-green-600 dark:text-green-400 font-bold mr-2">1.</span>
                                <span>Each process gets a fixed time slice (time quantum, e.g., 2ms)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 dark:text-green-400 font-bold mr-2">2.</span>
                                <span>Processes execute in circular queue order (FIFO)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 dark:text-green-400 font-bold mr-2">3.</span>
                                <span>After quantum expires, process moves to back of queue</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 dark:text-green-400 font-bold mr-2">4.</span>
                                <span>Continues until all processes complete</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 dark:text-green-400 font-bold mr-2">⚡</span>
                                <span><strong>Key Advantage:</strong> Fair CPU time, prevents starvation</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <ProsConsSection
                    pros={algorithmData.pros}
                    cons={algorithmData.cons}
                    timeComplexity={algorithmData.timeComplexity}
                    spaceComplexity={algorithmData.spaceComplexity}
                />

                <WorkingSection steps={algorithmData.workingSteps} />

                <div className="card">
                    <h2 className="section-title">Interactive Visualization</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Adjust the time quantum and watch how Round Robin schedules processes with fair time slicing.
                    </p>

                    {/* Input Panel */}
                    <InputPanel
                        processes={inputs.processes}
                        onProcessesChange={(newProcesses) => {
                            setInputs({ ...inputs, processes: newProcesses as any });
                            handleReset();
                        }}
                        algorithmType="round-robin"
                        timeQuantum={timeQuantum}
                        onTimeQuantumChange={(newQuantum) => {
                            setTimeQuantum(newQuantum);
                            handleReset();
                        }}
                    />

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

                <CodeEditor
                    cCode={algorithmData.cCode}
                    pythonCode={algorithmData.pythonCode}
                />
                <ExampleSection examples={algorithmData.examples} />
            </div>
        </div>
    );
};

export default RoundRobin;
