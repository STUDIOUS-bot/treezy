# Treezy - Interactive Tree Visualization

Treezy is an interactive web application for visualizing and learning about complex tree data structures. It provides animated, step-by-step visualizations of how different tree structures handle insertions and balance themselves.

## Features

- Interactive visualization of multiple tree data structures:
  - AVL Trees
  - Red-Black Trees
  - B-Trees
- Step-by-step animation of tree operations
- Detailed explanations of each step
- Animation controls (play/pause, speed, step forward/backward)
- Dark and light mode support
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/treezy.git
cd treezy
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Select a tree type (AVL, Red-Black, or B-Tree)
2. Enter a list of numbers (comma or space separated) or use the "Random" button
3. Click "Visualize" to see the tree being built
4. Use the controls to play/pause the animation, adjust speed, or step through manually
5. Read the explanation panel to understand how the tree works

## Technologies Used

- React.js
- TypeScript
- D3.js for visualization
- Tailwind CSS for styling
- Vite for build tooling

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by various algorithm visualization tools
- Built for educational purposes to help understand complex data structures
