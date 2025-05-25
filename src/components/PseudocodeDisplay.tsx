import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Language = 'python' | 'java' | 'cpp';
type TreeType = 'avl' | 'rb' | 'btree';
type Operation = 'insert' | 'delete' | 'search' | 'rotate' | 'balance';

interface PseudocodeDisplayProps {
  treeType: TreeType;
  darkMode: boolean;
}

const PseudocodeDisplay: React.FC<PseudocodeDisplayProps> = ({ treeType, darkMode }) => {
  const [language, setLanguage] = useState<Language>('python');
  const [operation, setOperation] = useState<Operation>('insert');

  // Get the appropriate pseudocode based on tree type, operation, and language
  const getPseudocode = (): string => {
    if (treeType === 'avl') {
      return getAVLPseudocode(operation, language);
    } else if (treeType === 'rb') {
      return getRBPseudocode(operation, language);
    } else if (treeType === 'btree') {
      return getBTreePseudocode(operation, language);
    }
    return 'Select a tree type to view pseudocode';
  };

  // Get AVL Tree pseudocode
  const getAVLPseudocode = (op: Operation, lang: Language): string => {
    if (op === 'insert') {
      if (lang === 'python') {
        return `def insert(self, key):
    # Step 1: Perform standard BST insert
    if self.root is None:
        self.root = Node(key)
        return

    # Find the position to insert
    current = self.root
    while current:
        if key < current.key:
            if current.left is None:
                current.left = Node(key)
                current.left.parent = current
                break
            current = current.left
        else:
            if current.right is None:
                current.right = Node(key)
                current.right.parent = current
                break
            current = current.right

    # Step 2: Update heights of ancestors
    self.update_height(current)

    # Step 3: Rebalance the tree
    self.rebalance(current)`;
      } else if (lang === 'java') {
        return `public void insert(int key) {
    // Step 1: Perform standard BST insert
    if (root == null) {
        root = new Node(key);
        return;
    }

    // Find the position to insert
    Node current = root;
    while (true) {
        if (key < current.key) {
            if (current.left == null) {
                current.left = new Node(key);
                current.left.parent = current;
                break;
            }
            current = current.left;
        } else {
            if (current.right == null) {
                current.right = new Node(key);
                current.right.parent = current;
                break;
            }
            current = current.right;
        }
    }

    // Step 2: Update heights of ancestors
    updateHeight(current);

    // Step 3: Rebalance the tree
    rebalance(current);
}`;
      } else if (lang === 'cpp') {
        return `void insert(int key) {
    // Step 1: Perform standard BST insert
    if (root == nullptr) {
        root = new Node(key);
        return;
    }

    // Find the position to insert
    Node* current = root;
    while (true) {
        if (key < current->key) {
            if (current->left == nullptr) {
                current->left = new Node(key);
                current->left->parent = current;
                break;
            }
            current = current->left;
        } else {
            if (current->right == nullptr) {
                current->right = new Node(key);
                current->right->parent = current;
                break;
            }
            current = current->right;
        }
    }

    // Step 2: Update heights of ancestors
    updateHeight(current);

    // Step 3: Rebalance the tree
    rebalance(current);
}`;
      }
    } else if (op === 'balance') {
      if (lang === 'python') {
        return `def rebalance(self, node):
    # Update heights
    self.update_height(node)

    # Check balance factor
    balance = self.get_balance(node)

    # Left heavy
    if balance > 1:
        # Left-Right case
        if self.get_balance(node.left) < 0:
            self.left_rotate(node.left)
        # Left-Left case
        self.right_rotate(node)

    # Right heavy
    elif balance < -1:
        # Right-Left case
        if self.get_balance(node.right) > 0:
            self.right_rotate(node.right)
        # Right-Right case
        self.left_rotate(node)`;
      } else if (lang === 'java') {
        return `private void rebalance(Node node) {
    // Update heights
    updateHeight(node);

    // Check balance factor
    int balance = getBalance(node);

    // Left heavy
    if (balance > 1) {
        // Left-Right case
        if (getBalance(node.left) < 0) {
            leftRotate(node.left);
        }
        // Left-Left case
        rightRotate(node);
    }

    // Right heavy
    else if (balance < -1) {
        // Right-Left case
        if (getBalance(node.right) > 0) {
            rightRotate(node.right);
        }
        // Right-Right case
        leftRotate(node);
    }
}`;
      } else if (lang === 'cpp') {
        return `void rebalance(Node* node) {
    // Update heights
    updateHeight(node);

    // Check balance factor
    int balance = getBalance(node);

    // Left heavy
    if (balance > 1) {
        // Left-Right case
        if (getBalance(node->left) < 0) {
            leftRotate(node->left);
        }
        // Left-Left case
        rightRotate(node);
    }

    // Right heavy
    else if (balance < -1) {
        // Right-Left case
        if (getBalance(node->right) > 0) {
            rightRotate(node->right);
        }
        // Right-Right case
        leftRotate(node);
    }
}`;
      }
    }
    return `Pseudocode for ${op} operation in AVL Tree (${lang}) not available yet.`;
  };

  // Get Red-Black Tree pseudocode
  const getRBPseudocode = (op: Operation, lang: Language): string => {
    if (op === 'insert') {
      if (lang === 'python') {
        return `def insert(self, key):
    # Step 1: Perform standard BST insert
    new_node = Node(key)
    new_node.color = RED  # New nodes are always red

    if self.root is None:
        self.root = new_node
        self.fix_insert(new_node)  # Fix red-red violations
        return

    # Find the position to insert
    current = self.root
    parent = None

    while current is not None:
        parent = current
        if new_node.key < current.key:
            current = current.left
        else:
            current = current.right

    # Set the parent of the new node
    new_node.parent = parent

    # Insert the new node
    if new_node.key < parent.key:
        parent.left = new_node
    else:
        parent.right = new_node

    # Fix red-red violations
    self.fix_insert(new_node)`;
      } else if (lang === 'java') {
        return `public void insert(int key) {
    // Step 1: Perform standard BST insert
    Node newNode = new Node(key);
    newNode.color = RED;  // New nodes are always red

    if (root == null) {
        root = newNode;
        fixInsert(newNode);  // Fix red-red violations
        return;
    }

    // Find the position to insert
    Node current = root;
    Node parent = null;

    while (current != null) {
        parent = current;
        if (newNode.key < current.key) {
            current = current.left;
        } else {
            current = current.right;
        }
    }

    // Set the parent of the new node
    newNode.parent = parent;

    // Insert the new node
    if (newNode.key < parent.key) {
        parent.left = newNode;
    } else {
        parent.right = newNode;
    }

    // Fix red-red violations
    fixInsert(newNode);
}`;
      } else if (lang === 'cpp') {
        return `void insert(int key) {
    // Step 1: Perform standard BST insert
    Node* newNode = new Node(key);
    newNode->color = RED;  // New nodes are always red

    if (root == nullptr) {
        root = newNode;
        fixInsert(newNode);  // Fix red-red violations
        return;
    }

    // Find the position to insert
    Node* current = root;
    Node* parent = nullptr;

    while (current != nullptr) {
        parent = current;
        if (newNode->key < current->key) {
            current = current->left;
        } else {
            current = current->right;
        }
    }

    // Set the parent of the new node
    newNode->parent = parent;

    // Insert the new node
    if (newNode->key < parent->key) {
        parent->left = newNode;
    } else {
        parent->right = newNode;
    }

    // Fix red-red violations
    fixInsert(newNode);
}`;
      }
    }
    return `Pseudocode for ${op} operation in Red-Black Tree (${lang}) not available yet.`;
  };

  // Get B-Tree pseudocode
  const getBTreePseudocode = (op: Operation, lang: Language): string => {
    if (op === 'insert') {
      if (lang === 'python') {
        return `def insert(self, key):
    # If tree is empty
    if self.root is None:
        self.root = Node()
        self.root.keys.append(key)
        return

    # If root is full, split it
    if len(self.root.keys) == (2 * self.t - 1):
        new_root = Node()
        new_root.children.append(self.root)
        self.split_child(new_root, 0)
        self.root = new_root

    # Insert non-full
    self.insert_non_full(self.root, key)

def insert_non_full(self, node, key):
    # Initialize index as the rightmost element
    i = len(node.keys) - 1

    # If this is a leaf node
    if node.is_leaf():
        # Find the location of new key
        while i >= 0 and key < node.keys[i]:
            i -= 1

        # Insert the new key at found location
        node.keys.insert(i + 1, key)
    else:
        # Find the child which is going to have the new key
        while i >= 0 and key < node.keys[i]:
            i -= 1
        i += 1

        # If the child is full, split it
        if len(node.children[i].keys) == (2 * self.t - 1):
            self.split_child(node, i)

            # After split, the middle key goes up and
            # node's children are split into two
            if key > node.keys[i]:
                i += 1

        # Insert the key
        self.insert_non_full(node.children[i], key)`;
      } else if (lang === 'java') {
        return `public void insert(int key) {
    // If tree is empty
    if (root == null) {
        root = new Node();
        root.keys.add(key);
        return;
    }

    // If root is full, split it
    if (root.keys.size() == (2 * t - 1)) {
        Node newRoot = new Node();
        newRoot.children.add(root);
        splitChild(newRoot, 0);
        root = newRoot;
    }

    // Insert non-full
    insertNonFull(root, key);
}

private void insertNonFull(Node node, int key) {
    // Initialize index as the rightmost element
    int i = node.keys.size() - 1;

    // If this is a leaf node
    if (node.isLeaf()) {
        // Find the location of new key
        while (i >= 0 && key < node.keys.get(i)) {
            i--;
        }

        // Insert the new key at found location
        node.keys.add(i + 1, key);
    } else {
        // Find the child which is going to have the new key
        while (i >= 0 && key < node.keys.get(i)) {
            i--;
        }
        i++;

        // If the child is full, split it
        if (node.children.get(i).keys.size() == (2 * t - 1)) {
            splitChild(node, i);

            // After split, the middle key goes up and
            // node's children are split into two
            if (key > node.keys.get(i)) {
                i++;
            }
        }

        // Insert the key
        insertNonFull(node.children.get(i), key);
    }
}`;
      } else if (lang === 'cpp') {
        return `void insert(int key) {
    // If tree is empty
    if (root == nullptr) {
        root = new Node();
        root->keys.push_back(key);
        return;
    }

    // If root is full, split it
    if (root->keys.size() == (2 * t - 1)) {
        Node* newRoot = new Node();
        newRoot->children.push_back(root);
        splitChild(newRoot, 0);
        root = newRoot;
    }

    // Insert non-full
    insertNonFull(root, key);
}

void insertNonFull(Node* node, int key) {
    // Initialize index as the rightmost element
    int i = node->keys.size() - 1;

    // If this is a leaf node
    if (node->isLeaf()) {
        // Find the location of new key
        while (i >= 0 && key < node->keys[i]) {
            i--;
        }

        // Insert the new key at found location
        node->keys.insert(node->keys.begin() + i + 1, key);
    } else {
        // Find the child which is going to have the new key
        while (i >= 0 && key < node->keys[i]) {
            i--;
        }
        i++;

        // If the child is full, split it
        if (node->children[i]->keys.size() == (2 * t - 1)) {
            splitChild(node, i);

            // After split, the middle key goes up and
            // node's children are split into two
            if (key > node->keys[i]) {
                i++;
            }
        }

        // Insert the key
        insertNonFull(node->children[i], key);
    }
}`;
      }
    }
    return `Pseudocode for ${op} operation in B-Tree (${lang}) not available yet.`;
  };

  return (
    <div className="bg-white dark:bg-black rounded-lg shadow-md p-4 mb-6 mt-8 dark:border dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Pseudocode</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Language</label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`btn ${language === 'python' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setLanguage('python')}
            >
              Python
            </button>
            <button
              type="button"
              className={`btn ${language === 'java' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setLanguage('java')}
            >
              Java
            </button>
            <button
              type="button"
              className={`btn ${language === 'cpp' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setLanguage('cpp')}
            >
              C++
            </button>
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Operation</label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`btn ${operation === 'insert' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setOperation('insert')}
            >
              Insert
            </button>
            {treeType === 'avl' && (
              <button
                type="button"
                className={`btn ${operation === 'balance' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setOperation('balance')}
              >
                Balance
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-auto max-h-96 rounded-lg">
        <SyntaxHighlighter
          language={language}
          style={darkMode ? vscDarkPlus : vs}
          showLineNumbers={true}
          customStyle={{
            borderRadius: '0.5rem',
            fontSize: '0.9rem',
            padding: '1rem',
          }}
        >
          {getPseudocode()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default PseudocodeDisplay;
