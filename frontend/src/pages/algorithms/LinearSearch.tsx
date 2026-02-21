import React, { useState, useEffect } from "react";
import type { AlgorithmData } from "../../types";
import ProsConsSection from "../../components/algorithm/ProsConsSection";
import WorkingSection from "../../components/algorithm/WorkingSection";
import ExampleSection from "../../components/algorithm/ExampleSection";
import CodeEditor from "../../components/algorithm/CodeEditor";
import InputPanel from "../../components/algorithm/InputPanel";
import ArrayVisualizer from "../../components/animations/ArrayVisualizer";

const LinearSearch: React.FC = () => {
  const defaultInputs = {
    array: [64, 34, 25, 12, 22, 11, 90],
    target: 22,
  };

  const [inputs, setInputs] = useState(defaultInputs);
  const [animationState, setAnimationState] = useState({
    currentIndex: -1,
    found: false,
    foundIndex: -1,
    message: "Click Play to start the search",
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const algorithmData: AlgorithmData = {
    id: "linear-search",
    title: "Linear Search",
    category: "Searching & Sorting",
    definition:
      "Linear Search is a simple searching algorithm that sequentially checks each element in a list until the target element is found or the end of the list is reached. It works by comparing the target value with each element one by one from the beginning to the end.",
    realWorldUse:
      "Linear search is used in small datasets, unsorted lists, or when searching for the first occurrence of an element. Real-world applications include searching through a contact list, finding a specific email in an inbox, or locating a file in a small directory.",
    pros: [
      "Simple and easy to understand and implement",
      "Works on both sorted and unsorted arrays",
      "No preprocessing required",
      "Efficient for small datasets",
      "Can find the first occurrence easily",
    ],
    cons: [
      "Inefficient for large datasets (O(n) time complexity)",
      "Not suitable when faster alternatives like binary search are available",
      "Performance degrades linearly with input size",
      "No early termination optimization for sorted arrays",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    workingSteps: [
      {
        step: 1,
        title: "Initialize the search",
        description:
          "Start from the first element (index 0) of the array. Set a variable to track the current position.",
        variables: [
          { name: "arr", type: "list", purpose: "The array to search through" },
          {
            name: "target",
            type: "int",
            purpose: "The value we are looking for",
          },
          { name: "i", type: "int", purpose: "Current index being examined" },
        ],
        codeSnippet: "for i in range(len(arr)):",
      },
      {
        step: 2,
        title: "Compare current element with target",
        description:
          "Check if the element at the current index matches the target value. If it matches, we have found the element.",
        variables: [
          {
            name: "arr[i]",
            type: "int",
            purpose: "Current element being compared",
          },
        ],
        codeSnippet: "if arr[i] == target:\n    return i  # Found!",
      },
      {
        step: 3,
        title: "Move to next element",
        description:
          "If the current element does not match, increment the index and move to the next element in the array.",
        codeSnippet:
          "# Loop continues to next iteration\n# i increments automatically",
      },
      {
        step: 4,
        title: "Repeat or terminate",
        description:
          "Repeat steps 2-3 until either the target is found or we reach the end of the array. If we reach the end without finding the target, return -1 to indicate the element is not present.",
        codeSnippet: "return -1  # Not found",
      },
    ],
    defaultInputs,
    pythonCode: `def linear_search(arr, target):
    """
    Perform linear search to find target in arr.
    Returns the index if found, -1 otherwise.
    """
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1

# Test the algorithm
arr = ${JSON.stringify(inputs.array)}
target = ${inputs.target}

result = linear_search(arr, target)

if result != -1:
    print(f"Element {target} found at index {result}")
else:
    print(f"Element {target} not found in the array")

# Show the array
print(f"\\nArray: {arr}")
print(f"Target: {target}")`,
    examples: [
      {
        title: "Example 1: Element Found",
        input: { array: [64, 34, 25, 12, 22, 11, 90], target: 22 },
        output: { index: 4, message: "Element 22 found at index 4" },
        explanation:
          "The algorithm starts at index 0 (value 64), compares with target 22, moves to index 1 (value 34), continues comparing, and finally finds 22 at index 4. Total comparisons: 5.",
      },
      {
        title: "Example 2: Element Not Found",
        input: { array: [10, 20, 30, 40, 50], target: 35 },
        output: { index: -1, message: "Element 35 not found" },
        explanation:
          "The algorithm checks all 5 elements (10, 20, 30, 40, 50) but never finds 35. After reaching the end of the array, it returns -1 to indicate the element is not present.",
      },
    ],
  };

  // Animation logic
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (currentStep >= inputs.array.length) {
        setIsPlaying(false);
        setAnimationState({
          currentIndex: -1,
          found: false,
          foundIndex: -1,
          message: `Element ${inputs.target} not found in the array`,
        });
        return;
      }

      const currentValue = inputs.array[currentStep];

      if (currentValue === inputs.target) {
        setAnimationState({
          currentIndex: currentStep,
          found: true,
          foundIndex: currentStep,
          message: `✓ Found ${inputs.target} at index ${currentStep}!`,
        });
        setIsPlaying(false);
      } else {
        setAnimationState({
          currentIndex: currentStep,
          found: false,
          foundIndex: -1,
          message: `Checking index ${currentStep}: ${currentValue} ≠ ${inputs.target}`,
        });
        setCurrentStep(currentStep + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentStep, inputs]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setAnimationState({
      currentIndex: -1,
      found: false,
      foundIndex: -1,
      message: "Click Play to start the search",
    });
  };

  const handleStep = () => {
    if (currentStep >= inputs.array.length) return;

    const currentValue = inputs.array[currentStep];

    if (currentValue === inputs.target) {
      setAnimationState({
        currentIndex: currentStep,
        found: true,
        foundIndex: currentStep,
        message: `✓ Found ${inputs.target} at index ${currentStep}!`,
      });
    } else {
      setAnimationState({
        currentIndex: currentStep,
        found: false,
        foundIndex: -1,
        message: `Checking index ${currentStep}: ${currentValue} ≠ ${inputs.target}`,
      });
      setCurrentStep(currentStep + 1);
    }
  };

  const handleInputChange = (newInputs: any) => {
    const parsedArray =
      typeof newInputs.array === "string"
        ? newInputs.array
            .split(",")
            .map((v: string) => parseInt(v.trim()))
            .filter((v: number) => !isNaN(v))
        : newInputs.array;

    setInputs({ array: parsedArray, target: newInputs.target });
    handleReset();
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-900 dark:text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {algorithmData.title}
              </h1>
              <span className="algorithm-badge badge-searching">
                {algorithmData.category}
              </span>
            </div>
          </div>
        </div>

        {/* Definition */}
        <div className="card">
          <h2 className="section-title">What is Linear Search?</h2>
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

        {/* Pros & Cons */}
        <ProsConsSection
          pros={algorithmData.pros}
          cons={algorithmData.cons}
          timeComplexity={algorithmData.timeComplexity}
          spaceComplexity={algorithmData.spaceComplexity}
        />

        {/* How It Works */}
        <WorkingSection steps={algorithmData.workingSteps} />

        {/* Animation */}
        <div className="card">
          <h2 className="section-title">Interactive Visualization</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Watch how Linear Search examines each element sequentially until it
            finds the target value.
          </p>
          <ArrayVisualizer
            array={inputs.array}
            currentIndex={animationState.currentIndex}
            sortedIndices={
              animationState.found ? [animationState.foundIndex] : []
            }
            message={animationState.message}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
            onStep={handleStep}
          />
        </div>

        {/* Input Panel */}
        <InputPanel
          defaultInputs={defaultInputs}
          onInputChange={handleInputChange}
          inputFields={[
            {
              key: "array",
              label: "Array (comma-separated)",
              type: "array",
              placeholder: "64, 34, 25, 12, 22, 11, 90",
            },
            {
              key: "target",
              label: "Target Value",
              type: "number",
              placeholder: "22",
            },
          ]}
        />

        {/* Code Editor */}
        <CodeEditor defaultCode={algorithmData.pythonCode} />

        {/* Examples */}
        <ExampleSection examples={algorithmData.examples} />
      </div>
    </div>
  );
};

export default LinearSearch;
