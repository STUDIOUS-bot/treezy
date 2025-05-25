export interface AVLNode {
  value: number;
  height: number;
  left: AVLNode | null;
  right: AVLNode | null;
  x?: number;
  y?: number;
  id: string;
}

export interface AVLOperation {
  type: 'insert' | 'rotate-left' | 'rotate-right' | 'update-height' | 'balance';
  node?: AVLNode;
  description: string;
}

export class AVLTree {
  root: AVLNode | null = null;
  operations: AVLOperation[] = [];

  // Helper function to get height of a node
  private getHeight(node: AVLNode | null): number {
    return node ? node.height : 0;
  }

  // Helper function to get balance factor of a node
  private getBalanceFactor(node: AVLNode | null): number {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  // Right rotation
  private rotateRight(y: AVLNode): AVLNode {
    const x = y.left as AVLNode;
    const T2 = x.right;

    // Perform rotation
    x.right = y;
    y.left = T2;

    // Update heights
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

    this.operations.push({
      type: 'rotate-right',
      node: y,
      description: `Right rotation performed at node ${y.value}`
    });

    // Return new root
    return x;
  }

  // Left rotation
  private rotateLeft(x: AVLNode): AVLNode {
    const y = x.right as AVLNode;
    const T2 = y.left;

    // Perform rotation
    y.left = x;
    x.right = T2;

    // Update heights
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

    this.operations.push({
      type: 'rotate-left',
      node: x,
      description: `Left rotation performed at node ${x.value}`
    });

    // Return new root
    return y;
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
    this.root = this.insertNode(this.root, value);
  }

  private insertNode(node: AVLNode | null, value: number): AVLNode {
    // 1. Perform standard BST insertion
    if (node === null) {
      const newNode: AVLNode = {
        value,
        height: 1,
        left: null,
        right: null,
        id: `node-${value}-${Date.now()}`
      };

      this.operations.push({
        type: 'insert',
        node: newNode,
        description: `Inserted new node with value ${value}`
      });

      return newNode;
    }

    if (value < node.value) {
      node.left = this.insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.insertNode(node.right, value);
    } else {
      // Duplicate values not allowed
      return node;
    }

    // 2. Update height of this ancestor node
    node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;

    this.operations.push({
      type: 'update-height',
      node,
      description: `Updated height of node ${node.value} to ${node.height}`
    });

    // 3. Get the balance factor to check if this node became unbalanced
    const balance = this.getBalanceFactor(node);

    this.operations.push({
      type: 'balance',
      node,
      description: `Checking balance factor of node ${node.value}: ${balance}`
    });

    // Left Left Case
    if (balance > 1 && value < (node.left as AVLNode).value) {
      this.operations.push({
        type: 'balance',
        description: `Left Left Case detected at node ${node.value}`
      });
      return this.rotateRight(node);
    }

    // Right Right Case
    if (balance < -1 && value > (node.right as AVLNode).value) {
      this.operations.push({
        type: 'balance',
        description: `Right Right Case detected at node ${node.value}`
      });
      return this.rotateLeft(node);
    }

    // Left Right Case
    if (balance > 1 && value > (node.left as AVLNode).value) {
      this.operations.push({
        type: 'balance',
        description: `Left Right Case detected at node ${node.value}`
      });
      node.left = this.rotateLeft(node.left as AVLNode);
      return this.rotateRight(node);
    }

    // Right Left Case
    if (balance < -1 && value < (node.right as AVLNode).value) {
      this.operations.push({
        type: 'balance',
        description: `Right Left Case detected at node ${node.value}`
      });
      node.right = this.rotateRight(node.right as AVLNode);
      return this.rotateLeft(node);
    }

    // Return the unchanged node
    return node;
  }

  // Calculate the coordinates for visualization
  calculateCoordinates(
    node: AVLNode | null = this.root,
    depth: number = 0,
    position: number = 0,
    horizontalSpacing: number = 60,
    verticalSpacing: number = 60
  ): void {
    if (!node) return;

    // Calculate x and y coordinates
    node.y = depth * verticalSpacing + 40;
    node.x = position * horizontalSpacing + 300; // Shift much further right with an even larger offset

    // Get the total number of nodes to adjust spacing
    const totalNodes = this.getAllNodes().length;
    const maxDepth = this.getMaxDepth(this.root);

    // Calculate a scaling factor based on tree size
    const scaleFactor = Math.max(1, Math.min(3, Math.log2(totalNodes + 1)));

    // Calculate coordinates for left and right children with adaptive spacing
    if (node.left) {
      this.calculateCoordinates(
        node.left,
        depth + 1,
        position - Math.pow(2, Math.max(0, 2 - depth)) / scaleFactor,
        horizontalSpacing,
        verticalSpacing
      );
    }

    if (node.right) {
      this.calculateCoordinates(
        node.right,
        depth + 1,
        position + Math.pow(2, Math.max(0, 2 - depth)) / scaleFactor,
        horizontalSpacing,
        verticalSpacing
      );
    }
  }

  // Helper method to get the maximum depth of the tree
  private getMaxDepth(node: AVLNode | null): number {
    if (!node) return 0;
    return Math.max(this.getMaxDepth(node.left), this.getMaxDepth(node.right)) + 1;
  }

  // Get all nodes for visualization
  getAllNodes(): AVLNode[] {
    const nodes: AVLNode[] = [];

    const traverse = (node: AVLNode | null) => {
      if (node) {
        nodes.push(node);
        traverse(node.left);
        traverse(node.right);
      }
    };

    traverse(this.root);
    return nodes;
  }

  // Get all edges for visualization
  getEdges(): { source: AVLNode; target: AVLNode }[] {
    const edges: { source: AVLNode; target: AVLNode }[] = [];

    const traverse = (node: AVLNode | null) => {
      if (node) {
        if (node.left) {
          edges.push({ source: node, target: node.left });
          traverse(node.left);
        }
        if (node.right) {
          edges.push({ source: node, target: node.right });
          traverse(node.right);
        }
      }
    };

    traverse(this.root);
    return edges;
  }
}
