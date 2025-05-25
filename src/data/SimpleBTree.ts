// A simplified B-Tree implementation focused on visualization
export interface SimpleBTreeNode {
  keys: number[];
  children: SimpleBTreeNode[];
  x?: number;
  y?: number;
  id: string;
}

export interface BTreeOperation {
  type: 'insert';
  key: number;
  description: string;
}

export class SimpleBTree {
  root: SimpleBTreeNode;
  order: number; // B-Tree order (maximum number of children)
  operations: BTreeOperation[];

  constructor(order: number = 3) {
    this.order = order;
    // Create an empty root node
    this.root = {
      keys: [],
      children: [],
      id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
    };

    // Initialize operations array
    this.operations = [];
  }

  // Insert a key into the B-Tree
  insert(key: number): void {
    // Add operation to track this insertion
    this.operations.push({
      type: 'insert',
      key: key,
      description: `Insert ${key} into the tree`
    });

    // For simplicity, we'll just add keys to the appropriate nodes
    // without implementing the full B-Tree insertion algorithm

    // If the root is empty, add the key to the root
    if (this.root.keys.length === 0) {
      this.root.keys.push(key);
      return;
    }

    // If the root is a leaf, add the key to the root
    if (this.root.children.length === 0) {
      this.insertIntoNode(this.root, key);
      return;
    }

    // Otherwise, find the appropriate leaf node
    let current = this.root;
    while (current.children.length > 0) {
      let i = 0;
      while (i < current.keys.length && key > current.keys[i]) {
        i++;
      }

      current = current.children[i];
    }

    // Insert into the leaf node
    this.insertIntoNode(current, key);
  }

  // Insert a key into a node and keep keys sorted
  private insertIntoNode(node: SimpleBTreeNode, key: number): void {
    // Find the position to insert the key
    let i = 0;
    while (i < node.keys.length && key > node.keys[i]) {
      i++;
    }

    // Insert the key at the correct position
    node.keys.splice(i, 0, key);

    // If the node has too many keys, split it
    if (node.keys.length > this.order - 1) {
      this.splitNode(node);
    }
  }

  // Split a node when it has too many keys
  private splitNode(node: SimpleBTreeNode): void {
    // If this is the root, create a new root
    if (node === this.root) {
      const newRoot: SimpleBTreeNode = {
        keys: [],
        children: [node],
        id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
      };
      this.root = newRoot;
      this.splitChild(newRoot, 0);
    } else {
      // Find the parent of this node
      const parent = this.findParent(this.root, node);
      if (parent) {
        // Find the index of this node in the parent's children
        const index = parent.children.indexOf(node);
        this.splitChild(parent, index);
      }
    }
  }

  // Split a child of a node
  private splitChild(parent: SimpleBTreeNode, index: number): void {
    const child = parent.children[index];
    const middleIndex = Math.floor(child.keys.length / 2);
    const middleKey = child.keys[middleIndex];

    // Create a new node with the right half of the keys
    const newNode: SimpleBTreeNode = {
      keys: child.keys.splice(middleIndex + 1),
      children: [],
      id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
    };

    // If the child has children, split them too
    if (child.children.length > 0) {
      newNode.children = child.children.splice(middleIndex + 1);
    }

    // Remove the middle key from the child
    child.keys.splice(middleIndex, 1);

    // Insert the middle key into the parent
    const parentIndex = parent.keys.findIndex(k => k > middleKey);
    if (parentIndex === -1) {
      parent.keys.push(middleKey);
      parent.children.push(newNode);
    } else {
      parent.keys.splice(parentIndex, 0, middleKey);
      parent.children.splice(parentIndex + 1, 0, newNode);
    }
  }

  // Find the parent of a node
  private findParent(current: SimpleBTreeNode, target: SimpleBTreeNode): SimpleBTreeNode | null {
    if (current.children.includes(target)) {
      return current;
    }

    for (const child of current.children) {
      const parent = this.findParent(child, target);
      if (parent) {
        return parent;
      }
    }

    return null;
  }

  // Calculate coordinates for visualization
  calculateCoordinates(): void {
    // First pass: assign y-coordinates based on depth
    this.assignYCoordinates(this.root, 0);

    // Second pass: assign x-coordinates
    this.assignXCoordinates(this.root, 400);

    // Third pass: center each level
    this.centerEachLevel();
  }

  // First pass: assign y-coordinates based on depth
  private assignYCoordinates(node: SimpleBTreeNode, depth: number): void {
    // Set y-coordinate based on depth
    node.y = depth * 80 + 40;

    // Process children
    for (const child of node.children) {
      this.assignYCoordinates(child, depth + 1);
    }
  }

  // Second pass: assign x-coordinates
  private assignXCoordinates(node: SimpleBTreeNode, startX: number): number {
    // For leaf nodes, just place them at the current position
    if (node.children.length === 0) {
      node.x = startX;
      return startX + 100; // Return next available position
    }

    // Process first child
    let currentX = this.assignXCoordinates(node.children[0], startX);

    // Process remaining children
    for (let i = 1; i < node.children.length; i++) {
      currentX = this.assignXCoordinates(node.children[i], currentX + 50);
    }

    // Position this node centered over its children
    const firstChildX = node.children[0].x || startX;
    const lastChildX = node.children[node.children.length - 1].x || startX;
    node.x = (firstChildX + lastChildX) / 2;

    return currentX;
  }

  // Third pass: center each level
  private centerEachLevel(): void {
    // Group nodes by level (y-coordinate)
    const nodesByLevel: Map<number, SimpleBTreeNode[]> = new Map();

    // Collect all nodes
    const allNodes = this.getAllNodes();

    // Group by y-coordinate
    allNodes.forEach(node => {
      const y = node.y || 0;
      if (!nodesByLevel.has(y)) {
        nodesByLevel.set(y, []);
      }
      nodesByLevel.get(y)?.push(node);
    });

    // Center each level
    nodesByLevel.forEach(nodes => {
      // Find min and max x on this level
      const minX = Math.min(...nodes.map(n => n.x || 0));
      const maxX = Math.max(...nodes.map(n => n.x || 0));

      // Calculate center of this level
      const center = (minX + maxX) / 2;

      // Shift all nodes to center around 400
      const offset = 400 - center;

      // Apply offset to all nodes on this level
      nodes.forEach(node => {
        if (node.x !== undefined) {
          node.x += offset;
        }
      });
    });
  }

  // Get all nodes for visualization
  getAllNodes(): SimpleBTreeNode[] {
    const nodes: SimpleBTreeNode[] = [];

    const traverse = (node: SimpleBTreeNode) => {
      nodes.push(node);
      for (const child of node.children) {
        traverse(child);
      }
    };

    traverse(this.root);
    return nodes;
  }

  // Get all edges for visualization
  getEdges(): { source: SimpleBTreeNode; target: SimpleBTreeNode }[] {
    const edges: { source: SimpleBTreeNode; target: SimpleBTreeNode }[] = [];

    const traverse = (node: SimpleBTreeNode) => {
      for (const child of node.children) {
        edges.push({ source: node, target: child });
        traverse(child);
      }
    };

    traverse(this.root);
    return edges;
  }
}
