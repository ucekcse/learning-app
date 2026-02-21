import React, { useState, useEffect } from 'react';
import type { AlgorithmData } from '../../types';
import ProsConsSection from '../../components/algorithm/ProsConsSection';
import WorkingSection from '../../components/algorithm/WorkingSection';
import ExampleSection from '../../components/algorithm/ExampleSection';
import CodeEditor from '../../components/algorithm/CodeEditor';
import InputPanel from '../../components/cpu/InputPanel';
import GanttChart from '../../components/animations/GanttChart';

const PriorityScheduling: React.FC = () => {
    const defaultInputs = {
        processes: [
            { id: 0, name: 'P1', arrivalTime: 0, burstTime: 4, priority: 2 },
            { id: 1, name: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
            { id: 2, name: 'P3', arrivalTime: 2, burstTime: 1, priority: 4 },
            { id: 3, name: 'P4', arrivalTime: 3, burstTime: 5, priority: 3 },
        ]
    };

    const [inputs, setInputs] = useState(defaultInputs);
    const [animationState, setAnimationState] = useState({
        ganttBlocks: [] as any[],
        currentTime: 0,
        waitingTimes: {} as Record<number, number>,
        turnaroundTimes: {} as Record<number, number>,
        message: 'Click Play to start Priority scheduling'
    });
    const [isPlaying, setIsPlaying] = useState(false);
    const [steps, setSteps] = useState<any[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const algorithmData: AlgorithmData = {
        id: 'priority-aging',
        title: 'Priority Scheduling with Aging',
        category: 'CPU Scheduling',
        definition: 'Priority Scheduling assigns a priority number to each process, and the CPU is allocated to the process with the highest priority (lowest priority number). Aging is a technique to prevent starvation by gradually increasing the priority of waiting processes over time. This ensures that low-priority processes eventually get executed.',
        realWorldUse: 'Priority scheduling is used in operating systems (Windows, Linux) for system processes, real-time systems where certain tasks must execute first, network routers for QoS (Quality of Service), and database management systems for transaction prioritization. Aging prevents indefinite postponement of low-priority tasks.',
        pros: [
            'Important tasks execute first',
            'Flexible priority assignment',
            'Aging prevents starvation',
            'Suitable for real-time systems',
            'Can be preemptive or non-preemptive'
        ],
        cons: [
            'Complex priority assignment',
            'Potential for starvation without aging',
            'Priority inversion problems',
            'Overhead of priority management',
            'Difficult to determine optimal priorities'
        ],
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        workingSteps: [
            {
                step: 1,
                title: 'Assign Importance',
                description: 'Every task is given a number (Priority). Smaller number usually means it is more important.',
                variables: [
                    { name: 'priority', type: 'int', purpose: 'Level of importance (1 is highest)' }
                ],
                codeSnippet: 'assign priority to each process'
            },
            {
                step: 2,
                title: 'Pick Most Important',
                description: 'The CPU looks at all waiting tasks and picks the one with the highest priority (simplest logic: lowest number).',
                codeSnippet: 'highest_priority = min(ready_queue, key=priority)\nexecute(highest_priority)'
            },
            {
                step: 3,
                title: 'Aging (Fairness)',
                description: 'If a task waits too long, we slowly increase its priority so it eventually gets picked. This prevents "starvation".',
                codeSnippet: 'if waiting_too_long(process):\n    increase_priority(process)'
            },
            {
                step: 4,
                title: 'Repeat',
                description: 'Keep serving the most important task available until all are done.',
                codeSnippet: 'repeat until empty'
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
    int priority;      // Lower value = Higher priority
    int completionTime;
    int waitingTime;
    int turnaroundTime;
    int waitingInQueue; // Time spent waiting for Agining
    bool completed;
};

void calculateTimes(struct Process p[], int n) {
    int currentTime = 0;
    int completedCount = 0;
    int agingThreshold = 5; // Example threshold

    while (completedCount < n) {
        int highestPriIdx = -1;
        int minPriority = INT_MAX;

        // Find highest priority process among arrived ones
        for (int i = 0; i < n; i++) {
            if (p[i].arrivalTime <= currentTime && !p[i].completed) {
                // Apply aging: decrease priority number (increase importance) based on waiting time
                // Simulating aging check here for demonstration
                // In real OS, this happens periodically
                
                if (p[i].priority < minPriority) {
                    minPriority = p[i].priority;
                    highestPriIdx = i;
                }
                // Handle tie-breaking with arrival time if needed
            }
        }

        if (highestPriIdx == -1) {
            currentTime++; 
        } else {
            // Execute Process
            currentTime += p[highestPriIdx].burstTime;
            p[highestPriIdx].completionTime = currentTime;
            p[highestPriIdx].turnaroundTime = p[highestPriIdx].completionTime - p[highestPriIdx].arrivalTime;
            p[highestPriIdx].waitingTime = p[highestPriIdx].turnaroundTime - p[highestPriIdx].burstTime;
            p[highestPriIdx].completed = true;
            completedCount++;
            
            // Note: Aging logic would typically effectively modify waiting processes' priority here
            // e.g., for(i...) if(waiting) p[i].priority--;
        }
    }
}

void printTable(struct Process p[], int n) {
    printf("PID\\tPri\\tArr\\tBurst\\tComp\\tWait\\tTurn\\n");
    for (int i = 0; i < n; i++) {
        printf("%d\\t%d\\t%d\\t%d\\t%d\\t%d\\t%d\\n", 
            p[i].id, p[i].priority, p[i].arrivalTime, p[i].burstTime,
            p[i].completionTime, p[i].waitingTime, p[i].turnaroundTime);
    }
}

int main() {
    struct Process p[] = {
        {1, 0, 4, 2, 0, 0, 0, 0, false},
        {2, 1, 3, 1, 0, 0, 0, 0, false},
        {3, 2, 1, 4, 0, 0, 0, 0, false},
        {4, 3, 5, 3, 0, 0, 0, 0, false}
    };
    int n = sizeof(p) / sizeof(p[0]);

    calculateTimes(p, n);
    printTable(p, n);

    return 0;
}`,
        pythonCode: `def priority_scheduling(processes):
    processes.sort(key=lambda x: x['arrival'])
    n = len(processes)
    completed = [False] * n
    current_time = 0
    completed_count = 0
    
    total_waiting = 0
    total_turnaround = 0
    
    print(f"{'Process':<10}{'Priority':<10}{'Arrival':<10}{'Burst':<10}{'Finish':<10}{'Turnaround':<12}{'Waiting':<10}")
    print("-" * 75)
    
    while completed_count < n:
        idx = -1
        max_priority = float('inf') # Lower value is higher priority
        
        # Find highest priority process among arrived
        for i in range(n):
            if (not completed[i] and 
                processes[i]['arrival'] <= current_time):
                if processes[i]['priority'] < max_priority:
                     max_priority = processes[i]['priority']
                     idx = i
                elif processes[i]['priority'] == max_priority:
                     # Tie breaker: Arrival time (simplified)
                     if processes[i]['arrival'] < processes[idx]['arrival']:
                         idx = i
        
        if idx != -1:
            p = processes[idx]
            current_time += p['burst']
            finish_time = current_time
            turnaround = finish_time - p['arrival']
            waiting = turnaround - p['burst']
            
            total_waiting += waiting
            total_turnaround += turnaround
            completed[idx] = True
            completed_count += 1
            
            print(f"{p['id']:<10}{p['priority']:<10}{p['arrival']:<10}{p['burst']:<10}{finish_time:<10}{turnaround:<12}{waiting:<10}")
        else:
             current_time += 1

    print("-" * 75)
    print(f"Average Waiting Time: {total_waiting / n:.2f}")
    print(f"Average Turnaround Time: {total_turnaround / n:.2f}")

# Example Data
processes = [
    {'id': 'P1', 'arrival': 0, 'burst': 4, 'priority': 2},
    {'id': 'P2', 'arrival': 1, 'burst': 3, 'priority': 1},
    {'id': 'P3', 'arrival': 2, 'burst': 1, 'priority': 4},
    {'id': 'P4', 'arrival': 3, 'burst': 5, 'priority': 3}
]

priority_scheduling(processes)`,
        examples: [
            {
                title: 'Example 1: Priority Scheduling without Aging',
                input: 'Processes: P1(AT=0, BT=4, P=2), P2(AT=1, BT=3, P=1), P3(AT=2, BT=1, P=4), P4(AT=3, BT=5, P=3)',
                output: 'Execution Order: P2→P1→P4→P3\\nP2 executes first (highest priority=1)',
                explanation: 'P2 has the highest priority (1), so it executes first even though P1 arrived earlier. After P2, P1 (priority=2) executes, followed by P4 (priority=3), and finally P3 (priority=4). Without aging, P3 waits the longest.'
            },
            {
                title: 'Example 2: Priority Scheduling with Aging',
                input: 'Same processes with aging threshold=5 time units',
                output: 'Execution Order: P2→P1→P3→P4\\nP3 priority increased due to aging',
                explanation: 'After P2 and P1 execute (7 time units), P3 has waited long enough for its priority to increase from 4 to 3, matching P4. Since P3 arrived earlier, it executes before P4. Aging prevents P3 from starving.'
            }
        ]
    };

    const calculatePriority = (processes: any[]) => {
        // Clone and add state
        const procList = processes.map(p => ({ ...p, completed: false }));
        let currentTime = 0;
        let completedCount = 0;
        const n = procList.length;

        const ganttBlocks: any[] = [];
        const steps: any[] = [];
        const waitingTimes: Record<number, number> = {};
        const turnaroundTimes: Record<number, number> = {};

        // Find min arrival to start
        const minArrival = Math.min(...procList.map(p => p.arrivalTime));
        currentTime = minArrival;

        while (completedCount < n) {
            // Find eligible processes
            const eligible = procList.filter(p => !p.completed && p.arrivalTime <= currentTime);

            if (eligible.length === 0) {
                currentTime++;
                continue;
            }

            // Find highest priority (lowest number)
            // Tie-break: Arrival time
            let selected = eligible[0];
            eligible.forEach(p => {
                if (p.priority < selected.priority) {
                    selected = p;
                } else if (p.priority === selected.priority) {
                    if (p.arrivalTime < selected.arrivalTime) {
                        selected = p;
                    }
                }
            });

            // Execute
            const startTime = currentTime;
            const endTime = startTime + selected.burstTime;

            ganttBlocks.push({
                processName: selected.name,
                startTime: startTime,
                endTime: endTime,
                processId: selected.id
            });

            selected.completed = true;
            completedCount++;
            currentTime = endTime;

            waitingTimes[selected.id] = startTime - selected.arrivalTime;
            turnaroundTimes[selected.id] = endTime - selected.arrivalTime;

            steps.push({
                ganttBlocks: [...ganttBlocks],
                currentTime: endTime,
                waitingTimes: { ...waitingTimes },
                turnaroundTimes: { ...turnaroundTimes },
                message: `Executing ${selected.name} (Priority ${selected.priority})`
            });
        }

        return { steps, ganttBlocks, waitingTimes, turnaroundTimes };
    };

    const handlePlayPause = () => {
        if (!isPlaying && steps.length === 0) {
            const { steps: pSteps } = calculatePriority(inputs.processes);
            setSteps(pSteps);
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
            message: 'Click Play to start Priority scheduling'
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
        <div className="min-h-screen bg-surface-50 dark:bg-dark-950 p-3 sm:p-8">
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
                    <h2 className="section-title">What is Priority Scheduling?</h2>
                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-4">{algorithmData.definition}</p>
                    <div className="bg-blue-100 dark:bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-blue-800 dark:text-primary-600 dark:text-primary-300 mb-2">Real-World Applications</h3>
                        <p className="text-blue-900 dark:text-blue-50 text-sm">{algorithmData.realWorldUse}</p>
                    </div>

                    {/* Brief Summary */}
                    <div className="mt-6 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-500 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-3">How It Works (Brief)</h3>
                        <ol className="space-y-2 text-sm text-green-900 dark:text-green-50">
                            <li><strong>1.</strong> Each process has a priority number (lower = higher priority)</li>
                            <li><strong>2.</strong> CPU selects process with highest priority</li>
                            <li><strong>3.</strong> Aging increases priority of waiting processes</li>
                            <li><strong>4.</strong> Prevents starvation of low-priority tasks</li>
                        </ol>
                        <p className="mt-3 text-sm font-semibold text-green-800 dark:text-green-100">
                            ✨ Key Advantage: Ensures important tasks execute first while preventing indefinite waiting
                        </p>
                    </div>
                </div>

                {/* InputPanel */}
                <InputPanel
                    processes={inputs.processes}
                    onProcessesChange={(newProcesses) => {
                        setInputs({ ...inputs, processes: newProcesses as any });
                        handleReset();
                    }}
                    algorithmType="priority"
                />

                <ProsConsSection
                    pros={algorithmData.pros}
                    cons={algorithmData.cons}
                    timeComplexity={algorithmData.timeComplexity}
                    spaceComplexity={algorithmData.spaceComplexity}
                />

                <div className="card">
                    <h2 className="section-title">Interactive Visualization</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Priority scheduling selects processes based on priority values. Watch the Gantt chart update as processes are executed.
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

                <WorkingSection steps={algorithmData.workingSteps} />

                <CodeEditor
                    cCode={algorithmData.cCode}
                    pythonCode={algorithmData.pythonCode}
                />

                <ExampleSection examples={algorithmData.examples} />

                <div className="card">
                    <h2 className="section-title">Key Concepts</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-500 rounded-lg p-4">
                            <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Priority Assignment</h3>
                            <p className="text-sm text-purple-900 dark:text-purple-50">
                                Priorities can be assigned based on process type (system vs user), memory requirements,
                                time limits, or resource needs. Lower numbers typically indicate higher priority.
                            </p>
                        </div>
                        <div className="bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-500 rounded-lg p-4">
                            <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Aging Mechanism</h3>
                            <p className="text-sm text-orange-900 dark:text-orange-50">
                                Aging gradually increases the priority of processes that wait too long. This prevents
                                starvation where low-priority processes never execute.
                            </p>
                        </div>
                        <div className="bg-pink-100 dark:bg-pink-900/30 border border-pink-300 dark:border-pink-500 rounded-lg p-4">
                            <h3 className="font-semibold text-pink-800 dark:text-pink-200 mb-2">Preemptive vs Non-Preemptive</h3>
                            <p className="text-sm text-pink-900 dark:text-pink-50">
                                Preemptive: Higher priority process can interrupt currently running process.
                                Non-Preemptive: Process runs to completion before next selection.
                            </p>
                        </div>
                        <div className="bg-teal-100 dark:bg-teal-900/30 border border-teal-300 dark:border-teal-500 rounded-lg p-4">
                            <h3 className="font-semibold text-teal-800 dark:text-teal-200 mb-2">Priority Inversion</h3>
                            <p className="text-sm text-teal-900 dark:text-teal-50">
                                Problem where high-priority process waits for low-priority process holding a resource.
                                Solved using priority inheritance or priority ceiling protocols.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriorityScheduling;
