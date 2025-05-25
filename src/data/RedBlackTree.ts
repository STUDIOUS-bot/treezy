export enum Color {
  RED = 'red',
  BLACK = 'black'
}

export interface RBNode {
  value: number;
  color: Color;
  left: RBNode | null;
  right: RBNode | null;
  parent: RBNode | null;
  x?: number;
  y?: number;
  id: string;
}

export interface RBOperation {
  type: 'insert' | 'rotate-left' | 'rotate-right' | 'color-flip' | 'recolor';
  node?: RBNode;
  description: string;
}

export class RedBlackTree {
  root: RBNode | null = null;
  NIL: RBNode;
  operations: RBOperation[] = [];

  constructor() {
    // Create sentinel NIL node
    this.NIL = {
      value: -1,
      color: Color.BLACK,
      left: null,
      right: null,
      parent: null,
      id: 'nil'
    };
    this.root = this.NIL;
  }

  // Left rotation
  private rotateLeft(x: RBNode): void {
    const y = x.right as RBNode;
    x.right = y.left;

    if (y.left !== this.NIL) {
      y.left.parent = x;
    }

    y.parent = x.parent;

    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }

    y.left = x;
    x.parent = y;

    this.operations.push({
      type: 'rotate-left',
      node: x,
      description: `Left rotation performed at node ${x.value}`
    });
  }

  // Right rotation
  private rotateRight(y: RBNode): void {
    const x = y.left as RBNode;
    y.left = x.right;

    if (x.right !== this.NIL) {
      x.right.parent = y;
    }

    x.parent = y.parent;

    if (y.parent === null) {
      this.root = x;
    } else if (y === y.parent.left) {
      y.parent.left = x;
    } else {
      y.parent.right = x;
    }

    x.right = y;
    y.parent = x;

    this.operations.push({
      type: 'rotate-right',
      node: y,
      description: `Right rotation performed at node ${y.value}`
    });
  }

  // Insert a node
  insert(value: number): void {
    // Add a separator operation to indicate a new value insertion
    if (this.operations.length > 0) {
      this.operations.push({
        type: 'insert',
        description: `Starting insertion of value ${value}`
      });
    }

    // Create new node
    const newNode: RBNode = {
      value,
      color: Color.RED, // New nodes are always red
      left: this.NIL,
      right: this.NIL,
      parent: null,
      id: `node-${value}-${Date.now()}`
    };

    this.operations.push({
      type: 'insert',
      node: newNode,
      description: `Created new RED node with value ${value}`
    });

    // Find position to insert
    let y: RBNode | null = null;
    let x: RBNode | null = this.root;

    while (x !== this.NIL && x !== null) {
      y = x;
      if (newNode.value < x.value) {
        x = x.left;
      } else {
        x = x.right;
      }
    }

    // Set parent of new node
    newNode.parent = y;

    // Insert node in the tree
    if (y === null) {
      this.root = newNode; // Tree was empty
    } else if (newNode.value < y.value) {
      y.left = newNode;
    } else {
      y.right = newNode;
    }

    this.operations.push({
      type: 'insert',
      node: newNode,
      description: `Inserted node ${newNode.value} into the tree`
    });

    // If the new node is the root, color it black and return
    if (newNode.parent === null) {
      newNode.color = Color.BLACK;
      this.operations.push({
        type: 'recolor',
        node: newNode,
        description: `Recolored root node ${newNode.value} to BLACK`
      });
      return;
    }

    // If the grandparent is null, return
    if (newNode.parent.parent === null) {
      return;
    }

    // Fix the tree to maintain Red-Black properties
    this.fixInsert(newNode);
  }

  // Fix the tree after insertion
  private fixInsert(k: RBNode): void {
    let u: RBNode;

    while (k.parent !== null && k.parent.color === Color.RED) {
      if (k.parent === k.parent.parent?.right) {
        u = k.parent.parent.left as RBNode; // Uncle

        // Case 1: Uncle is red
        if (u.color === Color.RED) {
          u.color = Color.BLACK;
          k.parent.color = Color.BLACK;
          k.parent.parent.color = Color.RED;

          this.operations.push({
            type: 'color-flip',
            node: k.parent.parent,
            description: `Color flip: Uncle and parent to BLACK, grandparent to RED`
          });

          k = k.parent.parent;
        } else {
          // Case 2: Uncle is black, k is left child
          if (k === k.parent.left) {
            k = k.parent;
            this.rotateRight(k);
          }

          // Case 3: Uncle is black, k is right child
          if (k.parent) {
            k.parent.color = Color.BLACK;
            if (k.parent.parent) {
              k.parent.parent.color = Color.RED;

              this.operations.push({
                type: 'recolor',
                node: k.parent,
                description: `Recolored parent to BLACK and grandparent to RED`
              });

              this.rotateLeft(k.parent.parent);
            }
          }
        }
      } else {
        u = k.parent.parent?.right as RBNode; // Uncle

        // Case 1: Uncle is red
        if (u && u.color === Color.RED) {
          u.color = Color.BLACK;
          k.parent.color = Color.BLACK;
          k.parent.parent.color = Color.RED;

          this.operations.push({
            type: 'color-flip',
            node: k.parent.parent,
            description: `Color flip: Uncle and parent to BLACK, grandparent to RED`
          });

          k = k.parent.parent;
        } else {
          // Case 2: Uncle is black, k is right child
          if (k === k.parent.right) {
            k = k.parent;
            this.rotateLeft(k);
          }

          // Case 3: Uncle is black, k is left child
          if (k.parent) {
            k.parent.color = Color.BLACK;
            if (k.parent.parent) {
              k.parent.parent.color = Color.RED;

              this.operations.push({
                type: 'recolor',
                node: k.parent,
                description: `Recolored parent to BLACK and grandparent to RED`
              });

              this.rotateRight(k.parent.parent);
            }
          }
        }
      }

      if (k === this.root) {
        break;
      }
    }

    if (this.root) {
      this.root.color = Color.BLACK;
    }
  }

  // Calculate the coordinates for visualization - improved to prevent overlapping
  calculateCoordinates(): void {
    if (!this.root || this.root === this.NIL) return;

    const verticalSpacing = 60;

    // First pass: assign initial y-coordinates based on depth
    this.assignYCoordinates(this.root, verticalSpacing);

    // Second pass: assign x-coordinates using a more sophisticated algorithm
    this.assignXCoordinates();

    // Third pass: detect and fix overlapping nodes
    this.fixOverlappingNodes();
  }

  // First pass: assign y-coordinates based on depth
  private assignYCoordinates(node: RBNode | null, verticalSpacing: number, depth: number = 0): void {
    if (!node || node === this.NIL) return;

    // Set y-coordinate based on depth
    node.y = depth * verticalSpacing + 40;

    // Process children
    this.assignYCoordinates(node.left, verticalSpacing, depth + 1);
    this.assignYCoordinates(node.right, verticalSpacing, depth + 1);
  }

  // Second pass: assign x-coordinates using a more sophisticated algorithm
  private assignXCoordinates(): void {
    // Get the maximum depth of the tree
    const maxDepth = this.getMaxDepth(this.root);

    // Calculate the width of the tree at each level
    const levelWidths: number[] = new Array(maxDepth + 1).fill(0);
    this.countNodesAtEachLevel(this.root, 0, levelWidths);

    // Calculate the total width needed for the tree
    const totalWidth = 800; // Fixed width for the tree

    // Calculate the horizontal spacing for each level
    const levelSpacing: number[] = levelWidths.map(width =>
      width > 0 ? totalWidth / width : 0
    );

    // Assign x-coordinates based on in-order traversal
    this.assignXCoordinatesByLevel(this.root, 0, levelSpacing);
  }

  // Count the number of nodes at each level
  private countNodesAtEachLevel(node: RBNode | null, depth: number, levelWidths: number[]): void {
    if (!node || node === this.NIL) return;

    // Increment the count for this level
    levelWidths[depth]++;

    // Process children
    this.countNodesAtEachLevel(node.left, depth + 1, levelWidths);
    this.countNodesAtEachLevel(node.right, depth + 1, levelWidths);
  }

  // Assign x-coordinates based on level and position
  private assignXCoordinatesByLevel(node: RBNode | null, depth: number, levelSpacing: number[]): void {
    if (!node || node === this.NIL) return;

    // Get all nodes at this level
    const nodesAtLevel = this.getNodesAtLevel(this.root, depth);

    // Sort nodes by in-order traversal position
    const sortedNodes = this.sortNodesByInOrderTraversal(nodesAtLevel);

    // Assign x-coordinates based on position in sorted array
    const spacing = levelSpacing[depth];
    sortedNodes.forEach((n, i) => {
      n.x = (i + 0.5) * spacing;
    });

    // Process next level
    this.assignXCoordinatesByLevel(this.root, depth + 1, levelSpacing);
  }

  // Get all nodes at a specific level
  private getNodesAtLevel(node: RBNode | null, targetDepth: number, currentDepth: number = 0): RBNode[] {
    if (!node || node === this.NIL) return [];

    if (currentDepth === targetDepth) {
      return [node];
    }

    return [
      ...this.getNodesAtLevel(node.left, targetDepth, currentDepth + 1),
      ...this.getNodesAtLevel(node.right, targetDepth, currentDepth + 1)
    ];
  }

  // Sort nodes by their position in an in-order traversal
  private sortNodesByInOrderTraversal(nodes: RBNode[]): RBNode[] {
    // Get all nodes in in-order traversal
    const inOrderNodes: RBNode[] = [];
    this.inOrderTraversal(this.root, inOrderNodes);

    // Sort the input nodes based on their position in the in-order traversal
    return nodes.sort((a, b) =>
      inOrderNodes.indexOf(a) - inOrderNodes.indexOf(b)
    );
  }

  // Perform an in-order traversal
  private inOrderTraversal(node: RBNode | null, result: RBNode[]): void {
    if (!node || node === this.NIL) return;

    this.inOrderTraversal(node.left, result);
    result.push(node);
    this.inOrderTraversal(node.right, result);
  }

  // Third pass: detect and fix overlapping nodes
  private fixOverlappingNodes(): void {
    // Get all nodes
    const nodes = this.getAllNodes();

    // Group nodes by level (y-coordinate)
    const nodesByLevel: Map<number, RBNode[]> = new Map();

    // Group by y-coordinate
    nodes.forEach(node => {
      const y = node.y || 0;
      if (!nodesByLevel.has(y)) {
        nodesByLevel.set(y, []);
      }
      nodesByLevel.get(y)?.push(node);
    });

    // Fix overlapping nodes at each level
    nodesByLevel.forEach(nodesAtLevel => {
      // Sort nodes by x-coordinate
      nodesAtLevel.sort((a, b) => (a.x || 0) - (b.x || 0));

      // Minimum distance between nodes
      const minDistance = 40;

      // Check for overlaps and fix them
      for (let i = 1; i < nodesAtLevel.length; i++) {
        const prevNode = nodesAtLevel[i - 1];
        const currentNode = nodesAtLevel[i];

        const prevX = prevNode.x || 0;
        const currentX = currentNode.x || 0;

        // If nodes are too close, move the current node
        if (currentX - prevX < minDistance) {
          currentNode.x = prevX + minDistance;
        }
      }
    });
  }

  // Helper method to get the maximum depth of the tree
  private getMaxDepth(node: RBNode | null): number {
    if (!node || node === this.NIL) return 0;
    return Math.max(this.getMaxDepth(node.left), this.getMaxDepth(node.right)) + 1;
  }

  // Get all nodes for visualization
  getAllNodes(): RBNode[] {
    const nodes: RBNode[] = [];

    const traverse = (node: RBNode | null) => {
      if (node && node !== this.NIL) {
        nodes.push(node);
        traverse(node.left);
        traverse(node.right);
      }
    };

    traverse(this.root);
    return nodes;
  }

  // Get all edges for visualization
  getEdges(): { source: RBNode; target: RBNode }[] {
    const edges: { source: RBNode; target: RBNode }[] = [];

    const traverse = (node: RBNode | null) => {
      if (node && node !== this.NIL) {
        if (node.left && node.left !== this.NIL) {
          edges.push({ source: node, target: node.left });
          traverse(node.left);
        }
        if (node.right && node.right !== this.NIL) {
          edges.push({ source: node, target: node.right });
          traverse(node.right);
        }
      }
    };

    traverse(this.root);
    return edges;
  }
}
