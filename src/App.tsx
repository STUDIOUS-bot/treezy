import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import InputForm from './components/InputForm';
import TreeVisualizer from './components/TreeVisualizer';
import Controls from './components/Controls';
import ExplanationPanel from './components/ExplanationPanel';
import PseudocodeDisplay from './components/PseudocodeDisplay';

type TreeType = 'avl' | 'rb' | 'btree';

// Function to get initial theme without causing flash
const getInitialDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;

  const savedTheme = localStorage.getItem('darkMode');
  if (savedTheme !== null) {
    return savedTheme === 'true';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const App = () => {
  // Initialize with the correct theme immediately to prevent flash
  const [darkMode, setDarkMode] = useState(() => getInitialDarkMode());
  const [values, setValues] = useState<number[]>([10, 20, 30, 40, 50, 25, 35]);
  const [treeType, setTreeType] = useState<TreeType>('avl');
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);

  useEffect(() => {
    // Ensure the theme is applied correctly on mount
    // The HTML script should have already applied the class, but this ensures consistency
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleFormSubmit = (newValues: number[], newTreeType: TreeType) => {
    setValues(newValues);
    setTreeType(newTreeType);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    // Trigger reset in TreeVisualizer by incrementing resetTrigger
    setResetTrigger(prev => prev + 1);
  };

  const handleSpeedChange = (speed: number) => {
    setAnimationSpeed(speed);
  };

  const handleStepChange = (step: number, total: number) => {
    setCurrentStep(step);
    setTotalSteps(total);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
        <Routes>
          <Route path="/" element={
            <div className="p-4">
              <h1 className="text-3xl font-bold mb-6">
                <span className="logo-large logo-text">Treezy</span> - Interactive Tree Visualization
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <InputForm onSubmit={handleFormSubmit} />

                  {values.length > 0 && (
                    <>
                      <Controls
                        isPlaying={isPlaying}
                        onPlayPause={handlePlayPause}
                        onPrevStep={handlePrevStep}
                        onNextStep={handleNextStep}
                        onReset={handleReset}
                        onSpeedChange={handleSpeedChange}
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                        animationSpeed={animationSpeed}
                      />

                      <TreeVisualizer
                        treeType={treeType}
                        values={values}
                        animationSpeed={animationSpeed}
                        isPlaying={isPlaying}
                        onStepChange={handleStepChange}
                        resetTrigger={resetTrigger}
                      />
                    </>
                  )}
                </div>

                <div>
                  <ExplanationPanel treeType={treeType} />
                  <div className="border-t border-gray-200 dark:border-gray-600 my-6"></div>
                  <PseudocodeDisplay treeType={treeType} darkMode={darkMode} />
                </div>
              </div>
            </div>
          } />
        </Routes>
      </Layout>
    </div>
  );
};

export default App;
