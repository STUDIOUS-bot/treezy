import React from 'react';

type TreeType = 'avl' | 'rb' | 'btree';

interface ExplanationPanelProps {
  treeType: TreeType;
}

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ treeType }) => {
  const getExplanation = () => {
    switch (treeType) {
      case 'avl':
        return {
          title: 'AVL Tree',
          description: 'AVL trees are self-balancing binary search trees where the height difference between left and right subtrees (balance factor) is at most 1 for all nodes.',
          properties: [
            'Height-balanced binary search tree',
            'Balance factor = height(left subtree) - height(right subtree)',
            'Balance factor must be -1, 0, or 1 for all nodes',
            'Rebalancing is done through rotations',
          ],
          operations: [
            'Left Rotation: Used when right subtree is too heavy',
            'Right Rotation: Used when left subtree is too heavy',
            'Left-Right Rotation: Double rotation for left-right imbalance',
            'Right-Left Rotation: Double rotation for right-left imbalance',
          ],
          complexity: {
            search: 'O(log n)',
            insert: 'O(log n)',
            delete: 'O(log n)',
          },
        };

      case 'rb':
        return {
          title: 'Red-Black Tree',
          description: 'Red-Black trees are self-balancing binary search trees where each node has a color (red or black) and satisfies specific properties to ensure the tree remains balanced.',
          properties: [
            'Every node is either red or black',
            'The root is black',
            'All leaves (NIL) are black',
            'If a node is red, both its children are black',
            'Every path from a node to any of its descendant NIL nodes has the same number of black nodes',
          ],
          operations: [
            'Color Flips: Change colors of nodes to maintain properties',
            'Rotations: Similar to AVL trees, used to rebalance the tree',
            'Recoloring: Changing node colors to maintain red-black properties',
          ],
          complexity: {
            search: 'O(log n)',
            insert: 'O(log n)',
            delete: 'O(log n)',
          },
        };

      case 'btree':
        return {
          title: 'B-Tree',
          description: 'B-Trees are self-balancing search trees designed to work well with disk storage. They can have multiple keys per node and multiple children.',
          properties: [
            'All leaves are at the same level',
            'A B-Tree of order m has a maximum of m children per node',
            'Each node (except root) has at least ⌈m/2⌉ children',
            'The root has at least 2 children if it is not a leaf',
            'A non-leaf node with k children contains k-1 keys',
          ],
          operations: [
            'Node Splitting: When a node is full, it splits into two nodes',
            'Key Redistribution: Moving keys between nodes to maintain balance',
            'Merging: Combining nodes when they have too few keys',
          ],
          complexity: {
            search: 'O(log n)',
            insert: 'O(log n)',
            delete: 'O(log n)',
          },
        };

      default:
        return {
          title: 'Tree Data Structures',
          description: 'Select a tree type to see its explanation.',
          properties: [],
          operations: [],
          complexity: {
            search: '',
            insert: '',
            delete: '',
          },
        };
    }
  };

  const explanation = getExplanation();

  return (
    <div className="bg-white dark:bg-black rounded-lg shadow-md p-6 dark:border dark:border-gray-700">
      <h2 className="text-xl font-bold mb-3">{explanation.title}</h2>
      <p className="mb-4">{explanation.description}</p>

      {explanation.properties.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Key Properties:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {explanation.properties.map((prop, index) => (
              <li key={index}>{prop}</li>
            ))}
          </ul>
        </div>
      )}

      {explanation.operations.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Operations:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {explanation.operations.map((op, index) => (
              <li key={index}>{op}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="font-semibold mb-2">Time Complexity:</h3>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
            <span className="font-medium">Search:</span> {explanation.complexity.search}
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
            <span className="font-medium">Insert:</span> {explanation.complexity.insert}
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
            <span className="font-medium">Delete:</span> {explanation.complexity.delete}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplanationPanel;
