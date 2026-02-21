import React, { useState } from 'react';
import type { AlgorithmData } from '../../types';
import ProsConsSection from '../../components/algorithm/ProsConsSection';
import WorkingSection from '../../components/algorithm/WorkingSection';
import ExampleSection from '../../components/algorithm/ExampleSection';
import CodeEditor from '../../components/algorithm/CodeEditor';
import InputPanel from '../../components/algorithm/InputPanel';
// GanttChart can be integrated for visual timeline

const SJF: React.FC = () => {
    const defaultInputs = {
        processes: [
            { id: 'P1', arrivalTime: 0, burstTime: 6 },
            { id: 'P2', arrivalTime: 2, burstTime: 2 },
            { id: 'P3', arrivalTime: 4, burstTime: 8 },
            { id: 'P4', arrivalTime: 5, burstTime: 3 }
        ]
    };

    const [, setInputs] = useState(defaultInputs);

    const algorithmData: AlgorithmData = {
        id: 'sjf',
        title: 'Shortest Job First (Non-Preemptive)',
        category: 'CPU Scheduling',
        definition: 'Shortest Job First (SJF) is a CPU scheduling algorithm that selects the process with the smallest burst time from the ready queue. In non-preemptive SJF, once a process starts executing, it runs to completion. This minimizes average waiting time.',
        realWorldUse: 'SJF is used in batch processing systems, background task scheduling, print job scheduling where job sizes are known, and in operating systems for optimizing throughput. While pure SJF is rare due to burst time prediction difficulty, variants are common.',
        pros: [
            'Minimizes average waiting time',
            'Optimal for batch systems',
            'Better throughput than FCFS',
            'Reduces average turnaround time',
            'Simple to understand and implement'
        ],
        cons: [
            'Requires knowing burst time in advance',
            'Can cause starvation of longer processes',
            'Not suitable for interactive systems',
            'Prediction of burst time is difficult',
            'Fairness issues - longer jobs may never execute'
        ],
        timeComplexity: 'O(n log n) for sorting',
        spaceComplexity: 'O(n)',
        workingSteps: [
            {
                step: 1,
                title: 'Sort by Duration',
                description: 'Imagine you have several tasks. You arrange them so that the one taking the shortest time is at the front.',
                variables: [
                    { name: 'ready_queue', type: 'list', purpose: 'List of waiting tasks' },
                    { name: 'shortest_job', type: 'Process', purpose: 'Task with minimum burst time' }
                ],
                codeSnippet: 'sort(ready_queue, by burst_time)'
            },
            {
                step: 2,
                title: 'Do the Quickest Job',
                description: 'The CPU picks the shortest task and finishes it completely before looking at the queue again.',
                codeSnippet: 'process = ready_queue.first()\nexecute(process)'
            },
            {
                step: 3,
                title: 'Check for New Tasks',
                description: 'While a task is running, new ones might arrive. They join the queue and get sorted based on their duration.',
                codeSnippet: 'add new_arrivals to ready_queue\nre-sort(ready_queue)'
            },
            {
                step: 4,
                title: 'Repeat',
                description: 'Keep picking the shortest available task until everything is done.',
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
    int completionTime;
    int waitingTime;
    int turnaroundTime;
    bool completed;
};

void calculateTimes(struct Process p[], int n) {
    int currentTime = 0;
    int completedCount = 0;

    while (completedCount < n) {
        int shortestIdx = -1;
        int minBurst = INT_MAX;

        // Find process with shortest burst time among those that have arrived
        for (int i = 0; i < n; i++) {
            if (p[i].arrivalTime <= currentTime && !p[i].completed) {
                if (p[i].burstTime < minBurst) {
                    minBurst = p[i].burstTime;
                    shortestIdx = i;
                }
            }
        }

        if (shortestIdx == -1) {
            currentTime++; // No process available, increment time
        } else {
            // Execute the shortest process
            currentTime += p[shortestIdx].burstTime;
            p[shortestIdx].completionTime = currentTime;
            p[shortestIdx].turnaroundTime = p[shortestIdx].completionTime - p[shortestIdx].arrivalTime;
            p[shortestIdx].waitingTime = p[shortestIdx].turnaroundTime - p[shortestIdx].burstTime;
            p[shortestIdx].completed = true;
            completedCount++;
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
    // Example Processes
    struct Process p[] = {
        {1, 0, 6, 0, 0, 0, false},
        {2, 2, 2, 0, 0, 0, false},
        {3, 4, 8, 0, 0, 0, false},
        {4, 5, 3, 0, 0, 0, false}
    };
    int n = sizeof(p) / sizeof(p[0]);

    calculateTimes(p, n);
    printTable(p, n);

    return 0;
}`,
        pythonCode: `def sjf_scheduling(processes):
    processes.sort(key=lambda x: (x['arrival'], x['burst']))
    
    n = len(processes)
    completed = [False] * n
    current_time = 0
    completed_count = 0
    
    total_waiting = 0
    total_turnaround = 0
    
    print(f"{'Process':<10}{'Arrival':<10}{'Burst':<10}{'Finish':<10}{'Turnaround':<12}{'Waiting':<10}")
    print("-" * 65)
    
    while completed_count < n:
        # Find available process with shortest burst
        idx = -1
        min_burst = float('inf')
        
        for i in range(n):
            if (not completed[i] and 
                processes[i]['arrival'] <= current_time and 
                processes[i]['burst'] < min_burst):
                min_burst = processes[i]['burst']
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
            
            print(f"{p['id']:<10}{p['arrival']:<10}{p['burst']:<10}{finish_time:<10}{turnaround:<12}{waiting:<10}")
        else:
            current_time += 1
            
    print("-" * 65)
    print(f"Average Waiting Time: {total_waiting / n:.2f}")
    print(f"Average Turnaround Time: {total_turnaround / n:.2f}")

# Example Data
processes = [
    {'id': 'P1', 'arrival': 0, 'burst': 6},
    {'id': 'P2', 'arrival': 2, 'burst': 2},
    {'id': 'P3', 'arrival': 4, 'burst': 8},
    {'id': 'P4', 'arrival': 5, 'burst': 3}
]

sjf_scheduling(processes)`,
        examples: [
            {
                title: 'Example: SJF Scheduling',
                input: {
                    processes: [
                        { id: 'P1', arrivalTime: 0, burstTime: 6 },
                        { id: 'P2', arrivalTime: 2, burstTime: 2 },
                        { id: 'P3', arrivalTime: 4, burstTime: 8 },
                        { id: 'P4', arrivalTime: 5, burstTime: 3 }
                    ]
                },
                output: { order: ['P1', 'P2', 'P4', 'P3'], avgWaiting: 4 },
                explanation: 'At t=0, only P1 available, execute P1 (0-6). At t=6, P2,P3,P4 available. P2 has shortest burst (2), execute P2 (6-8). Then P4 (burst=3) shorter than P3 (burst=8), execute P4 (8-11). Finally P3 (11-19). Avg waiting time is minimized.'
            }
        ]
    };

    const handleInputChange = (newInputs: any) => {
        // Parse process input
        setInputs(newInputs);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-3 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="card">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-2">{algorithmData.title}</h1>
                    <span className="algorithm-badge badge-cpu">{algorithmData.category}</span>
                </div>

                <div className="card">
                    <h2 className="section-title">What is Shortest Job First?</h2>
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

                <WorkingSection steps={algorithmData.workingSteps} />

                <div className="card">
                    <h2 className="section-title">Gantt Chart Visualization</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Process execution timeline showing SJF scheduling order.
                    </p>
                    <div className="bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-4 sm:p-8">
                        <p className="text-gray-700 dark:text-gray-200 text-center">
                            SJF selects the process with shortest burst time, minimizing average waiting time.
                        </p>
                    </div>
                </div>

                <InputPanel
                    defaultInputs={defaultInputs}
                    onInputChange={handleInputChange}
                    inputFields={[
                        { key: 'processes', label: 'CPU Processes', type: 'processes' }
                    ]}
                />

                <CodeEditor
                    cCode={algorithmData.cCode}
                    pythonCode={algorithmData.pythonCode}
                />
                <ExampleSection examples={algorithmData.examples} />
            </div>
        </div>
    );
};

export default SJF;
