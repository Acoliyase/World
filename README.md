# World Builder Simulation

A browser-based 3D simulation inspired by Sword Art Online’s Underworld, where an autonomous avatar constructs and evolves a world. The avatar learns building techniques through trial and error, using open-source AI/ML approaches like TensorFlow.js to simulate computational learning. The learning process is visible through logs, and the world persists across sessions.

## Features

- **Autonomous Avatar**: Builds independently, learning from successes and failures.
- **Persistent World**: Saves progress to browser storage; world evolves over time.
- **AI Learning**: Uses TensorFlow.js for decision-making; retrains on data.
- **Anime-Inspired Style**: Ethereal visuals with toon materials.
- **Object-Based Building**: Places houses, furniture, crops, walls, bushes, trees.
- **Organized Farming**: Crop plots with terrain elevation.
- **Logging System**: Detailed logs of attempts, AI research, and improvements.
- **Lightweight**: Runs smoothly in-browser, deployable on GitHub Pages.

## How to Run Locally

1. Clone the repository
2. Open `index.html` in a web browser, or serve with a local server (e.g., `python3 -m http.server`)

## Controls

- **Build Random Item**: Manual placement.
- **Simulate Learning**: 10 random attempts.
- **Auto Build with AI**: AI-guided placement.
- **Toggle Autonomous Mode**: Continuous building every 2 seconds.
- **Reset World**: Clears all progress.

## Deployment to GitHub Pages

1. Go to repository settings > Pages.
2. Select "Deploy from a branch" > main branch > /(root).
3. Save; site at `https://acoliyase.github.io/World/`

## Technologies

- Three.js for 3D rendering
- TensorFlow.js for ML
- Open-source assets and libraries