import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { AVLTree, AVLNode } from '../data/AVLTree';
import { RedBlackTree, RBNode, Color } from '../data/RedBlackTree';
import { BTree, BTreeNode } from '../data/BTree';
import { SimpleBTree, SimpleBTreeNode } from '../data/SimpleBTree';
import { SimpleRBTree, SimpleRBNode, SimpleColor } from '../data/SimpleRBTree';

type TreeType = 'avl' | 'rb' | 'btree';

interface TreeVisualizerProps {
  treeType: TreeType;
  values: number[];
  animationSpeed: number;
  isPlaying: boolean;
  onStepChange: (currentStep: number, totalSteps: number) => void;
  resetTrigger?: number; // Add reset trigger prop
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({
  treeType,
  values,
  animationSpeed,
  isPlaying,
  onStepChange,
  resetTrigger = 0,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [avlTree] = useState(new AVLTree());
  const [rbTree] = useState(new RedBlackTree());
  const [bTree, setBTree] = useState(new BTree(3)); // B-Tree of order 3
  const [simpleBTree, setSimpleBTree] = useState(new SimpleBTree(3)); // Simple B-Tree for visualization
  const [simpleRBTree, setSimpleRBTree] = useState(new SimpleRBTree()); // Simple Red-Black Tree for visualization
  const [operationDescription, setOperationDescription] = useState('');
  const [animationTimeout, setAnimationTimeout] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Reset and build tree when values change
  useEffect(() => {
    console.log("Values or tree type changed:", values, treeType);
    resetTree();
    if (values.length > 0) {
      buildTree();
    } else {
      // If no values, just clear the SVG
      if (svgRef.current) {
        d3.select(svgRef.current).selectAll('*').remove();
      }
    }
  }, [values, treeType]);

  // Handle animation when isPlaying changes
  useEffect(() => {
    if (isPlaying) {
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [isPlaying, animationSpeed, currentStep]);

  // Update step info when current step changes
  useEffect(() => {
    onStepChange(currentStep, totalSteps);
    updateOperationDescription();
  }, [currentStep, totalSteps]);

  // Handle reset trigger
  useEffect(() => {
    if (resetTrigger > 0) {
      console.log("Reset trigger activated:", resetTrigger);
      setCurrentStep(0);
      // Force redraw at step 0
      if (values.length > 0) {
        drawTree(0);
      } else {
        // Clear the SVG if no values
        if (svgRef.current) {
          d3.select(svgRef.current).selectAll('*').remove();
        }
      }
    }
  }, [resetTrigger]);

  // Reset the tree
  const resetTree = () => {
    if (animationTimeout) {
      clearTimeout(animationTimeout);
      setAnimationTimeout(null);
    }
    setCurrentStep(0);
    setTotalSteps(0);
    setOperationDescription('');

    // Clear the SVG
    if (svgRef.current) {
      d3.select(svgRef.current).selectAll('*').remove();
    }
  };

  // Build the tree step by step
  const buildTree = () => {
    // Log the tree type for debugging
    console.log("Building tree of type:", treeType);

    switch (treeType) {
      case 'avl':
        console.log("Building AVL Tree");
        buildAVLTree();
        break;
      case 'rb':
        console.log("Building Red-Black Tree");
        buildRBTree();
        break;
      case 'btree':
        console.log("Building B-Tree");
        buildBTree();
        break;
      default:
        console.error("Unknown tree type:", treeType);
    }
  };

  // Build AVL Tree
  const buildAVLTree = () => {
    avlTree.root = null;
    avlTree.operations = [];

    // Insert values one by one
    values.forEach(value => {
      avlTree.insert(value);
    });

    // Calculate coordinates for visualization with better spacing
    const maxDepth = getTreeDepth(avlTree.root);
    const nodeCount = avlTree.getAllNodes().length;

    // Use appropriate spacing based on tree size
    const horizontalSpacing = Math.min(60, 400 / Math.max(1, Math.pow(2, Math.min(maxDepth, 4))));
    const verticalSpacing = Math.min(60, 300 / Math.max(1, maxDepth));
    avlTree.calculateCoordinates(avlTree.root, 0, 0, horizontalSpacing, verticalSpacing);

    // Set total steps
    setTotalSteps(avlTree.operations.length);

    // Draw initial tree
    drawAVLTree(0);
  };

  // Helper function to get tree depth
  const getTreeDepth = (node: any): number => {
    if (!node) return 0;
    if (node === (rbTree.NIL || null)) return 0;

    const leftDepth = node.left ? getTreeDepth(node.left) : 0;
    const rightDepth = node.right ? getTreeDepth(node.right) : 0;

    return Math.max(leftDepth, rightDepth) + 1;
  };

  // Build Red-Black Tree - Completely rewritten with SimpleRBTree
  const buildRBTree = () => {
    console.log("Starting to build Red-Black Tree with SimpleRBTree");

    // Create a new SimpleRBTree
    const newTree = new SimpleRBTree();

    // Use only the input values, no default values
    const valuesToInsert = values;
    console.log("Values to insert:", valuesToInsert);

    // Insert values one by one
    valuesToInsert.forEach(value => {
      console.log("Inserting value:", value);
      newTree.insert(value);
    });

    // Calculate coordinates for visualization with improved spacing
    newTree.calculateCoordinates(); // Use default spacing from the SimpleRBTree class
    console.log("Coordinates calculated");

    // Update the state with the new tree
    setSimpleRBTree(newTree);
    console.log("SimpleRBTree updated:", newTree);
    console.log("Root node:", newTree.root);
    console.log("All nodes:", newTree.getAllNodes());

    // Set total steps based on the number of operations
    setTotalSteps(newTree.operations.length);

    // Draw the tree
    drawRBTree(1);
    console.log("Initial tree drawn");
  };

  // Build B-Tree - Completely rewritten with SimpleBTree
  const buildBTree = () => {
    // Create a new SimpleBTree with order 3
    const newTree = new SimpleBTree(3);

    // Use only the input values, no default values
    const valuesToInsert = values;

    // Insert values one by one
    valuesToInsert.forEach(value => {
      newTree.insert(value);
    });

    // Calculate coordinates for visualization with improved spacing
    newTree.calculateCoordinates(); // Use default spacing from the SimpleBTree class

    // Update the state with the new tree
    setSimpleBTree(newTree);

    // Set total steps based on the number of operations
    setTotalSteps(newTree.operations.length);

    // Draw the tree
    drawBTree(1);

    // Log for debugging
    console.log("SimpleBTree built:", newTree);
    console.log("Root node:", newTree.root);
    console.log("All nodes:", newTree.getAllNodes());
  };

  // Start animation
  const startAnimation = () => {
    if (currentStep < totalSteps) {
      const timeout = setTimeout(() => {
        setCurrentStep(prev => {
          const nextStep = prev + 1;
          if (nextStep <= totalSteps) {
            drawTree(nextStep);
            return nextStep;
          }
          return prev;
        });
      }, 1000 / animationSpeed);

      setAnimationTimeout(timeout);
    }
  };

  // Stop animation
  const stopAnimation = () => {
    if (animationTimeout) {
      clearTimeout(animationTimeout);
      setAnimationTimeout(null);
    }
  };

  // Zoom in function
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  // Zoom out function
  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  // Reset zoom and pan
  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Mouse drag state for panning
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Handle mouse down for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse move for panning
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    setPanOffset(prev => ({
      x: prev.x + dx / zoomLevel,
      y: prev.y + dy / zoomLevel
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse up for panning
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle mouse leave for panning
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Draw the tree based on the current step
  const drawTree = (step: number) => {
    console.log("Drawing tree of type:", treeType, "at step:", step);

    // If step is 0, show empty tree for all types
    if (step === 0) {
      if (svgRef.current) {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        setOperationDescription('Initial state - empty tree');
      }
      return;
    }

    switch (treeType) {
      case 'avl':
        console.log("Drawing AVL Tree");
        drawAVLTree(step);
        break;
      case 'rb':
        console.log("Drawing Red-Black Tree");
        drawRBTree(step);
        break;
      case 'btree':
        console.log("Drawing B-Tree");
        drawBTree(step);
        break;
      default:
        console.error("Unknown tree type:", treeType);
    }
  };

  // Update operation description
  const updateOperationDescription = () => {
    if (currentStep < 1) {
      setOperationDescription('Initial state');
      return;
    }

    let description = '';

    switch (treeType) {
      case 'avl':
        description = avlTree.operations[currentStep - 1]?.description || '';
        break;
      case 'rb':
        // Use simpleRBTree instead of rbTree
        if (currentStep <= simpleRBTree.operations.length) {
          description = simpleRBTree.operations[currentStep - 1]?.description || '';
        }
        break;
      case 'btree':
        // Use simpleBTree instead of bTree
        if (currentStep <= simpleBTree.operations.length) {
          description = simpleBTree.operations[currentStep - 1]?.description || '';
        }
        break;
    }

    console.log("Setting operation description:", description, "for step:", currentStep);
    setOperationDescription(description);
  };

  // Draw AVL Tree
  const drawAVLTree = (step: number) => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // If we're at step 0, just show an empty SVG
    if (step === 0 && values.length > 0) {
      setOperationDescription('Initial state - empty tree');
      return;
    }

    // Create a new tree for visualization
    const visualTree = new AVLTree();

    // Apply all values up to the current step
    // For a more accurate visualization, we should rebuild the tree for each step
    const valuesToInsert = [];
    let insertedValues = new Set<number>();

    // Process operations to determine which values to insert
    for (let i = 0; i < step; i++) {
      const op = avlTree.operations[i];
      if (op.type === 'insert' && op.node) {
        if (!insertedValues.has(op.node.value)) {
          valuesToInsert.push(op.node.value);
          insertedValues.add(op.node.value);
        }
      }
    }

    // Set operation description
    if (step > 0 && step <= avlTree.operations.length) {
      const currentOp = avlTree.operations[step - 1];
      setOperationDescription(currentOp.description || `Step ${step}`);
    }

    // Insert all values into the visualization tree
    valuesToInsert.forEach(value => {
      visualTree.insert(value);
    });

    // Calculate coordinates for visualization with improved spacing
    const treeDepth = getTreeDepth(visualTree.root);
    const nodeCount = visualTree.getAllNodes().length;

    // Use dynamic spacing based on tree size and depth to avoid overlapping
    const horizontalSpacing = Math.max(100, 1000 / (Math.pow(2, Math.min(treeDepth, 5))));
    const verticalSpacing = Math.max(80, 120 * Math.min(4, treeDepth) / treeDepth);

    visualTree.calculateCoordinates(
      visualTree.root,
      0,
      0,
      horizontalSpacing,
      verticalSpacing
    );

    // Get nodes and edges
    const nodes = visualTree.getAllNodes();
    const edges = visualTree.getEdges();

    // Set viewBox to ensure the tree fits in the SVG and is centered
    const svgWidth = 900; // Much wider SVG
    const svgHeight = 400;

    // Find the bounds of the tree to center it
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach(node => {
      minX = Math.min(minX, node.x || 0);
      maxX = Math.max(maxX, node.x || 0);
      minY = Math.min(minY, node.y || 0);
      maxY = Math.max(maxY, node.y || 0);
    });

    // Add padding with extra space on the left
    const paddingTop = 30;
    const paddingLeft = 250; // Even more padding on the left
    const paddingRight = 50;
    const paddingBottom = 30;

    minX = Math.max(0, minX - paddingLeft);
    minY = Math.max(0, minY - paddingTop);
    maxX = maxX + paddingRight;
    maxY = maxY + paddingBottom;

    // Calculate the width and height of the tree
    const treeWidth = maxX - minX;
    const treeHeight = maxY - minY;

    // Set viewBox to center the tree
    // If the tree is smaller than the SVG, center it
    // If the tree is larger than the SVG, scale it to fit
    let viewBoxWidth, viewBoxHeight, viewBoxX, viewBoxY;

    if (treeWidth <= svgWidth && treeHeight <= svgHeight) {
      // Tree fits within SVG, center it but shift more to the right and zoom in
      viewBoxWidth = svgWidth * 0.8; // Zoom in by reducing viewBox width
      viewBoxHeight = svgHeight * 0.8; // Zoom in by reducing viewBox height
      // Shift more to the right by reducing the left margin
      viewBoxX = Math.max(0, minX - (viewBoxWidth - treeWidth) / 4); // Use 1/4 instead of 1/3 to shift further right
      viewBoxY = minY - (viewBoxHeight - treeHeight) / 2;
    } else {
      // Tree is larger than SVG, scale it to fit and shift more to the right
      const scaleX = svgWidth / treeWidth;
      const scaleY = svgHeight / treeHeight;
      const scale = Math.min(scaleX, scaleY) * 0.8; // Zoom in by reducing scale by 20%

      viewBoxWidth = svgWidth / scale;
      viewBoxHeight = svgHeight / scale;
      // Shift more to the right by reducing the left margin
      viewBoxX = Math.max(0, minX - (viewBoxWidth - treeWidth) / 4); // Use 1/4 instead of 1/3 to shift further right
      viewBoxY = minY - (viewBoxHeight - treeHeight) / 2;
    }

    // Ensure viewBox doesn't go negative
    viewBoxX = Math.max(0, viewBoxX);
    viewBoxY = Math.max(0, viewBoxY);

    svg.attr('viewBox', `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`);

    // Draw edges
    edges.forEach(edge => {
      svg.append('line')
        .attr('x1', edge.source.x || 0)
        .attr('y1', edge.source.y || 0)
        .attr('x2', edge.target.x || 0)
        .attr('y2', edge.target.y || 0)
        .attr('stroke', document.documentElement.classList.contains('dark') ? '#6552D0' : '#000000') // Purple in dark mode, black in light mode
        .attr('stroke-width', 2);
    });

    // Draw nodes
    nodes.forEach(node => {
      const g = svg.append('g')
        .attr('transform', `translate(${node.x}, ${node.y})`);

      g.append('circle')
        .attr('r', 16)
        .attr('class', 'tree-node tree-node-avl')
        .attr('fill', document.documentElement.classList.contains('dark') ? '#6552D0' : '#F02F34'); // Purple in dark mode, red in light mode

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.3em')
        .attr('fill', '#FFFFFF') // White text for contrast
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text(node.value);

      // Show height
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-1.2em')
        .attr('fill', document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#000000') // Light gray in dark mode, black in light mode
        .attr('font-size', '9px')
        .attr('font-weight', 'bold')
        .text(`h: ${node.height}`);
    });
  };

  // Draw Red-Black Tree - Updated to show step by step
  const drawRBTree = (step: number) => {
    console.log("Drawing Red-Black Tree with SimpleRBTree, step:", step);

    if (!svgRef.current) {
      console.error("SVG ref is null");
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    console.log("SVG cleared");

    // If we're at step 0, just show an empty SVG
    if (step === 0) {
      console.log("Step 0, showing empty tree");
      setOperationDescription('Initial state - empty tree');
      return;
    }

    // Create a new tree for visualization
    const visualTree = new SimpleRBTree();

    // Get operations up to the current step
    const operations = simpleRBTree.operations.slice(0, step);

    // Set operation description
    if (step > 0 && step <= simpleRBTree.operations.length) {
      const currentOp = simpleRBTree.operations[step - 1];
      setOperationDescription(currentOp.description);
    }

    // Apply operations up to the current step
    operations.forEach(op => {
      if (op.type === 'insert') {
        visualTree.insert(op.value);
      }
    });

    // Calculate coordinates for visualization with improved spacing similar to AVL tree
    const treeDepth = visualTree.getMaxDepth(visualTree.root);
    const nodeCount = visualTree.getAllNodes().length;

    // Use dynamic spacing based on tree size and depth to avoid overlapping
    const horizontalSpacing = Math.max(80, 1000 / (Math.pow(2, Math.min(treeDepth, 5))));
    const verticalSpacing = Math.max(80, 120 * Math.min(4, treeDepth) / treeDepth);

    visualTree.calculateCoordinates(
      visualTree.root,
      0,
      0,
      horizontalSpacing,
      verticalSpacing
    );

    // Get nodes and edges
    const nodes = visualTree.getAllNodes();
    const edges = visualTree.getEdges();
    console.log("Nodes at step", step, ":", nodes);
    console.log("Edges at step", step, ":", edges);

    // Set viewBox to ensure the tree fits in the SVG and is centered
    const svgWidth = 900; // Much wider SVG
    const svgHeight = 400;

    // Find the bounds of the tree to center it
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach(node => {
      minX = Math.min(minX, node.x || 0);
      maxX = Math.max(maxX, node.x || 0);
      minY = Math.min(minY, node.y || 0);
      maxY = Math.max(maxY, node.y || 0);
    });

    // Add padding with extra space on the left
    const paddingTop = 30;
    const paddingLeft = 250; // Even more padding on the left
    const paddingRight = 50;
    const paddingBottom = 30;

    minX = Math.max(0, minX - paddingLeft);
    minY = Math.max(0, minY - paddingTop);
    maxX = maxX + paddingRight;
    maxY = maxY + paddingBottom;

    // Calculate the width and height of the tree
    const treeWidth = maxX - minX;
    const treeHeight = maxY - minY;

    // Set viewBox to center the tree
    // If the tree is smaller than the SVG, center it
    // If the tree is larger than the SVG, scale it to fit
    let viewBoxWidth, viewBoxHeight, viewBoxX, viewBoxY;

    if (treeWidth <= svgWidth && treeHeight <= svgHeight) {
      // Tree fits within SVG, center it but shift more to the right and zoom in
      viewBoxWidth = svgWidth * 0.8; // Zoom in by reducing viewBox width
      viewBoxHeight = svgHeight * 0.8; // Zoom in by reducing viewBox height
      // Shift more to the right by reducing the left margin
      viewBoxX = Math.max(0, minX - (viewBoxWidth - treeWidth) / 4); // Use 1/4 instead of 1/3 to shift further right
      viewBoxY = minY - (viewBoxHeight - treeHeight) / 2;
    } else {
      // Tree is larger than SVG, scale it to fit and shift more to the right
      const scaleX = svgWidth / treeWidth;
      const scaleY = svgHeight / treeHeight;
      const scale = Math.min(scaleX, scaleY) * 0.8; // Zoom in by reducing scale by 20%

      viewBoxWidth = svgWidth / scale;
      viewBoxHeight = svgHeight / scale;
      // Shift more to the right by reducing the left margin
      viewBoxX = Math.max(0, minX - (viewBoxWidth - treeWidth) / 4); // Use 1/4 instead of 1/3 to shift further right
      viewBoxY = minY - (viewBoxHeight - treeHeight) / 2;
    }

    // Ensure viewBox doesn't go negative
    viewBoxX = Math.max(0, viewBoxX);
    viewBoxY = Math.max(0, viewBoxY);

    svg.attr('viewBox', `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`);

    // Draw edges
    edges.forEach(edge => {
      svg.append('line')
        .attr('x1', edge.source.x || 0)
        .attr('y1', edge.source.y || 0)
        .attr('x2', edge.target.x || 0)
        .attr('y2', edge.target.y || 0)
        .attr('stroke', document.documentElement.classList.contains('dark') ? '#6552D0' : '#000000') // Purple in dark mode, black in light mode
        .attr('stroke-width', 2);
    });

    // Draw nodes
    nodes.forEach(node => {
      const g = svg.append('g')
        .attr('transform', `translate(${node.x}, ${node.y})`);

      const isDarkMode = document.documentElement.classList.contains('dark');
      const redNodeColor = isDarkMode ? '#6552D0' : '#F02F34'; // Purple in dark mode, red in light mode
      const blackNodeColor = isDarkMode ? '#17203D' : '#000000'; // Dark blue in dark mode, black in light mode

      g.append('circle')
        .attr('r', 16)
        .attr('class', `tree-node ${node.color === SimpleColor.RED ? 'tree-node-rb-red' : 'tree-node-rb-black'}`)
        .attr('fill', node.color === SimpleColor.RED ? redNodeColor : blackNodeColor);

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.3em')
        .attr('fill', '#FFFFFF') // White text for both for readability
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text(node.value);
    });
  };

  // Draw B-Tree - Updated to show step by step
  const drawBTree = (step: number) => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // If we're at step 0, just show an empty SVG
    if (step === 0) {
      setOperationDescription('Initial state - empty tree');
      return;
    }

    // Create a new tree for visualization
    const visualTree = new SimpleBTree(3);

    // Get operations up to the current step
    const operations = simpleBTree.operations.slice(0, step);

    // Set operation description
    if (step > 0 && step <= simpleBTree.operations.length) {
      const currentOp = simpleBTree.operations[step - 1];
      setOperationDescription(currentOp.description);
    }

    // Apply operations up to the current step
    operations.forEach(op => {
      if (op.type === 'insert') {
        visualTree.insert(op.key);
      }
    });

    // Calculate coordinates
    visualTree.calculateCoordinates();

    // Get nodes and edges
    const nodes = visualTree.getAllNodes();
    const edges = visualTree.getEdges();

    // Set SVG dimensions
    const svgWidth = 800;
    const svgHeight = 400;

    // Find the bounds of the tree to center it and avoid overlapping
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach(node => {
      minX = Math.min(minX, (node.x || 0) - 40); // Account for node width
      maxX = Math.max(maxX, (node.x || 0) + 40); // Account for node width
      minY = Math.min(minY, node.y || 0);
      maxY = Math.max(maxY, node.y || 0);
    });

    // Add padding
    const paddingTop = 30;
    const paddingLeft = 50;
    const paddingRight = 50;
    const paddingBottom = 30;

    minX = Math.max(0, minX - paddingLeft);
    minY = Math.max(0, minY - paddingTop);
    maxX = maxX + paddingRight;
    maxY = maxY + paddingBottom;

    // Calculate the width and height of the tree
    const treeWidth = maxX - minX;
    const treeHeight = maxY - minY;

    // Set viewBox to ensure the tree fits in the SVG
    svg.attr('viewBox', `${minX} ${minY} ${treeWidth} ${treeHeight}`);

    // Draw edges
    edges.forEach(edge => {
      const sourceX = edge.source.x || 0;
      const sourceY = edge.source.y || 0;
      const targetX = edge.target.x || 0;
      const targetY = edge.target.y || 0;

      // Draw a straight line
      svg.append('line')
        .attr('x1', sourceX)
        .attr('y1', sourceY + 15) // Offset from bottom of node
        .attr('x2', targetX)
        .attr('y2', targetY - 15) // Offset from top of node
        .attr('stroke', document.documentElement.classList.contains('dark') ? '#6552D0' : '#000000') // Purple in dark mode, black in light mode
        .attr('stroke-width', 2);
    });

    // Draw nodes
    nodes.forEach(node => {
      const g = svg.append('g')
        .attr('transform', `translate(${node.x}, ${node.y})`);

      // Calculate node dimensions based on number of keys
      const keyWidth = 25;
      const nodeWidth = Math.max(keyWidth * node.keys.length, 40);
      const nodeHeight = 30;

      // Draw node background
      const isDarkMode = document.documentElement.classList.contains('dark');
      const fillColor = isDarkMode ? '#17203D' : '#E7D3BB'; // Dark blue in dark mode, beige in light mode
      const strokeColor = isDarkMode ? '#6552D0' : '#000000'; // Purple border in dark mode, black in light mode

      g.append('rect')
        .attr('x', -nodeWidth / 2)
        .attr('y', -nodeHeight / 2)
        .attr('width', nodeWidth)
        .attr('height', nodeHeight)
        .attr('rx', 5)
        .attr('fill', fillColor)
        .attr('stroke', strokeColor)
        .attr('stroke-width', 1.5);

      // Draw separators between keys
      if (node.keys.length > 1) {
        for (let i = 1; i < node.keys.length; i++) {
          const separatorX = -nodeWidth / 2 + i * (nodeWidth / node.keys.length);
          g.append('line')
            .attr('x1', separatorX)
            .attr('y1', -nodeHeight / 2)
            .attr('x2', separatorX)
            .attr('y2', nodeHeight / 2)
            .attr('stroke', strokeColor) // Use same color as border
            .attr('stroke-width', 1);
        }
      }

      // Draw keys
      node.keys.forEach((key, i) => {
        const x = -nodeWidth / 2 + (i + 0.5) * (nodeWidth / node.keys.length);

        const textColor = isDarkMode ? '#FFFFFF' : '#000000'; // White text in dark mode, black in light mode

        g.append('text')
          .attr('x', x)
          .attr('y', 5)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', textColor)
          .attr('font-size', '12px')
          .attr('font-weight', 'bold')
          .text(key);
      });
    });
  };

  return (
    <div className="relative">
      <div className="relative">
        {/* Zoom controls */}
        <div className="absolute right-4 top-4 z-10 flex flex-col space-y-2">
          <button
            type="button"
            onClick={zoomIn}
            className="p-2 rounded-full shadow-md transition-colors"
            style={{ backgroundColor: document.documentElement.classList.contains('dark') ? '#6552D0' : '#F02F34', color: '#FFFFFF' }}
            aria-label="Zoom in"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#FFFFFF">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={zoomOut}
            className="p-2 rounded-full shadow-md transition-colors"
            style={{ backgroundColor: document.documentElement.classList.contains('dark') ? '#17203D' : '#E7D3BB', color: document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#000000' }}
            aria-label="Zoom out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#000000'}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={resetView}
            className="p-2 rounded-full shadow-md transition-colors text-xs"
            style={{ backgroundColor: document.documentElement.classList.contains('dark') ? '#000000' : '#000000', color: '#FFFFFF' }}
            aria-label="Reset view"
          >
            <span style={{ color: '#FFFFFF' }}>Reset</span>
          </button>
        </div>

        {/* Tree visualization container with both horizontal and vertical scrolling */}
        <div
          className={`tree-container tree-canvas ${isDragging ? 'dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={`tree-content ${isDragging ? 'dragging' : ''}`}
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`
            }}
          >
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              className="min-w-full tree-svg"
            />
          </div>
        </div>

        {/* Scroll indicators */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-8 h-16 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700 opacity-50 rounded-l-lg"></div>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-8 h-16 bg-gradient-to-l from-gray-200 to-transparent dark:from-gray-700 opacity-50 rounded-r-lg"></div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="h-8 w-16 bg-gradient-to-b from-gray-200 to-transparent dark:from-gray-700 opacity-50 rounded-t-lg"></div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="h-8 w-16 bg-gradient-to-t from-gray-200 to-transparent dark:from-gray-700 opacity-50 rounded-b-lg"></div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 12h8m-8 5h8" />
            </svg>
            Scroll or use zoom controls
          </span>
        </div>
      </div>

      {/* Operation description */}
      <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Operation:</h3>
        <p className="text-gray-800 dark:text-gray-200">{operationDescription || 'No operation'}</p>
      </div>
    </div>
  );
};

export default TreeVisualizer;
