// A simplified Red-Black Tree implementation focused on visualization
export enum SimpleColor {
  RED = 'RED',
  BLACK = 'BLACK'
}

export interface SimpleRBNode {
  value: number;
  color: SimpleColor;
  left: SimpleRBNode | null;
  right: SimpleRBNode | null;
  parent: SimpleRBNode | null;
  x?: number;
  y?: number;
}

export interface RBOperation {
  type: 'insert';
  value: number;
  description: string;
}

export class SimpleRBTree {
  root: SimpleRBNode | null;
  NIL: SimpleRBNode;
  operations: RBOperation[];

  constructor() {
    // Create NIL node (sentinel)
    this.NIL = {
      value: 0,
      color: SimpleColor.BLACK,
      left: null,
      right: null,
      parent: null
    };

    this.root = this.NIL;
    this.operations = [];
  }

  // Insert a value into the Red-Black Tree
  insert(value: number): void {
    // Add operation to track this insertion
    this.operations.push({
      type: 'insert',
      value: value,
      description: `Insert ${value} into the tree`
    });

    // Create a new node
    const newNode: SimpleRBNode = {
      value,
      color: SimpleColor.RED,
      left: this.NIL,
      right: this.NIL,
      parent: null
    };

    // If tree is empty, make the new node the root
    if (this.root === this.NIL) {
      newNode.color = SimpleColor.BLACK;
      this.root = newNode;
      return;
    }

    // Find the position to insert the new node
    let current = this.root;
    let parent = null;

    while (current !== this.NIL) {
      parent = current;

      if (value < current.value) {
        current = current.left!;
      } else {
        current = current.right!;
      }
    }

    // Set the parent of the new node
    newNode.parent = parent;

    // Insert the new node as a child of the parent
    if (parent) {
      if (value < parent.value) {
        parent.left = newNode;
      } else {
        parent.right = newNode;
      }
    }

    // Fix the Red-Black Tree properties
    this.fixInsert(newNode);
  }

  // Fix the Red-Black Tree properties after insertion
  private fixInsert(node: SimpleRBNode): void {
    let current = node;

    // Fix the tree until we reach the root or the parent is black
    while (current !== this.root && current.parent && current.parent.color === SimpleColor.RED) {
      // If parent is the left child of grandparent
      if (current.parent.parent && current.parent === current.parent.parent.left) {
        const uncle = current.parent.parent.right;

        // Case 1: Uncle is red
        if (uncle && uncle.color === SimpleColor.RED) {
          current.parent.color = SimpleColor.BLACK;
          uncle.color = SimpleColor.BLACK;
          current.parent.parent.color = SimpleColor.RED;
          current = current.parent.parent;
        } else {
          // Case 2: Uncle is black and current is right child
          if (current === current.parent.right) {
            current = current.parent;
            this.leftRotate(current);
          }

          // Case 3: Uncle is black and current is left child
          if (current.parent && current.parent.parent) {
            current.parent.color = SimpleColor.BLACK;
            current.parent.parent.color = SimpleColor.RED;
            this.rightRotate(current.parent.parent);
          }
        }
      } else { // Parent is the right child of grandparent
        const uncle = current.parent.parent!.left;

        // Case 1: Uncle is red
        if (uncle && uncle.color === SimpleColor.RED) {
          current.parent.color = SimpleColor.BLACK;
          uncle.color = SimpleColor.BLACK;
          current.parent.parent!.color = SimpleColor.RED;
          current = current.parent.parent!;
        } else {
          // Case 2: Uncle is black and current is left child
          if (current === current.parent.left) {
            current = current.parent;
            this.rightRotate(current);
          }

          // Case 3: Uncle is black and current is right child
          if (current.parent && current.parent.parent) {
            current.parent.color = SimpleColor.BLACK;
            current.parent.parent.color = SimpleColor.RED;
            this.leftRotate(current.parent.parent);
          }
        }
      }
    }

    // Ensure the root is black
    if (this.root) {
      this.root.color = SimpleColor.BLACK;
    }
  }

  // Left rotation
  private leftRotate(x: SimpleRBNode): void {
    const y = x.right!;

    // Turn y's left subtree into x's right subtree
    x.right = y.left;

    if (y.left !== this.NIL) {
      y.left.parent = x;
    }

    // Link x's parent to y
    y.parent = x.parent;

    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }

    // Put x on y's left
    y.left = x;
    x.parent = y;
  }

  // Right rotation
  private rightRotate(y: SimpleRBNode): void {
    const x = y.left!;

    // Turn x's right subtree into y's left subtree
    y.left = x.right;

    if (x.right !== this.NIL) {
      x.right.parent = y;
    }

    // Link y's parent to x
    x.parent = y.parent;

    if (y.parent === null) {
      this.root = x;
    } else if (y === y.parent.left) {
      y.parent.left = x;
    } else {
      y.parent.right = x;
    }

    // Put y on x's right
    x.right = y;
    y.parent = x;
  }

  // Calculate coordinates for visualization - improved to match AVL tree stability
  calculateCoordinates(
    node: SimpleRBNode | null = this.root,
    depth: number = 0,
    position: number = 0,
    horizontalSpacing: number = 80,
    verticalSpacing: number = 80
  ): void {
    if (!node || node === this.NIL) return;

    // Calculate x and y coordinates similar to AVL tree
    node.y = depth * verticalSpacing + 40;
    node.x = position * horizontalSpacing + 400; // Center around 400

    // Get the total number of nodes to adjust spacing
    const totalNodes = this.getAllNodes().length;
    const maxDepth = this.getMaxDepth(this.root);

    // Calculate a scaling factor based on tree size
    const scaleFactor = Math.max(1, Math.min(3, Math.log2(totalNodes + 1)));

    // Calculate coordinates for left and right children with adaptive spacing
    if (node.left && node.left !== this.NIL) {
      this.calculateCoordinates(
        node.left,
        depth + 1,
        position - Math.pow(2, Math.max(0, 3 - depth)) / scaleFactor,
        horizontalSpacing,
        verticalSpacing
      );
    }

    if (node.right && node.right !== this.NIL) {
      this.calculateCoordinates(
        node.right,
        depth + 1,
        position + Math.pow(2, Math.max(0, 3 - depth)) / scaleFactor,
        horizontalSpacing,
        verticalSpacing
      );
    }
  }

  // Helper method to get the maximum depth of the tree
  getMaxDepth(node: SimpleRBNode | null): number {
    if (!node || node === this.NIL) return 0;
    return Math.max(this.getMaxDepth(node.left), this.getMaxDepth(node.right)) + 1;
  }

  // Get all nodes for visualization
  getAllNodes(): SimpleRBNode[] {
    const nodes: SimpleRBNode[] = [];

    const traverse = (node: SimpleRBNode | null) => {
      if (!node || node === this.NIL) return;

      nodes.push(node);
      traverse(node.left);
      traverse(node.right);
    };

    traverse(this.root);
    return nodes;
  }

  // Get all edges for visualization
  getEdges(): { source: SimpleRBNode; target: SimpleRBNode }[] {
    const edges: { source: SimpleRBNode; target: SimpleRBNode }[] = [];

    const traverse = (node: SimpleRBNode | null) => {
      if (!node || node === this.NIL) return;

      if (node.left && node.left !== this.NIL) {
        edges.push({ source: node, target: node.left });
        traverse(node.left);
      }

      if (node.right && node.right !== this.NIL) {
        edges.push({ source: node, target: node.right });
        traverse(node.right);
      }
    };

    traverse(this.root);
    return edges;
  }
}
