import React, { useState, useEffect } from 'react';
import type { AlgorithmData } from '../../types';
import ProsConsSection from '../../components/algorithm/ProsConsSection';
import WorkingSection from '../../components/algorithm/WorkingSection';
import ExampleSection from '../../components/algorithm/ExampleSection';
import CodeEditor from '../../components/algorithm/CodeEditor';
import GanttChart from '../../components/animations/GanttChart';



const SRTF: React.FC = () => {
    const defaultInputs = {
        processes: [
            { id: 0, name: 'P1', arrivalTime: 0, burstTime: 8 },
            { id: 1, name: 'P2', arrivalTime: 1, burstTime: 4 },
            { id: 2, name: 'P3', arrivalTime: 2, burstTime: 9 },
            { id: 3, name: 'P4', arrivalTime: 3, burstTime: 5 },
        ]
    };

    const [inputs] = useState(defaultInputs);
    const [animationState, setAnimationState] = useState({
        ganttBlocks: [] as any[],
        currentTime: 0,
        waitingTimes: {} as Record<number, number>,
        turnaroundTimes: {} as Record<number, number>,
        message: 'Click Play to start SRTF scheduling'
    });
    const [isPlaying, setIsPlaying] = useState(false);
    const [steps, setSteps] = useState<any[]>([]);
    const [, setCurrentStepIndex] = useState(0);

    const algorithmData: AlgorithmData = {
        id: 'srtf',
        title: 'Shortest Remaining Time First (SRTF)',
        category: 'CPU Scheduling',
        definition: 'SRTF is a preemptive version of Shortest Job First (SJF) scheduling. At each time unit, the process with the shortest remaining burst time is selected for execution. If a new process arrives with a shorter remaining time than the currently executing process, the CPU is preempted and allocated to the new process. This minimizes average waiting time but requires frequent context switching.',
        realWorldUse: 'SRTF is used in time-critical systems where minimizing response time is crucial, such as real-time operating systems, embedded systems, and high-performance computing environments. It\'s ideal for scenarios where process burst times are known in advance and context switching overhead is acceptable.',
        pros: [
            'Minimizes average waiting time (optimal)',
            'Provides better response time than SJF',
            'Efficient for time-critical applications',
            'Reduces turnaround time for short processes',
            'Adapts dynamically to new arrivals'
        ],
        cons: [
            'Requires knowledge of remaining burst times',
            'High context switching overhead',
            'Can cause starvation for long processes',
            'Complex to implement',
            'Not practical without accurate burst time prediction'
        ],
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(n)',
        workingSteps: [
            {
                step: 1,
                title: 'Check Remaining Time',
                description: 'For every new task arrival or completion, checking the remaining time of all available tasks.',
                variables: [
                    { name: 'remaining_time', type: 'int', purpose: 'Time left to complete' }
                ],
                codeSnippet: 'check remaining_time for all processes'
            },
            {
                step: 2,
                title: 'Switch if Needed',
                description: 'If a new job arrives that can finish faster than the current one, stop the current one and start the new one (Preemption).',
                codeSnippet: 'if new_job.time < current_job.remaining:\\n    switch_to(new_job)'
            },
            {
                step: 3,
                title: 'Finish & Repeat',
                description: 'Once a task is done, again pick the one with the shortest remaining time from the list.',
                codeSnippet: 'repeat until all done'
            }
        ],
        defaultInputs,
        cCode: `#include <stdio.h>
#include <stdbool.h>
#include <limits.h>

struct Process {
    int id;
    int arrivalTime;
    int burstTime;
    int remainingTime;
    int completionTime;
    int waitingTime;
    int turnaroundTime;
    bool completed;
};

void calculateTimes(struct Process p[], int n) {
    int currentTime = 0;
    int completedCount = 0;

    // Initialize remaining time
    for (int i = 0; i < n; i++) {
        p[i].remainingTime = p[i].burstTime;
        p[i].completed = false;
    }

    while (completedCount < n) {
        int shortestIdx = -1;
        int minRemaining = INT_MAX;

        // Find process with shortest remaining time among arrived ones
        for (int i = 0; i < n; i++) {
            if (p[i].arrivalTime <= currentTime && !p[i].completed) {
                if (p[i].remainingTime < minRemaining) {
                    minRemaining = p[i].remainingTime;
                    shortestIdx = i;
                }
            }
        }

        if (shortestIdx == -1) {
            currentTime++; 
        } else {
            // Execute for 1 unit of time
            p[shortestIdx].remainingTime--;
            currentTime++;

            if (p[shortestIdx].remainingTime == 0) {
                p[shortestIdx].completed = true;
                completedCount++;
                p[shortestIdx].completionTime = currentTime;
                p[shortestIdx].turnaroundTime = p[shortestIdx].completionTime - p[shortestIdx].arrivalTime;
                p[shortestIdx].waitingTime = p[shortestIdx].turnaroundTime - p[shortestIdx].burstTime;
            }
        }
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
        {1, 0, 8, 0, 0, 0, 0, false},
        {2, 1, 4, 0, 0, 0, 0, false},
        {3, 2, 9, 0, 0, 0, 0, false},
        {4, 3, 5, 0, 0, 0, 0, false}
    };
    int n = sizeof(p) / sizeof(p[0]);

    calculateTimes(p, n);
    printTable(p, n);

    return 0;
}`,
        pythonCode: `def srtf_scheduling(processes):
    # processes: list of dicts {id, arrival, burst}
    
    n = len(processes)
    remaining_time = {p['id']: p['burst'] for p in processes}
    completion_time = {}
    gantt_chart = []
    
    current_time = 0
    completed = 0
    last_process = None
    
    print(f"{'Time':<10}{'Action':<40}")
    print("-" * 50)
    
    while completed < n:
        # Filter arrived processes with remaining time
        arrived = [p for p in processes 
                  if p['arrival'] <= current_time 
                  and remaining_time[p['id']] > 0]
        
        if not arrived:
            current_time += 1
            continue
            
        # Select shortest remaining time
        shortest = min(arrived, key=lambda p: remaining_time[p['id']])
        pid = shortest['id']
        
        # Execute for 1 unit
        if last_process != pid:
            print(f"{current_time:<10}Switch to {pid} (Rem: {remaining_time[pid]})")
        
        remaining_time[pid] -= 1
        current_time += 1
        last_process = pid
        
        if remaining_time[pid] == 0:
            completion_time[pid] = current_time
            completed += 1
            print(f"{current_time:<10}{pid} Finished")

    # Metrics
    total_wait = 0
    total_turn = 0
    print("-" * 50)
    print(f"{'Process':<10}{'Turnaround':<12}{'Waiting':<10}")
    
    for p in processes:
        turn = completion_time[p['id']] - p['arrival']
        wait = turn - p['burst']
        total_turn += turn
        total_wait += wait
        print(f"{p['id']:<10}{turn:<12}{wait:<10}")
        
    print("-" * 50)
    print(f"Avg Waiting Time: {total_wait/n:.2f}")

# Example
processes = [
    {'id': 'P1', 'arrival': 0, 'burst': 8},
    {'id': 'P2', 'arrival': 1, 'burst': 4},
    {'id': 'P3', 'arrival': 2, 'burst': 9},
    {'id': 'P4', 'arrival': 3, 'burst': 5}
]

srtf_scheduling(processes)`,
        examples: [
            {
                title: 'Example 1: SRTF with Preemption',
                input: 'Processes: P1(AT=0, BT=8), P2(AT=1, BT=4), P3(AT=2, BT=9), P4(AT=3, BT=5)',
                output: 'Execution Order: P1→P2→P4→P1→P3\\nAvg Waiting Time: 6.5 units',
                explanation: 'P1 starts at t=0. At t=1, P2 arrives with BT=4 < remaining(P1)=7, so P2 preempts P1. At t=3, P4 arrives with BT=5 > remaining(P2)=2, so P2 continues. P2 completes at t=5, then P4 executes (BT=5 < remaining(P1)=7). This demonstrates how SRTF dynamically selects the process with shortest remaining time.'
            },
            {
                title: 'Example 2: No Preemption Needed',
                input: 'Processes: P1(AT=0, BT=3), P2(AT=1, BT=6), P3(AT=2, BT=4)',
                output: 'Execution Order: P1→P3→P2\\nNo preemptions occur',
                explanation: 'P1 completes before P2 or P3 can preempt it. When P1 finishes at t=3, P3 has shorter remaining time (4) than P2 (6), so P3 executes next. This shows SRTF behaves like SJF when no preemption is beneficial.'
            }
        ]
    };

    // SRTF Algorithm Implementation
    const runSRTF = () => {
        const processes = inputs.processes.map(p => ({ ...p, remainingTime: p.burstTime }));
        const n = processes.length;
        const totalBurst = processes.reduce((acc, p) => acc + p.burstTime, 0);
        // Safety break
        const maxTime = Math.max(...processes.map(p => p.arrivalTime)) + totalBurst + 10;

        let currentTime = 0;
        let completed = 0;
        const completionTimes: Record<number, number> = {};
        const ganttBlocks: any[] = [];
        const animationSteps: any[] = [];

        // Helper to find shortest remaining time process
        const getShortest = (time: number) => {
            let shortest: any = null;
            let minRemaining = Infinity;

            processes.forEach(p => {
                if (p.arrivalTime <= time && p.remainingTime > 0) {
                    if (p.remainingTime < minRemaining) {
                        minRemaining = p.remainingTime;
                        shortest = p;
                    } else if (p.remainingTime === minRemaining) {
                        // Tie-breaker: Arrival time
                        if (shortest && p.arrivalTime < shortest.arrivalTime) {
                            shortest = p;
                        } else if (!shortest) {
                            shortest = p;
                        }
                    }
                }
            });
            return shortest;
        };

        let lastProcessId = -1;

        while (completed < n && currentTime < maxTime) {
            const currentProcess = getShortest(currentTime);

            if (currentProcess) {
                // Execute for 1 unit
                if (lastProcessId !== currentProcess.id) {
                    ganttBlocks.push({
                        processName: currentProcess.name,
                        startTime: currentTime,
                        endTime: currentTime + 1,
                        processId: currentProcess.id
                    });
                } else {
                    // Extend last block
                    ganttBlocks[ganttBlocks.length - 1].endTime++;
                }

                currentProcess.remainingTime--;
                currentTime++;
                lastProcessId = currentProcess.id;

                if (currentProcess.remainingTime === 0) {
                    completed++;
                    completionTimes[currentProcess.id] = currentTime;
                }

                // Calculate interim stats for visualization
                const currentWaitingTimes: Record<number, number> = {};
                const currentTurnaroundTimes: Record<number, number> = {};

                // Snapshot for this step
                animationSteps.push({
                    ganttBlocks: JSON.parse(JSON.stringify(ganttBlocks)),
                    currentTime,
                    waitingTimes: currentWaitingTimes, // Populate if needed for live stats
                    turnaroundTimes: currentTurnaroundTimes,
                    message: `Executing ${currentProcess.name} (Remaining: ${currentProcess.remainingTime})`
                });

            } else {
                // Idle time
                currentTime++;
            }
        }

        // Final stats
        const finalWaitingTimes: Record<number, number> = {};
        const finalTurnaroundTimes: Record<number, number> = {};

        inputs.processes.forEach(p => {
            const turn = completionTimes[p.id] - p.arrivalTime;
            finalTurnaroundTimes[p.id] = turn;
            finalWaitingTimes[p.id] = turn - p.burstTime;
        });

        // Add final step with full stats
        animationSteps.push({
            ganttBlocks: [...ganttBlocks],
            currentTime,
            waitingTimes: finalWaitingTimes,
            turnaroundTimes: finalTurnaroundTimes,
            message: 'SRTF Scheduling Completed'
        });

        return animationSteps;
    };

    const handlePlay = () => {
        if (!isPlaying) {
            if (steps.length === 0) {
                const newSteps = runSRTF();
                setSteps(newSteps);
                setCurrentStepIndex(0);
            }
            setIsPlaying(true);
        }
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    const handleReset = () => {
        setIsPlaying(false);
        setSteps([]);
        setCurrentStepIndex(0);
        setAnimationState({
            ganttBlocks: [],
            currentTime: 0,
            waitingTimes: {},
            turnaroundTimes: {},
            message: 'Click Play to start SRTF scheduling'
        });
    };

    // Animation Loop
    useEffect(() => {
        if (isPlaying && steps.length > 0) {
            const timer = setInterval(() => {
                setCurrentStepIndex(prev => {
                    if (prev >= steps.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    setAnimationState(steps[prev + 1]);
                    return prev + 1;
                });
            }, 1000); // 1 second per step
            return () => clearInterval(timer);
        }
    }, [isPlaying, steps]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
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
                    <h2 className="section-title">What is SRTF?</h2>
                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-4">{algorithmData.definition}</p>
                    <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-500 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">Real-World Applications</h3>
                        <p className="text-blue-900 dark:text-blue-50 text-sm">{algorithmData.realWorldUse}</p>
                    </div>
                </div>

                <ProsConsSection
                    pros={algorithmData.pros}
                    cons={algorithmData.cons}
                    timeComplexity={algorithmData.timeComplexity}
                    spaceComplexity={algorithmData.spaceComplexity}
                />

                <div className="card">
                    <h2 className="section-title">Interactive Visualization</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Watch how SRTF preemptively schedules processes based on shortest remaining time.
                    </p>
                    <GanttChart
                        processes={inputs.processes}
                        ganttBlocks={animationState.ganttBlocks.map((block: any) => ({
                            processName: block.process,
                            startTime: block.start,
                            endTime: block.end,
                            processId: inputs.processes.find(p => p.name === block.process)?.id || 0
                        }))}
                        currentTime={animationState.currentTime}
                        waitingTimes={animationState.waitingTimes}
                        turnaroundTimes={animationState.turnaroundTimes}
                        message={animationState.message}
                        isPlaying={isPlaying}
                        onPlayPause={() => isPlaying ? handlePause() : handlePlay()}
                        onReset={handleReset}
                    />

                    {Object.keys(animationState.waitingTimes).length > 0 && (
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-2">Waiting Times</h3>
                                <ul className="space-y-1">
                                    {inputs.processes.map(p => (
                                        <li key={p.id} className="text-sm text-gray-700 dark:text-gray-200">
                                            {p.name}: {animationState.waitingTimes[p.id]} units
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-2">Turnaround Times</h3>
                                <ul className="space-y-1">
                                    {inputs.processes.map(p => (
                                        <li key={p.id} className="text-sm text-gray-700 dark:text-gray-200">
                                            {p.name}: {animationState.turnaroundTimes[p.id]} units
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                <WorkingSection steps={algorithmData.workingSteps} />

                <CodeEditor
                    cCode={algorithmData.cCode}
                    pythonCode={algorithmData.pythonCode}
                />

                <ExampleSection examples={algorithmData.examples} />
            </div>
        </div>
    );
};

export default SRTF;
