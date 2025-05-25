export interface BTreeNode {
  keys: number[];
  children: BTreeNode[];
  isLeaf: boolean;
  x?: number;
  y?: number;
  id: string;
}

export interface BTreeOperation {
  type: 'insert' | 'split' | 'search';
  node?: BTreeNode;
  key?: number;
  description: string;
}

export class BTree {
  root: BTreeNode;
  t: number;
  operations: BTreeOperation[] = [];

  constructor(t: number = 3) {
    this.t = t;
    this.root = this.createNode(true);
    this.root.keys = [50];

    this.operations.push({
      type: 'insert',
      key: 50,
      description: 'Initial key added to root',
    });
  }

  createNode(isLeaf: boolean): BTreeNode {
    return {
      keys: [],
      children: [],
      isLeaf,
      id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
    };
  }

  insert(key: number): void {
    this.operations.push({
      type: 'insert',
      key,
      description: `Starting insertion of key ${key}`,
    });

    if (this.root.keys.length === 2 * this.t - 1) {
      const newRoot = this.createNode(false);
      newRoot.children.push(this.root);

      this.operations.push({
        type: 'split',
        node: this.root,
        description: 'Root node is full, splitting and creating new root',
      });

      this.splitChild(newRoot, 0);
      this.root = newRoot;
    }

    this.insertNonFull(this.root, key);
  }

  private insertNonFull(node: BTreeNode, key: number): void {
    let i = node.keys.length - 1;

    this.operations.push({
      type: 'search',
      node,
      key,
      description: `Searching for position to insert key ${key} in node with keys [${node.keys.join(', ')}]`,
    });

    if (node.isLeaf) {
      while (i >= 0 && key < node.keys[i]) {
        i--;
      }
      node.keys.splice(i + 1, 0, key);

      this.operations.push({
        type: 'insert',
        node,
        key,
        description: `Inserted key ${key} into leaf node, new keys: [${node.keys.join(', ')}]`,
      });
    } else {
      while (i >= 0 && key < node.keys[i]) {
        i--;
      }
      i++;

      if (node.children[i].keys.length === 2 * this.t - 1) {
        this.operations.push({
          type: 'split',
          node: node.children[i],
          description: 'Child node is full, splitting before insertion',
        });

        this.splitChild(node, i);

        if (key > node.keys[i]) {
          i++;
        }
      }

      this.insertNonFull(node.children[i], key);
    }
  }

  private splitChild(parent: BTreeNode, index: number): void {
    const fullChild = parent.children[index];
    const newChild = this.createNode(fullChild.isLeaf);

    const midIndex = this.t - 1;
    const middleKey = fullChild.keys[midIndex];

    // Transfer keys and children
    newChild.keys = fullChild.keys.splice(midIndex + 1);
    if (!fullChild.isLeaf) {
      newChild.children = fullChild.children.splice(this.t);
    }

    parent.children.splice(index + 1, 0, newChild);
    parent.keys.splice(index, 0, middleKey);

    this.operations.push({
      type: 'split',
      node: parent,
      description: `Split complete: middle key ${middleKey} moved to parent`,
    });
  }

  calculateCoordinates(): void {
    const verticalSpacing = 70;
    this.assignYCoordinates(this.root, verticalSpacing);
    this.assignXCoordinates(this.root, 400);
    this.centerEachLevel();
  }

  private assignYCoordinates(node: BTreeNode, spacing: number, depth: number = 0): void {
    node.y = depth * spacing + 40;
    if (!node.isLeaf) {
      for (const child of node.children) {
        this.assignYCoordinates(child, spacing, depth + 1);
      }
    }
  }

  private assignXCoordinates(node: BTreeNode, startX: number): number {
    if (node.isLeaf || node.children.length === 0) {
      node.x = startX;
      const nodeWidth = Math.max(node.keys.length * 20, 30);
      return startX + nodeWidth + 10;
    }

    let currentX = this.assignXCoordinates(node.children[0], startX);
    for (let i = 1; i < node.children.length; i++) {
      const prevChildKeys = node.children[i - 1].keys.length;
      const minGap = Math.max(30, prevChildKeys * 15);
      currentX = this.assignXCoordinates(node.children[i], currentX + minGap);
    }

    const firstChildX = node.children[0].x ?? startX;
    const lastChildX = node.children[node.children.length - 1].x ?? startX;
    node.x = (firstChildX + lastChildX) / 2;

    return currentX;
  }

  private centerEachLevel(): void {
    const levelMap: Map<number, BTreeNode[]> = new Map();

    for (const node of this.getAllNodes()) {
      const y = node.y ?? 0;
      if (!levelMap.has(y)) levelMap.set(y, []);
      levelMap.get(y)?.push(node);
    }

    levelMap.forEach(nodes => {
      const minX = Math.min(...nodes.map(n => n.x ?? 0));
      const maxX = Math.max(...nodes.map(n => n.x ?? 0));
      const centerOffset = 400 - (minX + maxX) / 2;

      for (const node of nodes) {
        if (node.x !== undefined) {
          node.x += centerOffset;
        }
      }
    });
  }

  private getMaxDepth(node: BTreeNode): number {
    if (node.isLeaf) return 1;
    return 1 + Math.max(...node.children.map(child => this.getMaxDepth(child)));
  }

  getAllNodes(): BTreeNode[] {
    const nodes: BTreeNode[] = [];

    const traverse = (node: BTreeNode) => {
      nodes.push(node);
      if (!node.isLeaf) {
        for (const child of node.children) {
          traverse(child);
        }
      }
    };

    traverse(this.root);
    return nodes;
  }

  getEdges(): { source: BTreeNode; target: BTreeNode }[] {
    const edges: { source: BTreeNode; target: BTreeNode }[] = [];

    const traverse = (node: BTreeNode) => {
      if (!node.isLeaf) {
        for (const child of node.children) {
          edges.push({ source: node, target: child });
          traverse(child);
        }
      }
    };

    traverse(this.root);
    return edges;
  }
}
