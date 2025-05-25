import React, { useState } from 'react';

type TreeType = 'avl' | 'rb' | 'btree';

interface InputFormProps {
  onSubmit: (values: number[], treeType: TreeType) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [input, setInput] = useState('10, 20, 30, 40, 50, 25, 35');
  const [treeType, setTreeType] = useState<TreeType>('avl');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    if (!input.trim()) {
      setError('Please enter at least one number');
      return;
    }

    try {
      // Parse input string to array of numbers
      const values = input
        .split(/[,\s]+/)
        .map(val => val.trim())
        .filter(val => val !== '')
        .map(val => {
          const num = parseInt(val, 10);
          if (isNaN(num)) {
            throw new Error(`Invalid number: ${val}`);
          }
          return num;
        });

      if (values.length === 0) {
        setError('Please enter at least one number');
        return;
      }

      // Clear error and submit
      setError('');
      onSubmit(values, treeType);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleRandomValues = () => {
    // Generate 5-10 random numbers between 1 and 100
    const count = Math.floor(Math.random() * 6) + 5;
    const values = Array.from({ length: count }, () => Math.floor(Math.random() * 100) + 1);
    setInput(values.join(', '));
  };

  return (
    <div className="bg-white dark:bg-black rounded-lg shadow-md p-6 mb-6 dark:border dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4">Tree Configuration</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="treeType" className="block mb-2 font-medium">
            Tree Type
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`btn ${treeType === 'avl' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTreeType('avl')}
            >
              AVL Tree
            </button>
            <button
              type="button"
              className={`btn ${treeType === 'rb' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTreeType('rb')}
            >
              Red-Black Tree
            </button>
            <button
              type="button"
              className={`btn ${treeType === 'btree' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTreeType('btree')}
            >
              B-Tree
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="values" className="block mb-2 font-medium">
            Values (comma or space separated)
          </label>
          <div className="flex gap-2">
            <input
              id="values"
              type="text"
              className="input flex-grow"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. 10, 5, 15, 3, 7, 12, 20"
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleRandomValues}
            >
              Random
            </button>
          </div>
          {error && <p className="text-red-500 mt-1">{error}</p>}
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            Visualize
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
