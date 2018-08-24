Screeps Render Engine

# Getting started

## Build

`npm run build`

## Run example

`cd example`

### Web

`npm start`

### Electron

`npm run build`
`npm run electron`

## Integrate to the app

```
  // create an instance
  this.gameApp = new GameApp({
    size: {
      width: 800,
      height: 600,
    },
    resourceMap,
    worldOptions,
  });

  // init it with DOM container
  await this.gameApp.init(this.refs.gameCanvas);

  // apply state when it changes
  this.gameApp.applyState(newState, TICK_DURATION);

```
