import React, { useEffect, useRef } from 'react';

type TreeType = 'avl' | 'rb' | 'btree';

interface SimpleTreeVisualizerProps {
  treeType: TreeType;
  values: number[];
}

const SimpleTreeVisualizer: React.FC<SimpleTreeVisualizerProps> = ({
  treeType,
  values,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    
    // Clear the SVG
    const svg = svgRef.current;
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    // Draw a simple tree visualization
    const width = 800;
    const height = 400;
    
    // Create a simple tree structure
    const treeData = createSimpleTree(values);
    
    // Draw the tree
    drawTree(svg, treeData, width, height);
  }, [treeType, values]);
  
  // Create a simple tree structure
  const createSimpleTree = (values: number[]) => {
    if (values.length === 0) return null;
    
    // Sort values for a more balanced tree
    const sortedValues = [...values].sort((a, b) => a - b);
    
    // Create a simple binary tree
    const root = createNode(sortedValues, 0, sortedValues.length - 1);
    
    return root;
  };
  
  // Create a node for the tree
  const createNode = (values: number[], start: number, end: number) => {
    if (start > end) return null;
    
    // Find the middle element
    const mid = Math.floor((start + end) / 2);
    
    // Create a node with the middle element
    const node = {
      value: values[mid],
      left: createNode(values, start, mid - 1),
      right: createNode(values, mid + 1, end),
      x: 0,
      y: 0,
    };
    
    return node;
  };
  
  // Draw the tree
  const drawTree = (svg: SVGSVGElement, root: any, width: number, height: number) => {
    if (!root) return;
    
    // Calculate node positions
    calculateNodePositions(root, 0, 0, width, 60);
    
    // Draw edges
    drawEdges(svg, root);
    
    // Draw nodes
    drawNodes(svg, root, treeType);
  };
  
  // Calculate node positions
  const calculateNodePositions = (node: any, depth: number, index: number, width: number, verticalSpacing: number) => {
    if (!node) return;
    
    // Calculate x and y coordinates
    node.y = depth * verticalSpacing + 40;
    
    // Calculate x based on a perfect binary tree layout
    const levelWidth = Math.pow(2, depth);
    const leftPadding = width / (levelWidth + 1);
    node.x = (index + 1) * leftPadding;
    
    // Calculate positions for children
    if (node.left) {
      calculateNodePositions(node.left, depth + 1, index * 2, width, verticalSpacing);
    }
    
    if (node.right) {
      calculateNodePositions(node.right, depth + 1, index * 2 + 1, width, verticalSpacing);
    }
  };
  
  // Draw edges
  const drawEdges = (svg: SVGSVGElement, node: any) => {
    if (!node) return;
    
    if (node.left) {
      // Create line element
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', node.x.toString());
      line.setAttribute('y1', node.y.toString());
      line.setAttribute('x2', node.left.x.toString());
      line.setAttribute('y2', node.left.y.toString());
      line.setAttribute('stroke', '#666');
      line.setAttribute('stroke-width', '2');
      
      svg.appendChild(line);
      
      // Draw edges for left child
      drawEdges(svg, node.left);
    }
    
    if (node.right) {
      // Create line element
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', node.x.toString());
      line.setAttribute('y1', node.y.toString());
      line.setAttribute('x2', node.right.x.toString());
      line.setAttribute('y2', node.right.y.toString());
      line.setAttribute('stroke', '#666');
      line.setAttribute('stroke-width', '2');
      
      svg.appendChild(line);
      
      // Draw edges for right child
      drawEdges(svg, node.right);
    }
  };
  
  // Draw nodes
  const drawNodes = (svg: SVGSVGElement, node: any, treeType: TreeType) => {
    if (!node) return;
    
    // Create group element
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${node.x}, ${node.y})`);
    
    // Create circle element
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', '16');
    
    // Set color based on tree type
    if (treeType === 'avl') {
      circle.setAttribute('fill', '#4CAF50');
    } else if (treeType === 'rb') {
      circle.setAttribute('fill', '#F44336');
    } else if (treeType === 'btree') {
      circle.setAttribute('fill', '#2196F3');
    }
    
    g.appendChild(circle);
    
    // Create text element
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dy', '0.3em');
    text.setAttribute('fill', 'white');
    text.setAttribute('font-size', '12px');
    text.textContent = node.value.toString();
    
    g.appendChild(text);
    svg.appendChild(g);
    
    // Draw nodes for children
    drawNodes(svg, node.left, treeType);
    drawNodes(svg, node.right, treeType);
  };

  return (
    <div className="relative">
      <div className="border border-gray-300 rounded-lg bg-white dark:bg-gray-800 min-h-[500px]">
        <svg
          ref={svgRef}
          width="100%"
          height="500"
          className="min-w-full"
        />
      </div>
      <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Tree Type:</h3>
        <p className="text-gray-800 dark:text-gray-200">
          {treeType === 'avl' ? 'AVL Tree' : treeType === 'rb' ? 'Red-Black Tree' : 'B-Tree'}
        </p>
      </div>
    </div>
  );
};

export default SimpleTreeVisualizer;
