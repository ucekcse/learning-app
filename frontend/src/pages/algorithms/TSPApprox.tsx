import React, { useState, useEffect } from "react";
import type { AlgorithmData } from "../../types";
import ProsConsSection from "../../components/algorithm/ProsConsSection";
import WorkingSection from "../../components/algorithm/WorkingSection";
import CodeEditor from "../../components/algorithm/CodeEditor";
import TSPVisualizer from "../../components/animations/TSPVisualizer";

const TSPApprox: React.FC = () => {
  const [cities, setCities] = useState<{ x: number; y: number; id: number }[]>(
    [],
  );
  const [path, setPath] = useState<number[]>([]);
  const [currentEdge, setCurrentEdge] = useState<
    { from: number; to: number } | undefined
  >();
  const [message, setMessage] = useState("Click Re-generate to create cities");
  const [isPlaying, setIsPlaying] = useState(false);
  const [cost, setCost] = useState(0);

  const isPlayingRef = React.useRef(false);

  const generateCities = (n: number) => {
    const newCities = [];
    for (let i = 0; i < n; i++) {
      newCities.push({
        id: i,
        x: Math.random() * 500 + 50,
        y: Math.random() * 300 + 50,
      });
    }
    setCities(newCities);
    setPath([]);
    setCurrentEdge(undefined);
    setCost(0);
    setMessage("Cities generated. Click Start to run Nearest Neighbor.");
  };

  useEffect(() => {
    generateCities(15);
  }, []);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const dist = (c1: any, c2: any) =>
    Math.sqrt((c1.x - c2.x) ** 2 + (c1.y - c2.y) ** 2);

  const solveTSPApprox = async () => {
    if (isPlayingRef.current) return;
    setIsPlaying(true);
    isPlayingRef.current = true;

    const n = cities.length;
    if (n === 0) return;

    const visited = new Array(n).fill(false);
    const currentPath = [0];
    visited[0] = true;
    let currentCity = 0;
    let totalCost = 0;

    setPath([0]);
    setMessage("Starting at City 0");
    await sleep(500);

    for (let i = 0; i < n - 1; i++) {
      if (!isPlayingRef.current) break;

      let nearestCity = -1;
      let minDistance = Infinity;

      // Find nearest unvisited
      for (let j = 0; j < n; j++) {
        if (!visited[j]) {
          const d = dist(cities[currentCity], cities[j]);

          // Visualize checking edge
          setCurrentEdge({ from: currentCity, to: j });
          await sleep(50); // Fast check

          if (d < minDistance) {
            minDistance = d;
            nearestCity = j;
          }
        }
      }

      if (nearestCity !== -1) {
        visited[nearestCity] = true;
        currentPath.push(nearestCity);
        setPath([...currentPath]);
        totalCost += minDistance;
        setCost(totalCost);

        // Highlight choice
        setCurrentEdge({ from: currentCity, to: nearestCity });
        setMessage(
          `Moved to City ${nearestCity} (Dist: ${Math.round(minDistance)})`,
        );
        currentCity = nearestCity;
        await sleep(400);
      }
    }

    // Return to start
    if (isPlayingRef.current) {
      const d = dist(cities[currentCity], cities[0]);
      totalCost += d;
      setCost(totalCost);
      currentPath.push(0); // Complete loop
      setPath([...currentPath]);
      setCurrentEdge({ from: currentCity, to: 0 });
      setMessage(`Returned to start. Total Cost: ${Math.round(totalCost)}`);
      await sleep(500);
      setCurrentEdge(undefined);
    }

    setIsPlaying(false);
    isPlayingRef.current = false;
  };

  const algorithmData: AlgorithmData = {
    id: "tsp-approx",
    title: "TSP - Approximation",
    category: "Advanced Algorithms",
    definition:
      'Since the Exact TSP is NP-Hard, approximation algorithms are used to find a "good enough" solution in a reasonable amount of time. The "Nearest Neighbor" heuristic is a common greedy approach where the salesperson visits the nearest unvisited city next.',
    realWorldUse:
      "Large-scale logistics (Amazon delivery routes), microchip manufacturing, network cabling, DNA sequencing.",
    pros: [
      "Much faster than exact algorithms (O(n^2) vs O(n!))",
      "Easy to implement",
      "Practical for large datasets",
    ],
    cons: [
      "Does not guarantee the shortest path",
      "Solution can be significantly worse than optimal (up to 2x or more in worst cases)",
      "Greedy choices early on can lead to long paths later",
    ],
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(n)",
    workingSteps: [
      {
        step: 1,
        title: "Start at a random city",
        description:
          "Pick an arbitrary city as the starting point and mark it as visited.",
        codeSnippet: "current_city = 0\nvisited = {0}",
      },
      {
        step: 2,
        title: "Find nearest unvisited city",
        description:
          "Check distances to all unvisited cities and select the one with the minimum distance.",
        codeSnippet:
          "next_city = min(unvisited, key=lambda city: dist[current_city][city])",
      },
      {
        step: 3,
        title: "Move and Repeat",
        description:
          "Move to the selected city, mark it as visited, and repeat step 2 until all cities are visited.",
        codeSnippet: "path.append(next_city)\ncurrent_city = next_city",
      },
      {
        step: 4,
        title: "Return to start",
        description:
          "Add the distance from the last city back to the starting city to complete the tour.",
        codeSnippet: "total_dist += dist[last_city][start_city]",
      },
    ],
    defaultInputs: { cities: 5 },
    pythonCode: `def tsp_approx(dist):
    n = len(dist)
    if n == 0: return 0

    visited = [False] * n
    path = [0]
    visited[0] = True
    total_cost = 0
    curr = 0

    for _ in range(n - 1):
        min_dist = float('inf')
        next_city = -1
        
        # Find nearest unvisited neighbor
        for i in range(n):
            if not visited[i] and dist[curr][i] < min_dist:
                min_dist = dist[curr][i]
                next_city = i
        
        if next_city != -1:
            visited[next_city] = True
            path.append(next_city)
            total_cost += min_dist
            curr = next_city
    
    # Return to start
    total_cost += dist[curr][0]
    path.append(0)
    
    return path, total_cost

# Example Distance Matrix
dist = [
    [0, 10, 15, 20],
    [10, 0, 35, 25],
    [15, 35, 0, 30],
    [20, 25, 30, 0]
]

path, cost = tsp_approx(dist)
print(f"Path: {path}")
print(f"Approximated Cost: {cost}")`,
    examples: [],
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-dark-950 text-gray-900 dark:text-white p-3 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="card">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {algorithmData.title}
          </h1>
          <span className="algorithm-badge badge-advanced">
            {algorithmData.category}
          </span>
        </div>

        <div className="card">
          <h2 className="section-title">Overview</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            {algorithmData.definition}
          </p>
          <div className="bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-primary-600 dark:text-primary-300 mb-2">
              Real-World Applications
            </h3>
            <p className="text-primary-600 dark:text-primary-300 text-sm">
              {algorithmData.realWorldUse}
            </p>
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
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Nearest Neighbor Approximation (Greedy Approach). Good for large N.
          </p>

          <div className="flex gap-4 mb-4">
            <button
              onClick={() => generateCities(15)}
              className="btn btn-secondary text-sm"
            >
              Re-generate Cities (N=15)
            </button>
            <button
              onClick={() => generateCities(30)}
              className="btn btn-secondary text-sm"
            >
              Re-generate Cities (N=30)
            </button>
            <button
              onClick={solveTSPApprox}
              disabled={isPlaying}
              className="btn btn-primary text-sm"
            >
              {isPlaying ? "Running..." : "Run Nearest Neighbor"}
            </button>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded border border-zinc-200 dark:border-zinc-800">
            {/* Visualizer Component Here */}
            <div style={{ minHeight: "400px" }}>
              <TSPVisualizer
                cities={cities}
                path={path}
                bestPath={[]}
                currentEdge={currentEdge}
                message={`${message} | Cost: ${Math.round(cost)}`}
              />
            </div>
          </div>
        </div>

        <CodeEditor defaultCode={algorithmData.pythonCode} />
      </div>
    </div>
  );
};

export default TSPApprox;
