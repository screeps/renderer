There are 3 apps in this repository, each with its own `package.json`:

1. `demo` folder contains an Electron app that imports `GameRenderer` from `engine/dist/renderer.js` and uses it to render a game scene.

2. `engine` folder contains the core game engine code, including the `GameRenderer` class and other related modules. It uses PixiJS v6 for rendering. It builds the package into `engine/dist/renderer.js` using Webpack.

3. `metadata` contains graphics metadata files that describe the assets used in the game, such as textures and animations.

# Dev Environment

The operating system is Windows 11. Always use absolute paths to set working directory in console commands.