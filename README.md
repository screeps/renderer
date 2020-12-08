| @screeps/renderer | @screeps/renderer-metadata |
| --- | --- |
| [![npm version](https://badge.fury.io/js/%40screeps%2Frenderer.svg)](https://badge.fury.io/js/%40screeps%2Frenderer)| [![npm version](https://badge.fury.io/js/%40screeps%2Frenderer-metadata.svg)](https://badge.fury.io/js/%40screeps%2Frenderer-metadata) |

This library is based on [PixiJS](http://www.pixijs.com) and contains the renderer engine used in the [Screeps](https://github.com/screeps/screeps) game. You can use it to develop your own standalone utilities, or discover the API to create mods for custom graphics on your own private server.

# Demo app

The [`demo`](https://github.com/screeps/renderer/tree/master/demo) folder contains an Electron app which you can use to test the library with real game object samples. You can launch it the following way:

```javascript
cd demo
npm install
npm run electron
```

Files in the [`samples`](https://github.com/screeps/renderer/tree/master/demo/src/samples) folder can be selected via the "File" menu to render specific game situations.

The demo app is also a good reference of how to integrate the renderer into a web page. 

# API

See [`main.d.ts`](https://github.com/screeps/renderer/blob/master/engine/main.d.ts),
it contains full TypeScript-style definitions which helps to understand the programmatic API.

If you want to define your own custom graphics on your private server, see [mods examples](https://github.com/screeps/launcher/tree/ptr/init_dist/example-mods/renderer).

# Documentation

## Pipeline

General pipeline works in the following way:

1. `GameRenderer` receives world state `applyState` method and delegates the logic to the `World` class.

2. `World` passes state to a sequence of `preprocessors`, which can perform actions with all state. For example, `setBadgeUrls` preprocessor sets `badgeUrl`s for all users in the state.

3. Than `World` brings down states by objects, creates `GameObject` for each one, if it's not created, and delegates applying state to each `GameObject`.

4. `GameObject` finds metadata according to the object type, and performs actions according to it. Running `calculations`, `actions`, `processors.`

## Processor

Processors are core of rendering engine. They are a way to create PIXI objects, to customize them. Actually, a processor is just a function that receives params (see `ProcessorParams`) and performs some actions with them.
 
For instance, `sprite` processor just creates a sprite. But it does it in a smart way. If a texture is not loaded, it creates a container, and initiates resource loading. And only after resource gets loaded it creates a sprite for it.

In general there are 2 kinds of processors:

1. for creating PIXI-related objects
    * object - implements common infrastructure for creating PIXI objects, the exact class should be passed through `payload.Class`.
    * container - is a thin wrapper around `object` for creating PIXI `Container` objects.
    * draw - is a wrapper around `object` for creating PIXI `Graphics` objects, and running methods for drawing. `payload.drawings` contains array of methods with params to call.
    * sprite - is a wrapper around `object` for creating PIXI `Sprite`. `payload.texture` contains a texture for the sprite.
    * text - is a wrapper around `object` for creating PIXI `Text`. It supports 2 params for specifying text attributes: `payload.text` and `payload.style`.
2. and for special purposes above those objects
    * circle - is a wrapper around `draw` for drawing circles (`payload: { color, radius, stroke, strokeWidth}`)
    * creepActions - parses `actionLog` of a game object and performs related actions.
    * creepBuildBody - parses body parts of a game object and visualizes them.
    * moveTo - is responsible for moving objects to right coordinates and angle. 
    * powerInfluence - renders influence of `powerCreep` (`actionLog.power`).
    * resourceCircle - is a wrapper around `circle` for rendering circle with a radius depending on amount of specified resource.
    * road - draws all roads of the current state.
    * runAction - runs actions on a target object (`payload.id`), it should be used only in specific cases. Putting `actions` directly on target object in metadata is preferable.
    * say - visualizes saying of objects
    * siteProgress - draws arc of progress

## Calculation

Sometimes we need to perform some calculations that we use in processors. In order to achieve that we use `calculations` in metadata. They allow us to calculate values if it’s needed and reuse them among several processors, or during several game ticks.

There are 2 major properties of calculations:
* `id` - is a name to be used in order to get access to the calculation result
* `func` - specifies a way how to calculate the result. It can be a function or an expression.

For example:
```
{
    id: 'energyTrianglePoints',
    props: ['energy', 'energyCapacity'],
    func: ({ state: { energy, energyCapacity } }) => {
        const { x, y } = resourceTriangle;
        let { width, height } = resourceTriangle;
        const koef = energy / energyCapacity;
        width *= koef;
        height *= koef;
        return [
            x - (width / 2), y,
            x, y - height,
            x + (width / 2), y,
        ];
    },
},
```
It defines calculation that will be available as `{ $calc: 'energyTrianglePoints' }` in expressions, or as `calcs.energyTrianglePoints` in code. This calculation will be evaluated every time, when either `energy` or `energyCapacity` properties of an object will be updated. And the result is calculated according the `func`.

## Expression

In perfect way the metadata of render engine should be a declarative way to explain how exact objects should be rendered. In this case it will be possible to transfer it via JSON. In order to achieve that we implemented the expression engine.

It introduces some built-in primitive functions that allows to define a way to evaluate expressions. All expressions are “precompiled”, on starting they are transferred to functional calls. It significantly improves performance of evaluation.

Any object key starting with `$` is considered an expression.

* Getting values:
    * $calc - returns value of a calculation (see ‘CalcExpression`). For example:  `{ $calc: 'displayName' }`),
    * $rel - returns property value of a target PIXI object (see `RelExpression`). For example: `{ $rel: 'scale.x' }`,
    * $processorParam - returns property value of processor params (see `ProcessorParamExpression`). For example: `{ $processorParam: 'tickDuration' }`,
    * $state - returns property value of a game state (see `StateExpression`). For example: `{ $state: 'actionLog.say' }`.
* Conditions and boolean:
    * $if - returns `then` or `else` expression, depending on condition provided (see `IfExpression`). For example: `{ $if: { $gt: [1, 2] }, then: ‘it cannot be’, else: ‘it can be’ }`,
    * $and - logical AND (see `AndExpression`). For example: `{ $and: [{ $calc: ‘calc1’ }, { $calc: ‘calc2’ }]  }`,
    * $gt - evaluates greater expression (see `GtExpression`). For example: `{ $gt: [ { $state: ‘x’ }, 10] }`,
    * $gte - evaluates greater or equal expression (see `GteExpression`),
    * $lt - evaluates less expression (see `LtExpression`),
    * $lte - evaluates less or equal expression (see `LteExpression`),
    * $not - logical NOT (see `NotExpression`). For example: `{ $not: true }`,
    * $or - logical OR (see `OrExpression`). For example: `{ $or: [{ $gt: [ { $state: ‘x’ }, 10] }, { $lt: [ { $state: ‘y’ }, 50] }]  }`,
* Operations:
    * $add - returns math addition of args (see `AddExpression`). For example: `{ $add: [1, 2, 3]  }`,
    * $div - returns math division of 2 args (see `DivExpression`). For example: `{ $div: [4, 2]  }`,
    * $max - returns max value of args (see `MaxExpression`). For example: `{ $max: [4, 2]  }`,
    * $min - returns min value of args (see `MinExpression`). For example: `{ $min: [4, 2]  }`,
    * $mul - returns math multiplication of args (see `MulExpression`). For example: `{ $mul: [2, 2]  }`,
    random.js
    * $sub - returns math subtraction of args (see `SubExpression`). For example: `{ $add: [3, 2, 1]  }`,

## Actions

Actions are classes that allow to smoothly display transition between different visual states of the object during the time.

There are several ways to create actions in the engine:
1. On the game object level in metadata (see `ProcessorActionMetadata`)
2. On the processor level (see `ActionMetadata`)

When you define actions on the game object level, their lifecycle is the similar to the lifecycle of the processors. For example:

```
actions: [
    {
        id: 'resourceScale',
        targetId: 'resourceCircle',
        props: ['resourceScale'],
        actions: [
            {
                action: 'ScaleTo',
                params: [
                    { $calc: 'resourceScale' },
                    { $calc: 'resourceScale' },
                    { $processorParam: 'tickDuration' },
                ],
            },
        ],
    },
],
```

It defines `resourceScale` actions that changes scaling of the target object with id `resourceCircle`, and runs every time the property `resourceScale` is updated.

When you define actions on the processor level, their lifecycle is completely managed by lifecycle of the parent processor. For example:

```
{
    type: 'draw',
    once: true,
    payload: {
        ...
    },
    actions: [{
        action: 'Repeat',
        params: [{
            action: 'Sequence',
            params: [
                [
                    {
                        action: 'TintTo',
                        params: [
                            0x0e0c04,
                            4.0,
                        ],
                    },
                    {
                        action: 'TintTo',
                        params: [
                            0x595026,
                            4.0,
                        ],
                    },
                ],
            ],
        }],
    }],
}
```

The actions run once when processor creates the object.

There are following actions:
* AlphaBy - changes alpha property of the target object by delta
* AlphaTo - changes alpha property of the target object to target value
* Blink - periodically changes visibility of the object
* CallFunc - runs the function provided during the time
* DelayTime - just idle for time specified
* FadeIn - fades in the object, updating its alpha property
* FadeOut - fades out the object, updating its alpha property
* FilterTo - updates property value with name specified to the value specified
* MoveBy - changes x, y properties of the target object by delta
* MoveTo - changes x, y properties of the target object to target value
* PivotBy - changes pivot x, y properties of the target object by delta
* PivotTo - changes pivot x, y properties of the target object to target value
* Repeat - repeats target action
* RotateBy - changes rotation property of the target object by delta
* RotateTo - changes rotation property of the target object to target value
* RotateBy - changes rotation property of the target object by delta
* RotateTo - changes rotation property of the target object to target value
* ScaleBy - changes scale x, y properties of the target object by delta
* ScaleTo - changes scale x, y properties of the target object to target value
* Sequence - group target actions to run sequentially after each other
* SkewBy - changes skew x, y properties of the target object by delta
* SkewTo - changes skew x, y properties of the target object to target value
* Spawn - group target actions to run in parallel
* TintBy - changes tint property of the target object by delta
* TintTo - changes tint property of the target object to target value

Actions support expressions in the params, it allows you to control actions flexibly.

## Lifecycle Metadata

The lifecycle of processors, actions and calculations is managed by `RunnableMetadata`. It supports the following properties:
* props - if set, the processor will be re-run when some of the specified properties are changed. It supports own properties of the game object, and its calculations.
* once - the processor will be run just once, when it meets `when` condition. When it meets `until` condition after that, the lifecycle starts from beginning. 
* shouldRun - deprecated, user `when` instead
* until - condition when object is destructed 
* when - condition when object is created

## Layer

In order to manage z-order of the object the engine has `layers` implemented. We use [pixi-layers](https://github.com/pixijs/pixi-display) for this. It allows to specify z-order separately from parent container.

All layers are specified in `layers` property of `Metadata`. The game support the following layers (from bottom to top):
* terrain - landscape graphics like walls and swamps
* objects - a default layer for object rendering
* lighting - lighting effects of the objects, the layer has filters that simplifies that
* effects  - just the most top layer for putting effects

In order to put a processor to specific layer you should specify its name in `layer` property. For example:
```
{
  layer: "effects",
}
```

## Viewport
TODO

## Resource
TODO

