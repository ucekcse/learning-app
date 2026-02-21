import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import LinearSearch from './pages/algorithms/LinearSearch';
import BinarySearch from './pages/algorithms/BinarySearch';
import PatternMatching from './pages/algorithms/PatternMatching';
import InsertionSort from './pages/algorithms/InsertionSort';
import HeapSort from './pages/algorithms/HeapSort';
import MergeSort from './pages/algorithms/MergeSort';
import QuickSort from './pages/algorithms/QuickSort';
import BFS from './pages/algorithms/BFS';
import DFS from './pages/algorithms/DFS';
import NQueens from './pages/algorithms/NQueens';
import FCFS from './pages/algorithms/FCFS';
import SJF from './pages/algorithms/SJF';
import Dijkstra from './pages/algorithms/Dijkstra';
import Prim from './pages/algorithms/Prim';
import Floyd from './pages/algorithms/Floyd';
import Warshall from './pages/algorithms/Warshall';
import RoundRobin from './pages/algorithms/RoundRobin';
import SRTF from './pages/algorithms/SRTF';
import PriorityScheduling from './pages/algorithms/PriorityScheduling';
import TSPExact from './pages/algorithms/TSPExact';
import TSPApprox from './pages/algorithms/TSPApprox';
import KthSmallest from './pages/algorithms/KthSmallest';
import DivideConquer from './pages/algorithms/DivideConquer';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Searching & Sorting Algorithms */}
          <Route path="/algorithm/linear-search" element={<LinearSearch />} />
          <Route path="/algorithm/binary-search" element={<BinarySearch />} />
          <Route path="/algorithm/pattern-matching" element={<PatternMatching />} />
          <Route path="/algorithm/insertion-sort" element={<InsertionSort />} />
          <Route path="/algorithm/heap-sort" element={<HeapSort />} />
          <Route path="/algorithm/merge-sort" element={<MergeSort />} />
          <Route path="/algorithm/quick-sort" element={<QuickSort />} />

          {/* Graph Algorithms */}
          <Route path="/algorithm/bfs" element={<BFS />} />
          <Route path="/algorithm/dfs" element={<DFS />} />
          <Route path="/algorithm/dijkstra" element={<Dijkstra />} />
          <Route path="/algorithm/prim" element={<Prim />} />
          <Route path="/algorithm/floyd" element={<Floyd />} />
          <Route path="/algorithm/warshall" element={<Warshall />} />


          {/* Algorithm Design */}
          <Route path="/algorithm/divide-conquer" element={<DivideConquer />} />
          <Route path="/algorithm/n-queens" element={<NQueens />} />

          {/* CPU Scheduling */}
          <Route path="/algorithm/fcfs" element={<FCFS />} />
          <Route path="/algorithm/sjf" element={<SJF />} />
          <Route path="/algorithm/srtf" element={<SRTF />} />
          <Route path="/algorithm/round-robin" element={<RoundRobin />} />
          <Route path="/algorithm/priority-aging" element={<PriorityScheduling />} />

          {/* Advanced Algorithms */}
          <Route path="/algorithm/tsp-exact" element={<TSPExact />} />
          <Route path="/algorithm/tsp-approx" element={<TSPApprox />} />
          <Route path="/algorithm/kth-smallest" element={<KthSmallest />} />

          {/* Placeholder routes for remaining algorithms */}
          <Route path="/algorithm/*" element={
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 flex items-center justify-center">
              <div className="card max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Algorithm Page</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  This is a comprehensive algorithm learning platform with 25+ algorithms.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Currently Implemented Pages (10):</strong>
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mt-2 space-y-1">
                  <li>Linear Search, Binary Search, Pattern Matching</li>
                  <li>Insertion Sort, Heap Sort, Merge Sort, Quick Sort</li>
                  <li>BFS (Breadth First Search), DFS (Depth First Search)</li>
                  <li>N-Queens Problem (Backtracking)</li>
                  <li>FCFS, SJF (CPU Scheduling)</li>
                </ul>
                <p className="text-gray-500 dark:text-gray-400 mt-4">
                  Each algorithm page includes: Definition, Pros/Cons, Working Steps, Interactive Animation,
                  Editable Inputs, Live Python Code Execution, and Examples.
                </p>
              </div>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
